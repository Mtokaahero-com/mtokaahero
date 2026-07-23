import { LogoutButton } from '@/components/fragments/LogoutButton';

export default function VendorDashboard() {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
                <LogoutButton className="w-auto" />
            </div>
        </div>
    );
}
