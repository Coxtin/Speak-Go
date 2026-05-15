import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useAiChat } from '../../hooks/useAiChat';


const SearchEvents = () => {


    const { startRecording, stopRecording, isRecording, isProcessingSTT } = useSpeechToText(); 
    const { chatHistory, aiMessage, isAiThinking, processUserMessage, resetChat } = useAiChat();
    
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
        <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
            <Text className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Spune-mi ce cauți 🎤
            </Text>

            {/* Fereastra de Răspuns AI */}
            <View className="bg-blue-50 w-full p-6 rounded-2xl min-h-[120px] mb-10 justify-center items-center border border-blue-100 shadow-sm">
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

            <Text className="mt-6 text-gray-500 font-medium">
                {isRecording ? "Ascult... (Apasă pentru a trimite)" : "Apasă pentru a vorbi"}
            </Text>

            {/* Buton opțional de resetare a conversației */}
            {aiMessage ? (
                <TouchableOpacity onPress={resetChat} className="mt-8 px-4 py-2">
                    <Text className="text-gray-400 font-bold">Resetează conversația</Text>
                </TouchableOpacity>
            ) : null}
        </SafeAreaView>
    );
}

export default SearchEvents;