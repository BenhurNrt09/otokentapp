import React, { createContext, useState, useContext, useEffect } from 'react';
import { Vehicle } from '../types';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';
import type { RealtimeChannel } from '@supabase/supabase-js';

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

type Advertisement = {
    id: string;
    title: string;
    image_url: string;
    link_url: string | null;
};

type AppContextType = {
    favorites: string[];
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    user: { id: string; name: string; surname: string; email: string; avatar?: string; role: string };
    isLoggedIn: boolean;
    login: (userData?: Partial<{ id: string; name: string; surname: string; email: string; avatar: string; role: string }>) => void;
    logout: () => void;
    updateUser: (data: Partial<{ id: string; name: string; surname: string; email: string; avatar: string; role: string }>) => void;
    notifications: Notification[];
    markAllNotificationsAsRead: () => void;
    unreadNotificationCount: number;
    unreadMessageCount: number;
    advertisements: Advertisement[];
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
        id: 'guest',
        name: 'Misafir',
        surname: 'Kullanıcı',
        email: 'Giriş Yapılmadı',
        avatar: undefined as string | undefined,
        role: 'user'
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Handle init session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                handleAuthChange(session.user);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                handleAuthChange(session.user);
            } else {
                clearUserData();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleAuthChange = async (supabaseUser: any) => {
        try {
            // Get additional user data from public.users table
            const { data: publicUser, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();

            const finalUser = {
                id: supabaseUser.id,
                name: publicUser?.name || supabaseUser.user_metadata?.name || 'Kullanıcı',
                surname: publicUser?.surname || supabaseUser.user_metadata?.surname || '',
                email: supabaseUser.email || '',
                avatar: publicUser?.avatar_url || undefined,
                role: publicUser?.role || 'user'
            };

            setUser(finalUser);
            setIsLoggedIn(true);
            saveUserData(finalUser);

            // Welcome check
            checkAndSendWelcomeNotification(finalUser);
        } catch (e) {
            console.error('Error handling auth change:', e);
        }
    };

    const clearUserData = () => {
        const guestUser = { id: 'guest', name: 'Misafir', surname: 'Kullanıcı', email: 'Giriş Yapılmadı', avatar: undefined, role: 'user' };
        setUser(guestUser);
        setIsLoggedIn(false);
        saveUserData(guestUser);
    };
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [messagesChannel, setMessagesChannel] = useState<RealtimeChannel | null>(null);
    const [notificationsChannel, setNotificationsChannel] = useState<RealtimeChannel | null>(null);

    // Auto-rotate ads every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAdIndex(prev => (prev + 1) % 2); // 2 ads total
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        loadUserData();
        loadNotificationsFromSupabase();
        loadAdvertisements();
    }, []);

    const loadAdvertisements = async () => {
        try {
            const { data, error } = await supabase
                .from('advertisements')
                .select('id, title, image_url, link_url')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (data) {
                setAdvertisements(data);
            }
        } catch (e) {
            console.log('Error loading ads', e);
        }
    };

    // Subscribe to real-time updates when user logs in
    useEffect(() => {
        if (isLoggedIn && user.email !== 'Giriş Yapılmadı') {
            subscribeToNotifications();
            subscribeToMessages();
        }
        return () => {
            if (messagesChannel) {
                supabase.removeChannel(messagesChannel);
            }
            if (notificationsChannel) {
                supabase.removeChannel(notificationsChannel);
            }
        };
    }, [isLoggedIn, user.email]);

    const loadUserData = async () => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(USER_DATA_FILE);
            if (fileInfo.exists) {
                const content = await FileSystem.readAsStringAsync(USER_DATA_FILE);
                const data = JSON.parse(content);
                if (data && data.email !== 'Giriş Yapılmadı') {
                    setUser({
                        id: data.id || 'guest',
                        name: data.name || 'Misafir',
                        surname: data.surname || 'Kullanıcı',
                        email: data.email || 'Giriş Yapılmadı',
                        avatar: data.avatar,
                        role: data.role || 'user'
                    });
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

    const login = async (userData?: Partial<{ id: string; name: string; surname: string; email: string; avatar: string; role: string }>) => {
        // No longer used as a generic login, auth is handled by Supabase Auth listeners
        // This is kept for compatibility if called elsewhere but ideally removed
        if (userData?.email) {
            handleAuthChange(userData as any);
        }
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

    const markAllNotificationsAsRead = async () => {
        if (!isLoggedIn || !user.id || user.id === 'guest') {
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
            return;
        }

        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (error) throw error;
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        } catch (e) {
            console.error('Error marking notifications as read:', e);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        clearUserData();
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

    // Load notifications from Supabase
    const loadNotificationsFromSupabase = async () => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                console.error('Error loading notifications:', error);
                return;
            }

            if (data) {
                const mappedNotifications: Notification[] = data.map(notif => ({
                    id: notif.id,
                    type: notif.type,
                    title: notif.title,
                    message: notif.message,
                    time: new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    read: notif.is_read,
                    icon: notif.type === 'message' ? 'mail' : notif.type === 'vehicle' ? 'car' : 'notifications',
                    color: notif.type === 'message' ? '#3b82f6' : notif.type === 'vehicle' ? '#10b981' : '#f59e0b'
                }));
                setNotifications(mappedNotifications);
            }
        } catch (e) {
            console.error('Error loading notifications:', e);
        }
    };

    // Subscribe to real-time notifications
    const subscribeToNotifications = () => {
        const channel = supabase
            .channel('notifications_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications'
                },
                (payload) => {
                    console.log('Notification change:', payload);
                    loadNotificationsFromSupabase();
                }
            )
            .subscribe();

        setNotificationsChannel(channel);
    };

    // Subscribe to real-time messages
    const subscribeToMessages = () => {
        const channel = supabase
            .channel('messages_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages'
                },
                (payload) => {
                    console.log('Message change:', payload);
                    // You can add logic here to update unread count
                }
            )
            .subscribe();

        setMessagesChannel(channel);
    };

    const fetchUnreadMessageCount = async () => {
        if (!isLoggedIn || user.id === 'guest') return;
        try {
            const { count, error } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('receiver_id', user.id)
                .eq('is_read', false);

            if (!error && count !== null) {
                setUnreadMessageCount(count);
            }
        } catch (e) {
            console.log('Error fetching unread message count', e);
        }
    };

    const unreadNotificationCount = notifications.filter(n => !n.read).length;

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
            advertisements,
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
