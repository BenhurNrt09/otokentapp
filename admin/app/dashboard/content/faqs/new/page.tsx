'use client';

import { useActionState } from 'react';
import { createFAQ } from '@/actions/content-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewFAQPage() {
    const [state, formAction, isPending] = useActionState(createFAQ, null);

    return (
        <div className="p-8">
            <Link href="/dashboard/content/faqs">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri Dön
                </Button>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Yeni SSS Ekle</h1>
            </div>

            <form action={formAction}>
                <Card>
                    <CardHeader>
                        <CardTitle>SSS Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="question">Soru *</Label>
                            <Input
                                id="question"
                                name="question"
                                placeholder="Sık sorulan soru"
                                required
                            />
                            {state?.errors?.question && (
                                <p className="text-sm text-red-600">{state.errors.question}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="answer">Cevap *</Label>
                            <Textarea
                                id="answer"
                                name="answer"
                                placeholder="Sorunun cevabı"
                                rows={6}
                                required
                            />
                            {state?.errors?.answer && (
                                <p className="text-sm text-red-600">{state.errors.answer}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Input
                                id="category"
                                name="category"
                                placeholder="Örn: Genel, Hesap, Mesajlaşma"
                            />
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
                            <Link href="/dashboard/content/faqs">
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
