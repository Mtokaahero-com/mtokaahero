import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/config/authOptions';
import { getMyProfile } from '@/lib/api/profile';

export default async function VendorsDashboardIndex() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) redirect('/auth/signin');

    try {
        const profile = await getMyProfile('SHOP', session.user.accessToken);
        redirect(`/dashboard/vendors/${profile.id}`);
    } catch {
        redirect('/auth/signin');
    }
}
