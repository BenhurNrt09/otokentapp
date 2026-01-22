export const MOCK_CHATS = [
    {
        id: '1',
        user: {
            id: 'u1',
            name: 'Mehmet Demir',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            online: true,
        },
        lastMessage: 'Araç hala satılık mı?',
        timestamp: '14:30',
        unreadCount: 2,
        messages: [
            { id: 'm1', text: 'Merhaba, ilanınızla ilgileniyorum.', sender: 'other', time: '14:28', type: 'text' },
            { id: 'm2', text: 'Araç hala satılık mı?', sender: 'other', time: '14:30', type: 'text' },
        ]
    },
    {
        id: '2',
        user: {
            id: 'u2',
            name: 'Ayşe Yılmaz',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            online: false,
        },
        lastMessage: 'Tamamdır, yarın görüşmek üzere.',
        timestamp: 'Dün',
        unreadCount: 0,
        messages: [
            { id: 'm3', text: 'Konum atabilir misiniz?', sender: 'me', time: 'Yesterday', type: 'text' },
            { id: 'm4', text: 'Tamamdır, yarın görüşmek üzere.', sender: 'other', time: 'Yesterday', type: 'text' },
        ]
    },
    {
        id: '3',
        user: {
            id: 'u3',
            name: 'Otokent Destek',
            avatar: null, // Default icon
            online: true,
            isSupport: true,
        },
        lastMessage: 'Talebini aldık, inceliyoruz.',
        timestamp: 'Pzt',
        unreadCount: 0,
        messages: [
            { id: 'm5', text: 'Merhaba, şifremi değiştiremiyorum.', sender: 'me', time: 'Mon', type: 'text' },
            { id: 'm6', text: 'Talebini aldık, inceliyoruz.', sender: 'other', time: 'Mon', type: 'text' },
        ]
    },
];

export const QUICK_REPLIES = [
    "Hala satılık mı?",
    "Son fiyat nedir?",
    "Takas düşünür müsünüz?",
    "Aracı ne zaman görebilirim?",
    "Konum atabilir misiniz?",
];
