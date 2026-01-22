import { getAdvertisements } from '@/actions/content-actions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import AdvertisementList from '@/components/content/advertisement-list';

export const dynamic = 'force-dynamic';

export default async function AdvertisementsPage() {
    const advertisements = await getAdvertisements();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Reklam Yönetimi</h1>
                    <p className="text-slate-600 mt-1">
                        Mobil uygulamada gösterilecek reklamları yönetin
                    </p>
                </div>
                <Link href="/dashboard/content/advertisements/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> Yeni Reklam Ekle
                    </Button>
                </Link>
            </div>

            <AdvertisementList data={advertisements} />
        </div>
    );
}
