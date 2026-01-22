import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

export default function SettingsScreen() {
    const navigation = useNavigation<any>();
    const { logout } = useApp();

    const MenuOption = ({ icon, title, subtitle, onPress, iconColor, textColor }: any) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 bg-white border-b border-gray-50"
        >
            <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-3">
                    <Ionicons name={icon} size={22} color={iconColor || "#475569"} />
                </View>
                <View>
                    <Text style={{ color: textColor || '#0f172a' }} className="font-medium text-base">{title}</Text>
                    {subtitle && <Text className="text-slate-400 text-xs">{subtitle}</Text>}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-slate-50">
            <Header hideAds={true} />

            <ScrollView className="flex-1">
                {/* Profile Section */}
                <View className="mb-6 bg-white border-y border-gray-100">
                    <Text className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-gray-100">Hesap</Text>
                    <MenuOption icon="person-circle-outline" title="Profili Düzenle" onPress={() => navigation.navigate('EditProfile')} />
                    <MenuOption icon="shield-checkmark-outline" title="Giriş ve Güvenlik" onPress={() => navigation.navigate('LoginSecurity')} />
                    <MenuOption icon="notifications-outline" title="Bildirim Ayarları" onPress={() => navigation.navigate('NotificationSettings')} />
                    <MenuOption icon="lock-closed-outline" title="Gizlilik ve Güvenlik" onPress={() => navigation.navigate('PrivacySecurity')} />
                </View>

                {/* Support Section */}
                <View className="mb-6 bg-white border-y border-gray-100">
                    <Text className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-gray-100">Destek</Text>
                    <MenuOption icon="help-circle-outline" title="Yardım Merkezi" onPress={() => navigation.navigate('HelpCenter')} />
                    <MenuOption icon="shield-checkmark-outline" title="Gizlilik Politikası" onPress={() => navigation.navigate('PrivacyPolicy')} />
                    <MenuOption icon="document-text-outline" title="Kullanım Koşulları" onPress={() => navigation.navigate('Terms')} />
                    <MenuOption icon="star-outline" title="Uygulamayı Değerlendir" subtitle="v1.0.0" onPress={() => { }} />
                </View>

                {/* Danger Zone */}
                <View className="mb-6 bg-white border-y border-red-100">
                    <Text className="px-4 py-3 text-xs font-bold text-red-400 uppercase tracking-wider bg-red-50 border-b border-red-100">Tehlikeli İşlemler</Text>
                    <MenuOption
                        icon="trash-outline"
                        title="Hesabımı Sil"
                        subtitle="Bu işlem geri alınamaz"
                        iconColor="#dc2626"
                        textColor="#dc2626"
                        onPress={() => {
                            Alert.alert(
                                'Hesap Silme',
                                'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir.',
                                [
                                    { text: 'İptal', style: 'cancel' },
                                    {
                                        text: 'Evet, Sil',
                                        style: 'destructive',
                                        onPress: () => {
                                            // TODO: Implement soft delete with database
                                            // This will mark the account as deleted, not permanently remove it
                                            Alert.alert('Başarılı', 'Hesabınız silindi. Geri getirme için yöneticinize başvurun.');
                                            logout();
                                            navigation.goBack();
                                        }
                                    }
                                ]
                            );
                        }}
                    />
                    <MenuOption
                        icon="log-out-outline"
                        title="Çıkış Yap"
                        onPress={() => {
                            Alert.alert(
                                'Çıkış Yap',
                                'Çıkış yapmak istediğinizden emin misiniz?',
                                [
                                    { text: 'İptal', style: 'cancel' },
                                    {
                                        text: 'Evet',
                                        onPress: () => {
                                            logout();
                                            navigation.goBack();
                                        }
                                    }
                                ]
                            );
                        }}
                    />
                </View>

                <View className="px-4 pb-8">
                    <Text className="text-center text-slate-400 text-xs">Otokent App v1.0.0</Text>
                </View>
            </ScrollView>
        </View>
    );
}
