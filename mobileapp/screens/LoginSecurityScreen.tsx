import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../context/ToastContext';

export default function LoginSecurityScreen() {
    const navigation = useNavigation();
    const { showSuccessToast, showErrorToast } = useToast();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showErrorToast('Lütfen tüm alanları doldurun');
            return;
        }

        if (newPassword !== confirmPassword) {
            showErrorToast('Yeni şifreler eşleşmiyor');
            return;
        }

        if (newPassword.length < 6) {
            showErrorToast('Şifre en az 6 karakter olmalıdır');
            return;
        }

        // TODO: Implement actual password change logic
        showSuccessToast('Şifre başarıyla güncellendi');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <View className="flex-1 bg-slate-50">
            <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex-row items-center justify-between shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900">Giriş ve Güvenlik</Text>
                <View className="w-8" />
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <Text className="text-lg font-bold text-slate-900 mb-4">Şifre Değiştir</Text>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">Mevcut Şifre</Text>
                            <TextInput
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry
                                className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900"
                                placeholder="••••••"
                            />
                        </View>
                        <View>
                            <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">Yeni Şifre</Text>
                            <TextInput
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900"
                                placeholder="••••••"
                            />
                        </View>
                        <View>
                            <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">Yeni Şifre (Tekrar)</Text>
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900"
                                placeholder="••••••"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handlePasswordChange}
                        className="bg-blue-600 mt-6 py-3 rounded-xl items-center"
                    >
                        <Text className="text-white font-bold">Şifreyi Güncelle</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
