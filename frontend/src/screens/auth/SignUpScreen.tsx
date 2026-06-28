import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, Platform, Alert, TextInput, KeyboardAvoidingView, Modal, ScrollView } from "react-native";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormValues, signupSchema } from "../../schemas/auth.schema";

import '../../../global.css';
import DateTimePicker from "@react-native-community/datetimepicker";
import { registerUser } from "../../api/auth.api";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";


const SignupPage = () => {

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showAgainPassword, setShowAgainPassword] = useState(false);
    const navigation = useNavigation<any>();

    const defaultPickerDate = new Date();
    defaultPickerDate.setFullYear(defaultPickerDate.getFullYear() - 11);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signupSchema),
        mode: "onChange",
        defaultValues:{
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            birthDate: undefined,
            password: '',
            repeatPassword: ''
        }
    });

   const onSubmit = async (data: SignUpFormValues) => {
        try {
            const response = await registerUser(data);
            const successMessage = response?.message || "Cont creat cu succes!";

            if (Platform.OS === "web") {
                window.alert(successMessage);
            } else {
                Alert.alert("Succes", successMessage);
            }
        } catch (error: any) {
            const message = error?.message || "A aparut o eroare necunoscuta.";

            if (Platform.OS === "web") {
                window.alert(message);
            } else {
                Alert.alert("Eroare", message);
            }
        }
   }

    return (
        <SafeAreaView className="flex-1 bg-slate-100">
           <KeyboardAvoidingView 
                behavior = {Platform.OS === "ios" ? "padding" : "height"}
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
                            <Text className="text-3xl font-semibold text-slate-900">Signup</Text>
                            <Text className="mt-1 text-sm text-slate-500">Creează un cont nou Speak&Go</Text>
                        </View>

                    <View className="mb-4">
                        <Controller
                            control={control}
                            name="firstName"
                            render={({
                                field: {onChange, onBlur, value},
                            }) => (
                                <>
                                <Text
                                    className="mb-2 text-sm text-slate-600"
                                >
                                    Prenume
                                </Text>
                                <TextInput
                                    className={`rounded-xl border px-4 py-3 text-slate-900 ${errors.firstName ? "border-red-400" : "border-slate-300"}`}
                                    placeholder="John"
                                    placeholderTextColor="#94a3b8"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    />
                                </>
                            )}
                            
                        />
                        {errors.firstName && (<Text className="ml-1 mt-1 text-sm text-red-500">{errors.firstName.message}</Text>)}
                    </View>

                    <View className="mb-4">
                            <Controller
                                control={control}
                                name="lastName"
                                render={({
                                    field: {onChange, onBlur, value}
                                }) => (
                                    <>
                                    <Text
                                        className="mb-2 text-sm text-slate-600"
                                    >
                                        Nume
                                    </Text>
                                    <TextInput
                                    className={`rounded-xl border px-4 py-3 text-slate-900 ${errors.lastName ? "border-red-400" : "border-slate-300"}`}
                                    placeholder="Doe"
                                    placeholderTextColor="#94a3b8"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    />
                                    </>
                                )}
                            />
                            {errors.lastName && (<Text className="ml-1 mt-1 text-sm text-red-500">{errors.lastName.message}</Text>)}
                    </View>

                    <View className="mb-4">
                        <Controller
                            control={control}
                            name="username"
                            render={({
                                field: {onChange, onBlur, value}
                            }) => (
                               <>
                                <Text
                                     className="mb-2 text-sm text-slate-600"
                                >
                                    Username
                                </Text>

                                <TextInput
                                    className={`rounded-xl border px-4 py-3 text-slate-900 ${errors.username ? "border-red-400" : "border-slate-300"}`}
                                    placeholder="Username"
                                    placeholderTextColor="#94a3b8"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    autoCapitalize="none"
                                />

                               </>
                            )}                       
                        />
                        {errors.username && (<Text className="ml-1 mt-1 text-sm text-red-500">{errors.username.message}</Text>)}

                    </View>

                    <View className="mb-4">
                            <Controller
                                control={control}
                                name="email"
                                render={({
                                    field: {onChange, onBlur, value}
                                }) => (
                                    <>
                                    <Text
                                        className="mb-2 text-sm text-slate-600"
                                    >  
                                        Email
                                    </Text>
                                    <TextInput
                                    className={`rounded-xl border px-4 py-3 text-slate-900 ${errors.email ? "border-red-400" : "border-slate-300"}`}
                                    placeholder="JohnDoe@gmail.com"
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
                            {errors.email && (<Text className="ml-1 mt-1 text-sm text-red-500">{errors.email.message}</Text>)}
                    </View>

                    <View className="mb-4">
                            <Controller
                                control={control}
                                name="birthDate"
                                render={({
                                    field: {onChange, onBlur, value}
                                }) => (
                                    <>
                                    <Text
                                        className="mb-2 text-sm text-slate-600"
                                    >
                                        Data nașterii
                                    </Text>
                                    <View>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => setShowDatePicker(true)}
                                            className={`rounded-xl border px-4 py-3 ${errors.birthDate ? "border-red-400" : "border-slate-300"}`}
                                        >
                                            <Text className={value ? "text-slate-900" : "text-slate-400"}>
                                                {value ? value.toLocaleDateString('ro-RO') : "ZZ/LL/AAAA"}
                                            </Text>
                                        </TouchableOpacity>
                                        
                                        {Platform.OS === 'ios' ? (
                                            <Modal
                                                visible={showDatePicker}
                                                transparent
                                                animationType="slide"
                                            >
                                                <TouchableOpacity 
                                                    activeOpacity={1}
                                                    onPress={() => setShowDatePicker(false)}
                                                    className="flex-1 justify-end"
                                                    style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
                                                >
                                                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                                                    <View className="bg-white rounded-t-3xl pb-6">
                                                        <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
                                                            <View />
                                                            <TouchableOpacity
                                                                onPress={() => setShowDatePicker(false)}
                                                                className="px-4 py-1"
                                                            >
                                                                <Text className="text-blue-500 font-semibold text-base">
                                                                    Gata
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                        <DateTimePicker
                                                            mode="date"
                                                            value={value || defaultPickerDate}
                                                            // maximumDate={new Date()}
                                                            display="spinner"
                                                            textColor="#000000"
                                                            onChange={(event, selectedDate) => {
                                                                if (selectedDate) {
                                                                    onChange(selectedDate);
                                                                }
                                                            }}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        </Modal>
                                    ) : (
                                        showDatePicker && (
                                            <DateTimePicker
                                                value={value || defaultPickerDate}
                                                mode="date"
                                                maximumDate={new Date()}
                                                display="default"
                                                onChange={(event, selectedDate) => {
                                                setShowDatePicker(false);
                                                if (event.type == 'set' && selectedDate)
                                                    onChange(selectedDate);
                                                }}       
                                            />
                                        )
                                    )}
                                </View>    
                                </>                        
                            )}
                        />

                        {errors.birthDate && (<Text className="ml-1 mt-1 text-sm text-red-500">{errors.birthDate.message}</Text>)}

                    </View>
                 
                    <View className="mb-4">
                        <Text className="mb-2 text-sm text-slate-600">Parolă</Text>
                        <View className={`flex-row items-center rounded-xl border ${errors.password ? "border-red-400" : "border-slate-300"}`}>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className="flex-1 px-4 py-3 text-slate-900"
                                        placeholder="Introdu parola"
                                        placeholderTextColor="#94a3b8"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        secureTextEntry={!showPassword}
                                    />
                                )}
                            />
                            <TouchableOpacity
                                className="px-4"
                                activeOpacity={0.8}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF"/>
                            </TouchableOpacity>
                        </View>
                        {errors.password && (<Text className="ml-1 mt-1 text-sm text-red-500">{errors.password.message}</Text>)}
                    </View>
                    
                    <View className="mb-4">
                        <Text className="mb-2 text-sm text-slate-600">Repetă parola</Text>
                        <View className={`flex-row items-center rounded-xl border ${errors.repeatPassword ? "border-red-400" : "border-slate-300"}`}>
                            <Controller
                                control={control}
                                name="repeatPassword"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className="flex-1 px-4 py-3 text-slate-900"
                                        placeholder="Reintrodu parola"
                                        placeholderTextColor="#94a3b8"
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        secureTextEntry={!showAgainPassword}
                                    />
                                )}
                            />
                            <TouchableOpacity
                                className="px-4"
                                activeOpacity={0.8}
                                onPress={() => setShowAgainPassword(!showAgainPassword)}
                            >
                                <Ionicons name={showAgainPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF"/>
                            </TouchableOpacity>
                        </View>
                        {errors.repeatPassword && (<Text className="ml-1 mt-1 text-sm text-red-500">{errors.repeatPassword.message}</Text>)}
                    </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmit(onSubmit)}
                    className="mt-2 items-center rounded-xl bg-slate-900 py-3"
                >
                    <Text className="text-base font-semibold text-white">Creează cont</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate("LoginPage")}
                    className="mt-5 items-center"
                >
                    <Text className="text-sm text-slate-600">
                        Ai deja cont? <Text className="font-semibold text-slate-900">Autentifică-te</Text>
                    </Text>
                </TouchableOpacity>
                </View>
            </ScrollView> 
        </KeyboardAvoidingView>
    </SafeAreaView>

    );
}

export default SignupPage;
