import React, { useState } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, Platform, Alert, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTickets } from '../../hooks/useTickets';
import { Ionicons } from '@expo/vector-icons';

type EventId = RouteProp<{BookEvent: { eventId: number }}, "BookEvent">

const BookEvent = () => {

    const navigation = useNavigation<any>();
    const route = useRoute<EventId>();
    const eventId = route.params.eventId;

    // NOU: Starea care memorează cantitatea pentru fiecare tip de bilet în parte
    // Ex: { id_bilet_1: 2, id_bilet_2: 0 }
    const [ticketQuantities, setTicketQuantities] = useState<Record<number, number>>({});

    const { ticket, availableSeats, isLoading } = useTickets(eventId);

    // Funcția pentru adăugarea unui bilet (+1)
    const incrementTicket = (id: number) => {
        setTicketQuantities((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1
        }));
    };

    // Funcția pentru eliminarea unui bilet (-1)
    const decrementTicket = (id: number) => {
        setTicketQuantities((prev) => {
            const currentQty = prev[id] || 0;
            if (currentQty <= 0) return prev; // Nu lăsăm să scadă sub 0
            
            return {
                ...prev,
                [id]: currentQty - 1
            };
        });
    };

    // Calculăm numărul total de bilete selectate pentru a ști dacă activăm butonul de Plată
    const totalSelectedTickets = Object.values(ticketQuantities).reduce((acc, curr) => acc + curr, 0);

    const handleContinue = () => {
        if (!ticket) return;

        const selectedTickets = ticket.ticketInfo.ticketTypes
            .filter(type => ticketQuantities[type.id] > 0)
            .map(type => ({
                ...type,
                quantity: ticketQuantities[type.id],
                eventName: ticket.eventName // Adăugăm numele evenimentului
            }));

        const totalPrice = selectedTickets.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
        const currency = selectedTickets[0]?.currency || '';

        navigation.navigate('PaymentSummary', {
            selectedTickets,
            totalPrice,
            currency,
            eventId
        } );
    };

    if (!eventId){
        if (Platform.OS === 'web'){
            window.alert("Eroare la preluarea datelor evenimentului!")
            navigation.goBack();
        } else {
            Alert.alert(
                "Eroare!",
                "Eroare la preluarea datelor evenimentului!",
                [{ text: "OK" , onPress: () => navigation.goBack() }]
            )
        }
        return null;
    }

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="mt-4 text-gray-600 font-medium">Se încarcă biletele...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center px-6 py-4 border-b border-gray-100">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Rezervă Bilete</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                <View className="bg-blue-50 p-6 rounded-3xl mb-8 flex-row items-center justify-between">
                    <View>
                        <Text className="text-blue-700 text-sm font-bold uppercase tracking-wider mb-1">Locuri Disponibile</Text>
                        
                        {/* CORECTAT: Roșu dacă sunt puține (FOMO), albastru dacă sunt multe */}
                        {availableSeats <= 50 ? (
                            <Text className="text-red-600 text-3xl font-black">{availableSeats}</Text>
                        ) : (
                            <Text className="text-blue-900 text-3xl font-black">{availableSeats}</Text>
                        )}
                        
                    </View>
                    <View className="bg-blue-100 p-3 rounded-2xl">
                        <Ionicons name="ticket" size={32} color="#2563EB" />
                    </View>
                </View>

                <Text className="text-lg font-bold text-gray-900 mb-4">Alege tipul biletului</Text>

                {ticket?.ticketInfo.ticketTypes && ticket.ticketInfo.ticketTypes.length > 0 ? (
                    ticket.ticketInfo.ticketTypes.map((type) => {
                        
                        // Extragem cantitatea curentă pentru acest bilet specific
                        const currentQty = ticketQuantities[type.id] || 0;

                        return (
                            <View 
                                key={type.id}
                                className={`p-5 rounded-2xl mb-4 border flex-row items-center justify-between ${currentQty > 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}
                            >
                                <View className="flex-1 mr-4">
                                    <Text className="text-gray-900 font-bold text-lg mb-1">{type.name}</Text>
                                    <Text className="text-gray-500 text-sm mb-2">Acces complet conform categoriei</Text>
                                    <Text className="text-blue-600 font-black text-xl">
                                        {type.price} {type.currency}
                                    </Text>
                                </View>
                                
                                {/* NOU: Selectorul de cantitate */}
                                <View className="flex-row items-center">
                                    {/* Butonul de Minus apare DOAR dacă avem măcar 1 bilet selectat */}
                                    {currentQty > 0 && (
                                        <>
                                            <TouchableOpacity 
                                                activeOpacity={0.7}
                                                onPress={() => decrementTicket(type.id)}
                                                className="w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm"
                                            >
                                                <Ionicons name="remove" size={20} color="#374151" />
                                            </TouchableOpacity>
                                            
                                            <Text className="mx-6 text-xl font-bold text-gray-900 w-6 text-center">
                                                {currentQty}
                                            </Text>
                                        </>
                                    )}

                                    {/* Butonul de Plus */}
                                    <TouchableOpacity 
                                        activeOpacity={0.7}
                                        onPress={() => incrementTicket(type.id)}
                                        className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center shadow-md shadow-blue-300"
                                    >
                                        <Ionicons name="add" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View className="bg-red-50 p-6 rounded-3xl items-center">
                        <Ionicons name="alert-circle" size={48} color="#EF4444" />
                        <Text className="text-red-800 font-bold text-lg mt-2">Niciun bilet disponibil</Text>
                        <Text className="text-red-600 text-center mt-1">Ne pare rău, nu au fost găsite categorii de bilete pentru acest eveniment.</Text>
                    </View>
                )}
            </ScrollView>

            <View className="p-6 border-t border-gray-100 bg-white">
                <TouchableOpacity 
                    className={`py-4 rounded-2xl items-center shadow-lg ${totalSelectedTickets > 0 && availableSeats > 0 ? 'bg-blue-600 shadow-blue-300' : 'bg-gray-300 shadow-none'}`}
                    disabled={totalSelectedTickets <= 0 || availableSeats <= 0 || totalSelectedTickets > availableSeats}
                    onPress={handleContinue}
                >
                    <Text className="text-white font-bold text-lg">
                        {totalSelectedTickets <= 0 ? "Alege un bilet!" : 
                        totalSelectedTickets > availableSeats ? "Nu sunt destule bilete!"
                        : `Cumpara (${totalSelectedTickets} ${totalSelectedTickets == 1 ? "bilet" : "bilete"})`}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default BookEvent;