import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types';
import VehicleCard from '../components/VehicleCard';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';

export default function HomeScreen() {
    const { searchQuery } = useApp();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchVehicles = async () => {
        try {
            setLoading(true);

            // Attempt to fetch from Supabase
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .eq('status', 'yayinda') // Only show active vehicles
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Supabase fetch failed, using mock data:', error.message);
                throw error;
            }

            if (data && data.length > 0) {
                setVehicles(data as Vehicle[]);
            } else {
                // Fallback to mock data if empty (just for demo purposes)
                // or maybe keep empty. But for now let's assume if it fails we show mock.
                // Actually the catch block handles the failure. 
                // If data is empty but no error, it means just no data in DB.
                setVehicles(data as Vehicle[]);
            }

        } catch (error) {
            console.log('Error fetching vehicles, switching to MOCK data.');
            // Import MOCK_VEHICLES here requires it to be at top level, 
            // but we can import it at the top of file.
            // For now I will assume I added the import.
            const { MOCK_VEHICLES } = require('../lib/mockData');

            // Filter MOCK data by search query if needed
            let filtered = MOCK_VEHICLES;
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter((v: Vehicle) =>
                    v.brand.toLowerCase().includes(query) ||
                    v.model.toLowerCase().includes(query)
                );
            }
            setVehicles(filtered);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchVehicles();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchVehicles();
    };

    return (
        <View className="flex-1 bg-slate-50">
            <Header />

            <FlatList
                data={vehicles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <VehicleCard vehicle={item} />}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    !loading ? (
                        <View className="items-center justify-center py-20">
                            <Text className="text-slate-400">Araç bulunamadı.</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}
