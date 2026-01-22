'use client';

import React from 'react';
import { ExpertiseData, PartStatus } from '@/types';
import { cn } from '@/lib/utils';

interface ExpertiseSelectorProps {
    value: ExpertiseData;
    onChange: (value: ExpertiseData) => void;
    disabled?: boolean;
}

const statusColors: Record<PartStatus, string> = {
    original: 'fill-green-100 stroke-green-600',
    painted: 'fill-orange-100 stroke-orange-600',
    changed: 'fill-red-100 stroke-red-600',
    local_painted: 'fill-yellow-100 stroke-yellow-600',
};

const statusLabels: Record<PartStatus, string> = {
    original: 'Orijinal',
    painted: 'Boyalı',
    changed: 'Değişen',
    local_painted: 'Lokal Boyalı',
};

export default function ExpertiseSelector({ value, onChange, disabled }: ExpertiseSelectorProps) {
    const parts = [
        { id: 'hood', label: 'Kaput' },
        { id: 'roof', label: 'Tavan' },
        { id: 'trunk', label: 'Bagaj' },
        { id: 'frontBumper', label: 'Ön Tampon' },
        { id: 'rearBumper', label: 'Arka Tampon' },
        { id: 'frontLeftFender', label: 'Sol Ön Çamurluk' },
        { id: 'frontRightFender', label: 'Sağ Ön Çamurluk' },
        { id: 'frontLeftDoor', label: 'Sol Ön Kapı' },
        { id: 'frontRightDoor', label: 'Sağ Ön Kapı' },
        { id: 'rearLeftDoor', label: 'Sol Arka Kapı' },
        { id: 'rearRightDoor', label: 'Sağ Arka Kapı' },
        { id: 'rearLeftFender', label: 'Sol Arka Çamurluk' },
        { id: 'rearRightFender', label: 'Sağ Arka Çamurluk' },
    ] as const;

    const toggleStatus = (partId: keyof ExpertiseData) => {
        if (disabled) return;

        const currentStatus = value[partId] || 'original';
        const statuses: PartStatus[] = ['original', 'painted', 'local_painted', 'changed'];
        const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
        const nextStatus = statuses[nextIndex];

        onChange({
            ...value,
            [partId]: nextStatus,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 mb-4">
                {Object.entries(statusLabels).map(([status, label]) => (
                    <div key={status} className="flex items-center gap-2 text-sm">
                        <div className={cn(
                            "w-4 h-4 rounded-full border",
                            status === 'original' && "bg-green-100 border-green-600",
                            status === 'painted' && "bg-orange-100 border-orange-600",
                            status === 'local_painted' && "bg-yellow-100 border-yellow-600",
                            status === 'changed' && "bg-red-100 border-red-600"
                        )} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parts.map((part) => {
                    const status = value[part.id] || 'original';
                    return (
                        <button
                            key={part.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => toggleStatus(part.id)}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg border transition-all",
                                status === 'original' && "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
                                status === 'painted' && "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100",
                                status === 'local_painted' && "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100",
                                status === 'changed' && "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
                                disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <span className="font-medium text-sm">{part.label}</span>
                            <span className="text-xs font-bold uppercase">{statusLabels[status]}</span>
                        </button>
                    );
                })}
            </div>

            <p className="text-xs text-muted-foreground mt-4 italic">
                * Parçaların üzerine tıklayarak durumlarını değiştirebilirsiniz (Orijinal → Boyalı → Lokal Boyalı → Değişen).
            </p>
        </div>
    );
}
