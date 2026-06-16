// navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import HomeScreen from '../main/HomeScreen'; 
import TicketPage from '../screens/ticketPage/TicketPage';
import UserPage from '../screens/user/UserPage';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {

    const navigation = useNavigation<any>();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: React.ComponentProps<typeof Ionicons>['name'];

                    if (route.name === 'Acasă') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Biletele mele') {
                        iconName = focused ? 'ticket' : 'ticket-outline';
                    } else if (route.name === 'Contul meu') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else {
                        iconName = 'help-circle-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2563EB',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                }
            })}
        >
            <Tab.Screen name="Acasă" component={HomeScreen} />
            <Tab.Screen name="Biletele mele" component={TicketPage} />
            <Tab.Screen 
                name="Contul meu"
                component={UserPage}
                options={{ 
                    tabBarButton: (props) => {
                        const { children, ref, ...rest } = props as any;
                        return (
                            <Pressable
                                {...rest}
                                delayLongPress={2000}
                                onLongPress={() => {
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                    console.log("Pagina de scanare este deschisa!");
                                    navigation.navigate("ScannerPage");
                                }}
                            >
                                {children}
                            </Pressable>
                        );
                    }
                }}
                />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;