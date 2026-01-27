'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Advertisement {
    id: string;
    title: string;
    image_url: string;
    link_url: string | null;
    is_active: boolean;
    display_order: number;
    created_at: string;
}

export async function getAdvertisements() {
    const supabase = await createClient();

    // Admins see all, sorted by order
    const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching ads:', error);
        return [];
    }

    return data as Advertisement[];
}

export async function createAdvertisement(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const link_url = formData.get('link_url') as string;
    const image_url = formData.get('image_url') as string;
    const is_active = formData.get('is_active') === 'true';
    const display_order = parseInt(formData.get('display_order') as string || '0');

    const { error } = await supabase
        .from('advertisements')
        .insert({
            title,
            link_url,
            image_url,
            is_active,
            display_order
        });

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/content/advertisements');
}

export async function updateAdvertisement(id: string, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get('title') as string;
    const link_url = formData.get('link_url') as string;
    const image_url = formData.get('image_url') as string;
    const is_active = formData.get('is_active') === 'true';
    const display_order = parseInt(formData.get('display_order') as string || '0');

    const { error } = await supabase
        .from('advertisements')
        .update({
            title,
            link_url,
            image_url,
            is_active,
            display_order
        })
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/content/advertisements');
}

export async function deleteAdvertisement(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('advertisements').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/content/advertisements');
}

export async function toggleAdvertisementStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('advertisements')
        .update({ is_active: !currentStatus })
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/content/advertisements');
}
