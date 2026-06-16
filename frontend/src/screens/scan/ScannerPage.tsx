import React, { useState, useRef } from 'react';
import { Text, View, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { apiFetch } from '../../api/apiClient';
import * as Haptics from 'expo-haptics';

export default function ScannerScreen() {
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const isScanningRef = useRef(false);

    if (!permission) {
        return <View className="flex-1 bg-black" />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 justify-center items-center p-5 bg-white">
                <Text className="text-base text-center mb-5 text-gray-800">Avem nevoie de acces la cameră pentru a scana bilete.</Text>
                <Button onPress={requestPermission} title="Permite Accesul" />
            </View>
        );
    }

    const resetScanner = () => {
        isScanningRef.current = false;
        setScanned(false);
    };

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (isScanningRef.current) return;
        isScanningRef.current = true;
        setScanned(true);

        try {
            const response = await apiFetch('/tickets/scan', {
                method: 'POST',
                body: JSON.stringify({ qrCode: data })
            });

            const result = await response.json();

            if (!response.ok){
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Alert.alert("ACCES RESPINS", result.message || "Eroare la scanarea biletului.", [
                    { text: "Scanează din nou", onPress: resetScanner }
                ]);
                return;
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert(
                "ACCES PERMIS",
                result.message || "Biletul este valid și a fost marcat ca scanat.",
                [{ text: "Următorul bilet", onPress: resetScanner }]
            );
        } catch (error: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(
                "EROARE REȚEA",
                "Nu s-a putut contacta serverul. Verifică conexiunea la internet.",
                [{ text: "Încearcă din nou", onPress: resetScanner }]
            );
        }
    };

    return (
        <View className="flex-1 bg-black">
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />
            <View className="flex-1 justify-between bg-black/30">
                <View className="flex-row items-center justify-between pt-12 px-5">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
                        <Ionicons name="close-circle" size={40} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Validare Bilete</Text>
                    <View className="w-10" />
                </View>
                <View className="flex-1 justify-center items-center">
                    <View className="w-64 h-64 border-2 border-blue-600 rounded-3xl bg-transparent" />
                </View>
                <View className="pb-12 items-center">
                    <View className="bg-black/60 py-2.5 px-5 rounded-3xl">
                        <Text className="text-white text-base font-bold text-center">
                            {scanned ? "Se validează..." : "Încadrează codul QR în pătrat"}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
