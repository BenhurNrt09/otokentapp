import { getCategoryById } from '@/actions/category-actions';
import CategoryForm from '@/components/category-form';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditCategoryPage({
    params,
}: {
    params: { id: string };
}) {
    const category = await getCategoryById(params.id);

    if (!category) {
        notFound();
    }

    return (
        <div className="p-8">
            <Link href="/dashboard/vehicles/categories">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri Dön
                </Button>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Kategori Düzenle</h1>
                <p className="text-slate-600 mt-1">{category.name}</p>
            </div>

            <CategoryForm category={category} />
        </div>
    );
}
