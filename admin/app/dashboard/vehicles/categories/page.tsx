import { getCategories } from '@/actions/category-actions';
import CategoryList from '@/components/category-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Araç Kategorileri</h1>
                    <p className="text-slate-600 mt-1">
                        Araç kategorilerini yönetin
                    </p>
                </div>
                <Link href="/dashboard/vehicles/categories/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> Yeni Kategori Ekle
                    </Button>
                </Link>
            </div>

            <CategoryList data={categories} />
        </div>
    );
}
