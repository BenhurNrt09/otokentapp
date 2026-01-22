'use client';

import { Policy } from '@/actions/content-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Edit, FileText } from 'lucide-react';
import Link from 'next/link';

interface PolicyListProps {
    data: Policy[];
}

export default function PolicyList({ data }: PolicyListProps) {
    const getPolicyTypeLabel = (type: string) => {
        switch (type) {
            case 'privacy':
                return 'Gizlilik Politikası';
            case 'terms':
                return 'Kullanım Koşulları';
            case 'cookie':
                return 'Çerez Politikası';
            default:
                return type;
        }
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-slate-500">Henüz politika bulunmuyor.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.map((policy) => (
                <Card key={policy.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <FileText className="w-8 h-8 text-blue-600" />
                            {policy.is_active ? (
                                <Badge variant="default" className="bg-green-600">
                                    Aktif
                                </Badge>
                            ) : (
                                <Badge variant="secondary">Pasif</Badge>
                            )}
                        </div>
                        <CardTitle className="mt-4">{policy.title}</CardTitle>
                        <CardDescription>
                            {getPolicyTypeLabel(policy.type)}
                            {policy.version && ` • v${policy.version}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-slate-500 mb-4">
                            Son güncelleme:{' '}
                            {new Date(policy.updated_at).toLocaleDateString('tr-TR')}
                        </div>
                        <Link href={`/dashboard/content/policies/${policy.id}`}>
                            <Button variant="outline" className="w-full">
                                <Edit className="w-4 h-4 mr-2" />
                                Düzenle
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
