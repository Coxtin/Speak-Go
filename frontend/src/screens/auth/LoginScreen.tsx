import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Platform, Alert, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import '../../../global.css';

const loginSchema = z.object({
    email: z.email({ message: "Enter a valid email address!" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters!" }),
});

type LoginFormValue = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValue>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: LoginFormValue) => {
        if (Platform.OS === "web") {
            window.alert(`Succes! Logare initiata pentru ${data.email}`);
        } else {
            Alert.alert("Succes!", `Logare initiata pentru ${data.email}`);
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
                    className="px-8"
                    contentContainerClassName="flex-grow px-8 pb-12 pt-6"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="mb-4">
                        <Text className="text-4l">Bine ai revenit</Text>
                        <Text className="text-lg">Conecteaza-te in contul tau!</Text>
                    </View>

                    <View className="mb-4">
                        <Controller
                            control={control}
                            name="email"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <>
                                    <Text className="text-sm font-sans">Enter your email address:</Text>
                                    <TextInput
                                        className={`bg-gray-100 px-4 py-4 rounded-xl text-gray-800 border ${errors.email ? `border-red-150` : `border-gray-200`}`}
                                        placeholder="ceva@ceva.com"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </>
                            )}
                        />
                        {errors.email && (<Text className="text-red-500 text-sm mt-1 ml-1">{errors.email.message}</Text>)}
                    </View>

                    <View className="mb-4">
                        <Controller
                            control={control}
                            name="password"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <>
                                    <Text className="text-sm font-sans">Enter your password:</Text>
                                    <TextInput
                                        className={`bg-gray-100 px-4 py-4 rounded-xl text-gray-800 border ${errors.password ? `border-red-150` : `border-gray-200`}`}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        secureTextEntry
                                    />
                                </>
                            )}
                        />
                        {errors.password && (<Text className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</Text>)}
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleSubmit(onSubmit)}
                        className="bg-blue-600 py-4 rounded-xl mt-4 items-center shadow-md"
                    >
                        <Text className="text-white text-lg font-bold">Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>

    )

}

export default LoginPage;