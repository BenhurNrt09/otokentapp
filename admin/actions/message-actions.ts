'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    vehicle_id: string | null;
    content: string;
    is_read: boolean;
    message_type: 'user' | 'support' | 'system';
    created_at: string;
    sender?: {
        name: string | null;
        surname: string | null;
        email: string;
        role: string;
    };
    receiver?: {
        name: string | null;
        surname: string | null;
        email: string;
        role: string;
    };
}

export async function getMessages() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:sender_id(name, surname, email, role),
            receiver:receiver_id(name, surname, email, role)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }

    return data as Message[];
}


export interface Conversation {
    user: {
        id: string;
        name: string | null;
        surname: string | null;
        email: string;
        avatar_url: string | null;
    };
    lastMessage: {
        content: string;
        created_at: string;
        is_read: boolean;
        sender_id: string;
    };
    unreadCount: number;
}

export async function getConversations() {
    const supabase = await createClient();

    // We want conversations between ANY user and the SUPPORT user (or any admin)
    // But primarily we care about unique users who have MESSAGES
    // Since Supabase doesn't support complex GROUP BY in client easily without a view,
    // we'll fetch latest messages and aggregate in JS for now or use a view if performance is key.
    // For MVP/lower scale, JS aggregation is fine.

    const { data: messages, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:sender_id(id, name, surname, email, avatar_url, role),
            receiver:receiver_id(id, name, surname, email, avatar_url, role)
        `)
        .order('created_at', { ascending: false })
        .limit(500); // Fetch reasonable amount of recent history

    if (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }

    const conversationsMap = new Map<string, Conversation>();
    const SUPPORT_ID = '00000000-0000-0000-0000-000000000001';

    messages?.forEach((msg) => {
        // Identify the "Other" user (not the support/system user)
        // If sender is support/admin, other is receiver.
        // If receiver is support/admin, other is sender.

        let otherUser;
        if (msg.sender_id === SUPPORT_ID) {
            otherUser = msg.receiver;
        } else if (msg.receiver_id === SUPPORT_ID) {
            otherUser = msg.sender;
        } else {
            // Include other admins' interactions or direct user-to-user if visible
            // For now, let's treat the currently logged in admin as "Self" too
            otherUser = msg.sender; // Default fall back
        }

        // Ideally we filter for messages involving the Support ID or the current Admin
        // Simplify: If message involves Support ID, it's a support chat.
        const isSupportChat = msg.sender_id === SUPPORT_ID || msg.receiver_id === SUPPORT_ID;

        if (!isSupportChat) return; // Skip non-support chats for this view?
        // Or keep them? Let's keep specific filtering logic:

        const otherId = msg.sender_id === SUPPORT_ID ? msg.receiver_id : msg.sender_id;
        // The user object might reside in msg.sender or msg.receiver
        const otherUserObj = msg.sender_id === SUPPORT_ID ? msg.receiver : msg.sender;

        if (!conversationsMap.has(otherId)) {
            conversationsMap.set(otherId, {
                user: otherUserObj,
                lastMessage: {
                    content: msg.content,
                    created_at: msg.created_at,
                    is_read: msg.is_read,
                    sender_id: msg.sender_id
                },
                unreadCount: 0
            });
        }

        const conv = conversationsMap.get(otherId)!;
        if (msg.receiver_id === SUPPORT_ID && !msg.is_read) {
            conv.unreadCount++;
        }
    });

    return Array.from(conversationsMap.values());
}

export async function sendSupportMessage(receiverId: string, content: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('send_support_message', {
        p_receiver_id: receiverId,
        p_content: content
    });

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/messages');
    revalidatePath(`/dashboard/messages/${receiverId}`);
    return data;
}

export async function deleteMessage(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('messages').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/messages');
}

