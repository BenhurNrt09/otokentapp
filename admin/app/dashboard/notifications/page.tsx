import { getNotifications } from '@/actions/notification-actions';
import NotificationList from '@/components/notification-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
    const notifications = await getNotifications();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Bildirim Yönetimi</h1>
                    <p className="text-slate-600 mt-1">
                        Kullanıcılara gönderilen bildirimleri yönetin
                    </p>
                </div>
                <Link href="/dashboard/notifications/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> Yeni Bildirim Gönder
                    </Button>
                </Link>
            </div>

            <NotificationList data={notifications} />
        </div>
    );
}
