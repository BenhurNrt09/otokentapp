'use client';

import { Advertisement } from '@/actions/content-actions';
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
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { deleteAdvertisement } from '@/actions/content-actions';
import { useState } from 'react';

interface AdvertisementListProps {
    data: Advertisement[];
}

export default function AdvertisementList({ data }: AdvertisementListProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Bu reklamı silmek istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(id);
        try {
            await deleteAdvertisement(id);
        } catch (error) {
            alert('Reklam silinirken bir hata oluştu.');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-slate-500">Henüz reklam bulunmuyor.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Görsel</TableHead>
                        <TableHead>Başlık</TableHead>
                        <TableHead>Sıra</TableHead>
                        <TableHead>Tarih Aralığı</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((ad) => (
                        <TableRow key={ad.id}>
                            <TableCell>
                                <img
                                    src={ad.image_url}
                                    alt={ad.title || 'Reklam'}
                                    className="w-20 h-12 object-cover rounded"
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                {ad.title || '-'}
                                {ad.link_url && (
                                    <a
                                        href={ad.link_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-blue-600"
                                    >
                                        <ExternalLink className="w-3 h-3 inline" />
                                    </a>
                                )}
                            </TableCell>
                            <TableCell>{ad.display_order}</TableCell>
                            <TableCell className="text-sm">
                                {ad.start_date
                                    ? new Date(ad.start_date).toLocaleDateString('tr-TR')
                                    : '-'}
                                {' → '}
                                {ad.end_date
                                    ? new Date(ad.end_date).toLocaleDateString('tr-TR')
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                {ad.is_active ? (
                                    <Badge variant="default" className="bg-green-600">
                                        Aktif
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">Pasif</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Link href={`/dashboard/content/advertisements/${ad.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-1" />
                                            Düzenle
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(ad.id)}
                                        disabled={loading === ad.id}
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
