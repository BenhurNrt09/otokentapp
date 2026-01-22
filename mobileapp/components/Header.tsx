import { View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Header() {
    const navigation = useNavigation<NavigationProp>();
    const { searchQuery, setSearchQuery } = useApp();
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    return (
        <SafeAreaView edges={['top']} className="bg-white shadow-sm z-50">
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                {/* Logo Area */}
                <View className="flex-row items-center">
                    <Image
                        source={require('../assets/logo.png')}
                        className="w-32 h-10"
                        resizeMode="contain"
                    />
                </View>

                {/* Right Actions */}
                <View className="flex-row items-center space-x-4 gap-4">
                    <TouchableOpacity onPress={() => setIsSearchVisible(!isSearchVisible)}>
                        <Ionicons name={isSearchVisible ? "close" : "search"} size={24} color="#334155" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                        <Ionicons name="notifications-outline" size={24} color="#334155" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Ionicons name="settings-outline" size={24} color="#334155" />
                    </TouchableOpacity>
                </View>
            </View>

            {isSearchVisible && (
                <View className="px-4 py-2 bg-slate-50 border-b border-gray-100">
                    <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-2">
                        <Ionicons name="search" size={20} color="#94a3b8" />
                        <TextInput
                            className="flex-1 ml-2 text-base text-slate-800"
                            placeholder="Marka, model veya ilan ara..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                    </View>
                </View>
            )}

            {/* Ad Space */}
            <View className="bg-slate-100 mx-4 my-3 py-10 rounded-xl items-center justify-center border border-gray-200 shadow-sm">
                <Text className="text-lg text-slate-400 font-bold tracking-widest uppercase">REKLAM ALANI</Text>
            </View>
        </SafeAreaView>
    );
}
