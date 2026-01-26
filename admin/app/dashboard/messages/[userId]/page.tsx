import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ChatInterface from '@/components/chat-interface';
import { getUserById } from '@/actions/user-actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ChatPage({ params }: { params: { userId: string } }) {
    const user = await getUserById(params.userId);

    if (!user) {
        notFound();
    }

    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    // Fetch messages
    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser?.id},receiver_id.eq.${params.userId}),and(sender_id.eq.${params.userId},receiver_id.eq.${currentUser?.id})`)
        .order('created_at', { ascending: true });

    return (
        <div className="p-8 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/messages">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {user.name} {user.surname}
                    </h1>
                    <p className="text-slate-500 text-sm">{user.email}</p>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-lg border shadow-sm overflow-hidden">
                <ChatInterface
                    initialMessages={messages || []}
                    currentUserId={currentUser?.id || ''}
                    otherUserId={params.userId}
                    otherUserAvatar={user.avatar_url}
                />
            </div>
        </div>
    );
}
