'use client';

import { useState } from 'react';
import { Advertisement, createAdvertisement, updateAdvertisement, deleteAdvertisement, toggleAdvertisementStatus } from '@/actions/ad-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface AdsManagerProps {
    initialAds: Advertisement[];
}

export default function AdsManager({ initialAds }: AdsManagerProps) {
    const [ads, setAds] = useState<Advertisement[]>(initialAds);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            if (editingAd) {
                await updateAdvertisement(editingAd.id, formData);
            } else {
                await createAdvertisement(formData);
            }
            setIsDialogOpen(false);
            setEditingAd(null);
            // In a real app with strict state management we might wait for revalidation or optimistic update
            // For now, revalidatePath in action handles the data refresh on next render, 
            // but we might want to manually refresh router or just wait.
        } catch (error) {
            console.error(error);
            alert('Bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu reklamı silmek istediğinizden emin misiniz?')) return;
        try {
            await deleteAdvertisement(id);
        } catch (error) {
            console.error(error);
            alert('Silme işlemi başarısız.');
        }
    };

    const handleToggleStatus = async (ad: Advertisement) => {
        try {
            await toggleAdvertisementStatus(ad.id, ad.is_active);
        } catch (error) {
            console.error(error);
            alert('Durum güncellenemedi.');
        }
    };

    const openNewDialog = () => {
        setEditingAd(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (ad: Advertisement) => {
        setEditingAd(ad);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Reklam Yönetimi</h1>
                <Button onClick={openNewDialog} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Reklam Ekle
                </Button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Görsel</TableHead>
                            <TableHead>Başlık</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead>Sıra</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                    Henüz reklam eklenmemiş.
                                </TableCell>
                            </TableRow>
                        ) : (
                            ads.map((ad) => (
                                <TableRow key={ad.id}>
                                    <TableCell>
                                        <div className="relative w-20 h-12 rounded overflow-hidden bg-slate-100 border">
                                            {ad.image_url ? (
                                                <Image
                                                    src={ad.image_url}
                                                    alt={ad.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 m-auto text-slate-300" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{ad.title}</TableCell>
                                    <TableCell>
                                        {ad.link_url && (
                                            <a
                                                href={ad.link_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:underline flex items-center text-xs"
                                            >
                                                Link <ExternalLink className="w-3 h-3 ml-1" />
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell>{ad.display_order}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={ad.is_active}
                                                onCheckedChange={() => handleToggleStatus(ad)}
                                            />
                                            <span className="text-xs text-slate-500">
                                                {ad.is_active ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditDialog(ad)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(ad.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingAd ? 'Reklam Düzenle' : 'Yeni Reklam Ekle'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Reklam Başlığı</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Örn: Yaz İndirimi"
                                defaultValue={editingAd?.title}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_url">Görsel URL</Label>
                            <Input
                                id="image_url"
                                name="image_url"
                                placeholder="https://..."
                                defaultValue={editingAd?.image_url}
                                required
                            />
                            <p className="text-xs text-slate-400">
                                Şimdilik harici resim URL'i kullanın (örn: imgur, website vs.)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link_url">Yönlendirilecek Link (Opsiyonel)</Label>
                            <Input
                                id="link_url"
                                name="link_url"
                                placeholder="https://otokent.com/kampanya"
                                defaultValue={editingAd?.link_url || ''}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="display_order">Sıralama</Label>
                                <Input
                                    id="display_order"
                                    name="display_order"
                                    type="number"
                                    defaultValue={editingAd?.display_order || 0}
                                />
                            </div>

                            <div className="flex flex-col justify-center space-y-2">
                                <Label htmlFor="is_active">Durum</Label>
                                <div className="flex items-center gap-2 mt-2">
                                    <Switch
                                        id="is_active"
                                        name="is_active"
                                        value="true" // Ensure value is sent
                                        defaultChecked={editingAd ? editingAd.is_active : true}
                                    />
                                    <Label htmlFor="is_active" className="cursor-pointer font-normal">
                                        Aktif olarak yayınla
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                İptal
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Kaydediliyor...' : (editingAd ? 'Güncelle' : 'Kaydet')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
