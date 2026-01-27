import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function RegisterScreen() {
    const navigation = useNavigation<any>();
    const { login } = useApp();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Agreements
    const [agreement1, setAgreement1] = useState(false); // User Agreement & Pre-info (Mandatory)
    const [agreement2, setAgreement2] = useState(false); // Otokent services (Optional)
    const [agreement3, setAgreement3] = useState(false); // Marketing (Optional)

    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !surname || !email || !password || !confirmPassword) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Hata', 'Şifreler uyuşmuyor.');
            return;
        }

        if (!agreement1) {
            Alert.alert('Uyarı', 'Lütfen kullanıcı sözleşmesi ve ön bilgilendirme formunu onaylayınız.');
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        surname,
                    }
                }
            });

            if (error) throw error;

            if (data.session) {
                // Session cached locally or returned immediately
                // AppContext listener will handle navigation
            } else {
                // Try to login immediately
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) {
                    // Check specifically for email not confirmed, implying trigger might be slow
                    if (signInError.message.includes('Email not confirmed') || signInError.message.includes('not confirmed')) {
                        // Wait 1 second and retry
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        const { error: retryError } = await supabase.auth.signInWithPassword({
                            email,
                            password,
                        });

                        if (retryError) {
                            console.log('Otomatik giriş yeniden denemesi başarısız:', retryError);
                            Alert.alert('Bilgi', 'Kayıt başarılı. Lütfen giriş yapınız.');
                            navigation.navigate('Login');
                        }
                    } else {
                        Alert.alert('Bilgi', 'Kayıt başarılı. Lütfen giriş yapınız.');
                        navigation.navigate('Login');
                    }
                }
            }
        } catch (error: any) {
            console.error('Kayıt hatası:', error);
            Alert.alert('Kayıt Başarısız', error.message || 'Kayıt sırasında bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const CheckboxRow = ({ active, onPress, text, isLink, onLinkPress }: any) => (
        <View className="flex-row items-start mb-4">
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                className="mt-0.5"
            >
                <View className={`w-5 h-5 rounded-md border items-center justify-center mr-3 ${active ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                    {active && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
            </TouchableOpacity>
            <View className="flex-1">
                {isLink ? (
                    <View className="flex-row flex-wrap">
                        <Text className="text-slate-600 text-sm leading-5">
                            <Text className="font-bold text-blue-600 underline" onPress={onLinkPress}>{text}</Text>
                            {' '}okudum ve onaylıyorum.
                        </Text>
                    </View>
                ) : (
                    <Text className="text-slate-600 text-sm leading-5">{text}</Text>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pb-8">

                    <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 mb-6">
                        <Ionicons name="arrow-back" size={24} color="#0f172a" />
                    </TouchableOpacity>

                    <View className="mb-8">
                        <Text className="text-3xl font-bold text-slate-900">Kayıt Ol</Text>
                        <Text className="text-slate-500 mt-2 text-base">Hemen aramıza katılın</Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4 mb-6">
                        <View className="flex-row space-x-4">
                            <View className="flex-1">
                                <Text className="text-slate-700 font-medium mb-2 ml-1">İsim</Text>
                                <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14 justify-center">
                                    <TextInput
                                        className="text-slate-800 text-base"
                                        placeholder="Adınız"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-700 font-medium mb-2 ml-1">Soyisim</Text>
                                <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14 justify-center">
                                    <TextInput
                                        className="text-slate-800 text-base"
                                        placeholder="Soyadınız"
                                        value={surname}
                                        onChangeText={setSurname}
                                    />
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-700 font-medium mb-2 ml-1">E-Posta</Text>
                            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14 justify-center">
                                <TextInput
                                    className="text-slate-800 text-base"
                                    placeholder="ornek@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-700 font-medium mb-2 ml-1">Şifre</Text>
                            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14 justify-center">
                                <TextInput
                                    className="flex-1 text-slate-800 text-base"
                                    placeholder="••••••••"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-700 font-medium mb-2 ml-1">Şifre Tekrar</Text>
                            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14 justify-center">
                                <TextInput
                                    className="text-slate-800 text-base"
                                    placeholder="••••••••"
                                    secureTextEntry={!showPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Agreements */}
                    <View className="mt-2 mb-6">
                        <CheckboxRow
                            active={agreement1}
                            onPress={() => setAgreement1(!agreement1)}
                            text="Kullanıcı Sözleşmesi ve Ön Bilgilendirme Formunu"
                            isLink
                            onLinkPress={() => Alert.alert('Sözleşme', 'Sözleşme metni burada gösterilecek.')}
                        />

                        <CheckboxRow
                            active={agreement2}
                            onPress={() => setAgreement2(!agreement2)}
                            text="Otokent hizmetleri ile ilgili e-posta ve sms almak istiyorum."
                        />

                        <CheckboxRow
                            active={agreement3}
                            onPress={() => setAgreement3(!agreement3)}
                            text=" Kampanya ve fırsatlardan haberdar olmak için ticari elektronik ileti almak istiyorum."
                        />
                    </View>


                    {/* Register Button */}
                    <TouchableOpacity
                        className="w-full bg-blue-600 h-14 rounded-2xl items-center justify-center shadow-lg shadow-blue-200 mb-8"
                        activeOpacity={0.8}
                        onPress={handleRegister}
                    >
                        <Text className="text-white font-bold text-lg">Kaydol</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
