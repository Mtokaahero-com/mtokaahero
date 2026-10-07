import { redirect } from 'next/navigation';

// Garages, mobile mechanics and parts shops share one organization dashboard.
export default function LegacyDashboardRedirect() {
    redirect('/dashboard/garage');
}
