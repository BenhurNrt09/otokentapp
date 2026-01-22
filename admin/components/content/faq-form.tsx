'use client';

import { useActionState } from 'react';
import { updateFAQ, FAQ } from '@/actions/content-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FAQFormProps {
    faq: FAQ;
}

export default function FAQForm({ faq }: FAQFormProps) {
    const updateFAQWithId = updateFAQ.bind(null, faq.id);
    const [state, formAction, isPending] = useActionState(updateFAQWithId, null);

    return (
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
                            defaultValue={faq.question}
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
                            defaultValue={faq.answer}
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
                            defaultValue={faq.category || ''}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="display_order">Sıralama</Label>
                        <Input
                            id="display_order"
                            name="display_order"
                            type="number"
                            defaultValue={faq.display_order}
                            min="0"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            name="is_active"
                            defaultChecked={faq.is_active}
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
