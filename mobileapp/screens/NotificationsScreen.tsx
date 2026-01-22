import { View, Text, FlatList, TouchableOpacity, Linking, Image } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

// Mock Data for Notifications
const NOTIFICATIONS = [
    {
        id: '1',
        type: 'price_drop',
        title: 'Fiyat Düştü!',
        message: 'Favoriye aldığınız 2020 BMW 3.20i fiyatı düştü.',
        time: '2 saat önce',
        read: false,
        icon: 'pricetag',
        color: '#ef4444' // red
    },
    {
        id: '2',
        type: 'message',
        title: 'Yeni Mesaj',
        message: 'Ahmet Yılmaz: Araç hala satılık mı?',
        time: '5 saat önce',
        read: true,
        icon: 'chatbubble-ellipses', // generic message icon
        color: '#3b82f6' // blue
    },
    {
        id: '3',
        type: 'new_vehicle',
        title: 'İlginizi Çekebilir',
        message: 'Aradığınız kriterlere uygun yeni Honda Civic eklendi.',
        time: '1 gün önce',
        read: true,
        icon: 'car-sport',
        color: '#10b981' // green
    },
    {
        id: '4',
        type: 'system',
        title: 'Sistem Güncellemesi',
        message: 'Otokent uygulaması güncellendi. Yeni özellikleri keşfedin.',
        time: '2 gün önce',
        read: true,
        icon: 'information-circle',
        color: '#64748b' // slate
    }
];

export default function NotificationsScreen() {
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            className={`flex-row items-start p-4 border-b border-gray-100 ${item.read ? 'bg-white' : 'bg-blue-50'}`}
        >
            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 bg-white border border-gray-100`}>
                <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="font-bold text-slate-900 text-sm">{item.title}</Text>
                    <Text className="text-xs text-slate-400">{item.time}</Text>
                </View>
                <Text className="text-slate-600 text-sm leading-5">{item.message}</Text>
            </View>
            {!item.read && (
                <View className="w-2 h-2 rounded-full bg-blue-600 mt-2 ml-2" />
            )}
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white">
            {/* Custom Header for this screen or reuse generic one? 
          Reusing Generic Header but typically sub-screens have back buttons.
          For now, using Generic Header as requested structure implies it's top level or accessible globally.
          Actually, since it's pushed to stack, it should probably show a back button if we want standard behavior,
          but let's Stick to the requested design.
      */}
            <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between pt-12 shadow-sm">
                <Text className="text-xl font-bold text-slate-900">Bildirimler</Text>
                <TouchableOpacity>
                    <Text className="text-blue-600 text-sm font-medium">Tümünü Okundu İşaretle</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={NOTIFICATIONS}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}
