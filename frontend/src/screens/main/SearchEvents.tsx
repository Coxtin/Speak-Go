import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useAiChat } from '../../hooks/useAiChat';


type SearchEventsProps = {
    inModal?: boolean;
};

const SearchEvents = ({ inModal = false }: SearchEventsProps) => {


    const { startRecording, stopRecording, isRecording, isProcessingSTT } = useSpeechToText(); 
    const { aiMessage, isAiThinking, processUserMessage, resetChat } = useAiChat();
    
    const handleVoiceCommand = async () => {
        // Oprește microfonul și așteaptă textul transcris de Whisper
        const transcribedText = await stopRecording();

        if (transcribedText) {
            // Trimite textul automat către OpenAI fără să apeși alt buton!
            await processUserMessage(transcribedText);
        }
    };

    const isBusy = isProcessingSTT || isAiThinking;

    return (

        <View className={`flex-1 w-full items-center justify-between ${inModal ? 'pb-2' : 'px-5 pb-6 pt-4'}`}>
           
            {/* Fereastra de Răspuns AI */}
            <View className="w-full bg-blue-50 p-4 rounded-2xl mt-2 border border-blue-100">
                {isBusy ? (
                    <View className="items-center">
                        <ActivityIndicator size="large" color="#2563EB" />
                        <Text className="text-blue-600 mt-3 font-medium">
                            {isProcessingSTT ? "Procesez vocea..." : "Asistentul se gândește..."}
                        </Text>
                    </View>
                ) : (
                    <Text className="text-lg text-gray-800 text-center font-medium">
                        {aiMessage || "Apasă pe microfon și spune, de exemplu: 'Vreau la un concert'"}
                    </Text>
                )}
            </View>

            {/* Butonul de Microfon (Hold to speak sau Tap to speak) */}
            <TouchableOpacity
                onPress={isRecording ? handleVoiceCommand : startRecording}
                disabled={isBusy}
                activeOpacity={0.8}
                className={`w-24 h-24 rounded-full items-center justify-center shadow-xl border-4 ${
                    isRecording 
                        ? "bg-red-500 border-red-200" 
                        : isBusy 
                            ? "bg-gray-300 border-gray-200" 
                            : "bg-blue-600 border-blue-200"
                }`}
            >
            <View className={`bg-white ${isRecording ? "w-8 h-8 rounded-md" : "w-6 h-6 rounded-full"}`} />     
            </TouchableOpacity>

            <Text className="mt-6 text-gray-500 font-medium text-center">
                {isRecording ? "Ascult... (Apasă pentru a trimite)" : "Apasă pentru a vorbi"}
            </Text>

            {/* Buton opțional de resetare a conversației */}
            {aiMessage ? (
                <TouchableOpacity onPress={resetChat} className="mt-4 px-4 py-2">
                    <Text className="text-gray-400 font-bold">Resetează conversația</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

export default SearchEvents;
