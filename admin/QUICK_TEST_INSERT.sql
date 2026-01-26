-- ACİL TEST: Manuel Araç Ekleme
-- Bu RLS'i bypass eder ve direkt veritabanına yazar
-- Eğer bu çalışırsa, sorun RLS politikalarında

INSERT INTO vehicles (
    brand, 
    model, 
    year, 
    price, 
    mileage, 
    fuel_type, 
    gear_type, 
    from_who, 
    status,
    title
) VALUES (
    'Toyota', 
    'Corolla Manuel Test', 
    2024, 
    850000, 
    0,
    'benzin', 
    'manuel', 
    'sahibinden_ilk', 
    'active',
    'MANUEL TEST ARACI - RLS Bypass'
);

-- Kontrol et
SELECT * FROM vehicles ORDER BY created_at DESC LIMIT 1;

-- Eğer araç eklendiyse, mobil app'te gözükecek!
-- Eğer hata aldıysanız, hatayı bana gönderin
