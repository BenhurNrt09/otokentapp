'use client';

import { createClient } from '@/lib/supabase/client';
import { Loader2, Trash, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
}

export default function ImageUpload({
    value,
    onChange,
    onRemove,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();

    const onUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            try {
                setIsUploading(true);
                const files = e.target.files;
                if (!files || files.length === 0) return;

                const newUrls: string[] = [];

                for (const file of Array.from(files)) {
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
                }

                onChange([...value, ...newUrls]);
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Resim yüklenirken bir hata oluştu.');
            } finally {
                setIsUploading(false);
            }
        },
        [onChange, value, supabase]
    );

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div
                        key={url}
                        className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-slate-200 group"
                    >
                        <div className="z-10 absolute top-2 right-2">
                            <button
                                type="button"
                                onClick={() => onRemove(url)}
                                className="bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 transition"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Vehicle Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <div className="w-full">
                <label
                    className={`
            border-2 border-dashed border-slate-300 rounded-lg p-10
            flex flex-col items-center justify-center cursor-pointer
            hover:bg-slate-50 transition gap-2
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
                        <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
                    ) : (
                        <UploadCloud className="w-10 h-10 text-slate-400" />
                    )}
                    <span className="text-sm text-slate-500 font-medium">
                        {isUploading ? 'Yükleniyor...' : 'Resim Yüklemek İçin Tıklayın'}
                    </span>
                    <span className="text-xs text-slate-400">
                        JPG, PNG, WEBP (Max 5MB)
                    </span>
                </label>
            </div>
        </div>
    );
}
