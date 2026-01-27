'use client';

import { Conversation } from '@/actions/message-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ConversationListProps {
    data: Conversation[];
}

export default function ConversationList({ data }: ConversationListProps) {
    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-slate-500">Henüz mesajlaşma bulunmuyor.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Kullanıcı</TableHead>
                        <TableHead>Son Mesaj</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((conv) => (
                        <TableRow key={conv.user.id} className="cursor-pointer hover:bg-slate-50">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={conv.user.avatar_url || ''} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                                            {conv.user.name?.[0]?.toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-slate-900">
                                            {conv.user.name} {conv.user.surname}
                                        </div>
                                        <div className="text-xs text-slate-500">{conv.user.email}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="max-w-md">
                                <div className="truncate text-slate-600 font-medium">
                                    {conv.lastMessage.content}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                    {conv.lastMessage.sender_id === conv.user.id ? 'Kullanıcı: ' : 'Siz: '}
                                    {conv.lastMessage.content}
                                </div>
                            </TableCell>
                            <TableCell>
                                {conv.unreadCount > 0 ? (
                                    <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                                        {conv.unreadCount} Yeni Mesaj
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="text-slate-500 bg-slate-100">
                                        Okundu
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="text-sm text-slate-600">
                                    {new Date(conv.lastMessage.created_at).toLocaleDateString('tr-TR')}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {new Date(conv.lastMessage.created_at).toLocaleTimeString('tr-TR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/dashboard/messages/${conv.user.id}`}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        Detay
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
