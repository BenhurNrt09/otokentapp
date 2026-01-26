import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function TermsScreen() {
    const navigation = useNavigation();
    const [policy, setPolicy] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPolicy();
    }, []);

    const loadPolicy = async () => {
        try {
            const { data, error } = await supabase
                .from('policies')
                .select('*')
                .eq('type', 'terms')
                .eq('is_active', true)
                .single();

            if (data) {
                setPolicy(data);
            }
        } catch (e) {
            console.error('Error loading policy:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-50">
            <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex-row items-center justify-between shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900">{policy?.title || 'Kullanım Koşulları'}</Text>
                <View className="w-8" />
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    {loading ? (
                        <Text className="text-slate-500 text-center py-10">Yükleniyor...</Text>
                    ) : policy ? (
                        <>
                            <Text className="text-slate-600 leading-6 mb-6">
                                {policy.content}
                            </Text>
                            <Text className="text-slate-400 text-xs mt-4 text-center">Son Güncelleme: {new Date(policy.updated_at).toLocaleDateString()}</Text>
                        </>
                    ) : (
                        <Text className="text-slate-500 text-center py-10">İçerik bulunamadı.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
