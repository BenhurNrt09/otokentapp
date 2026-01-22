import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginSecurityScreen() {
    const navigation = useNavigation();

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
                                secureTextEntry
                                className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900"
                                placeholder="••••••"
                            />
                        </View>
                        <View>
                            <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">Yeni Şifre</Text>
                            <TextInput
                                secureTextEntry
                                className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900"
                                placeholder="••••••"
                            />
                        </View>
                        <View>
                            <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">Yeni Şifre (Tekrar)</Text>
                            <TextInput
                                secureTextEntry
                                className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900"
                                placeholder="••••••"
                            />
                        </View>
                    </View>

                    <TouchableOpacity className="bg-blue-600 mt-6 py-3 rounded-xl items-center">
                        <Text className="text-white font-bold">Şifreyi Güncelle</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => Alert.alert('Hesabı Sil', 'Hesabınızı silmek istediğinize emin misiniz?', [{ text: 'İptal', style: 'cancel' }, { text: 'Evet, Sil', style: 'destructive' }])}
                    className="bg-white p-4 rounded-xl shadow-sm border border-red-100 flex-row items-center gap-3"
                >
                    <Ionicons name="trash-outline" size={20} color="#dc2626" />
                    <Text className="text-red-600 font-bold">Hesabımı Sil</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
