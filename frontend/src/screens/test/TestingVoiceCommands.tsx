import React, {useState} from "react";
import { Text, View, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native'
import { RecordingPresets, useAudioRecorder, AudioModule, setAudioModeAsync } from "expo-audio";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { apiFetch } from "../../api/apiClient";


const VoiceCommands = () => {

    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProccesing] = useState(false);
    const [transcribedText, setTranscribedText] = useState("");
    const navigation = useNavigation();

    const recordAudio = async() => {

        const permission = await AudioModule.requestRecordingPermissionsAsync();

        if (!permission.granted){
            if (Platform.OS === 'web'){
                window.alert("Nu putem sa accesam microfonul!");
                return;
            }
            else{
                Alert.alert("Nu putem sa accesam microfonul!");
                return;
            }
        } else{
            setIsRecording(true);
            setAudioModeAsync({
                playsInSilentMode: true,
                allowsRecording: true,
            });

            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();
        }
    }

    const stopRecord = async() => {

        await audioRecorder.stop();
        setIsRecording(false);

        const recordedUri = audioRecorder.uri;

        console.log("De aici poti prelua fisierul: ", recordedUri);
        console.log("Extensie fisier: ", recordedUri?.split('.').pop());

        if (!recordedUri) {
            Alert.alert("Eroare", "Nu am putut salva înregistrarea audio.");
            return;
        }

        await sendDataToBackend(recordedUri);
    }

    const sendDataToBackend = async (uri: string) => {

        setIsProccesing(true);

        const fileExtension = uri.split('.').pop();

        try{

            const formData = new FormData();
            
            formData.append('audio', {
                uri: uri,
                name: 'recording.m4a',
                type: `audio/${fileExtension || 'm4a'}`
            } as any);

            const response = await apiFetch('/voice', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json().catch(() => null);

            if (!response.ok){
                throw new Error(data?.error || "Nu am putut procesa audio-ul.");
            }


            console.log("Am primit textul!");
            setTranscribedText(data?.text || "");

        } catch(err){
            console.log("Eroare! Am primit: ", err);
            if (Platform.OS === 'web')
                window.alert("Eroare! Nu m-am putut conecta la server!");
            else
                Alert.alert("Eroare! Nu m-am putut conecta la server!")
        }
        finally{
            setIsProccesing(false);
        }

    }
    return(

        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center px-6">
                
                <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Speak & Go 🗣️
                </Text>

                {/* --- ZONA DE RĂSPUNS --- */}
                <View className="bg-gray-100 w-full p-4 rounded-xl min-h-[100px] mb-8 justify-center items-center">
                    {isProcessing ? (
                        <View>
                             <ActivityIndicator size="large" color="#2563EB" />
                             <Text className="text-gray-500 mt-2">Gândesc... 🤖</Text>
                        </View>
                    ) : (
                        <Text className="text-lg text-gray-800 text-center font-medium">
                            {transcribedText || "Apasă butonul și spune ceva..."}
                        </Text>
                    )}
                </View>

             
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="bg-gray-300 px-6 py-3 rounded-xl mb-6 w-full items-center"
                    disabled={isProcessing}
                >
                    <Text className="text-gray-700 font-bold">⬅️ Înapoi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={isRecording ? stopRecord : recordAudio}
                    activeOpacity={0.7}
                    disabled={isProcessing}
                    className={`px-6 py-6 rounded-full w-24 h-24 items-center justify-center shadow-xl border-4 ${
                        isRecording 
                        ? "bg-red-500 border-red-300" 
                        : isProcessing 
                            ? "bg-gray-400 border-gray-300" 
                            : "bg-blue-600 border-blue-400"
                    }`}
                >
                     <View className={`bg-white ${isRecording ? "w-8 h-8 rounded-sm" : "w-6 h-6 rounded-full"}`} />     
                </TouchableOpacity>
                
                <Text className="mt-4 text-gray-500">
                    {isRecording ? "Se înregistrează..." : "Apasă pentru a vorbi"}
                </Text>

            </View>
        </SafeAreaView>
    )

}

export default VoiceCommands;
