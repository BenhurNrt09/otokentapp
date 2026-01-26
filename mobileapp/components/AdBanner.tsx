import React from 'react';
import { View, Image, Dimensions, TouchableOpacity, Linking, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

interface Advertisement {
    id: string;
    title: string;
    image_url: string;
    link_url?: string;
}

interface AdBannerProps {
    data: Advertisement[];
}

export default function AdBanner({ data }: AdBannerProps) {
    const width = Dimensions.get('window').width;
    const height = width / 2.5; // Aspect ratio

    if (!data || data.length === 0) return null;

    const handlePress = (url?: string) => {
        if (url) {
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        }
    };

    return (
        <View className="mb-4">
            <Carousel
                loop
                width={width}
                height={height}
                autoPlay={data.length > 1}
                data={data}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => handlePress(item.link_url)}
                        className="px-4"
                    >
                        <View className="rounded-xl overflow-hidden shadow-lg bg-white h-full relative">
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
