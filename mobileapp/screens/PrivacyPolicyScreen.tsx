import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

export default function PrivacyPolicyScreen() {
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
                    Gizlilik Politikası
                </Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 }}>
                    OtoKent Gizlilik Politikası
                </Text>

                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    OtoKent olarak, kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu gizlilik politikası,
                    kişisel bilgilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    1. Toplanan Bilgiler
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    • Ad, soyad ve e-posta adresi{'\n'}
                    • Profil fotoğrafı{'\n'}
                    • Araç ilanları ve ilgili fotoğraflar{'\n'}
                    • Mesajlaşma geçmişi{'\n'}
                    • Konum bilgisi (paylaşıldığında)
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    2. Bilgilerin Kullanımı
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    Toplanan bilgiler aşağıdaki amaçlarla kullanılır:{'\n\n'}
                    • Hesap oluşturma ve kimlik doğrulama{'\n'}
                    • Araç ilanlarının yayınlanması{'\n'}
                    • Kullanıcılar arası iletişimin sağlanması{'\n'}
                    • Hizmet kalitesinin iyileştirilmesi{'\n'}
                    • Yasal yükümlülüklerin yerine getirilmesi
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    3. Bilgi Güvenliği
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    Kişisel bilgilerinizi korumak için endüstri standartlarında güvenlik önlemleri alıyoruz.
                    Verileriniz şifrelenerek saklanır ve yetkisiz erişime karşı korunur.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    4. Üçüncü Taraflarla Paylaşım
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    Kişisel bilgileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.
                    Hizmet sağlayıcılarımız ile paylaşılan bilgiler, yalnızca hizmet sunumu için kullanılır.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    5. Kullanıcı Hakları
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    • Kişisel verilerinize erişim hakkı{'\n'}
                    • Verilerin düzeltilmesini talep etme hakkı{'\n'}
                    • Verilerin silinmesini isteme hakkı{'\n'}
                    • Veri işlemeye itiraz etme hakkı
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    6. Çerezler
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    Uygulamamız, kullanıcı deneyimini iyileştirmek için çerezler ve benzeri teknolojiler kullanabilir.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    7. Değişiklikler
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 16, lineHeight: 22 }}>
                    Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olduğunda kullanıcılarımız bilgilendirilecektir.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 16, marginBottom: 8 }}>
                    8. İletişim
                </Text>
                <Text style={{ fontSize: 14, color: '#475569', marginBottom: 32, lineHeight: 22 }}>
                    Gizlilik politikamız hakkında sorularınız için lütfen Otokent Destek ile iletişime geçin.
                </Text>

                <Text style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginBottom: 16 }}>
                    Son Güncelleme: 22 Ocak 2026{'\n'}
                    © 2026 OtoKent. Tüm hakları saklıdır.
                </Text>
            </ScrollView>
        </View>
    );
}
