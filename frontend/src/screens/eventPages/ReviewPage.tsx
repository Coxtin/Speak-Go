import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { sendReview } from '../../api/reviews.api';

interface ReviewPageProps {
    eventId: number;
    closeModal?: () => void;
}

const ReviewPage = ({ eventId, closeModal } : ReviewPageProps) => {

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reviewText.trim()) {
            Alert.alert("Atenție", "Te rugăm să scrii un review înainte de a trimite.");
            return;
        }

        if (rating === 0) {
            Alert.alert("Atenție", "Te rugăm să acorzi o notă evenimentului.");
            return;
        }

        setIsSubmitting(true);

        try {
          
            await sendReview(eventId, reviewText, rating);

            Alert.alert("Succes", "Review-ul tău a fost trimis! Îți mulțumim pentru feedback.");
            
            if (closeModal) {
                closeModal();
            }
        } catch (error) {
            Alert.alert("Eroare", "A apărut o problemă la trimiterea review-ului.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }} className="rounded-t-3xl relative">
            <KeyboardAwareScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled" 
                enableOnAndroid={true}
                extraScrollHeight={120} // mărit un pic pentru a compensa butonul
            >
                <View className="flex-1">
                    {/* Header Modal / Pagină */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-black text-gray-900">Cum a fost?</Text>
                        {closeModal && (
                            <TouchableOpacity onPress={closeModal} className="p-2 bg-gray-100 rounded-full">
                                <Ionicons name="close" size={24} color="#4B5563" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text className="text-gray-500 mb-6 text-base leading-6">
                        Părerea ta contează! Povestește-ne cum te-ai simțit la acest eveniment și ajută alți utilizatori să ia o decizie.
                    </Text>

                    {/* Sistem de Rating cu Stele */}
                    <View className="flex-row justify-center space-x-2 mb-8 gap-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity 
                                key={star} 
                                onPress={() => setRating(star)}
                                className="p-1"
                            >
                                <Ionicons 
                                    name={star <= rating ? "star" : "star-outline"} 
                                    size={40} 
                                    color={star <= rating ? "#F59E0B" : "#D1D5DB"}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Text Area pentru comentariu */}
                    <Text className="text-gray-900 font-bold mb-2 ml-1">Experiența ta</Text>
                    <View className="bg-gray-50 rounded-2xl border border-gray-200 p-4 min-h-[150px] mb-8 shadow-sm">
                        <TextInput
                            className="flex-1 text-gray-800 text-base"
                            placeholder="Scrie aici detaliile... (ex: Atmosfera a fost incredibilă!)"
                            placeholderTextColor="#9CA3AF"
                            multiline={true}
                            textAlignVertical="top"
                            value={reviewText}
                            onChangeText={setReviewText}
                            maxLength={500}
                            style={{ minHeight: 200 }} 
                        />
                        <Text className="text-right text-xs text-gray-400 mt-2">
                            {reviewText.length}/500
                        </Text>
                    </View>
                </View>
            </KeyboardAwareScrollView>

            {/* Buton Trimitere Fixat Absolut */}
            <View className="absolute bottom-6 left-6 right-6">
                <TouchableOpacity 
                    className={`w-full py-4 rounded-2xl items-center shadow-lg flex-row justify-center ${
                        isSubmitting || rating === 0 || !reviewText.trim() 
                        ? 'bg-yellow-300 shadow-none' 
                        : 'bg-yellow-500 shadow-yellow-300'
                    }`}
                    onPress={handleSubmit}
                    disabled={isSubmitting || rating === 0 || !reviewText.trim()}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#713F12" size="small" />
                    ) : (
                        <>
                            <Ionicons name="send" size={20} color="#713F12" />
                            <Text className="text-yellow-900 font-black text-lg ml-2 uppercase tracking-wider">
                                Trimite Recenzia
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ReviewPage;
