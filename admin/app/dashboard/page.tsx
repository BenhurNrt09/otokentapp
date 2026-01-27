import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Car, MessageSquare, Bell, Plus, Image, HelpCircle, FileText, Banknote } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch real statistics from Supabase
    const [usersResult, vehiclesResult, messagesResult, notificationsResult, offersResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('vehicles').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('notifications').select('*', { count: 'exact', head: true }),
        supabase.from('offers').select('*', { count: 'exact', head: true }),
    ]);

    const stats = {
        users: usersResult.count || 0,
        vehicles: vehiclesResult.count || 0,
        messages: messagesResult.count || 0,
        notifications: notificationsResult.count || 0,
        offers: offersResult.count || 0,
    };

    // Fetch recent vehicles
    const { data: recentVehicles } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch recent offers
    const { data: recentOffers } = await supabase
        .from('offers')
        .select('*, vehicle:vehicle_id(brand, model)')
        .order('created_at', { ascending: false })
        .limit(5);

    const quickActions = [
        {
            title: 'Yeni Araç İlanı',
            description: 'Araç ilanı ekle',
            icon: Car,
            href: '/dashboard/vehicles/new',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            hoverColor: 'hover:bg-green-100',
        },
        {
            title: 'Yeni Reklam',
            description: 'Reklam banneri ekle',
            icon: Image,
            href: '/dashboard/content/advertisements/new',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverColor: 'hover:bg-blue-100',
        },
        {
            title: 'Gelen Teklifler',
            description: 'Teklifleri yönet',
            icon: Banknote,
            href: '/dashboard/offers',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            hoverColor: 'hover:bg-purple-100',
        },
        {
            title: 'Kullanıcılar',
            description: 'Kullanıcıları yönet',
            icon: Users,
            href: '/dashboard/users',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            hoverColor: 'hover:bg-orange-100',
        },
    ];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600 mt-1">OtoKent yönetim paneline hoş geldiniz</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Toplam Kullanıcı
                        </CardTitle>
                        <Users className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.users}</div>
                        <p className="text-xs text-slate-500 mt-1">Kayıtlı kullanıcı sayısı</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Toplam İlan
                        </CardTitle>
                        <Car className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.vehicles}</div>
                        <p className="text-xs text-slate-500 mt-1">Aktif araç ilanı</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Gelen Teklifler
                        </CardTitle>
                        <Banknote className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.offers}</div>
                        <p className="text-xs text-slate-500 mt-1">Bekleyen teklif sayısı</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Bildirimler
                        </CardTitle>
                        <Bell className="w-4 h-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.notifications}</div>
                        <p className="text-xs text-slate-500 mt-1">Gönderilen bildirim</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <Link key={index} href={action.href}>
                                <div className={`group p-6 border-2 border-slate-200 rounded-lg transition-all cursor-pointer ${action.hoverColor} hover:border-slate-300 hover:shadow-md`}>
                                    <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <action.icon className={`w-6 h-6 ${action.color}`} />
                                    </div>
                                    <p className="font-semibold text-slate-900 mb-1">{action.title}</p>
                                    <p className="text-xs text-slate-500">{action.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Vehicles */}
                <Card>
                    <CardHeader>
                        <CardTitle>Son Eklenen İlanlar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentVehicles && recentVehicles.length > 0 ? (
                            <div className="space-y-4">
                                {recentVehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div>
                                            <p className="font-medium">{vehicle.title || `${vehicle.brand} ${vehicle.model}`}</p>
                                            <p className="text-sm text-slate-500">
                                                {vehicle.price ? `${Number(vehicle.price).toLocaleString('tr-TR')} ₺` : 'Fiyat belirtilmemiş'}
                                            </p>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {format(new Date(vehicle.created_at), 'dd MMM yyyy', { locale: tr })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">Henüz ilan bulunmuyor</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Offers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Son Gelen Teklifler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentOffers && recentOffers.length > 0 ? (
                            <div className="space-y-4">
                                {recentOffers.map((offer) => (
                                    <div key={offer.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div>
                                            <p className="font-medium">
                                                {offer.vehicle ? `${offer.vehicle.brand} ${offer.vehicle.model}` : 'Araç Silinmiş'}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {offer.price ? `${Number(offer.price).toLocaleString('tr-TR')} ₺` : '-'}
                                                <span className="ml-2 text-slate-400">({offer.name} {offer.surname})</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mb-1
                                                ${offer.status === 'accepted' ? 'bg-green-100 text-green-700' : ''}
                                                ${offer.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                                                ${offer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                            `}>
                                                {offer.status === 'pending' ? 'Bekliyor' : offer.status === 'accepted' ? 'Onaylandı' : 'Reddedildi'}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {format(new Date(offer.created_at), 'dd MMM', { locale: tr })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500">Henüz teklif bulunmuyor</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
