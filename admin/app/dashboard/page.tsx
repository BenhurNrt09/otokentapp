"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, MessageSquare, Eye, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
    totalUsers: number;
    totalVehicles: number;
    totalMessages: number;
    totalViews: number;
    userGrowth: number;
    vehicleGrowth: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalVehicles: 0,
        totalMessages: 0,
        totalViews: 0,
        userGrowth: 0,
        vehicleGrowth: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch real data from Supabase
        // Mock data for now
        setTimeout(() => {
            setStats({
                totalUsers: 1247,
                totalVehicles: 832,
                totalMessages: 3456,
                totalViews: 12543,
                userGrowth: 12.5,
                vehicleGrowth: 8.3,
            });
            setLoading(false);
        }, 500);
    }, []);

    const statsCards = [
        {
            title: "Toplam Kullanıcılar",
            value: stats.totalUsers,
            icon: Users,
            growth: stats.userGrowth,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Toplam İlanlar",
            value: stats.totalVehicles,
            icon: Car,
            growth: stats.vehicleGrowth,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Toplam Mesajlar",
            value: stats.totalMessages,
            icon: MessageSquare,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Toplam Görüntüleme",
            value: stats.totalViews,
            icon: Eye,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">OtoKent Yönetim Paneline Hoş Geldiniz</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {stat.value.toLocaleString()}
                            </div>
                            {stat.growth !== undefined && (
                                <div className="flex items-center gap-1 mt-2">
                                    {stat.growth > 0 ? (
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-600" />
                                    )}
                                    <span
                                        className={`text-sm font-medium ${stat.growth > 0 ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {stat.growth > 0 ? "+" : ""}
                                        {stat.growth}%
                                    </span>
                                    <span className="text-sm text-gray-500">son 30 gün</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Son Aktiviteler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            Yeni kullanıcı kaydı
                                        </p>
                                        <p className="text-xs text-gray-500">{i} saat önce</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Popüler İlanlar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <Car className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            2024 BMW 3 Serisi
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Eye className="w-3 h-3 text-gray-400" />
                                            <p className="text-xs text-gray-500">{i * 123} görüntüleme</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors">
                            <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm font-medium text-gray-900">Yeni Kullanıcı</p>
                        </button>
                        <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-50 transition-colors">
                            <Car className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm font-medium text-gray-900">Yeni İlan</p>
                        </button>
                        <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors">
                            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm font-medium text-gray-900">Mesaj Gönder</p>
                        </button>
                        <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition-colors">
                            <Eye className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                            <p className="text-sm font-medium text-gray-900">Raporlar</p>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
