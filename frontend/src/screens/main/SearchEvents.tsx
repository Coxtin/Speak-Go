import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated'

import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useAiChat } from '../../hooks/useAiChat';
import { EventFilter } from '../../types/EventFilter';


type SearchEventsProps = {
    inModal?: boolean;
    onSearchReady? : (filters: EventFilter) => void,
    closeModal : boolean  
};

const SearchEvents = ({ inModal = false, onSearchReady, closeModal }: SearchEventsProps) => {


    const { startRecording, stopRecording, isRecording, isProcessingSTT } = useSpeechToText(); 
    const { aiMessage, isAiThinking, processUserMessage, resetChat } = useAiChat();
    
    const ringScale = useSharedValue(1);
    const ringOpacity = useSharedValue(0);

    useEffect(() => {

        if (isRecording || isAiThinking || isProcessingSTT){
            ringScale.value = withRepeat(
                withTiming(1.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            )
            ringOpacity.value = withRepeat(
                withTiming(0.45, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            )

        } else {
            ringScale.value = withTiming(1, { duration: 300 });
            ringOpacity.value = withTiming(0, { duration: 300 });
        }

    }, [isRecording, isAiThinking, isProcessingSTT])

    const animatedRingStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: ringScale.value }],
            opacity: ringOpacity.value
        }
    })

    const handleVoiceCommand = async () => {
        // Oprește microfonul și așteaptă textul transcris de Whisper
        const transcribedText = await stopRecording();

        if (transcribedText) {
            // Trimite textul automat către OpenAI fără să apeși alt buton!
            const AIResult = await processUserMessage(transcribedText);

            if (AIResult && AIResult.action === 'search_event'){
                if (onSearchReady)
                    onSearchReady(AIResult.parameters);
            }
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
            
           <View className="items-center justify-center relative w-40 h-40 mt-6">
                
                {/* 1. Cercul Animat care pulsează în SPATE */}
                <Animated.View 
                    className="absolute bg-blue-300 rounded-full w-24 h-24"
                    style={animatedRingStyle}
                />

                {/* 2. Butonul Fizic care stă DEASUPRA (z-10) */}
                <TouchableOpacity
                    onPress={isRecording ? handleVoiceCommand : startRecording}
                    disabled={isBusy}
                    activeOpacity={0.8}
                    className={`w-24 h-24 rounded-full items-center justify-center shadow-xl border-4 z-10 ${
                        isRecording 
                            ? "bg-red-500 border-red-200" 
                            : isBusy 
                                ? "bg-gray-300 border-gray-200" 
                                : "bg-blue-600 border-blue-200"
                    }`}
                >
                    {/* Iconița din interiorul butonului (pătrat roșu sau cerc alb) */}
                    <View className={`bg-white ${isRecording ? "w-8 h-8 rounded-md" : "w-6 h-6 rounded-full"}`} />     
                </TouchableOpacity>

            </View>

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
