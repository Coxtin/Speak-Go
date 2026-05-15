import { useState } from 'react';
import { Text, View, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native'
import { RecordingPresets, useAudioRecorder, AudioModule, setAudioModeAsync } from 'expo-audio';
import { apiFetch } from '../api/apiClient';

export const useSpeechToText = () => {
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessingSTT, setIsProcessingSTT] = useState(false); 
    const [transcribedText, setTranscribedText] = useState("");

    const startRecording = async () => {
        try {
            const permission = await AudioModule.requestRecordingPermissionsAsync();

            if (!permission.granted) {
                const msg = "Nu putem accesa microfonul!";
                Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Eroare", msg);
                return;
            }

            setIsRecording(true);
            setTranscribedText(""); 

            await setAudioModeAsync({
                playsInSilentMode: true,
                allowsRecording: true,
            });

            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();

        } catch (error) {
            console.error("Eroare la pornirea microfonului:", error);
            setIsRecording(false);
        }
    };

    // Returnăm un Promise<string | null> pentru a folosi textul instant în ecranul final
    const stopRecording = async (): Promise<string | null> => {
        try {

            await audioRecorder.stop();
            setIsRecording(false);

            const recordedUri = audioRecorder.uri;

            if (!recordedUri) {
                Alert.alert("Eroare", "Nu am putut salva înregistrarea audio.");
                return null;
            }

            return await sendDataToBackend(recordedUri);
        } catch (error) {
            console.error("Eroare la oprirea microfonului:", error);
            setIsRecording(false);
            return null;
        }
    };

    const sendDataToBackend = async (uri: string): Promise<string | null> => {
        
        setIsProcessingSTT(true);
        const fileExtension = uri.split('.').pop();

        try {
            const formData = new FormData();
            formData.append('audio', {
                uri: uri,
                name: `recording.${fileExtension || 'm4a'}`,
                type: `audio/${fileExtension || 'm4a'}`
            } as any);

            const response = await apiFetch('/voice', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.error || "Nu am putut procesa audio-ul.");
            }

            setTranscribedText(data?.text || "");
            return data?.text || null; // Returnăm textul aici!

        } catch (err) {
            console.error("Eroare STT: ", err);
            const msg = "Eroare! Nu m-am putut conecta la server pentru transcriere!";
            Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Eroare", msg);
            return null;
        } finally {
            setIsProcessingSTT(false);
        }
    };

    return {
        isRecording,
        isProcessingSTT,
        transcribedText,
        startRecording,
        stopRecording
    };
};