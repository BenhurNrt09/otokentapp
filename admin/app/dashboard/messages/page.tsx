"use client";

import ConversationList from '@/components/conversation-list';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function MessagesPage() {
    const [conversations, setConversations] = useState([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchConversations = async () => {
            // Fetch unique conversations (grouped by vehicle and user)
            // This is a simplified version; normally you'd use a robust query or RPC
            const { data } = await supabase
                .from('messages')
                .select(`
                    *,
                    sender:sender_id(email),
                    receiver:receiver_id(email),
                    vehicle:vehicle_id(brand, model, images)
                `)
                .order('created_at', { ascending: false });

            // Client-side grouping for simplicity in this repair
            const grouped = data ? Array.from(new Map(data.map((m: any) => [m.vehicle_id + m.sender_id, m])).values()) : [];
            setConversations(grouped as any);
        };

        fetchConversations();
    }, []);

    return (
        <div className="h-[calc(100vh-4rem)]">
            <ConversationList data={conversations} />
        </div>
    );
}
