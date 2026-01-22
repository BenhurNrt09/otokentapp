'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// ============================================================================
// TYPES
// ============================================================================

export interface Advertisement {
    id: string;
    title: string | null;
    image_url: string;
    link_url: string | null;
    display_order: number;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Policy {
    id: string;
    type: 'privacy' | 'terms' | 'cookie';
    title: string;
    content: string;
    version: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ============================================================================
// SCHEMAS
// ============================================================================

const AdvertisementSchema = z.object({
    title: z.string().optional(),
    image_url: z.string().url('Geçerli bir URL girin'),
    link_url: z.string().url('Geçerli bir URL girin').optional().or(z.literal('')),
    display_order: z.coerce.number().min(0),
    is_active: z.boolean(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});

const FAQSchema = z.object({
    question: z.string().min(1, 'Soru zorunludur'),
    answer: z.string().min(1, 'Cevap zorunludur'),
    category: z.string().optional(),
    display_order: z.coerce.number().min(0),
    is_active: z.boolean(),
});

const PolicySchema = z.object({
    type: z.enum(['privacy', 'terms', 'cookie']),
    title: z.string().min(1, 'Başlık zorunludur'),
    content: z.string().min(1, 'İçerik zorunludur'),
    version: z.string().optional(),
    is_active: z.boolean(),
});

// ============================================================================
// ADVERTISEMENT ACTIONS
// ============================================================================

export async function getAdvertisements() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching advertisements:', error);
        return [];
    }

    return data as Advertisement[];
}

export async function getAdvertisementById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data as Advertisement;
}

export async function createAdvertisement(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        title: formData.get('title') || '',
        image_url: formData.get('image_url'),
        link_url: formData.get('link_url') || '',
        display_order: formData.get('display_order'),
        is_active: formData.get('is_active') === 'true',
        start_date: formData.get('start_date') || null,
        end_date: formData.get('end_date') || null,
    };

    const validatedFields = AdvertisementSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    const { error } = await supabase.from('advertisements').insert([validatedFields.data]);

    if (error) {
        return { message: 'Veritabanı hatası: ' + error.message };
    }

    revalidatePath('/dashboard/content/advertisements');
    redirect('/dashboard/content/advertisements');
}

export async function updateAdvertisement(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        title: formData.get('title') || '',
        image_url: formData.get('image_url'),
        link_url: formData.get('link_url') || '',
        display_order: formData.get('display_order'),
        is_active: formData.get('is_active') === 'true',
        start_date: formData.get('start_date') || null,
        end_date: formData.get('end_date') || null,
    };

    const validatedFields = AdvertisementSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    const { error } = await supabase
        .from('advertisements')
        .update(validatedFields.data)
        .eq('id', id);

    if (error) {
        return { message: 'Veritabanı hatası: ' + error.message };
    }

    revalidatePath('/dashboard/content/advertisements');
    redirect('/dashboard/content/advertisements');
}

export async function deleteAdvertisement(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('advertisements').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/content/advertisements');
}

// ============================================================================
// FAQ ACTIONS
// ============================================================================

export async function getFAQs() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }

    return data as FAQ[];
}

export async function getFAQById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data as FAQ;
}

export async function createFAQ(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        question: formData.get('question'),
        answer: formData.get('answer'),
        category: formData.get('category') || null,
        display_order: formData.get('display_order'),
        is_active: formData.get('is_active') === 'true',
    };

    const validatedFields = FAQSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    const { error } = await supabase.from('faqs').insert([validatedFields.data]);

    if (error) {
        return { message: 'Veritabanı hatası: ' + error.message };
    }

    revalidatePath('/dashboard/content/faqs');
    redirect('/dashboard/content/faqs');
}

export async function updateFAQ(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        question: formData.get('question'),
        answer: formData.get('answer'),
        category: formData.get('category') || null,
        display_order: formData.get('display_order'),
        is_active: formData.get('is_active') === 'true',
    };

    const validatedFields = FAQSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    const { error } = await supabase
        .from('faqs')
        .update(validatedFields.data)
        .eq('id', id);

    if (error) {
        return { message: 'Veritabanı hatası: ' + error.message };
    }

    revalidatePath('/dashboard/content/faqs');
    redirect('/dashboard/content/faqs');
}

export async function deleteFAQ(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('faqs').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/content/faqs');
}

// ============================================================================
// POLICY ACTIONS
// ============================================================================

export async function getPolicies() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('policies')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching policies:', error);
        return [];
    }

    return data as Policy[];
}

export async function getPolicyById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data as Policy;
}

export async function updatePolicy(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        type: formData.get('type'),
        title: formData.get('title'),
        content: formData.get('content'),
        version: formData.get('version') || null,
        is_active: formData.get('is_active') === 'true',
    };

    const validatedFields = PolicySchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    const { error } = await supabase
        .from('policies')
        .update(validatedFields.data)
        .eq('id', id);

    if (error) {
        return { message: 'Veritabanı hatası: ' + error.message };
    }

    revalidatePath('/dashboard/content/policies');
    redirect('/dashboard/content/policies');
}
