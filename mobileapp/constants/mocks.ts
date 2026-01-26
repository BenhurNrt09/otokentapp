// Support user ID - должен совпадать с ID админа в базе
export const SUPPORT_USER_ID = '00000000-0000-0000-0000-000000000001';

export const MOCK_CHATS = [
    {
        id: SUPPORT_USER_ID,
        user: {
            id: SUPPORT_USER_ID,
            name: 'Otokent Destek',
            avatar: null, // Default icon
            online: true,
            isSupport: true,
        },
        lastMessage: 'OtoKent\'e Hoş Geldiniz!',
        timestamp: 'Bugün',
        unreadCount: 0,
        messages: []  // Messages will be dynamically loaded from Supabase
    },
];

export const QUICK_REPLIES = [
    "Hala satılık mı?",
    "Son fiyat nedir?",
    "Takas düşünür müsünüz?",
    "Aracı ne zaman görebilirim?",
    "Konum atabilir misiniz?",
];
