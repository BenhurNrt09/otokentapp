import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Vehicle } from '../types';
import VehicleCard from '../components/VehicleCard';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';
import AdBanner from '../components/AdBanner';

export default function HomeScreen() {
    const { searchQuery } = useApp();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [ads, setAds] = useState<any[]>([]);

    const fetchVehicles = async () => {
        try {
            setLoading(true);

            // Fetch Ads
            const { data: adsData } = await supabase
                .from('advertisements')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (adsData) setAds(adsData);

            // Fetch Vehicles
            let query = supabase
                .from('vehicles')
                .select('*')
                .eq('status', 'active') // Only show active vehicles
                .order('created_at', { ascending: false });

            if (searchQuery) {
                // Simple search on brand or model
                query = query.or(`brand.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setVehicles(data as Vehicle[]);
        } catch (error) {
            console.error(error);
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
                ListHeaderComponent={
                    <View>
                        <AdBanner data={ads} />
                    </View>
                }
                renderItem={({ item }) => <VehicleCard vehicle={item} />}
                contentContainerStyle={{ paddingBottom: 100 }}
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
