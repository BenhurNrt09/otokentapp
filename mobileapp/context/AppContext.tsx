import React, { createContext, useState, useContext, useEffect } from 'react';
import { Vehicle } from '../types';
import * as FileSystem from 'expo-file-system/legacy';

const USER_DATA_FILE = FileSystem.documentDirectory + 'user_data.json';

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
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // User State
    const [user, setUser] = useState({
        name: 'Misafir',
        surname: 'Kullanıcı',
        email: 'Giriş Yapılmadı',
        avatar: undefined as string | undefined
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            updateUser
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
