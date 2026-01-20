'use client';

import { deleteVehicle } from '@/actions/vehicle-actions';
import QRModal from '@/components/qr-modal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Vehicle } from '@/types';
import { MoreHorizontal, Pencil, QrCode, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface VehicleListProps {
    data: Vehicle[];
}

export default function VehicleList({ data }: VehicleListProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const handleDelete = (id: string) => {
        if (confirm('Bu aracı silmek istediğinize emin misiniz?')) {
            startTransition(async () => {
                await deleteVehicle(id);
            });
        }
    };

    const handleQR = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setQrModalOpen(true);
    };

    return (
        <>
            <QRModal
                isOpen={qrModalOpen}
                onClose={() => setQrModalOpen(false)}
                vehicleId={selectedVehicle?.id || ''}
                vehicleTitle={`${selectedVehicle?.brand} ${selectedVehicle?.model}`}
                vehiclePrice={selectedVehicle?.price || 0}
            />

            <div className="rounded-md border border-slate-200">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Resim</TableHead>
                            <TableHead>Marka / Model</TableHead>
                            <TableHead>Yıl</TableHead>
                            <TableHead>Fiyat</TableHead>
                            <TableHead>KM</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((vehicle) => (
                            <TableRow key={vehicle.id}>
                                <TableCell>
                                    <div className="relative w-16 h-12 rounded-md overflow-hidden bg-slate-100">
                                        {vehicle.images?.[0] ? (
                                            <Image
                                                src={vehicle.images[0]}
                                                alt={`${vehicle.brand} ${vehicle.model}`}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                                No IMG
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {vehicle.brand} {vehicle.model}
                                </TableCell>
                                <TableCell>{vehicle.year}</TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    }).format(vehicle.price)}
                                </TableCell>
                                <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vehicle.status === 'yayinda'
                                                ? 'bg-green-100 text-green-800'
                                                : vehicle.status === 'satildi'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-slate-100 text-slate-800'
                                            }`}
                                    >
                                        {vehicle.status === 'yayinda'
                                            ? 'Yayında'
                                            : vehicle.status === 'satildi'
                                                ? 'Satıldı'
                                                : 'Pasif'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleQR(vehicle)}>
                                                <QrCode className="mr-2 h-4 w-4" /> QR Kod
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/vehicles/${vehicle.id}`}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Düzenle
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(vehicle.id)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash className="mr-2 h-4 w-4" /> Sil
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
