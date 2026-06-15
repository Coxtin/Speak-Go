import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentParams } from '../../types/PaymentParams';
import { usePaymentSheet, useStripe } from '@stripe/stripe-react-native';
import { apiFetch } from '../../api/apiClient';
import { AuthContext } from '../../context/AuthContext';

type PaymentRouteProp = RouteProp<PaymentParams, 'PaymentSummary'>;

const PaymentSummary = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<PaymentRouteProp>();
    const { selectedTickets, totalPrice, currency, eventId } = route.params;

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckOut = async () => {

        try {

            setIsProcessing(true);

            const payload = { 
                eventId: eventId,
                selectedTickets: selectedTickets.map((ticket) => ({
                    ticketId: ticket.id,
                    quantity: ticket.quantity
                }))
            };

            const response = await apiFetch('/payments/create-intent', {
                method: "POST",
                body: JSON.stringify(payload)
            })

            const data = await response.json();

            if (!response.ok){
                
                if (Platform.OS === 'web')
                    window.alert(`Eroare, ${data.message}` || "Eroare la prelucrarea comenzii!");
                else
                    Alert.alert("Eroare!",
                                `Eroare: ${data.message}` || "Eroare la prelucrarea comenzii!");
                    
                    setIsProcessing(false);
                    return;

            }

            const { error: initError } = await initPaymentSheet({
                merchantDisplayName: "Speak&Go",
                paymentIntentClientSecret: data.client_secret,
                returnURL: 'speakandgo://stripe-redirect',
            })

            if (initError){
                if (Platform.OS === 'web')
                    window.alert(`Eroare Stripe: ${initError.message}`);
                else
                    Alert.alert("Eroare!",
                                `Eroare Stripe: ${initError.message}`);

                setIsProcessing(false);
                return;
        
            }

            const { error: paymentError } = await presentPaymentSheet();

            if (paymentError){

                if (paymentError.code === "Canceled")
                    console.log("Plata anulata de utilizator!");
                else
                    Alert.alert("Eroare", `Eroare: ${paymentError.code} ; ${paymentError.message}`);

            } else {

                try {

                    const confirmResponse = await apiFetch('/payments/confirm', {
                        method: "POST",
                        body: JSON.stringify({ bookingId: data.bookingId })
                    })

                    const confirmData = await confirmResponse.json();

                    if (!confirmResponse.ok){
                        Alert.alert("Avertisment",
                                    "Plata a reusit, dar a aparut o intarziere la generarea biletelor! Te rugam, verifica sectiunea 'Biletele mele'");
                        navigation.navigate("MainTabs", { screen: "Biletele mele" });
                        return;
                    }

                    Alert.alert("Succes!", "Plata a fost realizata cu succes! Biletele tale au fost activate!");
                    navigation.navigate("MainTabs", { screen: "Biletele mele" });

                } catch (error: any){

                    console.error(error);
                    Alert.alert("Eroare", "Nu am putut verifica statusul biletelor! Verifica sectiunea 'Biletele mele'!");
                    navigation.navigate("MainTabs", { screen: "Biletele mele" });

                }
            }


        } catch (error: any){

            console.log(error);

              if (Platform.OS === 'web')
                    window.alert("Eroare de conexiune! Te rugam sa verifici conexiunea la internet!");
                else
                    Alert.alert("Eroare!",
                                "Eroare de conexiune! Te rugam sa verifici conexiunea la internet!");
        
            } finally {
                setIsProcessing(false);
            }

    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Sumar Comandă</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                <View className="bg-gray-50 p-6 rounded-3xl mb-8">
                    <Text className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4">Detalii Bilete</Text>
                    
                    {selectedTickets.map((item, index) => (
                        <View key={item.id} className={`flex-row justify-between items-center ${index !== 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''}`}>
                            <View className="flex-1">
                                {item.eventName && (
                                    <Text className="text-gray-400 text-xs font-bold uppercase mb-1">{item.eventName}</Text>
                                )}
                                <Text className="text-gray-900 font-bold text-lg">{item.name}</Text>
                                <Text className="text-gray-500">
                                    {item.quantity} x {item.price} {item.currency}
                                </Text>
                            </View>
                            <Text className="text-gray-900 font-bold text-lg">
                                {item.quantity * item.price} {item.currency}
                            </Text>
                        </View>
                    ))}
                </View>

                <View className="bg-blue-50 p-6 rounded-3xl">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-blue-900 text-xl font-bold">Total de plată</Text>
                        <Text className="text-blue-600 text-2xl font-black">
                            {totalPrice} {currency}
                        </Text>
                    </View>
                </View>

                <View className="mt-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex-row items-center">
                    <Ionicons name="information-circle" size={24} color="#B45309" />
                    <Text className="ml-3 text-yellow-800 text-sm flex-1">
                        Biletele vor fi trimise pe adresa de e-mail asociată contului tău după confirmarea plății.
                    </Text>
                </View>
            </ScrollView>

            <View className="p-6 border-t border-gray-100 bg-white">
                <TouchableOpacity 
                    className="bg-blue-600 py-4 rounded-2xl items-center shadow-lg shadow-blue-300"
                    onPress={handleCheckOut}
                >
                    <Text className="text-white font-bold text-lg">Confirmă și Plătește</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default PaymentSummary;
