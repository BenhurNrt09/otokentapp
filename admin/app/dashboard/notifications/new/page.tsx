import { getUsers } from '@/actions/user-actions';
import { createNotification } from '@/actions/notification-actions';
import NotificationForm from '@/components/notification-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewNotificationPage() {
    const users = await getUsers();

    return (
        <div className="p-8">
            <Link href="/dashboard/notifications">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri Dön
                </Button>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Yeni Bildirim Gönder
                </h1>
            </div>

            <NotificationForm users={users} />
        </div>
    );
}
