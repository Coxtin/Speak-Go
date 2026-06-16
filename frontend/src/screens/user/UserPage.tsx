import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const UserPage = () => {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    const navigation = useNavigation<any>();

    const handleLogout = () => {
        Alert.alert(
            "Deconectare",
            "Ești sigur că vrei să te deconectezi?",
            [
                { text: "Anulează", style: "cancel" },
                { 
                    text: "Deconectează-mă", 
                    onPress: () => auth?.logout(),
                    style: "destructive"
                }
            ]
        );
    };

    const MenuOption = ({ icon, title, subtitle, onPress, color = "#4B5563", isLast = false }: any) => (
        <TouchableOpacity 
            onPress={onPress}
            activeOpacity={0.7}
            className={`flex-row items-center py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}
        >
            <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4">
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">{title}</Text>
                {subtitle && <Text className="text-gray-400 text-xs mt-0.5">{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header Profil */}
                <View className="items-center px-6 pt-10 pb-12 bg-blue-600 rounded-b-[40px] shadow-xl shadow-blue-200">
                    <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-4 shadow-lg">
                        <Text className="text-blue-600 text-4xl font-black">
                            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </Text>
                        <View className="absolute bottom-0 right-0 bg-green-400 w-6 h-6 rounded-full border-4 border-white" />
                    </View>
                    <Text className="text-white text-2xl font-black">{user?.username || "Utilizator"}</Text>
                    <Text className="text-blue-100 font-medium">{user?.email || "email@exemplu.com"}</Text>
                </View>

                {/* Bară de Statistici (Modern Stats) */}
                <View className="flex-row justify-around bg-white mx-8 -mt-8 rounded-3xl py-5 shadow-xl shadow-gray-200 border border-gray-50 z-10">
                    <View className="items-center">
                        <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Bilete</Text>
                        <Text className="text-gray-900 text-lg font-black">12</Text>
                    </View>
                    <View className="w-[1px] h-8 bg-gray-100 self-center" />
                    <View className="items-center">
                        <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Recenzii</Text>
                        <Text className="text-gray-900 text-lg font-black">5</Text>
                    </View>
                    <View className="w-[1px] h-8 bg-gray-100 self-center" />
                    <View className="items-center">
                        <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Rank</Text>
                        <View className="flex-row items-center">
                            <Ionicons name="star" size={14} color="#F59E0B" />
                            <Text className="text-gray-900 text-lg font-black ml-1">Gold</Text>
                        </View>
                    </View>
                </View>

                {/* Secțiuni Meniu */}
                <View className="px-6 mt-10">

                    <Text className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4 ml-1">Informații Cont</Text>
                    <View className="bg-gray-50 rounded-3xl p-5 mb-8 border border-gray-100 flex-row justify-between">
                        <View className="items-center flex-1">
                            <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                            <Text className="text-gray-400 text-[10px] font-bold mt-1">MEMBRU DIN</Text>
                            <Text className="text-gray-700 font-bold text-xs">Iunie 2024</Text>
                        </View>
                        <View className="w-[1px] h-10 bg-gray-200 self-center" />
                        <View className="items-center flex-1">
                            <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
                            <Text className="text-gray-400 text-[10px] font-bold mt-1">STATUS</Text>
                            <Text className="text-green-600 font-bold text-xs">Verificat</Text>
                        </View>
                    </View>
                    
                    <Text className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4 ml-1">General</Text>
                    <View className="bg-white rounded-3xl border border-gray-100 px-4 mb-8 shadow-sm">
                        <MenuOption 
                            icon="person-outline" 
                            title="Editează Profilul" 
                            subtitle="Nume, imagine și detalii contact"
                            onPress={() => Alert.alert("Info", "Funcționalitate în curs de dezvoltare")}
                        />
                        <MenuOption 
                            icon="lock-closed-outline" 
                            title="Schimbă Parola" 
                            subtitle="Securizează-ți contul"
                            isLast={true}
                            onPress={() => navigation.navigate("ChangePassword")}
                        />
                    </View>

                    <Text className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4 ml-1">Suport</Text>
                    <View className="bg-white rounded-3xl border border-gray-100 px-4 mb-8 shadow-sm">
                        <MenuOption 
                            icon="help-circle-outline" 
                            title="Centru de Ajutor" 
                            subtitle="Întrebări frecvente și suport"
                            onPress={() => navigation.navigate("HelpCenter")}
                        />
                        <MenuOption 
                            icon="information-circle-outline" 
                            title="Despre Speak&Go" 
                            isLast={true}
                            onPress={() => Alert.alert(
                                "Despre Speak&Go", 
                                "Versiune: 1.0.0-alpha.2\nBuild: 20260616\n\nDezvoltat cu ❤️ pentru experiențe memorabile."
                            )}
                        />
                    </View>

                    {/* Logout */}
                    <TouchableOpacity 
                        onPress={handleLogout}
                        activeOpacity={0.8}
                        className="flex-row items-center justify-center py-4 bg-red-50 rounded-2xl border border-red-100 mt-4"
                    >
                        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                        <Text className="ml-2 text-red-500 font-bold text-lg">Deconectare</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UserPage;
