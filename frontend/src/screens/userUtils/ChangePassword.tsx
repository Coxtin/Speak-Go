import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordValues } from '../../schemas/auth.schema';
import { modifyPassword } from '../../api/user.api';

const ChangePassword = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<ChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            repeatNewPassword: ''
        }
    });

    const onSubmit = async (data: ChangePasswordValues) => {
        
        if (data.oldPassword === data.newPassword){
            Alert.alert("Atenție!", "Nu poți schimba parola cu aceeași ca cea veche!");
            return;
        }
        
        try {
            setIsLoading(true);

            const response = await modifyPassword(data);
            
            Alert.alert("Succes", response.message || "Parola a fost actualizată cu succes!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            Alert.alert("Eroare", error.message || "Nu am putut modifica parola. Te rugăm să încerci din nou.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View className="px-6 py-4 border-b border-gray-100 flex-row items-center justify-between">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
                    >
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="text-xl font-black text-gray-800">Schimbă Parola</Text>
                    <View className="w-10" />
                </View>

                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 24 }}
                >
                    <View className="mb-8">
                        <Text className="text-gray-500 leading-6">
                            Pentru a-ți securiza contul, alege o parolă puternică pe care nu o folosești în altă parte.
                        </Text>
                    </View>

                    {/* Parola Veche */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-bold mb-2 ml-1">Parola Actuală</Text>
                        <View className={`flex-row items-center bg-gray-50 rounded-2xl px-4 border ${errors.oldPassword ? 'border-red-500' : 'border-gray-100'}`}>
                            <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                            <Controller
                                control={control}
                                name="oldPassword"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className="flex-1 py-4 px-3 text-gray-800"
                                        placeholder="Introdu parola actuală"
                                        secureTextEntry={!showOldPassword}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                                <Ionicons name={showOldPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                        {errors.oldPassword && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.oldPassword.message}</Text>}
                    </View>

                    {/* Parola Nouă */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-bold mb-2 ml-1">Parola Nouă</Text>
                        <View className={`flex-row items-center bg-gray-50 rounded-2xl px-4 border ${errors.newPassword ? 'border-red-500' : 'border-gray-100'}`}>
                            <Ionicons name="key-outline" size={20} color="#9CA3AF" />
                            <Controller
                                control={control}
                                name="newPassword"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className="flex-1 py-4 px-3 text-gray-800"
                                        placeholder="Introdu noua parolă"
                                        secureTextEntry={!showNewPassword}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                <Ionicons name={showNewPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                        {errors.newPassword && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.newPassword.message}</Text>}
                    </View>

                    {/* Repetă Parola Nouă */}
                    <View className="mb-10">
                        <Text className="text-gray-700 font-bold mb-2 ml-1">Repetă Parola Nouă</Text>
                        <View className={`flex-row items-center bg-gray-50 rounded-2xl px-4 border ${errors.repeatNewPassword ? 'border-red-500' : 'border-gray-100'}`}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#9CA3AF" />
                            <Controller
                                control={control}
                                name="repeatNewPassword"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className="flex-1 py-4 px-3 text-gray-800"
                                        placeholder="Reintrodu noua parolă"
                                        secureTextEntry={!showRepeatPassword}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            <TouchableOpacity onPress={() => setShowRepeatPassword(!showRepeatPassword)}>
                                <Ionicons name={showRepeatPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                        {errors.repeatNewPassword && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.repeatNewPassword.message}</Text>}
                    </View>

                    {/* Buton Salvare */}
                    <TouchableOpacity 
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                        activeOpacity={0.8}
                        className={`py-4 rounded-2xl items-center shadow-lg ${isLoading ? 'bg-blue-400' : 'bg-blue-600'}`}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-black text-lg">Actualizează Parola</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChangePassword;