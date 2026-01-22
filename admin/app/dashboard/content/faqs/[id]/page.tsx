import { getFAQById } from '@/actions/content-actions';
import FAQForm from '@/components/content/faq-form';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EditFAQPage({
    params,
}: {
    params: { id: string };
}) {
    const faq = await getFAQById(params.id);

    if (!faq) {
        notFound();
    }

    return (
        <div className="p-8">
            <Link href="/dashboard/content/faqs">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Geri Dön
                </Button>
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">SSS Düzenle</h1>
            </div>

            <FAQForm faq={faq} />
        </div>
    );
}
