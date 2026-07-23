import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/config/authOptions';
import { getMyProfile } from '@/lib/api/profile';

export default async function MechanicsDashboardIndex() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accessToken) redirect('/auth/signin');

    let profileId: string;
    try {
        const profile = await getMyProfile('MECHANIC', session.user.accessToken);
        profileId = profile.id;
    } catch {
        redirect('/auth/signin');
    }

    // redirect() throws NEXT_REDIRECT — keep it outside the try so the catch
    // above only ever guards the getMyProfile lookup, never this redirect.
    redirect(`/dashboard/mechanics/${profileId}`);
}
