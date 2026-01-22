import { View, Text, Switch, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationSettingsScreen() {
    const navigation = useNavigation();

    // Mock states for now
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(false);
    const [promoEnabled, setPromoEnabled] = useState(true);

    const ToggleOption = ({ title, subtitle, value, onChange }: any) => (
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <View className="flex-1 pr-4">
                <Text className="text-slate-900 font-medium text-base mb-0.5">{title}</Text>
                {subtitle && <Text className="text-slate-500 text-xs leading-4">{subtitle}</Text>}
            </View>
            <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: '#cbd5e1', true: '#2563eb' }}
                thumbColor={'#ffffff'}
            />
        </View>
    );

    return (
        <View className="flex-1 bg-slate-50">
            <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex-row items-center justify-between shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900">Bildirim Ayarları</Text>
                <View className="w-8" />
            </View>

            <View className="p-4">
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <ToggleOption
                        title="Anlık Bildirimler"
                        subtitle="Yeni mesajlar ve güncellemeler hakkında bildirim al."
                        value={pushEnabled}
                        onChange={setPushEnabled}
                    />
                    <ToggleOption
                        title="E-posta Bildirimleri"
                        subtitle="Özetler ve bültenler e-posta adresine gönderilsin."
                        value={emailEnabled}
                        onChange={setEmailEnabled}
                    />
                    <ToggleOption
                        title="SMS Bildirimleri"
                        subtitle="Önemli güvenlik uyarıları ve kodlar SMS olarak gelsin."
                        value={smsEnabled}
                        onChange={setSmsEnabled}
                    />
                    <ToggleOption
                        title="Kampanya ve Fırsatlar"
                        subtitle="Özel tekliflerden haberdar ol."
                        value={promoEnabled}
                        onChange={setPromoEnabled}
                    />
                </View>
            </View>
        </View>
    );
}
