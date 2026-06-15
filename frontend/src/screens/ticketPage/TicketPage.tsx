import React, { useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    RefreshControl, 
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch } from '../../api/apiClient'; // Ajustează calea dacă este nevoie
import { Ticket } from '../../types/TicketInfo';


const TicketPage = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Funcția care aduce datele de la server
    const fetchMyTickets = async () => {
        try {
            setError(null);
            
            const response = await apiFetch('/tickets', { // Asigură-te că ruta se potrivește cu backend-ul
                method: 'GET'
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "A apărut o eroare la aducerea biletelor.");
                return;
            }

            // Setăm biletele direct. Dacă nu are niciunul, backend-ul returnează []
            setTickets(data.tickets || []);

        } catch (err) {
            console.error("Eroare de rețea:", err);
            setError("Eroare de conexiune. Verifică internetul!");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    // useFocusEffect rulează de fiecare dată când acest tab devine activ pe ecran
    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            fetchMyTickets();
        }, [])
    );

    // Funcția pentru gestul de "Trage în jos pentru a reîmprospăta"
    const onRefresh = () => {
        setIsRefreshing(true);
        fetchMyTickets();
    };

    // Design-ul pentru un singur bilet
    const renderTicket = ({ item }: { item: Ticket }) => (
        <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 mx-1 items-center">
            <View className="w-full items-center mb-6 pb-6 border-b border-dashed border-gray-200">
                <Text className="text-xl font-black text-gray-900 text-center mb-2">
                    {item.booking.event.name}
                </Text>
                <View className="bg-blue-50 px-4 py-1.5 rounded-full">
                    <Text className="text-blue-700 font-bold text-sm">
                        {item.ticketType.name}
                    </Text>
                </View>
            </View>

            {/* Generarea on-the-fly a codului QR vectorial */}
            <View className="p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
                <QRCode
                    value={item.qrCode} 
                    size={200}
                    color="#111827" // Un negru mai blând pentru design, dar perfect scanabil
                    backgroundColor="white"
                />
            </View>

            <Text className="mt-6 text-xs font-mono text-gray-400 uppercase tracking-widest">
                ID BILET: {item.qrCode.split('-')[0]}
            </Text>
            
            {/* Un mic badge vizual pentru status */}
            {item.status === 'SCANNED' && (
                <View className="absolute top-4 right-4 bg-red-100 px-3 py-1 rounded-full">
                    <Text className="text-red-700 font-bold text-xs uppercase">Scanat</Text>
                </View>
            )}
        </View>
    );

    // Starea de încărcare inițială
    if (isLoading && !isRefreshing) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="mt-4 text-gray-500 font-medium tracking-wide">
                    Căutăm biletele tale...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 px-6 pt-6">
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-3xl font-black text-gray-900">Biletele Mele</Text>
                <View className="bg-blue-100 w-10 h-10 rounded-full justify-center items-center">
                    <Ionicons name="ticket" size={20} color="#2563EB" />
                </View>
            </View>

            {error && (
                <View className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6 flex-row items-center">
                    <Ionicons name="warning" size={20} color="#DC2626" />
                    <Text className="text-red-700 ml-3 flex-1">{error}</Text>
                </View>
            )}
            
            <FlatList
                data={tickets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTicket}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
                // Adăugăm Pull-to-Refresh:
                refreshControl={
                    <RefreshControl 
                        refreshing={isRefreshing} 
                        onRefresh={onRefresh}
                        colors={['#2563EB']} 
                        tintColor="#2563EB"
                    />
                }
                // Ce afișăm dacă array-ul de bilete este gol:
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="flex-1 justify-center items-center mt-20">
                            <Ionicons name="ticket-outline" size={80} color="#D1D5DB" />
                            <Text className="text-xl font-bold text-gray-700 mt-6 mb-2">
                                Niciun bilet activ
                            </Text>
                            <Text className="text-gray-500 text-center px-4">
                                Biletele pe care le cumperi vor apărea aici. Caută un eveniment și asigură-ți locul!
                            </Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};

export default TicketPage;