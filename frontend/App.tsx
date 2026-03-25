import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./global.css"; 


 // Ecrane
import HomeScreen from './src/main/HomeScreen';
import VoiceCommands from './src/screens/TestingVoiceCommands';
import LoginScreen from './src/screens/auth/LoginScreen'
import SignUpScreen from './src/screens/auth/SignUpScreen'


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          
          {/* Ecranul Principal */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Acasă 🏠', headerShown: false }} 
          />

          {/* Ecranul de Test Voce */}
          <Stack.Screen 
            name="TestingVoice" 
            component={VoiceCommands} 
            options={{ title: 'Testare Voce 🎤',
                      headerStyle:{backgroundColor: '#f4511e'},
                      headerTintColor: "#fff",
                      headerTitleStyle:{fontWeight: 'bold'},
                      headerShown: true }} 
          />
          <Stack.Screen
            name="LoginPage"
            component={LoginScreen}
            options={{title: 'Pagina Logare',
                      headerStyle: {backgroundColor: 'blue'},
                      headerShown: true, }}
          />

          <Stack.Screen 
            name="SignupPage"
            component={SignUpScreen}
            options={{title: 'Pagina inregistrare',
                      headerStyle: {backgroundColor: 'green'},
                      headerShown: true, }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}