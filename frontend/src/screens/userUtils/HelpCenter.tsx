import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const HelpCenter = () => {
    const navigation = useNavigation();

    const HelpSection = ({ title, children, icon }: any) => (
        <View className="mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                    <Ionicons name={icon} size={22} color="#2563EB" />
                </View>
                <Text className="text-xl font-bold text-gray-800">{title}</Text>
            </View>
            {children}
        </View>
    );

    const FAQItem = ({ question, answer }: any) => (
        <View className="mb-4">
            <Text className="text-gray-900 font-bold mb-1">{question}</Text>
            <Text className="text-gray-600 leading-5">{answer}</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="px-6 py-4 bg-white border-b border-gray-100 flex-row items-center">
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 mr-3"
                >
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text className="text-2xl font-black text-gray-800">Centru de Ajutor</Text>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
            >
                <HelpSection title="Despre Aplicație" icon="apps-outline">
                    <Text className="text-gray-600 leading-6 mb-4">
                        <Text className="font-bold text-blue-600">Speak&Go</Text> este asistentul tău inteligent pentru rezervarea biletelor la evenimente. Folosim tehnologie de ultimă oră pentru a-ți oferi cea mai rapidă cale de a ajunge la concertele, piesele de teatru sau festivalurile tale preferate.
                    </Text>
                </HelpSection>

                <HelpSection title="Cum funcționează?" icon="bulb-outline">
                    <FAQItem 
                        question="1. Căutare vocală sau text"
                        answer="Poți căuta evenimente folosind comenzi vocale naturale. Apasă pe microfon și spune: 'Vreau la un concert rock în București weekendul acesta'."
                    />
                    <FAQItem 
                        question="2. Selectarea biletelor"
                        answer="Alege tipul de bilet dorit (VIP, Acces General, etc.) și cantitatea. Verifică detaliile evenimentului înainte de a continua."
                    />
                    <FAQItem 
                        question="3. Plată rapidă și sigură"
                        answer="Folosim Stripe pentru plăți securizate. Cardul tău este în siguranță, iar tranzacția se procesează instant."
                    />
                    <FAQItem 
                        question="4. Biletele tale"
                        answer="După plată, biletul va apărea în secțiunea 'Biletele mele'. Vei primi un cod QR pe care îl vei prezenta la intrarea în locație."
                    />
                </HelpSection>

                <HelpSection title="Întrebări Frecvente" icon="help-buoy-outline">
                    <FAQItem 
                        question="Cum anulez o rezervare?"
                        answer="Momentan, rezervările sunt finale. Pentru situații excepționale, te rugăm să ne contactezi prin e-mail."
                    />
                    <FAQItem 
                        question="Unde găsesc biletul cumpărat?"
                        answer="Biletele tale sunt salvate în tab-ul 'Biletele mele' din meniul principal de jos."
                    />
                    <FAQItem 
                        question="Este sigură plata?"
                        answer="Da, procesăm toate plățile prin Stripe, lider mondial în securitatea tranzacțiilor online."
                    />
                </HelpSection>

                <HelpSection title="Contactează-ne" icon="mail-outline">
                    <Text className="text-gray-600 mb-2 italic">Ai nevoie de ajutor suplimentar?</Text>
                    <Text className="text-blue-600 font-bold">suport@speakandgo.ro</Text>
                    <Text className="text-gray-500 text-xs mt-4 text-center">
                        Program suport: Luni - Vineri, 09:00 - 18:00
                    </Text>
                </HelpSection>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HelpCenter;
