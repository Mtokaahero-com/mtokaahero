import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';

export default function RescuePlaceholderPage() {
    return (
        <AuthShell title="Roadside rescue" subtitle="Online rescue requests are coming soon." showSos={false}>
            <p className="text-sm text-muted-foreground">
                Rescue dispatch through the site is being built. <Link href="/" className="font-semibold text-primary hover:underline">Back to home</Link>
            </p>
        </AuthShell>
    );
}
