import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TermsScreen() {
    const navigation = useNavigation();

    return (
        <View className="flex-1 bg-slate-50">
            <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex-row items-center justify-between shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900">Kullanım Koşulları</Text>
                <View className="w-8" />
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <Text className="text-slate-900 font-bold mb-4">1. Giriş</Text>
                    <Text className="text-slate-600 leading-6 mb-6">
                        Otokent mobil uygulamasına hoş geldiniz. Bu uygulamayı kullanarak aşağıdaki kullanım koşullarını kabul etmiş olursunuz.
                    </Text>

                    <Text className="text-slate-900 font-bold mb-4">2. Hizmet Kapsamı</Text>
                    <Text className="text-slate-600 leading-6 mb-6">
                        Otokent, kullanıcılara araç ilanlarını inceleme, mesajlaşma ve profil oluşturma hizmetleri sunar.
                    </Text>

                    <Text className="text-slate-900 font-bold mb-4">3. Gizlilik</Text>
                    <Text className="text-slate-600 leading-6 mb-6">
                        Kişisel verileriniz KVKK kapsamında korunmaktadır. Detaylı bilgi için Gizlilik Politikamızı inceleyiniz.
                    </Text>

                    <Text className="text-slate-900 font-bold mb-4">4. Değişiklikler</Text>
                    <Text className="text-slate-600 leading-6 mb-6">
                        Otokent, bu koşulları dilediği zaman değiştirme hakkını saklı tutar.
                    </Text>

                    <Text className="text-slate-400 text-xs mt-4 text-center">Son Güncelleme: 20 Ocak 2026</Text>
                </View>
            </ScrollView>
        </View>
    );
}
