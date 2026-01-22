'use client';

import { useActionState } from 'react';
import { createCategory } from '@/actions/category-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewCategoryPage() {
    const [state, formAction, isPending] = useActionState(createCategory, null);

    return (
        <div className="p-8">
            <Link href="/dashboard/vehicles/categories">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri Dön
                </Button>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Yeni Kategori Ekle</h1>
            </div>

            <form action={formAction}>
                <Card>
                    <CardHeader>
                        <CardTitle>Kategori Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Kategori Adı *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Örn: Sedan"
                                required
                            />
                            {state?.errors?.name && (
                                <p className="text-sm text-red-600">{state.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input
                                id="slug"
                                name="slug"
                                placeholder="Örn: sedan"
                                required
                            />
                            <p className="text-xs text-slate-500">
                                URL için kullanılacak (küçük harf, tire ile)
                            </p>
                            {state?.errors?.slug && (
                                <p className="text-sm text-red-600">{state.errors.slug}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="icon">İkon</Label>
                            <Input
                                id="icon"
                                name="icon"
                                placeholder="Örn: car-sport"
                            />
                            <p className="text-xs text-slate-500">
                                Ionicons icon adı (opsiyonel)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="display_order">Sıralama</Label>
                            <Input
                                id="display_order"
                                name="display_order"
                                type="number"
                                defaultValue="0"
                                min="0"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="is_active" name="is_active" defaultChecked value="true" />
                            <Label htmlFor="is_active">Aktif</Label>
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
                            <Link href="/dashboard/vehicles/categories">
                                <Button type="button" variant="outline">
                                    İptal
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
