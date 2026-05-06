import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Alert, TextInput } from "react-native";

import { transferCommand } from "../../api/ai.api";

const TestingAIResponse = () => {
    const [inputText, setInputText] = useState("");
    const [AIMessage, setAIMessage] = useState("");

    const onSubmit = async () => {
        // Alert.alert("Text trimis", inputText || "Nu ai introdus nimic.");
        try{
            const AIResponse = await transferCommand(inputText);
            setAIMessage(AIResponse.action + "\n" + AIResponse.message);
        
        } catch (error: any){
            console.error("Eroare la receptarea mesajului de la ai");
            throw error;
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

                <Text className="text-2xl font-semibold text-slate-900 mb-3">
                    {AIMessage}
                </Text>
            </View>
        </SafeAreaView>
    );

};

export default TestingAIResponse;
