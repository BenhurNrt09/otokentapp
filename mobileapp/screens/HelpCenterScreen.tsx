import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_CHATS } from '../constants/mocks';
import { supabase } from '../lib/supabase';

export default function HelpCenterScreen() {
    const navigation = useNavigation<any>();
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleStartChat = async () => {
        try {
            setLoading(true);
            // Fetch the first admin user to be the support agent
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'admin')
                .limit(1)
                .single();

            if (data) {
                // Determine name based on available fields
                const name = data.name || 'OtoKent';
                const surname = data.surname || 'Destek';

                navigation.navigate('ChatDetail', {
                    chat: {
                        id: data.id,
                        user: {
                            id: data.id,
                            name: `${name} ${surname}`,
                            avatar: data.avatar_url,
                            isSupport: true
                        }
                    }
                });
            } else {
                Alert.alert('Hata', 'Destek ekibine şu anda ulaşılamıyor.');
            }
        } catch (error) {
            console.error('Error starting chat:', error);
            Alert.alert('Hata', 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    const faqs = [
        {
            question: "Nasıl ilan verebilirim?",
            answer: "İlan vermek için öncelikle giriş yapmanız gerekmektedir. Ardından ana sayfadaki '+' butonuna tıklayın. Aracınızın fotoğraflarını ekleyin, marka, model, yıl, fiyat ve kilometre bilgilerini doldurun. Detaylı açıklama ekleyerek ilanınızı yayınlayabilirsiniz."
        },
        {
            question: "Üyelik ücretli mi?",
            answer: "Hayır, OtoKent üyeliği tamamen ücretsizdir. İlan görüntüleme, favori ekleme ve mesajlaşma gibi tüm temel özellikler ücretsiz olarak sunulmaktadır."
        },
        {
            question: "Şifremi unuttum, ne yapmalıyım?",
            answer: "Giriş ekranında 'Şifremi Unuttum' bağlantısına tıklayın. Kayıtlı e-posta adresinizi girin. Size gönderilecek doğrulama kodu ile yeni şifrenizi belirleyebilirsiniz. Sorun yaşarsanız OtoKent Destek ile iletişime geçin."
        },
        {
            question: "Hesabımı nasıl silebilirim?",
            answer: "Ayarlar → Gizlilik ve Güvenlik → Hesabı Sil seçenekleri üzerinden hesabınızı kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz ve tüm verileriniz silinecektir. İşleme devam etmeden önce emin olun."
        }
    ];

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
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isExpanded={expandedFAQ === index}
                            onPress={() => toggleFAQ(index)}
                        />
                    ))}
                </View>

                <View className="h-8" />
            </ScrollView>
        </View>
    );
}

interface FAQItemProps {
    question: string;
    answer: string;
    isExpanded: boolean;
    onPress: () => void;
}

const FAQItem = ({ question, answer, isExpanded, onPress }: FAQItemProps) => (
    <TouchableOpacity
        onPress={onPress}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
        <View className="p-4 flex-row items-center justify-between">
            <Text className="text-slate-700 font-medium flex-1 pr-3">{question}</Text>
            <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#cbd5e1"
            />
        </View>
        {isExpanded && (
            <View className="px-4 pb-4 pt-0">
                <View className="border-t border-gray-100 pt-3">
                    <Text className="text-slate-600 leading-6">{answer}</Text>
                </View>
            </View>
        )}
    </TouchableOpacity>
);
