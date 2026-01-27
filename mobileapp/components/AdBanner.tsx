import React, { useRef, useEffect } from 'react';
import { View, Image, Dimensions, TouchableOpacity, Linking, Text, FlatList, ViewToken } from 'react-native';

import { Advertisement } from '../types';

interface AdBannerProps {
    data: Advertisement[];
}

export default function AdBanner({ data }: AdBannerProps) {
    const width = Dimensions.get('window').width;
    const height = width / 2.5; // Aspect ratio
    const flatListRef = useRef<FlatList>(null);
    const currentIndexRef = useRef(0);

    const handlePress = (url?: string) => {
        if (url) {
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        }
    };

    // Auto-scroll effect
    useEffect(() => {
        if (!data || data.length <= 1) return;

        const interval = setInterval(() => {
            currentIndexRef.current = (currentIndexRef.current + 1) % data.length;
            flatListRef.current?.scrollToIndex({
                index: currentIndexRef.current,
                animated: true,
            });
        }, 10000); // Auto-scroll every 10 seconds

        return () => clearInterval(interval);
    }, [data]);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            currentIndexRef.current = viewableItems[0].index;
        }
    });

    if (!data || data.length === 0) return null;

    return (
        <View className="mb-4" style={{ height }}>
            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                    });
                }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => handlePress(item.link_url)}
                        style={{ width }}
                        className="px-0"
                    >
                        <View className="shadow-lg bg-white h-full relative">
                            <Image
                                source={{ uri: item.image_url }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />
                            {item.title && (
                                <View className="absolute bottom-0 left-0 right-0 bg-black/40 p-2">
                                    <Text className="text-white text-xs font-bold truncate">{item.title}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
