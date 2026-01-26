'use client';

import { useActionState } from 'react';
import { createNotification } from '@/actions/notification-actions';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface NotificationFormProps {
    users: User[];
}

export default function NotificationForm({ users }: NotificationFormProps) {
    const [state, formAction, isPending] = useActionState(createNotification, null);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Bildirim Detayları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="user_id">Kullanıcı *</Label>
                        <Select name="user_id" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Kullanıcı seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.name && user.surname
                                            ? `${user.name} ${user.surname} (${user.email})`
                                            : user.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {state?.errors?.user_id && (
                            <p className="text-sm text-red-600">{state.errors.user_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Başlık *</Label>
                        <Input id="title" name="title" placeholder="Bildirim başlığı" required />
                        {state?.errors?.title && (
                            <p className="text-sm text-red-600">{state.errors.title}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Mesaj *</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Bildirim içeriği"
                            required
                            className="min-h-[100px]"
                        />
                        {state?.errors?.message && (
                            <p className="text-sm text-red-600">{state.errors.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Bildirim Tipi *</Label>
                        <Select name="type" defaultValue="system">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">Sistem</SelectItem>
                                <SelectItem value="message">Mesaj</SelectItem>
                                <SelectItem value="vehicle">Araç</SelectItem>
                                <SelectItem value="promotion">Promosyon</SelectItem>
                            </SelectContent>
                        </Select>
                        {state?.errors?.type && (
                            <p className="text-sm text-red-600">{state.errors.type}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="action_url">Yönlendirme Linki (Opsiyonel)</Label>
                        <Input
                            id="action_url"
                            name="action_url"
                            type="url"
                            placeholder="https://..."
                        />
                        {state?.errors?.action_url && (
                            <p className="text-sm text-red-600">{state.errors.action_url}</p>
                        )}
                    </div>

                    {state?.message && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{state.message}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Gönderiliyor...' : 'Gönder'}
                        </Button>
                        <Link href="/dashboard/notifications">
                            <Button type="button" variant="outline">
                                İptal
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
