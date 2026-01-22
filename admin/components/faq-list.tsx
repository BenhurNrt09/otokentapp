'use client';

import { FAQ } from '@/actions/faq-actions';
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
import { deleteFAQ } from '@/actions/faq-actions';
import { Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface FAQListProps {
    data: FAQ[];
}

export default function FAQList({ data }: FAQListProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Bu SSS\'yi silmek istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(id);
        try {
            await deleteFAQ(id);
        } catch (error) {
            alert('SSS silinirken bir hata oluştu.');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-slate-500">Henüz SSS bulunmuyor.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Soru</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Sıra</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((faq) => (
                        <TableRow key={faq.id}>
                            <TableCell className="font-medium max-w-md">
                                {faq.question}
                                <div className="text-xs text-slate-500 mt-1 truncate">
                                    {faq.answer}
                                </div>
                            </TableCell>
                            <TableCell>
                                {faq.category ? (
                                    <Badge variant="outline">{faq.category}</Badge>
                                ) : (
                                    <span className="text-slate-400">-</span>
                                )}
                            </TableCell>
                            <TableCell>{faq.display_order}</TableCell>
                            <TableCell>
                                {faq.is_active ? (
                                    <Badge variant="default" className="bg-green-600">Aktif</Badge>
                                ) : (
                                    <Badge variant="secondary">Pasif</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                    <Link href={`/dashboard/content/faqs/${faq.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Edit2 className="w-4 h-4 mr-1" />
                                            Düzenle
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(faq.id)}
                                        disabled={loading === faq.id}
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
