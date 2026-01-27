import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Vehicle } from '../types';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import VehicleCard from '../components/VehicleCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const { user, logout, updateUser, favorites } = useApp(); // Use context

    // Local state for favorites list logic
    const [favoriteVehicles, setFavoriteVehicles] = useState<Vehicle[]>([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);

    const handlePickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets[0].uri) {
                // Update user avatar in context (mock persistence)
                updateUser({ ...user, avatar: result.assets[0].uri });
            }
        }
    };

    const fetchFavoriteVehicles = async () => {
        if (favorites.length === 0) {
            setFavoriteVehicles([]);
            return;
        }

        try {
            setLoadingFavorites(true);
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .in('id', favorites);

            if (error) throw error;
            setFavoriteVehicles(data as Vehicle[]);
        } catch (error) {
            console.error("Favoriler yükleme hatası:", error);
        } finally {
            setLoadingFavorites(false);
        }
    };

    // Re-fetch when favorites change or screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchFavoriteVehicles();
        }, [favorites])
    );

    return (
        <View className="flex-1 bg-slate-50">
            <Header hideAds={true} />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Profile Card */}
                <View className="bg-white m-4 p-6 rounded-2xl shadow-sm items-center border border-gray-100">
                    <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm overflow-hidden relative">
                        {user.avatar ? (
                            <Image source={{ uri: user.avatar }} className="w-full h-full" resizeMode="cover" />
                        ) : (
                            <Ionicons name="person" size={48} color="#2563eb" />
                        )}
                        {/* Edit Icon removed as requested */}
                    </View>
                    <Text className="text-xl font-bold text-slate-900 mb-1">{user.name} {user.surname}</Text>
                    <Text className="text-slate-500 mb-6">{user.email}</Text>

                    <TouchableOpacity
                        onPress={logout}
                        className="flex-row items-center bg-red-50 px-6 py-3 rounded-full border border-red-100"
                    >
                        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                        <Text className="text-red-500 font-bold ml-2">Çıkış Yap</Text>
                    </TouchableOpacity>
                </View>

                {/* Shortcuts or Stats */}
                <View className="flex-row px-4 gap-4 mb-6">
                    <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
                        <Text className="text-2xl font-bold text-slate-900">{favorites.length}</Text>
                        <Text className="text-slate-500 text-xs mt-1">Favoriler</Text>
                    </View>
                    <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
                        <Text className="text-2xl font-bold text-slate-900">0</Text>
                        <Text className="text-slate-500 text-xs mt-1">İlanlarım</Text>
                    </View>
                </View>

                {/* Notifications Button */}


                {/* Favorites List */}
                <View className="px-4">
                    <Text className="text-lg font-bold text-slate-900 mb-3">Favori İlanlarım</Text>

                    {loadingFavorites ? (
                        <View className="py-10 items-center">
                            <ActivityIndicator size="small" color="#2563eb" />
                        </View>
                    ) : favoriteVehicles.length > 0 ? (
                        <View>
                            {favoriteVehicles.map(vehicle => (
                                <VehicleCard key={vehicle.id} vehicle={vehicle} />
                            ))}
                        </View>
                    ) : (
                        <View className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 items-center justify-center">
                            <Ionicons name="heart-outline" size={48} color="#cbd5e1" />
                            <Text className="text-slate-400 text-sm mt-3 text-center">
                                Henüz favorilere eklediğiniz bir araç yok.
                            </Text>
                        </View>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}
