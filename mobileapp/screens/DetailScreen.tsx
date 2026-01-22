import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const { width } = Dimensions.get('window');

export default function DetailScreen() {
    const route = useRoute<DetailScreenRouteProp>();
    const navigation = useNavigation();
    const { vehicle } = route.params;

    const formattedPrice = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
    }).format(vehicle.price);

    const handleCall = () => {
        Linking.openURL('tel:+905555555555'); // Example phone
    };

    const handleWhatsapp = () => {
        Linking.openURL('https://wa.me/905555555555'); // Example WP
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />

            {/* Back Button (Absolute) */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-12 left-4 z-50 bg-black/50 w-10 h-10 items-center justify-center rounded-full"
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Image Carousel (Simple Horizontal Scroll) */}
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                    {vehicle.images && vehicle.images.length > 0 ? (
                        vehicle.images.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img }}
                                style={{ width: width, height: 300 }}
                                resizeMode="cover"
                            />
                        ))
                    ) : (
                        <View style={{ width: width, height: 300 }} className="bg-slate-200 items-center justify-center">
                            <Text className="text-slate-400">Görsel Yok</Text>
                        </View>
                    )}
                </ScrollView>

                <View className="p-5">
                    <Text className="text-2xl font-bold text-slate-900 mb-2">
                        {vehicle.brand} {vehicle.model}
                    </Text>
                    <Text className="text-3xl font-extrabold text-blue-600 mb-6">
                        {formattedPrice}
                    </Text>

                    {/* Quick Stats Grid */}
                    <View className="flex-row flex-wrap gap-4 mb-8">
                        <View className="w-[47%] bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <Text className="text-slate-500 text-xs uppercase mb-1">Yıl</Text>
                            <Text className="text-slate-900 font-bold">{vehicle.year}</Text>
                        </View>
                        <View className="w-[47%] bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <Text className="text-slate-500 text-xs uppercase mb-1">KM</Text>
                            <Text className="text-slate-900 font-bold">{vehicle.mileage.toLocaleString()}</Text>
                        </View>
                        <View className="w-[47%] bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <Text className="text-slate-500 text-xs uppercase mb-1">Yakıt</Text>
                            <Text className="text-slate-900 font-bold capitalize">{vehicle.fuel_type}</Text>
                        </View>
                        <View className="w-[47%] bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <Text className="text-slate-500 text-xs uppercase mb-1">Vites</Text>
                            <Text className="text-slate-900 font-bold capitalize">{vehicle.gear_type}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View>
                        <Text className="text-lg font-bold text-slate-900 mb-3 block border-b border-slate-100 pb-2">
                            Açıklama
                        </Text>
                        <Text className="text-slate-600 leading-6">
                            {vehicle.description || 'Açıklama bulunmuyor.'}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-md">
                <View className="flex-row gap-4">
                    <TouchableOpacity
                        onPress={() => {
                            // Create a mock chat object for this vehicle/seller
                            const mockChat = {
                                id: Date.now().toString(),
                                user: {
                                    id: 'seller_1',
                                    name: vehicle.seller_name || 'Satıcı',
                                    avatar: null,
                                    online: true
                                },
                                messages: [],
                                vehicle: vehicle // Pass vehicle context if needed
                            };
                            navigation.navigate('ChatDetail', { chat: mockChat });
                        }}
                        className="flex-1 bg-blue-600 py-4 rounded-xl items-center shadow-blue-200 shadow-lg"
                    >
                        <Text className="text-white font-bold text-lg">Mesaj Gönder</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => Linking.openURL('tel:905551234567')}
                        className="flex-1 bg-emerald-600 py-4 rounded-xl items-center shadow-emerald-200 shadow-lg"
                    >
                        <Text className="text-white font-bold text-lg">Ara</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
