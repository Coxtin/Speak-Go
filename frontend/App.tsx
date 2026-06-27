import * as React from 'react';
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import "./global.css"; 

//Contexte
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { ModalContext, ModalProvider } from './src/context/ModalContext';

 // Ecrane
import HomeScreen from './src/main/HomeScreen';
import VoiceCommands from './src/screens/test/TestingVoiceCommands';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import ResetPasswordScreen from './src/screens/auth/ResetPasswordScreen'
import InsertResetCodeScreen from './src/screens/auth/InsertResetCodeScreen';
import ModifyPasswordScreen from './src/screens/auth/ModifyPasswordScreen';
import TestingAIReponse from './src/screens/test/TestingAIResponse'
import SearchEvents from './src/screens/main/SearchEvents';
import EventPage from './src/screens/eventPages/EventPage';
import MainTabNavigator from './src/navigation/MainNavigator';
import GlobalModal from './src/components/GlobalModal';
import BookEvent from './src/screens/eventPages/BookEvent';
import TicketPage from './src/screens/ticketPage/TicketPage';
import PaymentSummary from './src/screens/eventPages/PaymentSummary';
import HelpCenter from './src/screens/userUtils/HelpCenter';
import ChangePassword from './src/screens/userUtils/ChangePassword';
import ScannerPage from './src/screens/scan/ScannerPage';
import ReviewPage from './src/screens/eventPages/ReviewPage';


const Stack = createNativeStackNavigator();

const STRIPE_PUBLISHABLE_KEY = "pk_test_51ThrXyL2TYUo7CJ5fU110hCU7rmGQEeRWyoYQMWVHu19btHeL8N2CO3XDvGA2MZZ4w1yCJud1yT55PNhpSKgmivw00ASQZcqCj";

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
                            name="MainTabs" 
                            component={MainTabNavigator} 
                            options={{ headerShown: false }} 
                        />
                        
                        <Stack.Screen 
                            name="EventPage"
                            component={EventPage}
                            options={{ headerShown: false }}
                        
                        />

                        <Stack.Screen
                            name="BookEvent"
                            component={BookEvent}
                            options={{headerShown: false}}
                        />

                        <Stack.Screen
                            name="PaymentSummary"
                            component={PaymentSummary}
                            options={{headerShown: false}}
                        />

                        <Stack.Screen
                            name="HelpCenter"
                            component={HelpCenter}
                            options={{headerShown: false}}
                        />

                        <Stack.Screen
                            name="ChangePassword"
                            component={ChangePassword}
                            options={{headerShown: false}}
                        />

                        {/* Am sters ReviewPage de aici deoarece este folosit ca o componenta de Modal, nu ca un ecran de sine statator */}

                        <Stack.Screen
                            name="ScannerPage"
                            component={ScannerPage}
                            options={{ headerShown: false }}
                        />

                        {/* <Stack.Screen 
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
                        <Stack.Screen
                            name="SearchEvents"
                            component={SearchEvents}
                            options={{
                                title: "Testare Comanda -> Raspuns AI",
                                headerStyle: { backgroundColor: '#f45qqe' },
                                headerTintColor: '#fff',
                                headerTitleStyle: { fontWeight: 'bold' },
                                headerShown: true
                            }}
                        /> */}
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
                                title: 'Resetează parola',
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
                                title: 'Modifică parola',
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
                <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
                    <NavigationContainer>
                        <ModalProvider>
                            <GlobalModal />
                            <RootNavigator />
                        </ModalProvider>
                    </NavigationContainer>
                </StripeProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
