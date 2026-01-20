import VehicleForm from '@/components/vehicle-form';

export default function NewVehiclePage() {
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Yeni Araç Ekle</h1>
                    <p className="text-slate-600">Sisteme yeni bir araç kaydedin</p>
                </div>
            </div>
            <VehicleForm />
        </div>
    );
}
