import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { MOCK_CHATS } from '../constants/mocks';
import { Ionicons } from '@expo/vector-icons';

export default function MessagesScreen() {
    const navigation = useNavigation<any>();

    const renderChat = ({ item }: any) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ChatDetail', { chat: item })}
            className="flex-row items-center p-4 bg-white border-b border-gray-50 active:bg-slate-50"
        >
            <View className="relative">
                <View className="w-14 h-14 bg-slate-100 rounded-full items-center justify-center overflow-hidden border border-gray-100">
                    {item.user.avatar ? (
                        <Image source={{ uri: item.user.avatar }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <Ionicons name={item.user.isSupport ? "headset" : "person"} size={26} color="#64748b" />
                    )}
                </View>
                {item.user.online && (
                    <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                )}
            </View>

            <View className="flex-1 ml-4">
                <View className="flex-row justify-between items-center mb-1">
                    <Text className="font-bold text-slate-900 text-base">{item.user.name}</Text>
                    <Text className="text-xs text-slate-400 font-medium">{item.timestamp}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <Text className="text-slate-500 text-sm truncate pr-4" numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                    {item.unreadCount > 0 && (
                        <View className="bg-blue-600 px-2 py-0.5 rounded-full min-w-[20px] items-center">
                            <Text className="text-white text-[10px] font-bold">{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-slate-50">
            <Header />
            <FlatList
                data={MOCK_CHATS}
                renderItem={renderChat}
                keyExtractor={item => item.id}
                className="flex-1"
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center pt-20">
                        <Ionicons name="chatbubbles-outline" size={64} color="#cbd5e1" />
                        <Text className="text-slate-400 mt-4 font-medium">Henüz mesajınız yok</Text>
                    </View>
                }
            />
        </View>
    );
}
