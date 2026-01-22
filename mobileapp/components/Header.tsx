import { View, Image, Text, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HeaderProps {
    hideAds?: boolean;
}

export default function Header({ hideAds = false }: HeaderProps) {
    const navigation = useNavigation<NavigationProp>();
    const { searchQuery, setSearchQuery, currentAdIndex } = useApp();
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const ads = [
        require('../assets/reklam1.png'),
        require('../assets/reklam2.png'),
    ];

    return (
        <SafeAreaView edges={['top']} className="bg-white shadow-sm z-50">
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                {/* Logo Area */}
                <View className="flex-row items-center flex-1">
                    <Image
                        source={require('../assets/logo.png')}
                        className="w-20 h-8"
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

            {/* Ad Space - Auto-rotating */}
            {!hideAds && (
                <View style={{
                    height: 160,
                    width: Dimensions.get('window').width,
                    overflow: 'hidden'
                }}>
                    <Image
                        source={ads[currentAdIndex]}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                </View>
            )}
        </SafeAreaView>
    );
}
