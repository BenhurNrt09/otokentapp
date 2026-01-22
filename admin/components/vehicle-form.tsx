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
import { Vehicle } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    brand: z.string().min(1, 'Marka en az 1 karakter olmalıdır'),
    model: z.string().min(1, 'Model en az 1 karakter olmalıdır'),
    year: z.coerce.number().min(1900),
    price: z.coerce.number().min(0),
    mileage: z.coerce.number().min(0),
    fuel_type: z.enum(['benzin', 'dizel', 'hibrit', 'elektrik']),
    gear_type: z.enum(['manuel', 'otomatik']),
    description: z.string().optional(),
    images: z.array(z.string()).min(1, 'En az bir resim yüklemelisiniz'),
    status: z.enum(['yayinda', 'satildi', 'pasif']),
});

type VehicleFormValues = z.infer<typeof formSchema>;

interface VehicleFormProps {
    initialData?: Vehicle | null;
}

export default function VehicleForm({ initialData }: VehicleFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<VehicleFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                brand: initialData.brand,
                model: initialData.model,
                year: initialData.year,
                price: initialData.price,
                mileage: initialData.mileage,
                fuel_type: initialData.fuel_type,
                gear_type: initialData.gear_type,
                description: initialData.description || '',
                images: initialData.images || [],
                status: initialData.status,
            }
            : {
                brand: '',
                model: '',
                year: new Date().getFullYear(),
                price: 0,
                mileage: 0,
                fuel_type: 'benzin',
                gear_type: 'manuel',
                description: '',
                images: [],
                status: 'yayinda',
            },
    });

    const onSubmit = async (data: VehicleFormValues) => {
        startTransition(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'images') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            });

            if (initialData) {
                await updateVehicle(initialData.id, null, formData);
            } else {
                await createVehicle(null, formData);
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Araç Resimleri</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={(urls) => field.onChange(urls)}
                                        onRemove={(url) =>
                                            field.onChange(
                                                field.value.filter((current) => current !== url)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Marka</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="BMW" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="3.20i" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Yıl</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fiyat (TL)</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mileage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kilometre</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fuel_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Yakıt Tipi</FormLabel>
                                    <Select
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seçiniz" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="benzin">Benzin</SelectItem>
                                            <SelectItem value="dizel">Dizel</SelectItem>
                                            <SelectItem value="hibrit">Hibrit</SelectItem>
                                            <SelectItem value="elektrik">Elektrik</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gear_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vites Tipi</FormLabel>
                                    <Select
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seçiniz" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="manuel">Manuel</SelectItem>
                                            <SelectItem value="otomatik">Otomatik</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Durum</FormLabel>
                                    <Select
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seçiniz" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="yayinda">Yayında</SelectItem>
                                            <SelectItem value="satildi">Satıldı</SelectItem>
                                            <SelectItem value="pasif">Pasif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Açıklama</FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={isPending}
                                        placeholder="Araç detayları..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? 'Kaydediliyor...' : initialData ? 'Güncelle' : 'Oluştur'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
