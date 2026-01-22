import { getPolicyById } from '@/actions/content-actions';
import PolicyForm from '@/components/content/policy-form';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditPolicyPage({
    params,
}: {
    params: { id: string };
}) {
    const policy = await getPolicyById(params.id);

    if (!policy) {
        notFound();
    }

    return (
        <div className="p-8">
            <Link href="/dashboard/content/policies">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri Dön
                </Button>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Politika Düzenle
                </h1>
                <p className="text-slate-600 mt-1">{policy.title}</p>
            </div>

            <PolicyForm policy={policy} />
        </div>
    );
}
