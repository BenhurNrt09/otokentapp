import { getPolicies } from '@/actions/content-actions';
import PolicyList from '@/components/content/policy-list';

export const dynamic = 'force-dynamic';

export default async function PoliciesPage() {
    const policies = await getPolicies();

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Politika Yönetimi</h1>
                <p className="text-slate-600 mt-1">
                    Gizlilik, kullanım koşulları ve çerez politikalarını yönetin
                </p>
            </div>

            <PolicyList data={policies} />
        </div>
    );
}
