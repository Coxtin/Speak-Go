// screens/Main/HomeScreen.tsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Image, SectionList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming, 
    withSequence,
    interpolateColor,
    Easing 
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext'; 
import { useEvents } from '../hooks/useEvents';
import { BASE_URL } from '../../config/config';
import { Ionicons } from '@expo/vector-icons';
import { EventParams } from '../types/eventParams';
import { ModalContext } from '../context/ModalContext';
import { EventFilter } from '../types/EventFilter';
import SearchEvents from '../screens/main/SearchEvents';

const HomeScreen = () => {
    
    const auth = useContext(AuthContext);
    const modal = useContext(ModalContext);
    const navigation = useNavigation<any>();

    const openModal = modal?.openModal;
    
    const { events, isLoading, error, fetchFilteredEvents , refresh } = useEvents();
    const [text, setText] = useState<string>("");

    // Grupăm evenimentele pe categorii
    const groupedEvents = events.reduce((acc: Record<string, EventParams[]>, event) => {
        const category = event.category || 'Altele';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(event);
        return acc;
    }, {});

    const sections = Object.keys(groupedEvents).map(category => ({
        title: category,
        data: groupedEvents[category]
    }));

    //console.log("Date primite de la Backend: ", JSON.stringify(events, null, 2));

    if (isLoading && events.length === 0){
        return (
            <SafeAreaView
                className='flex-1 justify-center items-center'
            >
                <ActivityIndicator size="large" color="#2563EB"/>
                <Text className="text-gray-500 mt-4 font-medium">Se încarcă evenimentele...</Text>
            </SafeAreaView>
        )
    }

    if (error && events.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center px-6">
                <Text className="text-red-500 font-semibold text-lg text-center mb-4">{error}</Text>
                <TouchableOpacity onPress={refresh} className="bg-blue-600 px-6 py-3 rounded-xl">
                    <Text className="text-white font-bold">Reîncearcă</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const goToEventPage = (eventData: EventParams) => {

        navigation.navigate("EventPage", {
            eventData: eventData,
        });
    }

    const renderEventCard = ({ item }: { item: EventParams }) => {
        // Combinăm BASE_URL cu ruta relativă salvată în baza de date (/uploads/nume_poza.jpg)
        const fullImageUrl = item.imageUrl ? `${BASE_URL}${item.imageUrl}` : null;

        const prices =
            item.ticketTypes
                ?.map((t) => Number(String(t.price).replace(',', '.')))
                .filter((price) => Number.isFinite(price)) || [];

        const minPrice = prices.length > 0 ? Math.min(...prices) : null;
        const currency = item.ticketTypes?.map((t => t.currency))

        const hasScannedTicket = item.bookings && item.bookings.length > 0;
        const hasNotReviewed = !item.reviews || item.reviews.length === 0;
        const canLeaveReview = hasScannedTicket && hasNotReviewed;

        const pulse = useSharedValue(0);

        useEffect(() => {
            if (canLeaveReview) {
                pulse.value = withRepeat(
                    withSequence(
                        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
                        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1, // Infinit
                    true // Reversibil
                );
            } else {
                pulse.value = 0;
            }
        }, [canLeaveReview]);

        const animatedBorderStyle = useAnimatedStyle(() => {
            const animatedBorderColor = interpolateColor(
                pulse.value,
                [0, 1],
                ['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 1)']
            );

            const scale = 1 + (pulse.value * 0.015);

            return {
                borderColor: canLeaveReview ? animatedBorderColor : '#f3f4f6',
                borderWidth: canLeaveReview ? 3 : 1,
                transform: [{ scale: canLeaveReview ? scale : 1 }],
                shadowColor: canLeaveReview ? '#f59e0b' : '#000',
                shadowOpacity: canLeaveReview ? 0.1 + (pulse.value * 0.4) : 0.05,
                shadowRadius: canLeaveReview ? 4 + (pulse.value * 6) : 3,
                elevation: canLeaveReview ? 2 + (pulse.value * 6) : 2,
            };
        });

        return (
            <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => goToEventPage(item)}
                className="mb-6"
            >
                <Animated.View 
                    className="bg-white rounded-3xl overflow-hidden"
                    style={animatedBorderStyle}
                >
                    {/* Secțiunea Imaginii */}
                    {fullImageUrl ? (
                        <Image 
                            source={{ uri: fullImageUrl }} 
                            className="w-full h-48 bg-gray-100"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-48 bg-gray-200 items-center justify-center">
                            <Text className="text-gray-400 font-medium">Fără Imagine</Text>
                        </View>
                    )}

                    {/* Tag-ul cu Categoria */}
                    <View className="absolute top-4 left-4 bg-blue-600 px-3 py-1.5 rounded-full shadow">
                        <Text className="text-white text-xs font-bold uppercase tracking-wider">
                            {item.category}
                        </Text>
                    </View>

                    {/* Badge evident poziționat peste imagine */}
                    {canLeaveReview && (
                        <View className="absolute top-4 right-4 bg-yellow-400 px-3 py-1.5 rounded-full shadow-lg flex-row items-center border border-yellow-500">
                            <Text className="text-yellow-900 text-xs font-black tracking-wider uppercase">
                                ⭐ Review Disponibil
                            </Text>
                        </View>
                    )}

                    {/* Detalii Eveniment */}
                    <View className="p-5">
                        <Text className="text-xl font-bold text-gray-800 mb-1" numberOfLines={1}>
                            {item.title}
                        </Text>

                        {/* Informații din tabela Venue (Nume și Oraș) */}
                        <Text className="text-blue-600 font-semibold text-sm mb-3">
                            📍 {item.venue?.name} • {item.venue?.city}
                        </Text>

                        <Text className="text-gray-500 text-sm mb-4 line-clamp-2" numberOfLines={2}>
                            {item.description}
                        </Text>

                        {/* Divider bar */}
                        <View className="h-[1px] bg-gray-100 w-full mb-4" />

                        {/* Footer-ul cardului: Dată și Preț */}
                        <View className="flex-row justify-between items-center">
                            <View>
                                <Text className="text-xs text-gray-400 font-medium uppercase">Dată eveniment</Text>
                                <Text className="text-gray-700 font-bold mt-0.5">
                                    {new Date(item.date).toLocaleDateString('ro-RO', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </Text>
                            </View>

                            {/* Buton simulat / Preț sau Review */}
                        <View className={`px-4 py-2.5 rounded-xl ${canLeaveReview ? 'bg-yellow-500' : 'bg-slate-900'}`}>
                            <Text className="text-white font-bold text-center shadow-sm">
                                {canLeaveReview 
                                    ? 'Scrie un Review' 
                                    : (minPrice !== null
                                        ? `Preț bilet - ${minPrice.toLocaleString('ro-RO')} ${currency[0]} `
                                        : 'Preț indisponibil')
                                }
                            </Text>
                        </View>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView
            className="flex-1 bg-slate-50"
            edges={['top', 'left', 'right']}
        >
            <KeyboardAvoidingView
                style = {{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View
                    className='flex-1 relative'
                >
                {/* Header personalizat de sus */}
                    <View className="px-6 pt-4 pb-3 bg-white border-b border-gray-100 flex-row justify-between items-center">
                        <View>
                            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">Descoperă</Text>
                            <Text className="text-2xl font-black text-slate-800">Evenimente Noi 🔥</Text>

                        </View>
                    </View>

                    {/* Listarea eficientă cu SectionList grupate pe categorii */}
                    <SectionList
                        sections={sections}
                        renderItem={renderEventCard}
                        renderSectionHeader={({ section: { title } }) => (
                            <View className="bg-slate-50 pt-6 pb-2">
                                <Text className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                    {title}
                                </Text>
                                <View className="h-1 w-12 bg-blue-600 rounded-full mt-1" />
                            </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 120 }}
                        showsVerticalScrollIndicator={false}
                        stickySectionHeadersEnabled={false}
                        keyboardDismissMode='on-drag'
                        
                        // Pull to Refresh: Când utilizatorul trage în jos de listă, se re-execută funcția refresh
                        refreshControl={
                            <RefreshControl 
                                refreshing={isLoading} 
                                onRefresh={refresh} 
                                colors={["#2563EB"]} // Pentru Android
                                tintColor="#2563EB"  // Pentru iOS
                            />
                        }

                        // Ce se afișează dacă baza de date este goală
                        ListEmptyComponent={() => (
                            <View className="flex-1 items-center justify-center py-20">
                                <Text className="text-gray-400 text-lg font-medium text-center">
                                    Momentan nu există evenimente disponibile.
                                </Text>
                            </View>
                        )}
                    />

                    <View
                        className='absolute bottom-6 left-5 right-5 bg-white rounded-xl shadow-2xl flex-row items-center px-4 py-2.5 border border-gray-100 elevation-5'
                    >
                        <Ionicons
                            name="search-outline"
                            size={20}
                            color="#9CA3AF"
                        />

                        <TextInput
                            placeholder='Spune sau scrie ce cauți'
                            placeholderTextColor="#9CA3AF"
                            className='flex-1 ml-3 text-base text-gray-800'
                            onChangeText={setText}
                            value={text}
                        />
                        
                        {text ? (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    if (openModal && !modal?.visible){
                                        openModal(<SearchEvents 
                                            inModal={true}
                                            initialText={text}
                                            onSearchReady={fetchFilteredEvents}
                                            closeModal={modal.closeModal}
                                        />);
                                        setText("");
                                    }
                                }}
                                className='bg-blue p-3 rounded-full ml-2 shadow-md flex-row items-center justify-center'
                            >
                                <Ionicons
                                    name="send-outline"
                                    color="blue"
                                    size={22}
                                />
                            </TouchableOpacity>
                        )
                        : (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => { 
                                    if (openModal && !modal?.visible){
                                        console.log("am apasat");
                                        openModal(<SearchEvents 
                                            inModal={true}
                                            onSearchReady={fetchFilteredEvents}
                                            closeModal={modal.closeModal}
                                        />);
                                    }
                                 }}
                                className='bg-blue p-3 rounded-full ml-2 shadow-md flex-row items-center justify-center'
                            >
                                <Ionicons
                                    name="mic"
                                    color="blue"
                                    size={22}
                                />
                            </TouchableOpacity>
                        )}

                    
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default HomeScreen;

