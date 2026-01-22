import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CookiePolicyScreen() {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <View style={{
                backgroundColor: 'white',
                paddingHorizontal: 16,
                paddingTop: 48,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#e2e8f0',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8 }}>
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginLeft: 12 }}>
                    Çerez Politikası
                </Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 }}>
                    OtoKent Çerez Politikası
                </Text>

                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    OtoKent uygulaması, kullanıcı deneyimini iyileştirmek ve hizmetlerimizi geliştirmek için
                    çerezler ve benzeri teknolojiler kullanmaktadır.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    1. Çerez Nedir?
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    Çerezler, web siteleri veya mobil uygulamalar tarafından cihazınıza yerleştirilen küçük
                    metin dosyalarıdır. Bu dosyalar, uygulamanın tercihlerinizi hatırlamasına ve daha iyi bir
                    kullanıcı deneyimi sunmasına yardımcı olur.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    2. Kullandığımız Çerez Türleri
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    <Text style={{ fontWeight: '600' }}>Zorunlu Çerezler:{'\n'}</Text>
                    Uygulamanın temel işlevlerini yerine getirmesi için gereklidir. Oturum yönetimi ve
                    güvenlik için kullanılır.{'\n\n'}

                    <Text style={{ fontWeight: '600' }}>İşlevsel Çerezler:{'\n'}</Text>
                    Tercihlerinizi ve ayarlarınızı hatırlamak için kullanılır. Örneğin, dil tercihiniz
                    veya son aramalarınız.{'\n\n'}

                    <Text style={{ fontWeight: '600' }}>Analitik Çerezler:{'\n'}</Text>
                    Uygulamanın nasıl kullanıldığını anlamamıza yardımcı olur. Hangi sayfaların en çok
                    ziyaret edildiği, kullanıcıların ne kadar süre kaldığı gibi bilgileri toplar.{'\n\n'}

                    <Text style={{ fontWeight: '600' }}>Reklam Çerezleri:{'\n'}</Text>
                    Size daha alakalı reklamlar göstermek için kullanılır. Tercihlerinize ve ilgi
                    alanlarınıza uygun içerik sunmamızı sağlar.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    3. Çerezlerin Kullanım Amaçları
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    • Kimlik doğrulama ve oturum yönetimi{'\n'}
                    • Kullanıcı tercihlerini kaydetme{'\n'}
                    • Uygulama performansını izleme ve iyileştirme{'\n'}
                    • Kullanım istatistiklerini toplama{'\n'}
                    • Kişiselleştirilmiş içerik ve reklamlar sunma{'\n'}
                    • Güvenlik ve dolandırıcılık önleme
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    4. Üçüncü Taraf Çerezleri
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    Uygulamamızda aşağıdaki üçüncü taraf hizmetlerinin çerezlerini kullanabiliriz:{'\n\n'}
                    • Google Analytics (Analitik hizmetler){'\n'}
                    • Facebook SDK (Sosyal medya entegrasyonu){'\n'}
                    • Firebase (Performans izleme ve bildirimler){'\n'}
                    • Reklam ağları (Hedefli reklamlar)
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    5. Çerez Kontrolü
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    Çoğu mobil cihaz ve web tarayıcısı, çerezleri yönetmenize olanak tanır. Cihazınızın
                    ayarlarından çerezleri devre dışı bırakabilir veya silebilirsiniz. Ancak bu durumda,
                    uygulamanın bazı özelliklerinin düzgün çalışmayabileceğini unutmayın.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    6. Çerez Süresi
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    Oturum çerezleri, uygulamayı kapattığınızda silinir. Kalıcı çerezler ise belirli bir
                    süre boyunca cihazınızda kalır ve bir sonraki ziyaretinizde tanınmanızı sağlar.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    7. Politika Güncellemeleri
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    Bu çerez politikası zaman zaman güncellenebilir. Önemli değişiklikler olduğunda
                    kullanıcılarımızı bilgilendireceğiz.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    8. İletişim
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 32, lineHeight: 22 }}>
                    Çerez politikamız hakkında sorularınız için lütfen OtoKent Destek ile iletişime geçin.
                </Text>

                <Text style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginBottom: 16 }}>
                    Son Güncelleme: 22 Ocak 2026{'\n'}
                    © 2026 OtoKent. Tüm hakları saklıdır.
                </Text>
            </ScrollView>
        </View>
    );
}
