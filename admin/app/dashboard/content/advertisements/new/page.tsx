'use client';

import { useActionState } from 'react';
import { createAdvertisement } from '@/actions/content-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ImageUpload from '@/components/image-upload';

import { toast } from "sonner";
import { useEffect } from 'react';

export default function NewAdvertisementPage() {
    const [state, formAction, isPending] = useActionState(createAdvertisement, null);

    useEffect(() => {
        if (state?.message) {
            toast.error(state.message);
        }
    }, [state]);

    const [imageUrls, setImageUrls] = useState<string[]>([]);

    return (
        <div className="p-8">
            <Link href="/dashboard/content/advertisements">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri Dön
                </Button>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Yeni Reklam Ekle</h1>
            </div>

            <form action={formAction}>
                <Card>
                    <CardHeader>
                        <CardTitle>Reklam Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Başlık</Label>
                            <Input id="title" name="title" placeholder="Reklam başlığı (opsiyonel)" />
                        </div>

                        <div className="space-y-4">
                            <Label>Reklam Görseli *</Label>
                            <ImageUpload
                                value={imageUrls}
                                onChange={(urls) => setImageUrls(urls)}
                                onRemove={(url) => setImageUrls(imageUrls.filter((current) => current !== url))}
                                maxFiles={1}
                                bucketName="vehicle-images"
                                maxSizeInMB={10}
                            />
                            <input
                                type="hidden"
                                name="image_url"
                                value={imageUrls[0] || ''}
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
                                placeholder="https://example.com (opsiyonel)"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Başlangıç Tarihi</Label>
                                <Input id="start_date" name="start_date" type="date" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date">Bitiş Tarihi</Label>
                                <Input id="end_date" name="end_date" type="date" />
                            </div>
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
                            <Link href="/dashboard/content/advertisements">
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
