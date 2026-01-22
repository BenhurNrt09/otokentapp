'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const CategorySchema = z.object({
    name: z.string().min(1, 'Kategori adı zorunludur'),
    slug: z.string().min(1, 'Slug zorunludur'),
    icon: z.string().optional(),
    display_order: z.coerce.number().min(0),
    is_active: z.boolean(),
});

export async function getCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data as Category[];
}

export async function getCategoryById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data as Category;
}

export async function createCategory(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        icon: formData.get('icon') || null,
        display_order: formData.get('display_order'),
        is_active: formData.get('is_active') === 'true',
    };

    const validatedFields = CategorySchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    const { error } = await supabase.from('categories').insert([validatedFields.data]);

    if (error) {
        return { message: 'Veritabanı hatası: ' + error.message };
    }

    revalidatePath('/dashboard/vehicles/categories');
    redirect('/dashboard/vehicles/categories');
}

export async function updateCategory(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        icon: formData.get('icon') || null,
        display_order: formData.get('display_order'),
        is_active: formData.get('is_active') === 'true',
    };

    const validatedFields = CategorySchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    const { error } = await supabase
        .from('categories')
        .update(validatedFields.data)
        .eq('id', id);

    if (error) {
        return { message: 'Veritabanı hatası: ' + error.message };
    }

    revalidatePath('/dashboard/vehicles/categories');
    redirect('/dashboard/vehicles/categories');
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/dashboard/vehicles/categories');
}
