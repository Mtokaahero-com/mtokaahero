import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/config/authOptions';
import { getMyProfile } from '@/lib/api/profile';

export default async function MechanicsDashboardIndex() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) redirect('/auth/signin');

    try {
        const profile = await getMyProfile('MECHANIC', session.user.accessToken);
        redirect(`/dashboard/mechanics/${profile.id}`);
    } catch {
        redirect('/auth/signin');
    }
}
