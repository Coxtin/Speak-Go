import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Platform, Alert, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import '../../../global.css';
import { LoginFormValues, loginSchema } from "../../schemas/auth.schema";
import { loginUser } from "../../api/auth.api";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {

    const navigation = useNavigation<any>();

    const auth = useContext(AuthContext);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
       
        try {

            const response = await loginUser(data);

           // console.log("am primit: ", response);

            console.log(response.data.user);
            console.log(response.data.refreshToken);

            await auth?.login(
                response.data.accessToken,
                response.data.refreshToken,
                response.data.user,
            );


        } catch (error: any){

            const message = error?.message || "A aparut o eroare necunoscuta.";

            if (Platform.OS === 'web')
                window.alert(message);
            else
                Alert.alert("Eroare", message);
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
                            <Text className="text-3xl font-semibold text-slate-900">Login</Text>
                            <Text className="mt-1 text-sm text-slate-500">Intră în contul tău Speak&Go</Text>
                        </View>

                        <View className="mb-4">
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

                        <View className="mb-5">
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <Text className="mb-2 text-sm text-slate-600">Parolă</Text>
                                        <TextInput
                                            className={`rounded-xl border px-4 py-3 text-slate-900 ${errors.password ? "border-red-400" : "border-slate-300"}`}
                                            placeholder="Introdu parola"
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

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleSubmit(onSubmit)}
                            className="items-center rounded-xl bg-slate-900 py-3"
                        >
                            <Text className="text-base font-semibold text-white">Autentificare</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate("SignupPage")}
                            className="mt-5 items-center"
                        >
                            <Text className="text-sm text-slate-600">
                                Nu ai cont? <Text className="font-semibold text-slate-900">Creează unul</Text>
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate("ResetPasswordScreen")}
                                className="mt-5 items-center"
                                
                        >

                                <Text className="text-sm text-slate-600">
                                    Ai uitat parola? <Text className="font-semibold text-slate-900">Reseteaz-o!</Text>
                                </Text>

                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

}

export default LoginPage;

