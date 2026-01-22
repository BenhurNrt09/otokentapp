import React, { createContext, useState, useContext, useEffect } from 'react';
import { Vehicle } from '../types';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_FILE = FileSystem.documentDirectory + 'user_data.json';

type Notification = {
    id: string;
    type: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: string;
    color: string;
};

type AppContextType = {
    favorites: string[]; // Store IDs of favorite vehicles
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    user: { name: string; surname: string; email: string; avatar?: string };
    isLoggedIn: boolean;
    login: (userData?: Partial<{ name: string; surname: string; email: string; avatar: string }>) => void;
    logout: () => void;
    updateUser: (data: Partial<{ name: string; surname: string; email: string; avatar: string }>) => void;
    notifications: Notification[];
    markAllNotificationsAsRead: () => void;
    unreadNotificationCount: number;
    unreadMessageCount: number;
    currentAdIndex: number;
    setCurrentAdIndex: (index: number) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    // User State
    const [user, setUser] = useState({
        name: 'Misafir',
        surname: 'Kullanıcı',
        email: 'Giriş Yapılmadı',
        avatar: undefined as string | undefined
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasWelcomedUser, setHasWelcomedUser] = useState(false);

    // Auto-rotate ads every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAdIndex(prev => (prev + 1) % 2); // 2 ads total
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(USER_DATA_FILE);
            if (fileInfo.exists) {
                const content = await FileSystem.readAsStringAsync(USER_DATA_FILE);
                const data = JSON.parse(content);
                if (data && data.email !== 'Giriş Yapılmadı') {
                    setUser(data);
                    setIsLoggedIn(true);
                }
            }
        } catch (e) {
            console.log('Error loading user data', e);
        }
    };

    const saveUserData = async (userData: any) => {
        try {
            await FileSystem.writeAsStringAsync(USER_DATA_FILE, JSON.stringify(userData));
        } catch (e) {
            console.log('Error saving user data', e);
        }
    };

    const login = (userData?: Partial<{ name: string; surname: string; email: string; avatar: string }>) => {
        const defaultUser = {
            name: 'Ahmet',
            surname: 'Yılmaz',
            email: 'ahmet@otokent.com',
            avatar: undefined
        };
        const newUser = { ...defaultUser, ...userData };
        setUser(newUser);
        setIsLoggedIn(true);
        saveUserData(newUser);

        // Check if this is the first login
        checkAndSendWelcomeNotification(newUser);
    };

    const checkAndSendWelcomeNotification = async (userData: any) => {
        try {
            const welcomed = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'welcomed.json');
            if (!welcomed.exists) {
                // First time user - send welcome notification
                const welcomeNotification: Notification = {
                    id: Date.now().toString(),
                    type: 'welcome',
                    title: 'OtoKent\'e Hoş Geldiniz!',
                    message: `Merhaba ${userData.name}! OtoKent ailesine katıldığınız için teşekkür ederiz.`,
                    time: 'Şimdi',
                    read: false,
                    icon: 'checkmark-circle',
                    color: '#10b981'
                };
                setNotifications([welcomeNotification]);

                // Also create welcome message in OtoKent Destek chat
                const welcomeMessage = {
                    id: 'm1',
                    text: `OtoKent'e Hoş Geldiniz ${userData.name}! Herhangi bir destek veya sorununuz olduğunda lütfen bize bildirin, ekiplerimiz size kısa sürede dönecektir.`,
                    sender: 'other',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type: 'text'
                };

                // Save welcome message to OtoKent Destek chat
                await AsyncStorage.setItem('chat_3_messages', JSON.stringify([welcomeMessage]));

                await FileSystem.writeAsStringAsync(
                    FileSystem.documentDirectory + 'welcomed.json',
                    JSON.stringify({ welcomed: true })
                );
            }
        } catch (e) {
            console.log('Error checking welcome status', e);
        }
    };

    const markAllNotificationsAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    };

    const logout = () => {
        const guestUser = { name: 'Misafir', surname: 'Kullanıcı', email: 'Giriş Yapılmadı', avatar: undefined };
        setUser(guestUser);
        setIsLoggedIn(false);
        saveUserData(guestUser);
    };

    const updateUser = (data: Partial<{ name: string; surname: string; email: string; avatar: string }>) => {
        setUser(prev => {
            const newData = { ...prev, ...data };
            saveUserData(newData);
            return newData;
        });
    };

    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    const isFavorite = (id: string) => favorites.includes(id);

    const unreadNotificationCount = notifications.filter(n => !n.read).length;
    // For now, hardcode unread message count. In production, this would come from MOCK_CHATS
    const unreadMessageCount = 0; // Will be updated when messages arrive

    return (
        <AppContext.Provider value={{
            favorites,
            toggleFavorite,
            isFavorite,
            searchQuery,
            setSearchQuery,
            user,
            isLoggedIn,
            login,
            logout,
            updateUser,
            notifications,
            markAllNotificationsAsRead,
            unreadNotificationCount,
            unreadMessageCount,
            currentAdIndex,
            setCurrentAdIndex
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
