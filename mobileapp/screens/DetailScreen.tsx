import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ExpertiseMap } from '../components/ExpertiseMap';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const { width } = Dimensions.get('window');

const LABELS: Record<string, string> = {
    sahibinden_ilk: 'İlk Sahibinden',
    sahibinden_ikinci: 'İkinci Sahibinden',
    galeriden: 'Galeriden',
    yetkili_bayiden: 'Yetkili Bayiden',
    owner: 'Sahibinden',
    dealer: 'Galeriden',
    gallery: 'Yetkili Bayiden',
    benzin: 'Benzin',
    dizel: 'Dizel',
    hibrit: 'Hibrit',
    elektrik: 'Elektrik',
    manuel: 'Manuel',
    otomatik: 'Otomatik'
};

const DetailRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <View className="w-[47%] mb-3">
        <Text className="text-slate-500 text-xs uppercase mb-1">{label}</Text>
        <Text className="text-slate-900 font-bold">{value || '-'}</Text>
    </View>
);

export default function DetailScreen() {
    const route = useRoute<DetailScreenRouteProp>();
    const navigation = useNavigation();
    const { vehicle } = route.params;

    const formattedPrice = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
    }).format(vehicle.price);

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />

            {/* Back Button (Absolute) */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-12 left-4 z-50 bg-black/50 w-10 h-10 items-center justify-center rounded-full"
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Image Carousel */}
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                    {vehicle.images && vehicle.images.length > 0 ? (
                        vehicle.images.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img }}
                                style={{ width: width, height: 300 }}
                                resizeMode="cover"
                            />
                        ))
                    ) : (
                        <View style={{ width: width, height: 300 }} className="bg-slate-200 items-center justify-center">
                            <Text className="text-slate-400">Görsel Yok</Text>
                        </View>
                    )}
                </ScrollView>

                <View className="p-5">
                    <Text className="text-2xl font-bold text-slate-900 mb-2">
                        {vehicle.brand} {vehicle.model}
                    </Text>
                    <Text className="text-3xl font-extrabold text-blue-600 mb-6">
                        {formattedPrice}
                    </Text>

                    {/* Technical Details Grid */}
                    <View className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                        <Text className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Teknik Detaylar</Text>
                        <View className="flex-row flex-wrap justify-between">
                            <DetailRow label="Yıl" value={vehicle.year} />
                            <DetailRow label="KM" value={vehicle.mileage?.toLocaleString()} />
                            <DetailRow label="Yakıt" value={LABELS[vehicle.fuel_type] || vehicle.fuel_type} />
                            <DetailRow label="Vites" value={LABELS[vehicle.gear_type] || vehicle.gear_type} />
                            <DetailRow label="Seri" value={vehicle.series} />
                            <DetailRow label="Gövde Tipi" value={vehicle.body_type} />
                            <DetailRow label="Renk" value={vehicle.color} />
                            <DetailRow label="Kimden" value={LABELS[vehicle.from_who] || vehicle.from_who} />
                            <DetailRow label="Çekiş" value={vehicle.drive_type} />
                            <DetailRow label="Garanti" value={vehicle.warranty ? 'Var' : 'Yok'} />
                            <DetailRow label="Ağır Hasarlı" value={vehicle.heavy_damage_record ? 'Evet' : 'Hayır'} />
                        </View>
                    </View>

                    {/* Expertise Map */}
                    {vehicle.expertise_data && (
                        <ExpertiseMap data={vehicle.expertise_data} />
                    )}

                    {/* Description */}
                    <View className="mt-6">
                        <Text className="text-lg font-bold text-slate-900 mb-3 block border-b border-slate-100 pb-2">
                            Açıklama
                        </Text>
                        <Text className="text-slate-600 leading-6">
                            {vehicle.description || 'Açıklama bulunmuyor.'}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-md">
                <View className="flex-row gap-4">
                    <TouchableOpacity
                        onPress={() => {
                            const mockChat = {
                                id: Date.now().toString(),
                                user: {
                                    id: 'seller_1',
                                    name: 'Satıcı',
                                    online: true
                                },
                                messages: [],
                                vehicle: vehicle
                            };
                            navigation.navigate('ChatDetail', { chat: mockChat });
                        }}
                        className="flex-1 bg-blue-600 py-4 rounded-xl items-center shadow-blue-200 shadow-lg"
                    >
                        <Text className="text-white font-bold text-lg">Mesaj Gönder</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => Linking.openURL('tel:905551234567')}
                        className="flex-1 bg-emerald-600 py-4 rounded-xl items-center shadow-emerald-200 shadow-lg"
                    >
                        <Text className="text-white font-bold text-lg">Ara</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
