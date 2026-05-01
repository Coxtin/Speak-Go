import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Platform, Alert, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import "../../../global.css";
import { insertResetCodeSchema, InsertResetCodeValues } from "../../schemas/auth.schema";
import { verifyResetCode } from "../../api/auth.api";

import * as secureStore from 'expo-secure-store';

const InsertResetCodeScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const email = route.params?.email as string | undefined;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<InsertResetCodeValues>({
        resolver: zodResolver(insertResetCodeSchema),
        mode: "onChange",
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = async (data: InsertResetCodeValues) => {

        if (!email) {
            const message = "Nu am putut identifica email-ul pentru resetare. Reia procesul de la primul pas.";
            if (Platform.OS === "web") {
                window.alert(message);
            } else {
                Alert.alert("Eroare", message);
            }
            return;
        }

        const payload = {
            email: email,
            code: data.code
        }

        try {
            
            const response = await verifyResetCode(payload);
            const message = response?.message || "Codul de resetare a fost verificat cu succes!";

            if (Platform.OS === "web") {
                window.alert(message);
            } else {
                Alert.alert("Succes", message);
            }

            await secureStore.setItemAsync("resetPasswordToken", response.token);

            navigation.navigate("ModifyPasswordScreen");

        } catch (error: any) {

            const errorMessage = error.message || "Cod incorect sau expirat.";
            if (Platform.OS === "web") {
                window.alert(errorMessage);
            } else {
                Alert.alert("Eroare", errorMessage);
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-100">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerClassName="flex-grow justify-center px-6 py-10"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="w-full self-center rounded-2xl border border-slate-200 bg-white p-6">
                        <View className="mb-6">
                            <Text className="text-3xl font-semibold text-slate-900">Introdu codul</Text>
                            <Text className="mt-1 text-sm text-slate-500">Introdu codul de 6 cifre primit pe email.</Text>
                        </View>

                        <View className="mb-5">
                            <Controller
                                control={control}
                                name="code"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text className="mb-2 text-sm text-slate-600">Cod resetare</Text>
                                        <TextInput
                                            className={`rounded-xl border px-4 py-3 text-slate-900 ${errors.code ? "border-red-400" : "border-slate-300"}`}
                                            placeholder="000000"
                                            placeholderTextColor="#94a3b8"
                                            onChangeText={(text) => onChange(text.replace(/[^0-9]/g, "").slice(0, 6))}
                                            onBlur={onBlur}
                                            value={value}
                                            keyboardType="number-pad"
                                            maxLength={6}
                                        />
                                    </>
                                )}
                            />
                            {errors.code && <Text className="ml-1 mt-1 text-sm text-red-500">{errors.code.message}</Text>}
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleSubmit(onSubmit)}
                            className="items-center rounded-xl bg-slate-900 py-3"
                        >
                            <Text className="text-base font-semibold text-white">Continuă</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default InsertResetCodeScreen;
