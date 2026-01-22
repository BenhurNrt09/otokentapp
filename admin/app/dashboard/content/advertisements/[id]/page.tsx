import { getAdvertisementById } from '@/actions/content-actions';
import AdvertisementForm from '@/components/content/advertisement-form';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditAdvertisementPage({
    params,
}: {
    params: { id: string };
}) {
    const advertisement = await getAdvertisementById(params.id);

    if (!advertisement) {
        notFound();
    }

    return (
        <div className="p-8">
            <Link href="/dashboard/content/advertisements">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri Dön
                </Button>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Reklam Düzenle</h1>
            </div>

            <AdvertisementForm advertisement={advertisement} />
        </div>
    );
}
