'use client';

import { useActionState } from 'react';
import { updatePolicy, Policy } from '@/actions/content-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PolicyFormProps {
    policy: Policy;
}

export default function PolicyForm({ policy }: PolicyFormProps) {
    const updatePolicyWithId = updatePolicy.bind(null, policy.id);
    const [state, formAction, isPending] = useActionState(updatePolicyWithId, null);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Politika İçeriği</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="type">Tip *</Label>
                        <Select name="type" defaultValue={policy.type}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="privacy">Gizlilik Politikası</SelectItem>
                                <SelectItem value="terms">Kullanım Koşulları</SelectItem>
                                <SelectItem value="cookie">Çerez Politikası</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Başlık *</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={policy.title}
                            required
                        />
                        {state?.errors?.title && (
                            <p className="text-sm text-red-600">{state.errors.title}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">İçerik *</Label>
                        <Textarea
                            id="content"
                            name="content"
                            defaultValue={policy.content}
                            rows={15}
                            required
                        />
                        {state?.errors?.content && (
                            <p className="text-sm text-red-600">{state.errors.content}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="version">Versiyon</Label>
                        <Input
                            id="version"
                            name="version"
                            defaultValue={policy.version || '1.0'}
                            placeholder="1.0"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            name="is_active"
                            defaultChecked={policy.is_active}
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
