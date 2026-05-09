import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Alert, TextInput, ActivityIndicator } from "react-native";
import { ChatCompletionMessageParam } from "../../types/chatCompletionMessageParam";

import { transferCommand } from "../../api/ai.api";

const TestingAIResponse = () => {
    const [inputText, setInputText] = useState("");
    const [AIMessage, setAIMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<Array<ChatCompletionMessageParam>>([]);

    const onSubmit = async () => {
        // Alert.alert("Text trimis", inputText || "Nu ai introdus nimic.");

        try{

            setIsLoading(true);

            const currentHistory = [...chatHistory, {role: 'user', content: inputText}];

            const AIResponse = await transferCommand(currentHistory);


            if (AIResponse.action === "ask_for_info"){

                setChatHistory([...currentHistory, {role: 'assistant', content: JSON.stringify(AIResponse)}]);

            }

            const parsedMessage =
                typeof AIResponse?.message === "string"
                    ? AIResponse.message
                    : JSON.stringify(AIResponse?.message ?? "", null, 2);
                        
            setAIMessage(parsedMessage);

            // setAIMessage(`${AIResponse?.action ?? "unknown"}\n${parsedMessage}`);
        
        } catch (error: any){
            console.error("Eroare la receptarea mesajului de la ai");
            Alert.alert("Eroare", error?.message || "A aparut o problema la procesarea mesajului.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-4 justify-center">
            <View className="w-full">

                <Text className="text-2xl font-semibold text-slate-900 mb-3">
                    Testing AI Response
                </Text>

                <TextInput
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base text-slate-900 mb-3"
                    placeholder="Scrie aici..."
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={onSubmit}
                    returnKeyType="done"
                />

                <TouchableOpacity
                    className="w-full bg-blue-600 rounded-xl py-3 items-center"
                    onPress={onSubmit}
                >
                    <Text className="text-white text-base font-semibold">Submit</Text>
                </TouchableOpacity>

                {isLoading ? (
                    <ActivityIndicator
                        size="large"
                        color="blue"
                    />
                ) : (

                <Text className="text-2xl border border-slate-300 rounded-xl px-4 py-3 font-semibold text-slate-900 mb-3">
                    {AIMessage}
                </Text>
                )}
            </View>
        </SafeAreaView>
    );

};

export default TestingAIResponse;

