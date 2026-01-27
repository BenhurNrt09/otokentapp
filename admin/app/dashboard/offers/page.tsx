"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Offer {
    id: string;
    vehicle_id: string;
    price: number;
    name: string;
    surname: string;
    phone: string;
    status: string;
    created_at: string;
    user: {
        email: string;
    };
    vehicle: {
        brand: string;
        model: string;
        title: string;
    } | null;
}

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const { data, error } = await supabase
                .from('offers')
                *,
                vehicle: vehicle_id(brand, model)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedOffers = (data || []).map((item: any) => ({
                id: item.id,
                vehicle_id: item.vehicle_id,
                price: item.price,
                name: item.name || '',
                surname: item.surname || '',
                phone: item.phone || '',
                status: item.status,
                created_at: item.created_at,
                user: {
                    email: item.user?.email || 'Bilinmiyor'
                },
                vehicle: item.vehicle ? {
                    brand: item.vehicle.brand,
                    model: item.vehicle.model,
                    title: `${ item.vehicle.brand } ${ item.vehicle.model } `
                } : null
            }));

            setOffers(formattedOffers);
        } catch (error: any) {
            console.error('Error fetching offers (FULL):', JSON.stringify(error, null, 2), error.message);
            // If it's a Supabase error 406 (Not Acceptable), it usually means schema cache needs reload
            // or we are selecting columns that don't exist.
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase.from('offers').update({ status: newStatus }).eq('id', id);
        if (!error) {
            setOffers(offers.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } else {
            alert('Durum güncellenemedi.');
        }
    };

    if (loading) return <div className="p-8">Yükleniyor...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Gelen Teklifler</h1>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">Araç</th>
                            <th className="p-4 font-medium text-gray-600">Teklif Veren</th>
                            <th className="p-4 font-medium text-gray-600">İletişim</th>
                            <th className="p-4 font-medium text-gray-600">Tutar</th>
                            <th className="p-4 font-medium text-gray-600">Tarih</th>
                            <th className="p-4 font-medium text-gray-600">Durum</th>
                            <th className="p-4 font-medium text-gray-600">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {offers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">Henüz hiç teklif yok.</td>
                            </tr>
                        ) : (
                            offers.map((offer) => (
                                <tr key={offer.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        {offer.vehicle ? (
                                            <span className="font-medium text-slate-900">{offer.vehicle.title}</span>
                                        ) : (
                                            <span className="text-red-500">Araç Bulunamadı ({offer.vehicle_id})</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium capitalize">{offer.name} {offer.surname}</div>
                                        <div className="text-xs text-gray-500">{offer.user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-gray-700">{offer.phone || '-'}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-bold text-green-600">
                                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(offer.price)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {format(new Date(offer.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px - 2 py - 1 rounded text - xs font - bold uppercase
                                            ${ offer.status === 'accepted' ? 'bg-green-100 text-green-700' : '' }
                                            ${ offer.status === 'rejected' ? 'bg-red-100 text-red-700' : '' }
                                            ${ offer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : '' }
            `}>
                                            {offer.status === 'pending' ? 'Bekliyor' : offer.status === 'accepted' ? 'Onaylandı' : 'Reddedildi'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateStatus(offer.id, 'accepted')}
                                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                                                disabled={offer.status === 'accepted'}
                                            >
                                                Onayla
                                            </button>
                                            <button
                                                onClick={() => updateStatus(offer.id, 'rejected')}
                                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                                                disabled={offer.status === 'rejected'}
                                            >
                                                Reddet
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
