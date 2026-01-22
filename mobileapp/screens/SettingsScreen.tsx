import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

export default function SettingsScreen() {
    const navigation = useNavigation<any>();
    const { isDarkMode, toggleTheme, logout } = useApp();

    const MenuOption = ({ icon, title, subtitle, onPress, toggle }: any) => (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 bg-white border-b border-gray-50"
        >
            <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-3">
                    <Ionicons name={icon} size={22} color="#475569" />
                </View>
                <View>
                    <Text className="text-slate-900 font-medium text-base">{title}</Text>
                    {subtitle && <Text className="text-slate-400 text-xs">{subtitle}</Text>}
                </View>
            </View>
            {toggle ? (
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#767577', true: '#2563eb' }}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            )}
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-slate-50">
            {/* Header implies "Settings" now */}
            <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between pt-12 shadow-sm">
                <Text className="text-xl font-bold text-slate-900">Ayarlar</Text>
            </View>

            <ScrollView>
                {/* Menu Sections */}
                <View className="mb-6 bg-white border-y border-gray-100">
                    <Text className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-gray-100">Hesap Ayarları</Text>
                    <MenuOption icon="person-circle-outline" title="Profili Düzenle" onPress={() => navigation.navigate('EditProfile')} />
                    <MenuOption icon="shield-checkmark-outline" title="Giriş ve Güvenlik" onPress={() => navigation.navigate('LoginSecurity')} />
                    <MenuOption icon="notifications-outline" title="Bildirim Ayarları" onPress={() => navigation.navigate('NotificationSettings')} />
                    <MenuOption icon="lock-closed-outline" title="Gizlilik ve Güvenlik" onPress={() => navigation.navigate('PrivacySecurity')} />
                </View>

                <View className="mb-6 bg-white border-y border-gray-100">
                    <Text className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-gray-100">Görünüm</Text>
                    <MenuOption
                        icon="moon-outline"
                        title="Karanlık Mod"
                        toggle={true}
                        onPress={toggleTheme}
                    />
                </View>

                <View className="mb-6 bg-white border-y border-gray-100">
                    <Text className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-gray-100">Destek</Text>
                    <MenuOption icon="help-circle-outline" title="Yardım Merkezi" onPress={() => navigation.navigate('HelpCenter')} />
                    <MenuOption icon="document-text-outline" title="Kullanım Koşulları" onPress={() => navigation.navigate('Terms')} />
                    <MenuOption icon="star-outline" title="Uygulamayı Değerlendir" subtitle="v1.0.0" onPress={() => { }} />
                    <MenuOption
                        icon="log-out-outline"
                        title="Çıkış Yap"
                        onPress={() => {
                            Alert.alert('Çıkış Yap', 'Çıkış yapmak istediğinize emin misiniz?', [
                                { text: 'İptal', style: 'cancel' },
                                {
                                    text: 'Çıkış Yap', style: 'destructive', onPress: () => {
                                        logout(); // Assuming logout is destructured from useApp
                                        navigation.goBack();
                                    }
                                }
                            ]);
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
