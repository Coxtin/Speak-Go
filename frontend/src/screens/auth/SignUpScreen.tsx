import React, {useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity, Platform, Alert, TextInput, KeyboardAvoidingView, Modal, ScrollView } from "react-native";

import { useForm, Controller } from "react-hook-form";
import { email, refine, regex, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormValues, signupSchema } from "../../schemas/auth.schema";

import '../../../global.css';
import DateTimePicker from "@react-native-community/datetimepicker";
import { registerUser } from "../../api/auth.api";


const SignupPage = () => {

    const navigation = useNavigation<any>();

    const [showDatePicker, setShowDatePicker] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signupSchema),
        mode: "onChange",
        defaultValues:{
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            birthDate: undefined,
            password: '',
            repeatPassword: ''
        }
    });

   const onSubmit = async (data: SignUpFormValues) => {
        // if (Platform.OS === "web"){
        //     window.alert(`Succes! Logare initiata pentru ${data.email}`)
        // } else {
        //     Alert.alert(`Succes! Logare initiate pentru ${data.email}`);
        // }

        const response = await registerUser(data)
        console.log(response)
        

   }

    return (

        <SafeAreaView className="flex-1 bg-slate-100">
           <KeyboardAvoidingView 
                behavior = {Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    className="px-8"
                    contentContainerClassName="flex-grow justify-center px-8 pb-12 pt-6"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="mb-8 flex-1 justify-center">
                        <Text className="text-4l">Salut</Text>
                        <Text className="text-lg">Sa incepem prin crearea unui cont!</Text>
                    </View>

                    <View className="mb-4">
                        <Controller
                            control={control}
                            name="firstName"
                            render={({
                                field: {onChange, onBlur, value},
                            }) => (
                                <>
                                <Text
                                    className="text-sm font-sans"
                                >
                                    Enter your first name:</Text>
                                <TextInput
                                    className={`bg-gray-100 px-4 py-4 rounded-xl text-gray-800 border ${errors.firstName ? `border-red-150` : `border-gray-200`}`}
                                    placeholder="John"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    />
                                </>
                            )}
                            
                        />
                        {errors.firstName && (<Text className="text-red-500 text-sm mt-1 ml-1">{errors.firstName.message}</Text>)}
                    </View>

                    <View className="mb-4">
                            <Controller
                                control={control}
                                name="lastName"
                                render={({
                                    field: {onChange, onBlur, value}
                                }) => (
                                    <>
                                    <Text
                                        className="text-sm font-sans"
                                    >
                                        Enter your last name:
                                    </Text>
                                    <TextInput
                                    className={`bg-gray-100 px-4 py-4 rounded-xl text-gray-800 border ${errors.lastName ? `border-red-150` : `border-gray-200`}`}
                                    placeholder="Doe"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    />
                                    </>
                                )}
                            />
                            {errors.lastName && (<Text className="text-red-500 text-sm mt-1 ml-1">{errors.lastName.message}</Text>)}
                    </View>

                    <View className="mb-4">
                        <Controller
                            control={control}
                            name="username"
                            render={({
                                field: {onChange, onBlur, value}
                            }) => (
                               <>
                               <Text
                                    className="text-sm font-sans"
                                >
                                    Enter your username:
                               </Text>

                                <TextInput
                                    className={`bg-gray-100 px-4 py-4 rounded-xl text-gray-800 border ${errors.username ? `border-red-150` : `border-gray-200`}`}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    autoCapitalize="none"
                                />

                               </>
                            )}                       
                        />
                        {errors.username && (<Text className="text-red-500 text-sm mt-1 ml-1">{errors.username.message}</Text>)}

                    </View>

                    <View className="mb-4">
                            <Controller
                                control={control}
                                name="email"
                                render={({
                                    field: {onChange, onBlur, value}
                                }) => (
                                    <>
                                    <Text
                                        className="text-sm font-sans"
                                    >  
                                        Enter your email address:
                                    </Text>
                                    <TextInput
                                    className={`bg-gray-100 px-4 py-4 rounded-xl text-gray-800 border ${errors.email ? `border-red-150` : `border-gray-200`}`}
                                    placeholder="ceva@ceva.com"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    />
                                    </>
                                )}
                            />
                            {errors.email && (<Text className="text-red-500 text-sm mt-1 ml-1">{errors.email.message}</Text>)}
                    </View>

                    <View className="mb-4">
                            <Controller
                                control={control}
                                name="birthDate"
                                render={({
                                    field: {onChange, onBlur, value}
                                }) => (
                                    <>
                                    <Text
                                        className="text-sm font-sans"
                                    >
                                        Enter your birthday:  
                                    </Text>
                                    <View>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => setShowDatePicker(true)}
                                            className={`bg-gray-100 px-4 py-4 rounded-xl border ${errors.birthDate ? 'border-red-500' : 'border-gray-200'}`}
                                        >
                                            <Text className={value ? "text-gray-800" : "text-gray-400"}>
                                                {value ? value.toLocaleDateString('ro-RO') : "ZZ/LL/AAAA"}
                                            </Text>
                                        </TouchableOpacity>
                                        
                                        {Platform.OS === 'ios' ? (
                                            <Modal
                                                visible={showDatePicker}
                                                transparent
                                                animationType="slide"
                                            >
                                                <TouchableOpacity 
                                                    activeOpacity={1}
                                                    onPress={() => setShowDatePicker(false)}
                                                    className="flex-1 justify-end"
                                                    style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
                                                >
                                                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                                                    <View className="bg-white rounded-t-3xl pb-6">
                                                        <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
                                                            <View />
                                                            <TouchableOpacity
                                                                onPress={() => setShowDatePicker(false)}
                                                                className="px-4 py-1"
                                                            >
                                                                <Text className="text-blue-500 font-semibold text-base">
                                                                    Done
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                        <DateTimePicker
                                                            mode="date"
                                                            value={value || new Date()}
                                                            // maximumDate={new Date()}
                                                            display="spinner"
                                                            textColor="#000000"
                                                            onChange={(event, selectedDate) => {
                                                                if (selectedDate) {
                                                                    onChange(selectedDate);
                                                                }
                                                            }}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        </Modal>
                                    ) : (
                                        showDatePicker && (
                                            <DateTimePicker
                                                value={value || new Date()}
                                                mode="date"
                                                maximumDate={new Date()}
                                                display="default"
                                                onChange={(event, selectedDate) => {
                                                setShowDatePicker(false);
                                                if (event.type == 'set' && selectedDate)
                                                    onChange(selectedDate);
                                                }}       
                                            />
                                        )
                                    )}
                                </View>    
                                </>                        
                            )}
                        />

                        {errors.birthDate && (<Text className="text-red-500 text-sm mt-1 ml-1">{errors.birthDate.message}</Text>)}

                    </View>
                
                    <View className="mb-4">
                        <Controller
                            control={control}
                            name="password"
                            render={({
                                field: {onChange, onBlur, value}
                            }) => (
                                <>
                                <Text className="text-sm font-sans">
                                    Enter a password: 
                                </Text>
                                
                                <TextInput
                                     className={`bg-gray-100 px-4 py-4 rounded-xl text-gray-800 border ${errors.password ? `border-red-150` : `border-gray-200`}`}
                                     onChangeText={onChange}
                                     onBlur={onBlur}
                                     value={value}
                                     secureTextEntry
                                />
                                </>
                            )}
                        />
                        
                        {errors.password && (<Text className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</Text>)}

                    </View>
                    
                    <View className="mb-4">
                        <Controller
                            control={control}
                            name="repeatPassword"
                            render={({
                                field: {onChange, onBlur, value}
                            }) => (
                                <>
                                <Text className="text-sm font-sans">
                                    Repeat password: 
                                </Text>
                                
                                <TextInput
                                     className={`bg-gray-100 px-4 py-4 rounded-xl text-gray-800 border ${errors.repeatPassword ? `border-red-150` : `border-gray-200`}`}
                                     onChangeText={onChange}
                                     onBlur={onBlur}
                                     value={value}
                                     secureTextEntry
                                />
                                </>
                            )}
                        />
                        
                        {errors.repeatPassword && (<Text className="text-red-500 text-sm mt-1 ml-1">{errors.repeatPassword.message}</Text>)}

                    </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleSubmit(onSubmit)}
                    className="bg-blue-600 py-4 rounded-xl mt-4 items-center shadow-md"
                >
                    <Text className="text-white text-lg font-bold">Submit</Text>
                </TouchableOpacity>
            </ScrollView> 
        </KeyboardAvoidingView>
    </SafeAreaView>

)}

export default SignupPage;