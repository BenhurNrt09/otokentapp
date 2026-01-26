'use client';

import { createVehicle, updateVehicle } from '@/actions/vehicle-actions';
import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Vehicle, ExpertiseData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ExpertiseSelector from './vehicle-expertise-selector';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { toast } from "sonner";

const partStatusEnum = z.enum(['original', 'painted', 'changed', 'local_painted']);

const formSchema = z.object({
    brand: z.string().min(1, 'Marka zorunludur'),
    model: z.string().min(1, 'Model zorunludur'),
    series: z.string().default(''),
    year: z.coerce.number().min(1900),
    price: z.coerce.number().min(0),
    mileage: z.coerce.number().min(0),
    fuel_type: z.enum(['benzin', 'dizel', 'hibrit', 'elektrik']),
    gear_type: z.enum(['manuel', 'otomatik']),
    body_type: z.string().default(''),
    engine_capacity: z.string().default(''),
    engine_power: z.string().default(''),
    drive_type: z.string().default(''),
    color: z.string().default(''),
    warranty: z.boolean().default(false),
    heavy_damage_record: z.boolean().default(false),
    is_disabled_friendly: z.boolean().default(false),
    exchangeable: z.boolean().default(false),
    video_call_available: z.boolean().default(false),
    from_who: z.enum(['sahibinden_ilk', 'sahibinden_ikinci', 'galeriden', 'yetkili_bayiden']),
    description: z.string().default(''),
    images: z.array(z.string()).min(1, 'En az bir resim yüklemelisiniz'),
    expertise_data: z.record(z.string(), z.any()).default({}),
    status: z.enum(['active', 'sold', 'pending', 'archived']),
});

type VehicleFormValues = z.infer<typeof formSchema>;

interface VehicleFormProps {
    initialData?: Vehicle | null;
}

const STEPS = [
    { id: 1, title: 'Temel Bilgiler' },
    { id: 2, title: 'Teknik Detaylar' },
    { id: 3, title: 'Durum & Ekspertiz' },
    { id: 4, title: 'Görseller & Yayın' },
];

export default function VehicleForm({ initialData }: VehicleFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [currentStep, setCurrentStep] = useState(1);

    const form = useForm<VehicleFormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            brand: initialData?.brand || '',
            model: initialData?.model || '',
            series: initialData?.series || '',
            year: initialData?.year || new Date().getFullYear(),
            price: initialData?.price || 0,
            mileage: initialData?.mileage || 0,
            fuel_type: initialData?.fuel_type || 'benzin',
            gear_type: initialData?.gear_type || 'manuel',
            body_type: initialData?.body_type || '',
            engine_capacity: initialData?.engine_capacity || '',
            engine_power: initialData?.engine_power || '',
            drive_type: initialData?.drive_type || '',
            color: initialData?.color || '',
            warranty: !!initialData?.warranty,
            heavy_damage_record: !!initialData?.heavy_damage_record,
            is_disabled_friendly: !!initialData?.is_disabled_friendly,
            exchangeable: !!initialData?.exchangeable,
            video_call_available: !!initialData?.video_call_available,
            from_who: ((initialData as any)?.from_who === 'owner' ? 'sahibinden_ilk' :
                (initialData as any)?.from_who === 'dealer' ? 'galeriden' :
                    (initialData as any)?.from_who === 'gallery' ? 'yetkili_bayiden' :
                        ((initialData as any)?.from_who || 'sahibinden_ilk')),
            description: initialData?.description || '',
            images: initialData?.images || [],
            expertise_data: initialData?.expertise_data || {},
            status: initialData?.status === 'active' || initialData?.status === 'sold' || initialData?.status === 'pending' || initialData?.status === 'archived' ? initialData.status : 'active',
        },
    });

    const onSubmit = async (data: VehicleFormValues) => {
        startTransition(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'images' || key === 'expertise_data') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            });

            let result;
            try {
                if (initialData?.id) {
                    result = await updateVehicle(initialData.id, null, formData);
                } else {
                    result = await createVehicle(null, formData);
                }

                if (result?.message) {
                    toast.error(result.message);
                    if (result?.errors) {
                        // Optional: Log detailed errors or show specific field errors
                        console.error(result.errors);
                    }
                } else {
                    // Success case (usually redirects, but we can show a toast just in case or before redirect)
                    toast.success(initialData ? "Araç güncellendi." : "İlan yayınlandı.");
                }
            } catch (error) {
                // Ignore redirect errors as they are expected
                if ((error as any)?.digest?.includes('NEXT_REDIRECT')) {
                    toast.success(initialData ? "Araç güncellendi." : "İlan yayınlandı.");
                    return;
                }
                toast.error("Bir hata oluştu.");
                console.error(error);
            }
        });
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="max-w-5xl mx-auto">
            {/* Step Progress Container */}
            <div className="mb-6 px-4">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                    {STEPS.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center relative">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white transition-colors duration-200 text-sm",
                                    currentStep === step.id ? "border-blue-600 text-blue-600 font-bold" :
                                        currentStep > step.id ? "border-green-500 bg-green-50 text-green-600" :
                                            "border-slate-200 text-slate-400"
                                )}>
                                    {currentStep > step.id ? "✓" : step.id}
                                </div>
                                <span className={cn(
                                    "mt-1.5 text-[10px] font-medium absolute top-8 whitespace-nowrap",
                                    currentStep === step.id ? "text-blue-600" : "text-slate-500"
                                )}>
                                    {step.title}
                                </span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className={cn(
                                    "h-[1.5px] flex-1 mx-2 transition-colors duration-200",
                                    currentStep > step.id ? "bg-green-500" : "bg-slate-200"
                                )} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        {/* STEP 1: TEMEL BİLGİLER */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="brand" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Marka</FormLabel>
                                            <FormControl><Input placeholder="BMW" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="model" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Model</FormLabel>
                                            <FormControl><Input placeholder="3 Serisi" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="series" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Seri / Paket</FormLabel>
                                            <FormControl><Input placeholder="3.20i M Sport" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="year" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Yıl</FormLabel>
                                            <FormControl><Input type="number" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="price" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fiyat (TL)</FormLabel>
                                            <FormControl><Input type="number" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="mileage" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kilometre</FormLabel>
                                            <FormControl><Input type="number" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="from_who" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kimden</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="sahibinden_ilk">İlk Sahibinden</SelectItem>
                                                    <SelectItem value="sahibinden_ikinci">İkinci Sahibinden</SelectItem>
                                                    <SelectItem value="galeriden">Galeriden</SelectItem>
                                                    <SelectItem value="yetkili_bayiden">Yetkili Bayiden</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: TEKNİK DETAYLAR */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField control={form.control} name="fuel_type" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Yakıt Tipi</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="benzin">Benzin</SelectItem>
                                                    <SelectItem value="dizel">Dizel</SelectItem>
                                                    <SelectItem value="hibrit">Hibrit</SelectItem>
                                                    <SelectItem value="elektrik">Elektrik</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="gear_type" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vites Tipi</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="manuel">Manuel</SelectItem>
                                                    <SelectItem value="otomatik">Otomatik</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="body_type" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kasa Tipi</FormLabel>
                                            <FormControl><Input placeholder="Sedan, SUV vb." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="engine_capacity" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Motor Hacmi</FormLabel>
                                            <FormControl><Input placeholder="1598 cc" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="engine_power" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Motor Gücü</FormLabel>
                                            <FormControl><Input placeholder="170 hp" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="drive_type" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Çekiş</FormLabel>
                                            <FormControl><Input placeholder="Arkadan İtiş" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="color" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Renk</FormLabel>
                                            <FormControl><Input placeholder="Metalik Gri" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>
                        )}

                        {/* STEP 3: DURUM & EKSPERTİZ */}
                        {currentStep === 3 && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <FormField control={form.control} name="warranty" render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <div className="space-y-1 leading-none"><FormLabel>Garanti Var</FormLabel></div>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="heavy_damage_record" render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-red-50/50">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <div className="space-y-1 leading-none"><FormLabel className="text-red-700">Ağır Hasarlı</FormLabel></div>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="is_disabled_friendly" render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <div className="space-y-1 leading-none"><FormLabel>Engelli Plakalı</FormLabel></div>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="exchangeable" render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <div className="space-y-1 leading-none"><FormLabel>Takaslı</FormLabel></div>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="video_call_available" render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            <div className="space-y-1 leading-none"><FormLabel>Görüntülü Arama İle Görülebilir</FormLabel></div>
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h3 className="text-lg font-semibold mb-4">Ekspertiz Bilgisi (Boya & Değişen)</h3>
                                    <FormField control={form.control} name="expertise_data" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ExpertiseSelector value={field.value} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </div>
                        )}

                        {/* STEP 4: MEDYA & YAYIN */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <FormField control={form.control} name="images" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Araç Resimleri</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value}
                                                onChange={(urls) => field.onChange(urls)}
                                                onRemove={(url) => field.onChange(field.value.filter((current) => current !== url))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="description" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Açıklama</FormLabel>
                                        <FormControl><Textarea placeholder="Araç hakkında detaylı bilgi giriniz..." className="min-h-[150px]" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="status" render={({ field }) => (
                                    <FormItem className="w-full md:w-1/2">
                                        <FormLabel>İlan Durumu</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Yayında</SelectItem>
                                                <SelectItem value="sold">Satıldı</SelectItem>
                                                <SelectItem value="pending">Beklemede</SelectItem>
                                                <SelectItem value="archived">Arşiv</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1 || isPending}
                                className="gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" /> Geri
                            </Button>

                            {currentStep < STEPS.length ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="gap-2 ml-auto"
                                >
                                    Sonraki <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isPending} className="gap-2 ml-auto bg-blue-600 hover:bg-blue-700">
                                    {isPending ? 'Kaydediliyor...' : initialData ? 'Güncelle' : 'İlanı Yayınla'}
                                    <Save className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
