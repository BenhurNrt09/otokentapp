import { View, Image, Text, TouchableOpacity, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import AdBanner from './AdBanner'; // Import AdBanner

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HeaderProps {
    hideAds?: boolean;
}

interface Advertisement {
    id: string;
    title: string | null;
    image_url: string;
    link_url: string | null;
    is_active: boolean;
    display_order: number; // Ensure this matches types
}

export default function Header({ hideAds = false }: HeaderProps) {
    const navigation = useNavigation<NavigationProp>();
    const { searchQuery, setSearchQuery, unreadNotificationCount } = useApp();
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch advertisements from Supabase
    useEffect(() => {
        fetchAdvertisements();
    }, []);

    const fetchAdvertisements = async () => {
        try {
            const { data, error } = await supabase
                .from('advertisements')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) {
                console.error('Error fetching advertisements:', error);
                return;
            }

            if (data && data.length > 0) {
                setAdvertisements(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView edges={['top']} className="bg-white shadow-sm z-50">
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                {/* Logo Area */}
                <View className="flex-row items-center flex-1">
                    <Image
                        source={require('../assets/logo.png')}
                        className="w-28 h-11"
                        resizeMode="contain"
                    />
                </View>

                {/* Right Icons */}
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity onPress={() => setIsSearchVisible(!isSearchVisible)} className="p-2">
                        <Ionicons name="search-outline" size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')} className="p-2 relative">
                        <Ionicons name="notifications-outline" size={24} color="#1e293b" />
                        {unreadNotificationCount > 0 && (
                            <View className="absolute top-1 right-1 bg-red-500 rounded-full min-w-[16px] h-4 items-center justify-center px-1">
                                <Text className="text-white text-[10px] font-bold">{unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')} className="p-2">
                        <Ionicons name="settings-outline" size={24} color="#1e293b" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            {isSearchVisible && (
                <View className="px-4 py-3 border-b border-gray-100">
                    <TextInput
                        className="bg-slate-50 rounded-xl px-4 py-2.5 text-slate-900"
                        placeholder="Araç ara..."
                        placeholderTextColor="#94a3b8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                </View>
            )}

            {/* Ad Space - Use AdBanner for consistent behavior */}
            {!hideAds && (
                <AdBanner data={advertisements} />
            )}
        </SafeAreaView>
    );
}
