'use server';

import { createClient } from '@/lib/supabase/server';
import { User, UserFormData } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Zod schema for user validation
const UserSchema = z.object({
    email: z.string().email('Geçerli bir e-posta adresi girin'),
    name: z.string().min(1, 'Ad zorunludur'),
    surname: z.string().min(1, 'Soyad zorunludur'),
    phone: z.string().min(10, 'Geçerli bir telefon numarası girin').optional(),
    role: z.enum(['user', 'admin', 'moderator']),
    is_active: z.boolean(),
});

export async function getUsers(includeDeleted: boolean = false) {
    const supabase = await createClient();

    let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (!includeDeleted) {
        query = query.is('deleted_at', null);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }

    return data as User[];
}

export async function getUserById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching user:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
        });
        return null;
    }

    return data as User;
}

export async function updateUser(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        email: formData.get('email'),
        name: formData.get('name'),
        surname: formData.get('surname'),
        phone: formData.get('phone'),
        role: formData.get('role'),
        is_active: formData.get('is_active') === 'true',
    };

    const validatedFields = UserSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    try {
        const { error } = await supabase
            .from('users')
            .update(validatedFields.data)
            .eq('id', id);

        if (error) {
            return {
                message: 'Veritabanı hatası: ' + error.message,
            };
        }
    } catch (e) {
        return {
            message: 'Beklenmeyen bir hata oluştu.'
        }
    }

    revalidatePath('/dashboard/users');
    redirect('/dashboard/users');
}

export async function softDeleteUser(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('users')
        .update({
            deleted_at: new Date().toISOString(),
            is_active: false,
        })
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/users');
}

export async function restoreUser(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('users')
        .update({
            deleted_at: null,
            is_active: true,
        })
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/users');
}

export async function createUser(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        email: formData.get('email'),
        name: formData.get('name'),
        surname: formData.get('surname'),
        phone: formData.get('phone'),
        role: formData.get('role'),
        is_active: formData.get('is_active') === 'true',
    };

    const validatedFields = UserSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    const { error } = await supabase.from('users').insert([
        validatedFields.data,
    ]);

    if (error) {
        console.error('Database Error:', error);
        return {
            message: 'Veritabanı hatası: ' + error.message,
        };
    }

    revalidatePath('/dashboard/users');
    redirect('/dashboard/users');
}
