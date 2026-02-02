import React, {useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity, Platform, Alert } from "react-native";
import '../../../global.css';


const LoginPage = () => {

    return (

        <SafeAreaView className="flex-1 bg-slate-100">
            <View>
                <Text className="text-2xl font-bold text-gray-800 mb-8 text-center">
                    Aici va fi pagina de Login!
                </Text>
            </View>
        </SafeAreaView>

    )

}

export default LoginPage;