import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import UserList from '@/components/user-list';
import { getUsers } from '@/actions/user-actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const activeUsers = await getUsers(false);
    const allUsers = await getUsers(true);
    const deletedUsers = allUsers.filter(u => u.deleted_at !== null);

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-8 h-8" />
                        Kullanıcı Yönetimi
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Sistemdeki tüm kullanıcıları listeleyin ve yönetin
                    </p>
                </div>
                <Link href="/dashboard/users/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> Yeni Kullanıcı Ekle
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="active">
                        Aktif Kullanıcılar ({activeUsers.length})
                    </TabsTrigger>
                    <TabsTrigger value="all">
                        Tüm Kullanıcılar ({allUsers.length})
                    </TabsTrigger>
                    <TabsTrigger value="deleted">
                        Silinmiş ({deletedUsers.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                    <UserList data={activeUsers} />
                </TabsContent>

                <TabsContent value="all">
                    <UserList data={allUsers} />
                </TabsContent>

                <TabsContent value="deleted">
                    <UserList data={deletedUsers} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
