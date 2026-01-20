'use server';

import { createClient } from '@/lib/supabase/server';
import { Vehicle, VehicleFormData } from '@/types'; // This might need adjustment as VehicleFormData uses File[], we need a pure data structure for server action
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Zod schema for server-side validation
const VehicleSchema = z.object({
    brand: z.string().min(1, 'Marka zorunludur'),
    model: z.string().min(1, 'Model zorunludur'),
    year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    price: z.coerce.number().min(0),
    mileage: z.coerce.number().min(0),
    fuel_type: z.enum(['benzin', 'dizel', 'hibrit', 'elektrik']),
    gear_type: z.enum(['manuel', 'otomatik']),
    description: z.string().optional(),
    images: z.array(z.string()), // Accept array of URLs strings
    status: z.enum(['yayinda', 'satildi', 'pasif']),
});

export async function createVehicle(prevState: any, formData: FormData) {
    const supabase = await createClient();

    // Extract data from formData
    // Note: For multi-select or arrays (images), we might need to handle them carefully.
    // Assuming the client sends 'images' as a JSON string or multiple entries.
    // To simplify, let's assume the component sends ready-to-use primitive values or we use bind.
    // But standard way with formData:

    const rawData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        year: formData.get('year'),
        price: formData.get('price'),
        mileage: formData.get('mileage'),
        fuel_type: formData.get('fuel_type'),
        gear_type: formData.get('gear_type'),
        description: formData.get('description'),
        status: formData.get('status'),
        images: JSON.parse(formData.get('images') as string || '[]'),
    };

    const validatedFields = VehicleSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    const { error } = await supabase.from('vehicles').insert([
        validatedFields.data,
    ]);

    if (error) {
        console.error('Database Error:', error);
        return {
            message: 'Veritabanı hatası: ' + error.message,
        };
    }

    revalidatePath('/dashboard/vehicles');
    redirect('/dashboard/vehicles');
}

export async function updateVehicle(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        year: formData.get('year'),
        price: formData.get('price'),
        mileage: formData.get('mileage'),
        fuel_type: formData.get('fuel_type'),
        gear_type: formData.get('gear_type'),
        description: formData.get('description'),
        status: formData.get('status'),
        images: JSON.parse(formData.get('images') as string || '[]'),
    };

    const validatedFields = VehicleSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Lütfen formu kontrol edin.',
        };
    }

    try {
        const { error } = await supabase
            .from('vehicles')
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

    revalidatePath('/dashboard/vehicles');
    redirect('/dashboard/vehicles');
}

export async function deleteVehicle(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from('vehicles').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/dashboard/vehicles');
}
