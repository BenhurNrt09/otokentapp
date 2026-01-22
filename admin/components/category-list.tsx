'use client';

import { Category } from '@/actions/category-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteCategory } from '@/actions/category-actions';
import { useState } from 'react';

interface CategoryListProps {
    data: Category[];
}

export default function CategoryList({ data }: CategoryListProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(id);
        try {
            await deleteCategory(id);
        } catch (error) {
            alert('Kategori silinirken bir hata oluştu.');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-slate-500">Henüz kategori bulunmuyor.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>İsim</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>İkon</TableHead>
                        <TableHead>Sıralama</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell>
                                <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                                    {category.slug}
                                </code>
                            </TableCell>
                            <TableCell>{category.icon || '-'}</TableCell>
                            <TableCell>{category.display_order}</TableCell>
                            <TableCell>
                                {category.is_active ? (
                                    <Badge variant="default" className="bg-green-600">
                                        Aktif
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">Pasif</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Link href={`/dashboard/vehicles/categories/${category.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-1" />
                                            Düzenle
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(category.id)}
                                        disabled={loading === category.id}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Sil
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
