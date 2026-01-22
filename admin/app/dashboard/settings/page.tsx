import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon, Database, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <SettingsIcon className="w-8 h-8" />
                    Sistem Ayarları
                </h1>
                <p className="text-slate-600 mt-1">
                    Uygulama ayarlarını ve yapılandırmaları yönetin
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <Database className="w-8 h-8 text-blue-600 mb-2" />
                        <CardTitle>Veritabanı</CardTitle>
                        <CardDescription>
                            Veritabanı bağlantısı ve yedekleme ayarları
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Durum:</span>
                                <span className="text-green-600 font-medium">✓ Bağlı</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Bağlantı:</span>
                                <span className="font-mono text-xs">Supabase</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Bell className="w-8 h-8 text-blue-600 mb-2" />
                        <CardTitle>Bildirimler</CardTitle>
                        <CardDescription>
                            Push bildirim ve e-posta ayarları
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Push Bildirimler:</span>
                                <span className="text-green-600 font-medium">✓ Aktif</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">E-posta:</span>
                                <span className="text-green-600 font-medium">✓ Aktif</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Shield className="w-8 h-8 text-blue-600 mb-2" />
                        <CardTitle>Güvenlik</CardTitle>
                        <CardDescription>
                            RLS politikaları ve güvenlik ayarları
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">RLS:</span>
                                <span className="text-green-600 font-medium">✓ Aktif</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">2FA:</span>
                                <span className="text-slate-500">Pasif</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <SettingsIcon className="w-8 h-8 text-blue-600 mb-2" />
                        <CardTitle>Genel</CardTitle>
                        <CardDescription>
                            Uygulama genel ayarları
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Versiyon:</span>
                                <span className="font-medium">1.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Bakım Modu:</span>
                                <span className="text-slate-500">Pasif</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
