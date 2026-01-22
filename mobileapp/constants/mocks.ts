export const MOCK_CHATS = [
    {
        id: '3',
        user: {
            id: 'u3',
            name: 'Otokent Destek',
            avatar: null, // Default icon
            online: true,
            isSupport: true,
        },
        lastMessage: 'OtoKent\'e Hoş Geldiniz!',
        timestamp: 'Bugün',
        unreadCount: 0,
        messages: []  // Messages will be dynamically loaded from AsyncStorage
    },
];

export const QUICK_REPLIES = [
    "Hala satılık mı?",
    "Son fiyat nedir?",
    "Takas düşünür müsünüz?",
    "Aracı ne zaman görebilirim?",
    "Konum atabilir misiniz?",
];
