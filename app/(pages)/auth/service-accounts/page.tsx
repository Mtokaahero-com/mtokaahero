import Link from 'next/link';
import { WrenchIcon, BuildingIcon } from '@/components/ui/icons';


export default function Component() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background">
            <div className="max-w-md w-full space-y-4 px-4">
                <h1 className="text-3xl font-bold text-foreground">Choose Your Account Type</h1>
                <p className="text-muted-foreground">
                    Select whether you would like to sign up as a mechanic or a garage owner.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        href="/auth/service-accounts/mechanic/signup"
                        className="bg-card p-6 rounded-lg shadow-md hover:bg-accent hover:text-accent-foreground transition-colors flex flex-col items-center justify-center gap-2"
                        prefetch={false}
                    >
                        <WrenchIcon className="size-8 text-primary" />
                        <h2 className="text-xl font-bold">Sign up as Mechanic</h2>
                        <p className="text-sm text-muted-foreground">Create an account to offer your services.</p>
                    </Link>
                    <Link
                        href="/auth/service-accounts/garage/signup"
                        className="bg-card p-6 rounded-lg shadow-md hover:bg-accent hover:text-accent-foreground transition-colors flex flex-col items-center justify-center gap-2"
                        prefetch={false}
                    >
                        <BuildingIcon className="size-8 text-primary" />
                        <h2 className="text-xl font-bold">Sign up as Garage Owner</h2>
                        <p className="text-sm text-muted-foreground">Create an account to manage your garage.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
