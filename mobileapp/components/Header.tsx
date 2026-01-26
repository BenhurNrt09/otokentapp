import { View, Image, Text, TouchableOpacity, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

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
}

export default function Header({ hideAds = false }: HeaderProps) {
    const navigation = useNavigation<NavigationProp>();
    const { searchQuery, setSearchQuery, currentAdIndex, setCurrentAdIndex } = useApp();
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

    // Auto-rotate ads every 5 seconds
    useEffect(() => {
        if (advertisements.length === 0) return;

        const interval = setInterval(() => {
            setCurrentAdIndex((prev) => (prev + 1) % advertisements.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [advertisements.length]);

    const currentAd = advertisements[currentAdIndex];

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
                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')} className="p-2">
                        <Ionicons name="notifications-outline" size={24} color="#1e293b" />
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

            {/* Ad Space - From Supabase */}
            {!hideAds && (
                <View style={{
                    height: 160,
                    width: Dimensions.get('window').width,
                    overflow: 'hidden',
                    backgroundColor: '#f1f5f9'
                }}>
                    {loading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="small" color="#3b82f6" />
                        </View>
                    ) : currentAd ? (
                        <Image
                            source={{ uri: currentAd.image_url }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-slate-400 text-sm">Reklam bulunmuyor</Text>
                        </View>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
}
