import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions, Linking, Modal, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
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

    const [offerModalVisible, setOfferModalVisible] = React.useState(false);
    const [offerPrice, setOfferPrice] = React.useState('');
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [successModalVisible, setSuccessModalVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleSendOffer = async () => {
        if (!offerPrice || !name || !surname || !phone) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz.');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                Alert.alert('Hata', 'Teklif vermek için giriş yapmalısınız.');
                setLoading(false);
                return;
            }

            const { error } = await supabase
                .from('offers')
                .insert({
                    user_id: user.id,
                    vehicle_id: vehicle.id,
                    price: parseFloat(offerPrice.replace(/[^0-9.]/g, '')),
                    name: name,
                    surname: surname,
                    phone: phone,
                    status: 'pending'
                });

            if (error) throw error;

            setOfferModalVisible(false);
            setTimeout(() => setSuccessModalVisible(true), 300);
            setOfferPrice('');
            setName('');
            setSurname('');
            setPhone('');
        } catch (error: any) {
            Alert.alert('Hata', 'Teklif gönderilirken bir sorun oluştu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar style="dark" />

            {/* Back Button (Absolute) */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-12 left-4 z-50 bg-white/90 p-2 rounded-full shadow-sm"
            >
                <Ionicons name="arrow-back" size={24} color="#1e293b" />
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
                    <View className="bg-white p-4 rounded-xl border border-slate-100 mb-6 shadow-sm">
                        <Text className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Teknik Detaylar</Text>
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
                    <View className="mt-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <Text className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                            Açıklama
                        </Text>
                        <Text className="text-slate-600 leading-6">
                            {vehicle.description || 'Açıklama bulunmuyor.'}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => setOfferModalVisible(true)}
                        className="flex-1 bg-orange-500 py-3.5 rounded-xl items-center shadow-orange-200 shadow-md active:scale-95 transition-transform"
                    >
                        <Text className="text-white font-bold text-base">Teklif Ver</Text>
                    </TouchableOpacity>

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
                        className="flex-1 bg-blue-600 py-3.5 rounded-xl items-center shadow-blue-200 shadow-md active:scale-95 transition-transform"
                    >
                        <Text className="text-white font-bold text-base">Mesaj</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => Linking.openURL('tel:905551234567')}
                        className="w-14 items-center justify-center bg-emerald-600 rounded-xl shadow-emerald-200 shadow-md active:scale-95 transition-transform"
                    >
                        <Ionicons name="call" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Offer Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={offerModalVisible}
                onRequestClose={() => setOfferModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 justify-end bg-black/50"
                >
                    <View className="bg-white rounded-t-3xl p-6 h-[85%] shadow-2xl">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-slate-900">Teklif Ver</Text>
                            <TouchableOpacity onPress={() => setOfferModalVisible(false)} className="p-2 bg-slate-100 rounded-full">
                                <Ionicons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                            <View className="mb-4">
                                <Text className="text-slate-500 mb-2 font-medium">Adınız</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 font-bold h-14"
                                    placeholder="Adınız"
                                    placeholderTextColor="#94a3b8"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-slate-500 mb-2 font-medium">Soyadınız</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 font-bold h-14"
                                    placeholder="Soyadınız"
                                    placeholderTextColor="#94a3b8"
                                    value={surname}
                                    onChangeText={setSurname}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-slate-500 mb-2 font-medium">Telefon Numarası</Text>
                                <TextInput
                                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 font-bold h-14"
                                    placeholder="05XX XXX XX XX"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-slate-500 mb-2 font-medium">Teklifiniz (TL)</Text>
                                <View className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex-row items-center h-14">
                                    <Text className="text-slate-900 font-bold text-xl mr-2">₺</Text>
                                    <TextInput
                                        className="flex-1 text-xl font-bold text-slate-900"
                                        placeholder="0"
                                        placeholderTextColor="#94a3b8"
                                        keyboardType="numeric"
                                        value={offerPrice}
                                        onChangeText={setOfferPrice}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleSendOffer}
                                disabled={loading}
                                className="bg-orange-500 py-4 rounded-xl items-center shadow-lg shadow-orange-200 mb-8"
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-lg">Teklifi Gönder</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={successModalVisible}
                onRequestClose={() => setSuccessModalVisible(false)}
            >
                <View className="flex-1 items-center justify-center bg-black/80 px-4">
                    <View className="bg-white rounded-[32px] p-8 items-center w-full max-w-sm shadow-2xl relative overflow-hidden">
                        {/* Decorative Background */}
                        <View className="absolute top-0 left-0 right-0 h-32 bg-green-500/10 rounded-t-[32px]" />

                        <View className="w-24 h-24 bg-green-500 rounded-full items-center justify-center mb-6 shadow-xl shadow-green-200 mt-4 border-4 border-white">
                            <Ionicons name="checkmark-sharp" size={56} color="white" />
                        </View>

                        <Text className="text-3xl font-black text-slate-900 text-center mb-3">Harika!</Text>

                        <Text className="text-slate-500 text-center text-lg mb-8 leading-7 font-medium">
                            Teklifiniz satıcıya başarıyla iletildi.{'\n'}En kısa sürede size geri dönüş yapılacaktır.
                        </Text>

                        <TouchableOpacity
                            onPress={() => setSuccessModalVisible(false)}
                            className="bg-slate-900 w-full py-4 rounded-2xl items-center active:scale-95 transition-transform shadow-lg shadow-slate-300"
                        >
                            <Text className="text-white font-bold text-lg">Tamam, Anlaşıldı</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}
