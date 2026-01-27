'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Message {
    id: string;
    content: string;
    sender_id: string;
    receiver_id: string;
    created_at: string;
    media_url?: string;
    message_type: 'text' | 'image' | 'voice' | 'location' | 'document' | 'support';
}

interface ChatInterfaceProps {
    initialMessages: Message[];
    currentUserId: string;
    otherUserId: string;
    otherUserAvatar?: string | null;
}

export default function ChatInterface({
    initialMessages,
    currentUserId,
    otherUserId,
    otherUserAvatar
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        // Scroll to bottom on mount and new messages
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        // Realtime subscription
        const channel = supabase
            .channel(`chat_${otherUserId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `or(and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId}))`
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUserId, otherUserId, supabase]);

    // Scroll effect when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsSending(true);
        try {
            // Use server action to send as 'OtoKent Support'
            // We dynamic import to avoid server-only module issues if this component is client-side only
            // But actions are fine to import.
            // However, we need to pass the bound action or import it.
            // Let's assume we import the action at top or passed as prop?
            // Existing import is from '@/actions/message-actions':
            const { sendSupportMessage } = await import('@/actions/message-actions');

            await sendSupportMessage(otherUserId, newMessage);

            // We don't need to manually update state as realtime subscription will handle it,
            // or we can optimistic update. Realtime is safer for consistency.
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Mesaj gönderilemedi.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.map((msg) => {
                        const isMe = msg.sender_id === currentUserId;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${isMe
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-800'
                                        }`}
                                >
                                    {msg.message_type === 'image' && msg.media_url && (
                                        <div className="mb-2 relative w-48 h-32 rounded overflow-hidden bg-black/10">
                                            <Image
                                                src={msg.media_url}
                                                alt="Shared image"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <p>{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-slate-400'
                                        }`}>
                                        {new Date(msg.created_at).toLocaleTimeString('tr-TR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-slate-50">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        disabled={isSending}
                        className="bg-white"
                    />
                    <Button type="submit" disabled={isSending}>
                        <Send className="w-4 h-4 mr-2" />
                        Gönder
                    </Button>
                </form>
            </div>
        </div>
    );
}
