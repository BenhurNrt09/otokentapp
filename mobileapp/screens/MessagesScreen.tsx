import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function MessagesScreen() {
    const navigation = useNavigation<any>();
    const { user, isLoggedIn } = useApp();
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadChats = useCallback(async () => {
        if (!isLoggedIn || user.id === 'guest') {
            setLoading(false);
            return;
        }

        try {
            // Fetch all messages where user is sender or receiver
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    sender:users!messages_sender_id_fkey(id, name, surname, avatar_url),
                    receiver:users!messages_receiver_id_fkey(id, name, surname, avatar_url)
                `)
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Mesajlar yükleme hatası:', error);
                return;
            }

            if (data) {
                // Group by conversation partner
                const conversations: any = {};
                data.forEach((msg: any) => {
                    const otherUser = msg.sender_id === user.id ? msg.receiver : msg.sender;
                    if (!otherUser) return;

                    if (!conversations[otherUser.id]) {
                        conversations[otherUser.id] = {
                            id: otherUser.id,
                            user: {
                                id: otherUser.id,
                                name: `${otherUser.name} ${otherUser.surname}`,
                                avatar: otherUser.avatar_url,
                                online: false // Would need real-time presence for this
                            },
                            lastMessage: msg.content,
                            timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            unreadCount: msg.receiver_id === user.id && !msg.is_read ? 1 : 0,
                            rawTime: new Date(msg.created_at).getTime()
                        };
                    } else if (msg.receiver_id === user.id && !msg.is_read) {
                        conversations[otherUser.id].unreadCount++;
                    }
                });


                // Check for support chat
                const SUPPORT_ID = '00000000-0000-0000-0000-000000000001';
                let supportChat = conversations[SUPPORT_ID];

                if (!supportChat) {
                    supportChat = {
                        id: SUPPORT_ID,
                        user: {
                            id: SUPPORT_ID,
                            name: 'OtoKent',
                            surname: 'Destek',
                            avatar: null,
                            isSupport: true,
                            online: true
                        },
                        lastMessage: 'Size nasıl yardımcı olabiliriz?',
                        timestamp: '',
                        unreadCount: 0,
                        rawTime: Date.now() + 1000000000 // Always top
                    };
                } else {
                    // Update support chat to make sure it's pinned/marked properly if needed
                    // But we will just ensure it's at the top by filtering it out from sorted list and manual unshift or sorting trick
                    supportChat.user.isSupport = true; // Ensure isSupport is true
                    supportChat.rawTime = Date.now() + 1000000000; // Force top
                }

                // Add support chat to conversations map if not present (for the array conversion)
                conversations[SUPPORT_ID] = supportChat;

                const sortedChats = Object.values(conversations).sort((a: any, b: any) => b.rawTime - a.rawTime);
                setChats(sortedChats);
            }
        } catch (e) {
            console.error('Sohbetler işleme hatası:', e);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, user.id]);

    useFocusEffect(
        useCallback(() => {
            loadChats();
        }, [loadChats])
    );

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
                data={chats}
                renderItem={renderChat}
                keyExtractor={item => item.id}
                className="flex-1"
                refreshing={loading}
                onRefresh={loadChats}
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
