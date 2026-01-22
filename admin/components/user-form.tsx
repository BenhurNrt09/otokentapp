'use client';

import { useActionState } from 'react';
import { updateUser } from '@/actions/user-actions';
import { User, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserFormProps {
    user: User;
}

export default function UserForm({ user }: UserFormProps) {
    const updateUserWithId = updateUser.bind(null, user.id);
    const [state, formAction, isPending] = useActionState(updateUserWithId, null);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Kullanıcı Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Ad *</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={user.name || ''}
                                required
                            />
                            {state?.errors?.name && (
                                <p className="text-sm text-red-600">{state.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="surname">Soyad *</Label>
                            <Input
                                id="surname"
                                name="surname"
                                defaultValue={user.surname || ''}
                                required
                            />
                            {state?.errors?.surname && (
                                <p className="text-sm text-red-600">{state.errors.surname}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-posta *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={user.email}
                            required
                        />
                        {state?.errors?.email && (
                            <p className="text-sm text-red-600">{state.errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            defaultValue={user.phone || ''}
                        />
                        {state?.errors?.phone && (
                            <p className="text-sm text-red-600">{state.errors.phone}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Rol *</Label>
                        <Select name="role" defaultValue={user.role}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">Kullanıcı</SelectItem>
                                <SelectItem value="moderator">Moderatör</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        {state?.errors?.role && (
                            <p className="text-sm text-red-600">{state.errors.role}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            name="is_active"
                            defaultChecked={user.is_active}
                            value="true"
                        />
                        <Label htmlFor="is_active">Aktif Kullanıcı</Label>
                    </div>

                    {state?.message && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{state.message}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Kaydediliyor...' : 'Kaydet'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            İptal
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
