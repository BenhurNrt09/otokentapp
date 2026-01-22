import { View, Text, FlatList, TouchableOpacity, TextInput, Image, ScrollView, Alert, Linking, ActionSheetIOS, Platform } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

const INSURANCE_COMPANIES = [
    { id: '1', name: 'Allianz Sigorta', hasPhone: '08503999999', hasWeb: 'https://www.allianz.com.tr' },
    { id: '2', name: 'Axa Sigorta', hasPhone: '08502509999', hasWeb: 'https://www.axasigorta.com.tr' },
    { id: '3', name: 'Anadolu Sigorta', hasPhone: '08507240850', hasWeb: 'https://www.anadolusigorta.com.tr' },
    { id: '4', name: 'Sompo Sigorta', hasPhone: '08502500757', hasWeb: 'https://www.somposigorta.com.tr' },
    { id: '5', name: 'Ak Sigorta', hasPhone: '4442727', hasWeb: 'https://www.aksigorta.com.tr' },
    { id: '6', name: 'Mapfre Sigorta', hasPhone: '08507559999', hasWeb: 'https://www.mapfre.com.tr' },
    { id: '7', name: 'Türkiye Sigorta', hasPhone: '08502022020', hasWeb: 'https://www.turkiyesigorta.com.tr' }
];

export default function InsuranceScreen() {
    const [search, setSearch] = useState('');

    const handleCompanyPress = (company: any) => {
        Alert.alert(
            company.name,
            'Nasıl iletişime geçmek istersiniz?',
            [
                {
                    text: 'Web Sitesine Git',
                    onPress: () => Linking.openURL(company.hasWeb)
                },
                {
                    text: 'Müşteri Hizmetlerini Ara',
                    onPress: () => Linking.openURL(`tel:${company.hasPhone}`)
                },
                {
                    text: 'İptal',
                    style: 'cancel'
                }
            ]
        );
    };

    const filteredCompanies = INSURANCE_COMPANIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View className="flex-1 bg-white">
            <Header />

            <View className="p-4 bg-slate-50 border-b border-gray-100">
                <View className="flex-row items-center bg-white border border-gray-200 rounded-lg px-3 py-3">
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Sigorta şirketi ara..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <FlatList
                data={filteredCompanies}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={{ padding: 10 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleCompanyPress(item)}
                        className="flex-1 m-2 bg-white rounded-xl shadow-sm border border-slate-100 items-center justify-center p-6 h-40"
                    >
                        {/* Placeholder for Logo if network image fails or is huge */}
                        <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-3">
                            <Ionicons name="shield-checkmark" size={32} color="#cbd5e1" />
                        </View>
                        <Text className="text-center font-bold text-slate-700">{item.name}</Text>
                        <Text className="text-xs text-blue-600 mt-1 font-medium">Teklif Al</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
