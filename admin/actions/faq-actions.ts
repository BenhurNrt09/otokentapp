'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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

export async function getFAQs() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }

    return data as FAQ[];
}

export async function createFAQ(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const faq = {
        question: formData.get('question') as string,
        answer: formData.get('answer') as string,
        category: formData.get('category') as string || null,
        display_order: parseInt(formData.get('display_order') as string) || 0,
        is_active: formData.get('is_active') === 'true',
    };

    const { error } = await supabase.from('faqs').insert([faq]);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/content/faqs');
}

export async function updateFAQ(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient();

    const faq = {
        question: formData.get('question') as string,
        answer: formData.get('answer') as string,
        category: formData.get('category') as string || null,
        display_order: parseInt(formData.get('display_order') as string) || 0,
        is_active: formData.get('is_active') === 'true',
    };

    const { error } = await supabase.from('faqs').update(faq).eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/content/faqs');
}

export async function deleteFAQ(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('faqs').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/content/faqs');
}
