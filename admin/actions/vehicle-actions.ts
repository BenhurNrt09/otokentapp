'use server';

import { createClient } from '@/lib/supabase/server';
import { Vehicle } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Zod schema for server-side validation
const VehicleSchema = z.object({
    brand: z.string().min(1, 'Marka zorunludur'),
    model: z.string().min(1, 'Model zorunludur'),
    series: z.string().optional(),
    year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    price: z.coerce.number().min(0),
    mileage: z.coerce.number().min(0),
    fuel_type: z.enum(['benzin', 'dizel', 'hibrit', 'elektrik']),
    gear_type: z.enum(['manuel', 'otomatik']),
    body_type: z.string().optional(),
    engine_capacity: z.string().optional(),
    engine_power: z.string().optional(),
    drive_type: z.string().optional(),
    color: z.string().optional(),
    warranty: z.coerce.boolean(),
    heavy_damage_record: z.coerce.boolean(),
    is_disabled_friendly: z.coerce.boolean(),
    exchangeable: z.coerce.boolean(),
    video_call_available: z.coerce.boolean(),
    from_who: z.enum(['owner', 'dealer', 'gallery']),
    description: z.string().optional(),
    images: z.array(z.string()),
    expertise_data: z.any(),
    status: z.enum(['yayinda', 'satildi', 'pasif']),
});

export async function createVehicle(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        series: formData.get('series'),
        year: formData.get('year'),
        price: formData.get('price'),
        mileage: formData.get('mileage'),
        fuel_type: formData.get('fuel_type'),
        gear_type: formData.get('gear_type'),
        body_type: formData.get('body_type'),
        engine_capacity: formData.get('engine_capacity'),
        engine_power: formData.get('engine_power'),
        drive_type: formData.get('drive_type'),
        color: formData.get('color'),
        warranty: formData.get('warranty') === 'true',
        heavy_damage_record: formData.get('heavy_damage_record') === 'true',
        is_disabled_friendly: formData.get('is_disabled_friendly') === 'true',
        exchangeable: formData.get('exchangeable') === 'true',
        video_call_available: formData.get('video_call_available') === 'true',
        from_who: formData.get('from_who'),
        description: formData.get('description'),
        status: formData.get('status'),
        images: JSON.parse(formData.get('images') as string || '[]'),
        expertise_data: JSON.parse(formData.get('expertise_data') as string || '{}'),
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
        series: formData.get('series'),
        year: formData.get('year'),
        price: formData.get('price'),
        mileage: formData.get('mileage'),
        fuel_type: formData.get('fuel_type'),
        gear_type: formData.get('gear_type'),
        body_type: formData.get('body_type'),
        engine_capacity: formData.get('engine_capacity'),
        engine_power: formData.get('engine_power'),
        drive_type: formData.get('drive_type'),
        color: formData.get('color'),
        warranty: formData.get('warranty') === 'true',
        heavy_damage_record: formData.get('heavy_damage_record') === 'true',
        is_disabled_friendly: formData.get('is_disabled_friendly') === 'true',
        exchangeable: formData.get('exchangeable') === 'true',
        video_call_available: formData.get('video_call_available') === 'true',
        from_who: formData.get('from_who'),
        description: formData.get('description'),
        status: formData.get('status'),
        images: JSON.parse(formData.get('images') as string || '[]'),
        expertise_data: JSON.parse(formData.get('expertise_data') as string || '{}'),
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
