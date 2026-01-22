'use client';

import { useActionState } from 'react';
import { updateAdvertisement, Advertisement } from '@/actions/content-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdvertisementFormProps {
    advertisement: Advertisement;
}

export default function AdvertisementForm({ advertisement }: AdvertisementFormProps) {
    const updateAdWithId = updateAdvertisement.bind(null, advertisement.id);
    const [state, formAction, isPending] = useActionState(updateAdWithId, null);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Reklam Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Başlık</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={advertisement.title || ''}
                            placeholder="Reklam başlığı (opsiyonel)"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image_url">Görsel URL *</Label>
                        <Input
                            id="image_url"
                            name="image_url"
                            type="url"
                            defaultValue={advertisement.image_url}
                            required
                        />
                        {state?.errors?.image_url && (
                            <p className="text-sm text-red-600">{state.errors.image_url}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="link_url">Link URL</Label>
                        <Input
                            id="link_url"
                            name="link_url"
                            type="url"
                            defaultValue={advertisement.link_url || ''}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Başlangıç Tarihi</Label>
                            <Input
                                id="start_date"
                                name="start_date"
                                type="date"
                                defaultValue={
                                    advertisement.start_date
                                        ? new Date(advertisement.start_date).toISOString().split('T')[0]
                                        : ''
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="end_date">Bitiş Tarihi</Label>
                            <Input
                                id="end_date"
                                name="end_date"
                                type="date"
                                defaultValue={
                                    advertisement.end_date
                                        ? new Date(advertisement.end_date).toISOString().split('T')[0]
                                        : ''
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="display_order">Sıralama</Label>
                        <Input
                            id="display_order"
                            name="display_order"
                            type="number"
                            defaultValue={advertisement.display_order}
                            min="0"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            name="is_active"
                            defaultChecked={advertisement.is_active}
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
