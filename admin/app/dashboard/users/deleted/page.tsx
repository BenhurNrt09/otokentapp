import { getUsers } from '@/actions/user-actions';
import UserList from '@/components/user-list';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DeletedUsersPage() {
    const allUsers = await getUsers(true);
    const deletedUsers = allUsers.filter(u => u.deleted_at !== null);

    return (
        <div className="p-8">
            <Link href="/dashboard/users">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri Dön
                </Button>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Silinmiş Kullanıcılar</h1>
                <p className="text-slate-600 mt-1">
                    Soft delete ile silinmiş kullanıcıları görüntüleyin ve geri yükleyin
                </p>
            </div>

            <UserList data={deletedUsers} />
        </div>
    );
}
