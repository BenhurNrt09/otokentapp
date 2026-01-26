'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'message' | 'vehicle' | 'system' | 'promotion';
    is_read: boolean;
    action_url: string | null;
    created_at: string;
}

const NotificationSchema = z.object({
    user_id: z.string().uuid('Geçerli bir kullanıcı ID\'si girin'),
    title: z.string().min(1, 'Başlık zorunludur'),
    message: z.string().min(1, 'Mesaj zorunludur'),
    type: z.enum(['message', 'vehicle', 'system', 'promotion']),
    action_url: z.string().url('Geçerli bir URL girin').optional().or(z.literal('')).nullable(),
});

export async function getNotifications() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }

    return data as Notification[];
}

export async function createNotification(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        user_id: formData.get('user_id'),
        title: formData.get('title'),
        message: formData.get('message'),
        type: formData.get('type'),
        action_url: formData.get('action_url') ? formData.get('action_url') : null,
    };

    const validatedFields = NotificationSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    const { error } = await supabase.from('notifications').insert([
        {
            ...validatedFields.data,
            is_read: false,
        },
    ]);

    if (error) {
        return { message: 'Veritabanı hatası: ' + error.message };
    }

    revalidatePath('/dashboard/notifications');
}

export async function markAsRead(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/notifications');
}

export async function deleteNotification(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('notifications').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/notifications');
}
