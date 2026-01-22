import VehicleForm from '@/components/vehicle-form';

export default function NewVehiclePage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Yeni İlan Ekle</h2>
            </div>
            <VehicleForm />
        </div>
    );
}
