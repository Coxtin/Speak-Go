// navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Importăm ecranele tale
import HomeScreen from '../main/HomeScreen'; 
import SearchEvents from '../screens/main/SearchEvents'; 
// import ProfileScreen from '../screens/Main/ProfileScreen'; // O poți crea ulterior

const Tab = createBottomTabNavigator();

// Un ecran temporar de Profil până îl construiești pe cel real
const DummyProfile = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ecranul de Profil (În curând)</Text>
    </View>
);

const MainTabNavigator = () => {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;

                    if (route.name === 'Acasă') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Caută') {
                        iconName = focused ? 'mic' : 'mic-outline';
                    } else if (route.name === 'Profil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2563EB', // Culoarea albastră când e selectat
                tabBarInactiveTintColor: 'gray',
                headerShown: false, // Ascundem header-ul default de sus (îl vom face custom pe fiecare ecran dacă e nevoie)
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                }
            })}
        >
            <Tab.Screen name="Acasă" component={HomeScreen} />
            <Tab.Screen name="Caută" component={SearchEvents} />
            <Tab.Screen name="Profil" component={DummyProfile} />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;