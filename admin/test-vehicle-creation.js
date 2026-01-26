// Test Aracı Oluşturma Script - Admin Panelde Çalıştırılacak
// Browser Console'da çalıştır: Admin Panel > F12 > Console

async function testVehicleCreation() {
    console.log('=== TEST: Araç Oluşturma ===');

    const testData = {
        brand: 'Toyota',
        model: 'Corolla',
        series: '1.4 D-4D Advance',
        year: 2020,
        price: 850000,
        mileage: 45000,
        fuel_type: 'dizel',
        gear_type: 'manuel',
        body_type: 'Sedan',
        engine_capacity: '1364 cc',
        engine_power: '90 hp',
        drive_type: 'Önden Çekiş',
        color: 'Gümüş',
        warranty: false,
        heavy_damage_record: false,
        is_disabled_friendly: false,
        exchangeable: true,
        video_call_available: true,
        from_who: 'sahibinden_ilk',
        description: 'Test aracı - manuel eklendi',
        images: ['https://picsum.photos/800/600'],
        expertise_data: {},
        status: 'active'
    };

    const formData = new FormData();
    Object.entries(testData).forEach(([key, value]) => {
        if (key === 'images' || key === 'expertise_data') {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });

    try {
        console.log('Gönderilen veri:', testData);

        // Form action'ı çağır
        const response = await fetch('/api/vehicles/create', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log('Sonuç:', result);

        if (result.error) {
            console.error('❌ HATA:', result.error);
        } else {
            console.log('✅ Başarılı!');
        }
    } catch (error) {
        console.error('❌ NETWORK HATA:', error);
    }
}

// Çalıştır
console.log('Test fonksiyonu hazır. Çalıştırmak için: testVehicleCreation()');
