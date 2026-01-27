import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const { login } = useApp();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // Basic validation
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi giriniz.');
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Save Remember Me preference
            await AsyncStorage.setItem('remember_me', keepSignedIn ? 'true' : 'false');

            // AppContext listener will handle the state update
        } catch (error: any) {
            console.error('Giriş hatası:', error);
            if (error.message.includes('Invalid login credentials')) {
                Alert.alert(
                    'Giriş Başarısız',
                    'E-posta veya şifre hatalı. Hesabınız yoksa lütfen kayıt olunuz.',
                    [
                        { text: 'Tamam', style: 'cancel' },
                        { text: 'Kayıt Ol', onPress: () => navigation.navigate('Register') }
                    ]
                );
            } else if (error.message.includes('Email not confirmed')) {
                Alert.alert('Giriş Başarısız', 'E-posta adresiniz doğrulanmamış. Sistem yöneticisi ile iletişime geçin.');
            } else {
                Alert.alert('Giriş Başarısız', error.message || 'E-posta veya şifre hatalı.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                    className="px-6"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    {/* Logo Section */}
                    <View className="items-center mb-10 mt-10">
                        <Image
                            source={require('../assets/logo.png')}
                            className="w-48 h-48"
                            resizeMode="contain"
                        />
                        <Text className="text-black mt-4 font-bold text-xl">Hoş Geldiniz</Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4">
                        <View>
                            <Text className="text-slate-700 font-medium mb-2 ml-1">E-Posta</Text>
                            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14 focus:border-blue-500 transition-colors">
                                <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                                <TextInput
                                    className="flex-1 ml-3 text-slate-800 text-base"
                                    placeholder="ornek@email.com"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-700 font-medium mb-2 ml-1">Şifre</Text>
                            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14 focus:border-blue-500 transition-colors">
                                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                                <TextInput
                                    className="flex-1 ml-3 text-slate-800 text-base"
                                    placeholder="••••••••"
                                    placeholderTextColor="#94a3b8"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Keep Signed In & Forgot Password */}
                    <View className="flex-row items-center justify-between mt-4 mb-6">
                        <TouchableOpacity
                            className="flex-row items-center"
                            onPress={() => setKeepSignedIn(!keepSignedIn)}
                            activeOpacity={0.7}
                        >
                            <View className={`w-5 h-5 rounded-md border items-center justify-center mr-2 ${keepSignedIn ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                                {keepSignedIn && <Ionicons name="checkmark" size={14} color="white" />}
                            </View>
                            <Text className="text-slate-600 font-medium">Beni Hatırla</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => Alert.alert('Şifre Sıfırlama', 'Şifre sıfırlama bağlantısı gönderildi.')}>
                            <Text className="text-blue-600 font-medium text-sm">Şifremi Unuttum?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        className="w-full bg-blue-600 h-14 rounded-2xl items-center justify-center shadow-lg shadow-blue-200 mb-6"
                        activeOpacity={0.8}
                        onPress={handleLogin}
                    >
                        <Text className="text-white font-bold text-lg">Giriş Yap</Text>
                    </TouchableOpacity>

                    {/* Register Link */}
                    <View className="flex-row justify-center">
                        <Text className="text-slate-500">Hesabınız yok mu? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="text-blue-600 font-bold">Kaydol</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Help Center */}
                    <View className="mt-12 items-center">
                        <TouchableOpacity onPress={() => Alert.alert('Yardım', 'Yardım Merkezi sayfasına yönlendiriliyorsunuz.')}>
                            <Text className="text-slate-400 text-sm font-medium">Yardım Merkezi</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
