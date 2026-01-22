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
            let query = supabase
                .from('vehicles')
                .select('*')
                .eq('status', 'yayinda') // Only show active vehicles
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
            {/* Search Bar removed, now in Header */}

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
