'use client';

import { Notification } from '@/actions/notification-actions';
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
import { Trash2, CheckCircle } from 'lucide-react';
import { deleteNotification, markAsRead } from '@/actions/notification-actions';
import { useState } from 'react';

interface NotificationListProps {
    data: Notification[];
}

export default function NotificationList({ data }: NotificationListProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Bu bildirimi silmek istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(id);
        try {
            await deleteNotification(id);
        } catch (error) {
            alert('Bildirim silinirken bir hata oluştu.');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        setLoading(id);
        try {
            await markAsRead(id);
        } catch (error) {
            alert('Bildirim güncellenirken bir hata oluştu.');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-slate-500">Henüz bildirim bulunmuyor.</p>
            </div>
        );
    }

    const getTypeBadge = (type: string) => {
        const colors = {
            message: 'bg-blue-100 text-blue-800',
            vehicle: 'bg-green-100 text-green-800',
            system: 'bg-orange-100 text-orange-800',
            promotion: 'bg-purple-100 text-purple-800',
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Başlık</TableHead>
                        <TableHead>Mesaj</TableHead>
                        <TableHead>Tip</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((notif) => (
                        <TableRow key={notif.id}>
                            <TableCell className="font-medium">{notif.title}</TableCell>
                            <TableCell className="max-w-md truncate">{notif.message}</TableCell>
                            <TableCell>
                                <Badge className={getTypeBadge(notif.type)}>
                                    {notif.type === 'message' ? 'Mesaj' :
                                        notif.type === 'vehicle' ? 'Araç' :
                                            notif.type === 'system' ? 'Sistem' : 'Promosyon'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {notif.is_read ? (
                                    <Badge variant="secondary">Okundu</Badge>
                                ) : (
                                    <Badge variant="default" className="bg-blue-600">Yeni</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                {new Date(notif.created_at).toLocaleDateString('tr-TR')}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {!notif.is_read && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleMarkAsRead(notif.id)}
                                            disabled={loading === notif.id}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Okundu İşaretle
                                        </Button>
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(notif.id)}
                                        disabled={loading === notif.id}
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
