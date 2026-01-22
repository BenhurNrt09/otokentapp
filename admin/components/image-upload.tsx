'use client';

import { createClient } from '@/lib/supabase/client';
import { Loader2, Trash, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
    maxFiles?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function ImageUpload({
    value,
    onChange,
    onRemove,
    maxFiles = 10,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const supabase = createClient();

    const onUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            try {
                setIsUploading(true);
                const files = e.target.files;
                if (!files || files.length === 0) return;

                // Validate file count
                if (value.length + files.length > maxFiles) {
                    alert(`Maksimum ${maxFiles} fotoğraf yükleyebilirsiniz.`);
                    return;
                }

                const newUrls: string[] = [];
                const totalFiles = files.length;

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    // Validate file type
                    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                        alert(`${file.name} geçersiz dosya formatı. Sadece JPG, PNG ve WEBP desteklenir.`);
                        continue;
                    }

                    // Validate file size
                    if (file.size > MAX_FILE_SIZE) {
                        alert(`${file.name} çok büyük. Maksimum dosya boyutu 5MB.`);
                        continue;
                    }

                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                    const filePath = `${fileName}`;

                    const { error: uploadError, data } = await supabase.storage
                        .from('vehicle-images')
                        .upload(filePath, file);

                    if (uploadError) {
                        console.error('Upload error:', uploadError);
                        continue;
                    }

                    const {
                        data: { publicUrl },
                    } = supabase.storage.from('vehicle-images').getPublicUrl(data.path);

                    newUrls.push(publicUrl);
                    setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
                }

                onChange([...value, ...newUrls]);
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Resim yüklenirken bir hata oluştu.');
            } finally {
                setIsUploading(false);
                setUploadProgress(0);
            }
        },
        [onChange, value, supabase, maxFiles]
    );

    return (
        <div className="space-y-4">
            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {value.map((url, index) => (
                        <div
                            key={url}
                            className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-200 group hover:border-blue-500 transition-colors"
                        >
                            {index === 0 && (
                                <div className="absolute top-2 left-2 z-10">
                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                        Kapak
                                    </span>
                                </div>
                            )}
                            <div className="z-10 absolute top-2 right-2">
                                <button
                                    type="button"
                                    onClick={() => onRemove(url)}
                                    className="bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <Image
                                fill
                                className="object-cover"
                                alt={`Araç görseli ${index + 1}`}
                                src={url}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {value.length < maxFiles && (
                <div className="w-full">
                    <label
                        className={`
                            border-2 border-dashed border-slate-300 rounded-lg p-8
                            flex flex-col items-center justify-center cursor-pointer
                            hover:bg-slate-50 hover:border-blue-400 transition gap-3
                            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={onUpload}
                            disabled={isUploading}
                        />
                        {isUploading ? (
                            <>
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                <div className="w-full max-w-xs bg-slate-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <span className="text-sm text-slate-600 font-medium">
                                    Yükleniyor... {uploadProgress}%
                                </span>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-12 h-12 text-slate-400" />
                                <div className="text-center">
                                    <span className="text-sm text-slate-700 font-medium block">
                                        Fotoğraf Yüklemek İçin Tıklayın veya Sürükleyin
                                    </span>
                                    <span className="text-xs text-slate-500 mt-1 block">
                                        JPG, PNG, WEBP (Max 5MB) • {value.length}/{maxFiles} yüklendi
                                    </span>
                                </div>
                            </>
                        )}
                    </label>
                </div>
            )}

            {value.length >= maxFiles && (
                <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                        Maksimum {maxFiles} fotoğraf yüklediniz. Daha fazla eklemek için mevcut fotoğrafları silin.
                    </p>
                </div>
            )}
        </div>
    );
}
