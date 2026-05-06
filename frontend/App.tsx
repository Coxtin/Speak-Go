import * as React from 'react';
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./global.css"; 

import { AuthContext, AuthProvider } from './src/context/AuthContext';

 // Ecrane
import HomeScreen from './src/main/HomeScreen';
import VoiceCommands from './src/screens/TestingVoiceCommands';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import ResetPasswordScreen from './src/screens/auth/ResetPasswordScreen'
import InsertResetCodeScreen from './src/screens/auth/InsertResetCodeScreen';
import ModifyPasswordScreen from './src/screens/auth/ModifyPasswordScreen';
import TestingAIReponse from './src/screens/test/TestingAIResponse'


const Stack = createNativeStackNavigator();

const RootNavigator = () => {

  const auth = React.useContext(AuthContext);

  if (auth?.isLoading){
    return (

      <View
        className='flex-1 justify-center items-center'
      >
        <ActivityIndicator size="large" color="blue"/>
      </View>

    )
  }

  return (
        <Stack.Navigator>
            {auth?.user ? (
                // 🟢 ECRANE PROTEJATE (Doar pentru utilizatori logați)
                <>
                    <Stack.Screen 
                        name="Home" 
                        component={HomeScreen} 
                        options={{ title: 'Acasă 🏠', headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="TestingVoice" 
                        component={VoiceCommands} 
                        options={{ 
                            title: 'Testare Voce 🎤',
                            headerStyle: { backgroundColor: '#f4511e' },
                            headerTintColor: "#fff",
                            headerTitleStyle: { fontWeight: 'bold' },
                            headerShown: true 
                        }} 
                    />
                    <Stack.Screen
                        name="TestingAIResponse"
                        component={TestingAIReponse}
                        options={{
                            title: "Testare Raspunsuri AI",
                            headerStyle: { backgroundColor: '#f45qqe' },
                            headerTintColor: '#fff',
                            headerTitleStyle: { fontWeight: 'bold' },
                            headerShown: true
                        }}
                    />
                </>
            ) : (
                // 🔴 ECRANE PUBLICE (Doar pentru vizitatori)
                <>
                    <Stack.Screen
                        name="LoginPage"
                        component={LoginScreen}
                        options={{ 
                            title: 'Pagina Logare',
                            headerStyle: { backgroundColor: 'blue' },
                            headerTintColor: "#fff",
                            headerShown: true 
                        }}
                    />
                    <Stack.Screen 
                        name="SignupPage"
                        component={SignUpScreen}
                        options={{ 
                            title: 'Pagina înregistrare',
                            headerStyle: { backgroundColor: 'green' },
                            headerTintColor: "#fff",
                            headerShown: true 
                        }}
                    />

                    <Stack.Screen
                        name="ResetPasswordScreen"
                        component={ResetPasswordScreen}
                        options={{
                            title: 'Reseteaza parola',
                            headerStyle: {backgroundColor: 'green'},
                            headerTintColor: "#fff",
                            headerShown: true,
                        }}
                    />
                    <Stack.Screen
                        name="InsertResetCodeScreen"
                        component={InsertResetCodeScreen}
                        options={{
                            title: 'Introdu codul',
                            headerStyle: {backgroundColor: 'green'},
                            headerTintColor: "#fff",
                            headerShown: true,
                        }}
                    />
                    <Stack.Screen
                        name="ModifyPasswordScreen"
                        component={ModifyPasswordScreen}
                        options={{
                            title: 'Modifica parola',
                            headerStyle: {backgroundColor: 'green'},
                            headerTintColor: "#fff",
                            headerShown: true,
                        }}
                    />

                </>
            )}
        </Stack.Navigator>
    );

}

export default function App() {
  // React.useEffect(() => {
  //   const pingBackendRoot = async () => {
  //     try {
  //       await fetch("http://172.20.10.6:5002/");
  //     } catch (error) {
  //       console.log("Could not call backend root route:", error);
  //     }
  //   };

  //   pingBackendRoot();
  // }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
