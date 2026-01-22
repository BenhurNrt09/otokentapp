import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ToastProps {
    visible: boolean;
    message: string;
    type: 'success' | 'error';
    onHide: () => void;
}

export default function Toast({ visible, message, type, onHide }: ToastProps) {
    const translateY = new Animated.Value(-100);

    useEffect(() => {
        if (visible) {
            // Slide in
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }).start();

            // Auto dismiss after 4 seconds
            const timer = setTimeout(() => {
                // Slide out
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => onHide());
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    const backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
    const iconName = type === 'success' ? 'checkmark-circle' : 'close-circle';

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor, transform: [{ translateY }] }
            ]}
        >
            <Ionicons name={iconName} size={24} color="white" />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 9999,
        gap: 12,
    },
    message: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
    },
});
