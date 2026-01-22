'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useRef } from 'react';
import QRCode from 'react-qr-code';

interface QRModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleId: string;
    vehicleTitle: string;
    vehiclePrice: number;
}

export default function QRModal({
    isOpen,
    onClose,
    vehicleId,
    vehicleTitle,
    vehiclePrice,
}: QRModalProps) {
    // Frontend URL - In production this should come from env
    const frontendUrl = 'http://localhost:3000';
    const qrUrl = `${frontendUrl}/arac/${vehicleId}`;

    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const originalContents = document.body.innerHTML;
        const printContents = printContent.innerHTML;

        // Create a temporary hidden iframe or simple logic to print. 
        // Usually simpler:
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore event listeners destroyed by innerHTML replacement
    };

    // Better print approach: CSS @media print
    const handlePrintBetter = () => {
        window.print();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Araç QR Kodu</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-6 py-6" id="printable-area">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">{vehicleTitle}</h3>
                        <p className="text-2xl font-bold text-blue-600">
                            {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(vehiclePrice)}
                        </p>
                    </div>

                    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                        <QRCode value={qrUrl} size={200} />
                    </div>

                    <p className="text-xs text-slate-500 text-center max-w-[200px]">
                        Bu QR kodu okutarak aracın detaylarına ulaşabilirsiniz.
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Kapat
                    </Button>
                    <Button onClick={handlePrintBetter}>
                        Yazdır
                    </Button>
                </div>

                <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-area, #printable-area * {
              visibility: visible;
            }
            #printable-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .no-print {
                display: none;
            }
          }
        `}</style>
            </DialogContent>
        </Dialog>
    );
}
