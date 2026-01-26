'use client';

import { Message } from '@/actions/message-actions';
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
import { Trash2, MessageSquare } from 'lucide-react';
import { deleteMessage } from '@/actions/message-actions';
import { useState } from 'react';
import Link from 'next/link';

interface MessageListProps {
    data: Message[];
}

export default function MessageList({ data }: MessageListProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(id);
        try {
            await deleteMessage(id);
        } catch (error) {
            alert('Mesaj silinirken bir hata oluştu.');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-slate-500">Henüz mesaj bulunmuyor.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Gönderen</TableHead>
                        <TableHead>Alıcı</TableHead>
                        <TableHead>Mesaj</TableHead>
                        <TableHead>Tip</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((msg) => (
                        <TableRow key={msg.id}>
                            <TableCell className="font-medium">
                                {msg.sender ? (
                                    <>
                                        {msg.sender.name} {msg.sender.surname}
                                        <div className="text-xs text-slate-500">{msg.sender.email}</div>
                                    </>
                                ) : (
                                    <span className="text-slate-400 italic">Bilinmeyen Kullanıcı</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {msg.receiver ? (
                                    <>
                                        {msg.receiver.name} {msg.receiver.surname}
                                        <div className="text-xs text-slate-500">{msg.receiver.email}</div>
                                    </>
                                ) : (
                                    <span className="text-slate-400 italic">Bilinmeyen Alıcı</span>
                                )}
                            </TableCell>
                            <TableCell className="max-w-md truncate">{msg.content}</TableCell>
                            <TableCell>
                                <Badge variant="outline">
                                    {msg.message_type === 'user' ? 'Kullanıcı' :
                                        msg.message_type === 'support' ? 'Destek' : 'Sistem'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {msg.is_read ? (
                                    <Badge variant="secondary">Okundu</Badge>
                                ) : (
                                    <Badge variant="default" className="bg-blue-600">Yeni</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                {new Date(msg.created_at).toLocaleDateString('tr-TR')}
                                <div className="text-xs text-slate-500">
                                    {new Date(msg.created_at).toLocaleTimeString('tr-TR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {msg.sender && (
                                        <Link href={`/dashboard/messages/${msg.sender?.role === 'admin' ? msg.receiver_id : msg.sender_id}`}>
                                            <Button variant="outline" size="sm">
                                                <MessageSquare className="w-4 h-4 mr-1" />
                                                Cevapla
                                            </Button>
                                        </Link>
                                    )}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(msg.id)}
                                        disabled={loading === msg.id}
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
