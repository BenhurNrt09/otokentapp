import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacySecurityScreen() {
    const navigation = useNavigation();
    const [dataSharing, setDataSharing] = useState(true);
    const [locationServices, setLocationServices] = useState(true);

    return (
        <View className="flex-1 bg-slate-50">
            <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex-row items-center justify-between shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900">Gizlilik ve Güvenlik</Text>
                <View className="w-8" />
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Veri ve İzinler</Text>

                    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                        <View className="flex-1 pr-4">
                            <Text className="text-slate-900 font-medium">Veri Paylaşımı</Text>
                            <Text className="text-slate-500 text-xs">Uygulama deneyimini iyileştirmek için anonim kullanım verilerini paylaş.</Text>
                        </View>
                        <Switch
                            value={dataSharing}
                            onValueChange={setDataSharing}
                            trackColor={{ false: '#cbd5e1', true: '#2563eb' }}
                        />
                    </View>

                    <View className="flex-row items-center justify-between py-3">
                        <View className="flex-1 pr-4">
                            <Text className="text-slate-900 font-medium">Konum Servisleri</Text>
                            <Text className="text-slate-500 text-xs">Size yakın ilanları göstermek için konum izni.</Text>
                        </View>
                        <Switch
                            value={locationServices}
                            onValueChange={setLocationServices}
                            trackColor={{ false: '#cbd5e1', true: '#2563eb' }}
                        />
                    </View>
                </View>

                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <Text className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Yasal</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                        className="flex-row items-center justify-between py-3 border-b border-gray-100"
                    >
                        <Text className="text-slate-900 font-medium">Gizlilik Politikası</Text>
                        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CookiePolicy')}
                        className="flex-row items-center justify-between py-3"
                    >
                        <Text className="text-slate-900 font-medium">Çerez Politikası</Text>
                        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
