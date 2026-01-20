import VehicleForm from '@/components/vehicle-form';
import { createClient } from '@/lib/supabase/server';
import { Vehicle } from '@/types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditVehiclePage({ params }: PageProps) {
    // Await params properly for Next.js 15+
    const { id } = await params;
    const supabase = await createClient();

    const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !vehicle) {
        notFound();
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Araç Düzenle</h1>
                    <p className="text-slate-600">
                        {vehicle.brand} {vehicle.model} aracını düzenliyorsunuz
                    </p>
                </div>
            </div>
            <VehicleForm initialData={vehicle as Vehicle} />
        </div>
    );
}
