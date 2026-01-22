import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { MOCK_CHATS } from '../constants/mocks';

export default function HelpCenterScreen() {
    const navigation = useNavigation<any>(); // any mainly for navigation to Messages tab if needed

    // For now, "Canlı Destek" might just go to a specific "Admin" chat or just the messages tab.
    // User requested: "Help Center entry point that leads to a social chat feature".
    // I check if I can navigate to 'Messages' tab.

    const handleStartChat = () => {
        const supportChat = MOCK_CHATS.find(c => c.id === '3');
        if (supportChat) {
            navigation.navigate('ChatDetail', { chat: supportChat });
        } else {
            // Fallback
            navigation.navigate('MainTabs', { screen: 'Messages' });
        }
    };

    return (
        <View className="flex-1 bg-slate-50">
            <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex-row items-center justify-between shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900">Yardım Merkezi</Text>
                <View className="w-8" />
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Live Support Card */}
                <View className="bg-blue-600 rounded-2xl p-6 mb-6 shadow-lg shadow-blue-200 items-center">
                    <View className="bg-white/20 p-4 rounded-full mb-3">
                        <Ionicons name="chatbubbles" size={32} color="white" />
                    </View>
                    <Text className="text-white font-bold text-xl mb-1">Canlı Destek</Text>
                    <Text className="text-blue-100 text-center mb-6">Sorularınız için destek ekibimizle anında görüşün.</Text>

                    <TouchableOpacity
                        onPress={handleStartChat}
                        className="bg-white w-full py-3.5 rounded-xl flex-row items-center justify-center gap-2"
                    >
                        <Text className="text-blue-600 font-bold text-base">Sohbeti Başlat</Text>
                        <Ionicons name="arrow-forward" size={18} color="#2563eb" />
                    </TouchableOpacity>
                </View>

                {/* FAQ Section */}
                <Text className="text-slate-900 font-bold text-lg mb-4 ml-1">Sıkça Sorulan Sorular</Text>

                <View className="space-y-3">
                    <FAQItem question="Nasıl ilan verebilirim?" />
                    <FAQItem question="Üyelik ücretli mi?" />
                    <FAQItem question="Şifremi unuttum, ne yapmalıyım?" />
                    <FAQItem question="Hesabımı nasıl silebilirim?" />
                </View>

                <View className="h-8" />
            </ScrollView>
        </View>
    );
}

const FAQItem = ({ question }: { question: string }) => (
    <TouchableOpacity className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-row items-center justify-between">
        <Text className="text-slate-700 font-medium">{question}</Text>
        <Ionicons name="chevron-down" size={20} color="#cbd5e1" />
    </TouchableOpacity>
);
