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
    };
    receiver?: {
        name: string | null;
        surname: string | null;
        email: string;
    };
}

export async function getMessages() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('messages')
        .select(`
            *,
            sender:sender_id(name, surname, email),
            receiver:receiver_id(name, surname, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }

    return data as Message[];
}

export async function deleteMessage(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('messages').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/messages');
}
