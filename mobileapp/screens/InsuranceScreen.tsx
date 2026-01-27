import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Alert, Linking, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

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
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [tcNo, setTcNo] = useState('');
    const [plate, setPlate] = useState('');
    const [serialNo, setSerialNo] = useState('');

    const handleCompanyPress = (company: any) => {
        setSelectedCompany(company);
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        if (!tcNo || !plate || !serialNo || !name || !surname) {
            Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurunuz.');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                Alert.alert('Hata', 'Teklif almak için giriş yapmalısınız.');
                setLoading(false);
                return;
            }

            const { error } = await supabase.from('offers').insert({
                user_id: user.id,
                offer_type: 'insurance',
                insurance_company: selectedCompany?.name,
                name: name,
                surname: surname,
                tc_number: tcNo,
                plate_number: plate,
                license_serial: serialNo,
                status: 'pending'
            });

            if (error) throw error;

            setModalVisible(false);
            Alert.alert(
                'Teklif İsteği Alındı',
                `${selectedCompany?.name} için teklif talebiniz başarıyla oluşturuldu. Yetkililerimiz en kısa sürede sizinle iletişime geçecektir.`,
                [{ text: 'Tamam' }]
            );

            // Reset form
            setName('');
            setSurname('');
            setTcNo('');
            setPlate('');
            setSerialNo('');
        } catch (error: any) {
            console.error(error);
            Alert.alert('Hata', 'İşlem sırasında bir hata oluştu: ' + error.message);
        } finally {
            setLoading(false);
        }
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
                        className="flex-1 m-2 bg-white rounded-xl shadow-sm border border-slate-100 items-center justify-center p-6 h-40 active:scale-95 transition-transform"
                    >
                        <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-3">
                            <Ionicons name="shield-checkmark" size={32} color="#cbd5e1" />
                        </View>
                        <Text className="text-center font-bold text-slate-700">{item.name}</Text>
                        <Text className="text-xs text-blue-600 mt-1 font-medium">Teklif Al</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Offer Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    className="flex-1 justify-end bg-black/50"
                >
                    <View className="bg-white rounded-t-3xl p-6 shadow-2xl h-[85%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-slate-900">
                                {selectedCompany?.name} Teklif
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2 bg-slate-100 rounded-full">
                                <Ionicons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                            <View className="space-y-4 mb-8">
                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-slate-700 mb-2">Adınız</Text>
                                    <TextInput
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base font-semibold"
                                        placeholder="Adınız"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-slate-700 mb-2">Soyadınız</Text>
                                    <TextInput
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base font-semibold"
                                        placeholder="Soyadınız"
                                        value={surname}
                                        onChangeText={setSurname}
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-slate-700 mb-2">TC Kimlik No</Text>
                                    <TextInput
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base font-semibold"
                                        placeholder="11 haneli TC kimlik no"
                                        keyboardType="numeric"
                                        maxLength={11}
                                        value={tcNo}
                                        onChangeText={setTcNo}
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-slate-700 mb-2">Plaka</Text>
                                    <TextInput
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base font-semibold"
                                        placeholder="34 ABC 34"
                                        autoCapitalize="characters"
                                        value={plate}
                                        onChangeText={setPlate}
                                    />
                                </View>

                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-slate-700 mb-2">Ruhsat Seri No</Text>
                                    <TextInput
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base font-semibold"
                                        placeholder="Örn: AB 123456"
                                        autoCapitalize="characters"
                                        value={serialNo}
                                        onChangeText={setSerialNo}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={loading}
                                className="w-full bg-blue-600 p-4 rounded-xl items-center shadow-lg shadow-blue-200 mb-8"
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">Teklif İste</Text>
                                )}
                            </TouchableOpacity>

                            <Text className="text-xs text-slate-400 text-center mb-8">
                                * Kişisel verileriniz KVKK kapsamında korunmaktadır.
                            </Text>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
