import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Platform, Alert, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRoute } from "@react-navigation/native";
import "../../../global.css";
import { modifyPasswordSchema, ModifyPasswordValues } from "../../schemas/auth.schema";
import { modifyPassword } from "../../api/auth.api";

import * as secureStore from 'expo-secure-store';

const ModifyPasswordScreen = () => {
    const navigation = useNavigation<any>();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ModifyPasswordValues>({
        resolver: zodResolver(modifyPasswordSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            repeatPassword: "",
        },
    });

    const onSubmit = async (data: ModifyPasswordValues) => {
       
        try {

            const resetPasswordToken = await secureStore.getItemAsync("resetPasswordToken");

            if (!resetPasswordToken){

                const msg = "Sesiunea este invalidă sau a expirat. Te rugăm să reiei procesul.";
            
                if (Platform.OS === "web") window.alert(msg);
                else Alert.alert("Eroare", msg);
            
                navigation.navigate("ResetPasswordScreen"); 
                return;

            }

            const payload = {
                newPassword: data.password,
                token: resetPasswordToken
            }

            const response = await modifyPassword(payload);

            const successMessage = response?.message || "Parola a fost actualizata. Te poti autentifica acum!";
            
            if (Platform.OS === "web") {
                window.alert(successMessage);
            } else {
                Alert.alert("Succes", successMessage);
            }

            await secureStore.deleteItemAsync("resetPasswordToken");
            
            navigation.navigate("LoginPage");

        } catch (error: any){

             const message = error?.message || "A aparut o eroare necunoscuta.";
            
            if (Platform.OS === 'web')
                window.alert(message);
            else
                Alert.alert("Eroare", message);
        }
    }


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
                            <Text className="text-3xl font-semibold text-slate-900">Setează parola nouă</Text>
                            <Text className="mt-1 text-sm text-slate-500">Alege o parolă sigură pentru contul tău.</Text>
                        </View>

                        <View className="mb-4">
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text className="mb-2 text-sm text-slate-600">Parolă nouă</Text>
                                        <TextInput
                                            className={`rounded-xl border px-4 py-3 text-slate-900 ${errors.password ? "border-red-400" : "border-slate-300"}`}
                                            placeholder="Introdu parola noua"
                                            placeholderTextColor="#94a3b8"
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            secureTextEntry
                                        />
                                    </>
                                )}
                            />
                            {errors.password && <Text className="ml-1 mt-1 text-sm text-red-500">{errors.password.message}</Text>}
                        </View>

                        <View className="mb-5">
                            <Controller
                                control={control}
                                name="repeatPassword"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text className="mb-2 text-sm text-slate-600">Confirmă parola</Text>
                                        <TextInput
                                            className={`rounded-xl border px-4 py-3 text-slate-900 ${errors.repeatPassword ? "border-red-400" : "border-slate-300"}`}
                                            placeholder="Reintrodu parola"
                                            placeholderTextColor="#94a3b8"
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            value={value}
                                            secureTextEntry
                                        />
                                    </>
                                )}
                            />
                            {errors.repeatPassword && <Text className="ml-1 mt-1 text-sm text-red-500">{errors.repeatPassword.message}</Text>}
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleSubmit(onSubmit)}
                            className="items-center rounded-xl bg-slate-900 py-3"
                        >
                            <Text className="text-base font-semibold text-white">Salvează parola</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ModifyPasswordScreen;
