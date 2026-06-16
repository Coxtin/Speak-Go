import React, { useState } from 'react';
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

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        try {
            await apiFetch('/');
            Alert.alert(
                "ACCES PERMIS",
                "Biletul este valid și a fost marcat ca scanat.",
                [{ text: "Următorul bilet", onPress: () => setScanned(false) }]
            );
        } catch (error: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            const errorMessage = error.response?.data?.message || "Bilet invalid sau eroare de rețea.";
            Alert.alert(
                "ACCES RESPINS",
                errorMessage,
                [{ text: "Scanează din nou", onPress: () => setScanned(false), style: 'cancel' }]
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
