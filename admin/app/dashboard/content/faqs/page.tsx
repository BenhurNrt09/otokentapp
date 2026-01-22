import { getFAQs } from '@/actions/content-actions';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import FAQList from '@/components/content/faq-list';

export const dynamic = 'force-dynamic';

export default async function FAQsPage() {
    const faqs = await getFAQs();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">SSS Yönetimi</h1>
                    <p className="text-slate-600 mt-1">
                        Sık sorulan soruları yönetin
                    </p>
                </div>
                <Link href="/dashboard/content/faqs/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> Yeni SSS Ekle
                    </Button>
                </Link>
            </div>

            <FAQList data={faqs} />
        </div>
    );
}
