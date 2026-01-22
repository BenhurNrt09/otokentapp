import { getMessages } from '@/actions/message-actions';
import MessageList from '@/components/message-list';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    const messages = await getMessages();

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Mesaj Yönetimi</h1>
                <p className="text-slate-600 mt-1">
                    Kullanıcılar arasındaki mesajları görüntüleyin ve yönetin
                </p>
            </div>

            <MessageList data={messages} />
        </div>
    );
}
