import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VehicleList from '@/components/vehicle-list';
import { createClient } from '@/lib/supabase/server';
import { Vehicle } from '@/types';

export const dynamic = 'force-dynamic';

export default async function VehiclesPage() {
    const supabase = await createClient();

    const { data: vehicles, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching vehicles:', error);
        return <div>Araçlar yüklenirken bir hata oluştu.</div>;
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Araçlar</h1>
                    <p className="text-slate-600">
                        Sistemdeki tüm araçları listeleyin ve yönetin
                    </p>
                </div>
                <Link href="/dashboard/vehicles/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> Yeni Araç Ekle
                    </Button>
                </Link>
            </div>

            <VehicleList data={(vehicles as Vehicle[]) || []} />
        </div>
    );
}
