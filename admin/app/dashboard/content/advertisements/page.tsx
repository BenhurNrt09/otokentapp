import { getAdvertisements } from '@/actions/ad-actions';
import AdsManager from '@/components/ads-manager';

export const dynamic = 'force-dynamic';

export default async function AdvertisementsPage() {
    const ads = await getAdvertisements();

    return (
        <div className="p-8">
            <AdsManager initialAds={ads} />
        </div>
    );
}
