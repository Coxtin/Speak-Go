import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Platform, Alert, TextInput, KeyboardAvoidingView, ScrollView, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import "../../../global.css";
import { resetPasswordSchema, ResetPasswordValues } from "../../schemas/auth.schema";
import { sendResetCode } from "../../api/auth.api";


const ResetPasswordPage = () => {
    const navigation = useNavigation<any>();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
        },
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: ResetPasswordValues) => {
        try {

            setIsLoading(true);

            const response = await sendResetCode(data);
            const message = response?.message || "Ți-am trimis pe email instrucțiunile pentru resetarea parolei.";

            if (Platform.OS === "web") {
                window.alert(message);
            } else {
                Alert.alert("Succes", message);
            }

            navigation.navigate("InsertResetCodeScreen", { email: data.email });

        } catch (error: any) {
            const message = error?.message || "Eroare la resetarea parolei!";

            if (Platform.OS === "web") {
                window.alert(message);
            } else {
                Alert.alert("Eroare", message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-100">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="relative flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerClassName="flex-grow justify-center px-6 py-10"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="w-full self-center rounded-2xl border border-slate-200 bg-white p-6">
                        <View className="mb-6">
                            <Text className="text-3xl font-semibold text-slate-900">Resetare parolă</Text>
                            <Text className="mt-1 text-sm text-slate-500">Introdu adresa de email asociată contului tău.</Text>
                        </View>

                        <View className="mb-5">
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Text className="mb-2 text-sm text-slate-600">Email</Text>
                                        <TextInput
                                            className={`rounded-xl border px-4 py-3 text-slate-900 ${errors.email ? "border-red-400" : "border-slate-300"}`}
                                            placeholder="ceva@ceva.com"
                                            placeholderTextColor="#94a3b8"
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </>
                                )}
                                />
                                    {errors.email && <Text className="ml-1 mt-1 text-sm text-red-500">{errors.email.message}</Text>}
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading}
                                className="items-center rounded-xl bg-slate-900 py-3"
                            >
                                <Text className="text-base font-semibold text-white">Trimite codul de resetare</Text>
                            </TouchableOpacity>
                        </View>
                </ScrollView>
                {isLoading && (
                    <View className="absolute inset-0 z-10 items-center justify-center bg-gray-500/40">
                        <ActivityIndicator size="large" color="#2563EB" />
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ResetPasswordPage;
