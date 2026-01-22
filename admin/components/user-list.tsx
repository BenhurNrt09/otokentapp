'use client';

import { User } from '@/types';
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
import { Edit, Trash2, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { softDeleteUser, restoreUser } from '@/actions/user-actions';
import { useState } from 'react';

interface UserListProps {
    data: User[];
}

export default function UserList({ data }: UserListProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(id);
        try {
            await softDeleteUser(id);
        } catch (error) {
            alert('Kullanıcı silinirken bir hata oluştu.');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    const handleRestore = async (id: string) => {
        setLoading(id);
        try {
            await restoreUser(id);
        } catch (error) {
            alert('Kullanıcı geri yüklenirken bir hata oluştu.');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-slate-500">Henüz kullanıcı bulunmuyor.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ad Soyad</TableHead>
                        <TableHead>E-posta</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Kayıt Tarihi</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">
                                {user.name || ''} {user.surname || ''}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone || '-'}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        user.role === 'admin'
                                            ? 'default'
                                            : user.role === 'moderator'
                                                ? 'secondary'
                                                : 'outline'
                                    }
                                >
                                    {user.role === 'admin'
                                        ? 'Admin'
                                        : user.role === 'moderator'
                                            ? 'Moderatör'
                                            : 'Kullanıcı'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {user.deleted_at ? (
                                    <Badge variant="destructive">Silinmiş</Badge>
                                ) : user.is_active ? (
                                    <Badge variant="default" className="bg-green-600">
                                        Aktif
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary">Pasif</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                {new Date(user.created_at).toLocaleDateString('tr-TR')}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {!user.deleted_at ? (
                                        <>
                                            <Link href={`/dashboard/users/${user.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Düzenle
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(user.id)}
                                                disabled={loading === user.id}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Sil
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRestore(user.id)}
                                            disabled={loading === user.id}
                                        >
                                            <RotateCcw className="w-4 h-4 mr-1" />
                                            Geri Yükle
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
