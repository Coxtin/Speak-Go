// navigation/MainTabNavigator.tsx
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { AuthContext } from '../context/AuthContext';
// Importăm ecranele tale
import HomeScreen from '../main/HomeScreen'; 
import SearchEvents from '../screens/main/SearchEvents'; 
// import ProfileScreen from '../screens/Main/ProfileScreen'; // O poți crea ulterior

const Tab = createBottomTabNavigator();

// Un ecran temporar de Profil până îl construiești pe cel real
const DummyProfile = () => {

    const auth = useContext(AuthContext);

    return (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Ecranul de Profil (În curând)</Text>
            <View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={auth?.logout}
                >
                    <Text className='color-red-500 font-bold px-4 py-4 bg-slate-900 border rounded-xl'>LogOut</Text> 
                    <Ionicons
                        name="log-out-outline"
                        color="red"
                        size={22}
                    />   
                </TouchableOpacity>
            </View>
        </View>

    )
};

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
            {/* <Tab.Screen name="Caută" component={SearchEvents} /> */}
            <Tab.Screen name="Profil" component={DummyProfile} />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;