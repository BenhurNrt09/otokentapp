'use client';

import { useActionState } from 'react';
import { updateCategory, Category } from '@/actions/category-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryFormProps {
    category: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
    const updateCategoryWithId = updateCategory.bind(null, category.id);
    const [state, formAction, isPending] = useActionState(updateCategoryWithId, null);

    return (
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
                            defaultValue={category.name}
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
                            defaultValue={category.slug}
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
                            defaultValue={category.icon || ''}
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
                            defaultValue={category.display_order}
                            min="0"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            name="is_active"
                            defaultChecked={category.is_active}
                            value="true"
                        />
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
