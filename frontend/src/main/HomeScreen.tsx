import React , { useContext }from 'react';
import {View, Text, TouchableOpacity, Button, Platform, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from '../context/AuthContext';

function showAlert(message: string){
    if (Platform.OS == 'web')
        window.alert(message);
    else
        Alert.alert(message);
}

const HomeScreen = () => {

    const auth = useContext(AuthContext);

    const navigation = useNavigation<any>();

    return (

        <SafeAreaView className="flex-1 bg-slate-100">
            <View className="flex-1 items-center justify-center px-6">

                <Text className="text-2xl font-bold text-gray-800 mb-8 text-center">
                    Mergi la cautarea vocala!
                </Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('TestingVoice')}
                    activeOpacity={0.7}
                    className='bg-blue-500 px-6 py-3 rounded-xl mb-4 w-64'
                >
                    <Text className="text-white font-semibold text-lg text-center">Demo Speech to Text</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('TestingAIResponse')}
                    activeOpacity={0.7}
                    className='bg-blue-500 px-6 py-3 rounded-xl mb-4 w-64'
                >
                    <Text className='text-white font-semibold text-lg text-center'>Raspunsuri de la AI</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    onPress={() => navigation.navigate('LoginPage')}
                    activeOpacity={0.7}
                    className='bg-blue-500 px-6 py-3 rounded-xl mb-4 w-64'    
                >
                    <Text className="text-white font-semibold text-lg text-center">Login</Text>
                </TouchableOpacity>   

                <TouchableOpacity
                    onPress={() => navigation.navigate('SignupPage')}
                    activeOpacity={0.7}
                    className='bg-blue-500 px-6 py-3 rounded-xl w-64'    
                >
                    <Text className="text-white font-semibold text-lg text-center">Sign Up</Text>
                </TouchableOpacity>  */}

                <TouchableOpacity
                    onPress={async () => await auth?.logout()}
                    activeOpacity={0.7}
                    className='bg-blue-500 px-6 py-3 rounded-xl w-64'
                >
                    <Text className='text-white font-semibold text-lg text-center'>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

    );

}

export default HomeScreen;