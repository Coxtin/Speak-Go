import { useState } from 'react';
import { Alert } from 'react-native';
import { ChatCompletionMessageParam } from '../types/chatCompletionMessageParam'; 
import { transferCommand, getAudio } from '../api/ai.api';
import { apiFetch } from '../api/apiClient';
import { useAudioPlayer } from 'expo-audio';

export const useAiChat = () => {

    const [chatHistory, setChatHistory] = useState<Array<ChatCompletionMessageParam>>([]);
    const [aiMessage, setAiMessage] = useState<string>("");
    const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

    const audioPlayer = useAudioPlayer();
    
    const processUserMessage = async (text: string) => {
        if (!text) return null;

        setIsAiThinking(true);

        try {
            // 1. Adăugăm comanda utilizatorului în istoric
            const currentHistory: ChatCompletionMessageParam[] = [
                ...chatHistory,
                { role: 'user', content: text }
            ];

            const AIResponse = await transferCommand(currentHistory);

            // 3. Gestionăm Istoricul în funcție de Intenție (Intent Routing)
            if (AIResponse.action === "ask_for_info") {
                setChatHistory([
                    ...currentHistory,
                    { role: 'assistant', content: JSON.stringify(AIResponse) }
                ]);
            } else if (AIResponse.action === "search_events" || AIResponse.action === "greeting") {
                // Dacă a găsit datele sau doar a salutat, curățăm istoricul pentru o cerere nouă
                setChatHistory([]);
            }

            // 4. Afișăm textul formulat natural (reply_message)
            const displayText = AIResponse?.message 
                ? AIResponse?.message
                : JSON.stringify(AIResponse ?? "", null, 2);

            setAiMessage(`${displayText} \n\n ${AIResponse.action}`);

            if (AIResponse.message && AIResponse.action != "search_event"){

                const audioURI = await getAudio(AIResponse.message);
                
                if (audioURI){

                    audioPlayer.replace({uri: audioURI});
                    audioPlayer.play();

                }

            } 

            // Returnăm datele în cazul în care interfața vrea să facă ceva cu ele (ex: navigare spre o listă)
            return AIResponse;

        } catch (error: any) {
            console.error("Eroare la procesarea AI:", error);
            Alert.alert("Eroare AI", error?.message || "A apărut o problemă la comunicare.");
            return null;
        } finally {
            setIsAiThinking(false);
        }
    };

    // O funcție utilitară pentru a reseta conversația manual (ex: un buton de "Clear")
    const resetChat = () => {
        setChatHistory([]);
        setAiMessage("");
    };

    return {
        chatHistory,
        aiMessage,
        isAiThinking,
        processUserMessage,
        resetChat
    };
};