import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Vehicle } from '../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

interface VehicleCardProps {
    vehicle: Vehicle;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function VehicleCard({ vehicle }: VehicleCardProps) {
    const navigation = useNavigation<NavigationProp>();
    const { isFavorite, toggleFavorite } = useApp();

    const isFav = isFavorite(vehicle.id);

    // Format price like 1.250.000 TL
    const formattedPrice = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
    }).format(vehicle.price);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Detail', { vehicle })}
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-4"
        >
            {/* Image */}
            <View className="h-48 relative bg-slate-200">
                {vehicle.images && vehicle.images.length > 0 ? (
                    <Image
                        source={{ uri: vehicle.images[0] }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-full items-center justify-center">
                        <Text className="text-slate-400">Resim Yok</Text>
                    </View>
                )}

                {/* Favorite Button */}
                <TouchableOpacity
                    onPress={() => toggleFavorite(vehicle.id)}
                    className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/80 items-center justify-center shadow-sm z-10"
                >
                    <Ionicons
                        name={isFav ? "heart" : "heart-outline"}
                        size={24}
                        color={isFav ? "#ef4444" : "#64748b"}
                    />
                </TouchableOpacity>

                {/* Status Badge */}
                {vehicle.status !== 'yayinda' && (
                    <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded">
                        <Text className="text-white text-xs font-bold uppercase">{vehicle.status}</Text>
                    </View>
                )}
            </View>

            {/* Content (Simplified) */}
            <View className="p-3">
                <Text className="text-lg font-bold text-slate-900 mb-1" numberOfLines={1}>
                    {vehicle.brand} {vehicle.model}
                </Text>

                <Text className="text-xl font-extrabold text-blue-600">
                    {formattedPrice}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
