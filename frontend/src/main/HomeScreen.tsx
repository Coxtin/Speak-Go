// screens/Main/HomeScreen.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext'; 

import { EventParams } from '../types/eventParams';

const HomeScreen = () => {
    const auth = useContext(AuthContext);


    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header-ul paginii */}
            <View className="px-6 py-4 flex-row justify-between items-center bg-white shadow-sm z-10">
                <Text className="text-2xl font-bold text-gray-800">
                    Evenimente noi 🔥
                </Text>
                
                {/* Am mutat butonul de Log Out aici sus temporar, sau îl poți pune în Profil */}
                <TouchableOpacity onPress={async () => await auth?.logout()}>
                    <Text className="text-red-500 font-semibold">Log Out</Text>
                </TouchableOpacity>
            </View>

            {/* Aici vor fi evenimentele din baza de date */}
            <ScrollView className="flex-1 px-6 pt-4">
                
                {/* Card de test (Placeholder) */}
                <View className="bg-white p-4 rounded-2xl shadow-sm mb-4 border border-gray-100">
                    <View className="h-40 bg-gray-200 rounded-xl mb-3 items-center justify-center">
                        <Text className="text-gray-400">Imagine Eveniment</Text>
                    </View>
                    <Text className="text-lg font-bold text-gray-800">Concert Rock Legends</Text>
                    <Text className="text-gray-500 mb-2">București, Arenele Romane</Text>
                    <View className="flex-row justify-between items-center mt-2">
                        <Text className="text-blue-600 font-bold text-lg">150 RON</Text>
                        <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
                            <Text className="text-white font-semibold">Rezervă</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Sfârșit Card de test */}

            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;