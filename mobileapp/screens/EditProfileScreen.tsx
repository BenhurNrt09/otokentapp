import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { user, updateUser } = useApp();
    const { showSuccessToast, showErrorToast } = useToast();

    const [name, setName] = useState(user.name);
    const [surname, setSurname] = useState(user.surname);
    const [email, setEmail] = useState(user.email);

    const handleSave = () => {
        try {
            updateUser({ name, surname, email });
            showSuccessToast('Profil başarıyla güncellendi');
            navigation.goBack();
        } catch (error) {
            showErrorToast('Profil güncellenemedi, tekrar deneyiniz');
        }
    };

    const handlePickImage = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('İzin Gerekli', 'Galeri erişimi için izin gerekiyor.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                updateUser({ avatar: result.assets[0].uri });
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.');
        }
    };

    return (
        <View className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="bg-white px-4 pt-12 pb-4 border-b border-gray-100 flex-row items-center justify-between shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-900">Profili Düzenle</Text>
                <View className="w-8" />
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Avatar Section */}
                <View className="items-center mb-8 mt-4">
                    <TouchableOpacity onPress={handlePickImage}>
                        <View className="w-28 h-28 bg-blue-50 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm relative overflow-hidden">
                            {user.avatar ? (
                                <Image source={{ uri: user.avatar }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <Ionicons name="person" size={56} color="#2563eb" />
                            )}
                            <View className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-white">
                                <Ionicons name="camera" size={16} color="white" />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Text className="text-blue-600 font-medium">Fotoğrafı Değiştir</Text>
                </View>

                {/* Form Fields */}
                <View className="space-y-4">
                    <View>
                        <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">Ad</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-slate-900"
                            placeholder="Adınız"
                        />
                    </View>

                    <View>
                        <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">Soyad</Text>
                        <TextInput
                            value={surname}
                            onChangeText={setSurname}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-slate-900"
                            placeholder="Soyadınız"
                        />
                    </View>

                    <View>
                        <Text className="text-slate-500 text-sm font-medium mb-1.5 ml-1">E-posta</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-slate-900"
                            placeholder="E-posta adresiniz"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    className="bg-blue-600 mt-8 py-4 rounded-xl items-center shadow-lg shadow-blue-200"
                >
                    <Text className="text-white font-bold text-lg">Değişiklikleri Kaydet</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
