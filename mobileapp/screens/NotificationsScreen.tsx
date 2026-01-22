import { View, Text, FlatList, TouchableOpacity, Linking, Image } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function NotificationsScreen() {
    const { notifications, markAllNotificationsAsRead } = useApp();

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
            <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between pt-12 shadow-sm">
                <Text className="text-xl font-bold text-slate-900">Bildirimler</Text>
                <TouchableOpacity onPress={markAllNotificationsAsRead}>
                    <Text className="text-blue-600 text-sm font-medium">Tümünü Okundu İşaretle</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center pt-20">
                        <Ionicons name="notifications-outline" size={64} color="#cbd5e1" />
                        <Text className="text-slate-400 mt-4 font-medium">Henüz bildiriminiz yok</Text>
                    </View>
                }
            />
        </View>
    );
}
