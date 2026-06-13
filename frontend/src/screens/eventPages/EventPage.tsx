import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, View, Image, ActivityIndicator, Alert, Platform, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { EventParams } from '../../types/eventParams';
import { BASE_URL } from '../../../config/config';
import { Ionicons } from '@expo/vector-icons';

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate
} from 'react-native-reanimated';

const MAX_IMAGE_HEIGHT = 500;
const MIN_IMAGE_HEIGHT = 250;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.6;

type EventDetailsProp = RouteProp<{ EventPage: {eventData: EventParams}}, 'EventPage'>

const EventPage = () => {

    const navigation = useNavigation<any>();
    const route = useRoute<EventDetailsProp>();
    const { eventData } = route.params;

    const goToBookEvent = (eventId: number) => {
        navigation.navigate("BookEvent", {
            eventId: eventId
        })
    }

    if (!eventData){

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

        return (
            <View
                className='flex-1 justify-center items-center'
            >
                <ActivityIndicator 
                    size={18}
                    color="#2563EB"
                />
                <Text
                    className='font-bold text-red-500'
                >
                    Datele nu au putut fi incarcate!
                </Text>
            </View>
        )
    }

    const fullImageUrl = eventData.imageUrl ? `${BASE_URL}${eventData.imageUrl}` : null;

    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    })

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const height = interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT - MIN_IMAGE_HEIGHT],
            [HEADER_HEIGHT, MIN_IMAGE_HEIGHT],
            'clamp'
        );

        return {
            height,
        };
    });

    const imageAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0],
            [2, 1],
            'clamp'
        );

        const translateY = interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT],
            [0, -40],
            'clamp'
        );

        return {
            transform: [{ scale }, { translateY }],
        };
    });

    const contentAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT - MIN_IMAGE_HEIGHT],
            [0.9, 1],
            'clamp'
        );
        
        const translateY = interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT - MIN_IMAGE_HEIGHT],
            [20, 0],
            'clamp'
        );

        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    return (

        <View
            className='flex-1 bg-white'
        >

            <Animated.View
                pointerEvents="none"
                style={[{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    overflow: 'hidden'
                },
                headerAnimatedStyle
            ]}
            >
                {fullImageUrl ? (

                    <Animated.Image
                        source={{uri: fullImageUrl}}
                        style={[{ flex: 1 }, imageAnimatedStyle]}
                        resizeMode="cover"
                    />

                ) : (

                    <View
                        className='flex-1 bg-slate-800 items-center justify-center'
                    >
                        <Text
                            className='text-white font-bold'
                        >
                            Fara Imagine
                        </Text>
                    </View>

                )}
                
                {/* <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 80,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                /> */}
            </Animated.View>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.goBack()}
                className='absolute top-14 left-5 z-30 bg-black/40 p-2 rounded-full'
            >
                <Ionicons
                    name='arrow-back'
                    size={24}
                    color="white"
                />
            </TouchableOpacity>

            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                style={{flex: 1}}
                contentContainerStyle={{paddingTop: HEADER_HEIGHT}}
            >

                <Animated.View
                    style={contentAnimatedStyle}
                    className='bg-white px-6 pt-8 pb-32 min-h-screen'
                >
                    <View
                        style={{borderTopLeftRadius: 32, borderTopRightRadius: 32, position: 'absolute', top: 0, left: 0, right: 0, height: 32, backgroundColor: 'white', marginTop: -16}}
                    />

                    <View
                        className='w-12 h-1.5 bg-gray-300 rounded-full absolute top-3 self-center'
                    />

                    <View className='self-start bg-blue-100 px-3 py-1.5 rounded-full mb-3'>
                        <Text className='text-blue-700 font-bold text-xs uppercase tracking-wider'>
                            {eventData.category}
                        </Text>
                    </View>

                    <Text className='text-3xl font-extrabold text-gray-900 mb-6 leading-tight'>
                        {eventData.title}
                    </Text>

                    {/* Date & Location Grid */}
                    <View className='space-y-4 mb-8'>
                        <View className='flex-row items-center'>
                            <View className='bg-gray-100 p-3 rounded-2xl mr-4'>
                                <Ionicons name="calendar" size={24} color="#2563EB" />
                            </View>
                            <View>
                                <Text className='text-gray-500 text-xs font-medium uppercase'>Data și Ora</Text>
                                <Text className='text-gray-900 font-bold text-base'>
                                    {new Date(eventData.date).toLocaleDateString('ro-RO', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </Text>
                            </View>
                        </View>

                        <View className='flex-row items-center mt-4'>
                            <View className='bg-gray-100 p-3 rounded-2xl mr-4'>
                                <Ionicons name="location" size={24} color="#2563EB" />
                            </View>
                            <View className='flex-1'>
                                <Text className='text-gray-500 text-xs font-medium uppercase'>Locație</Text>
                                <Text className='text-gray-900 font-bold text-base' numberOfLines={1}>
                                    {eventData.venue.name}
                                </Text>
                                <Text className='text-gray-600 text-sm'>
                                    {eventData.venue.address}, {eventData.venue.city}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className='h-[1px] bg-gray-100 w-full mb-8' />

                    <View className='mb-8'>
                        <Text className='text-xl font-bold text-gray-900 mb-3'>Despre eveniment</Text>
                        <Text className='text-gray-600 leading-6 text-base'>
                            {eventData.description}
                        </Text>
                    </View>

                    {/* Venue Capacity */}
                    <View className='bg-blue-50 p-4 rounded-2xl flex-row items-center justify-between'>
                        <View className='flex-row items-center'>
                            <Ionicons name="people" size={20} color="#1D4ED8" />
                            <Text className='ml-2 text-blue-800 font-semibold'>Capacitate locație</Text>
                        </View>
                        <Text className='text-blue-900 font-bold'>{eventData.venue.capacity} locuri</Text>
                    </View>

                </Animated.View>

            </Animated.ScrollView>

            <View 
                className='absolute bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100 flex-row items-center justify-between'
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                    elevation: 10,
                }}
            >
                <View>
                    <Text className='text-gray-500 text-xs font-medium uppercase'>Preț pornire</Text>
                    <Text className='text-2xl font-black text-blue-600'>
                        {eventData.ticketTypes && eventData.ticketTypes.length > 0 
                            ? `${eventData.ticketTypes[0].price} ${eventData.ticketTypes[0].currency}` 
                            : 'Gratuit'}
                    </Text>
                </View>
                
                <TouchableOpacity 
                    className='bg-blue-600 px-10 py-4 rounded-2xl shadow-lg shadow-blue-300'
                    onPress={() => goToBookEvent(eventData.id)}
                >
                    <Text className='text-white font-bold text-lg'>Rezervă</Text>
                </TouchableOpacity>
            </View>

       </View>

    )

}

export default EventPage;
