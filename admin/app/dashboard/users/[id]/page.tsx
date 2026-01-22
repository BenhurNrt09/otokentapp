import { getUserById } from '@/actions/user-actions';
import UserForm from '@/components/user-form';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditUserPage({
    params,
}: {
    params: { id: string };
}) {
    const user = await getUserById(params.id);

    if (!user) {
        notFound();
    }

    return (
        <div className="p-8">
            <Link href="/dashboard/users">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri Dön
                </Button>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Kullanıcı Düzenle
                </h1>
                <p className="text-slate-600 mt-1">
                    {user.name} {user.surname} ({user.email})
                </p>
            </div>

            <UserForm user={user} />
        </div>
    );
}
