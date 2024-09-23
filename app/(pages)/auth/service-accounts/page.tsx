import Link from 'next/link';
import { WrenchIcon, BuildingIcon } from '@/components/ui/icons';

export default function Component() {
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-primary to-primary-foreground">
            <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32 xl:py-40 backdrop-blur-sm bg-white/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-4 md:space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
                            Choose Your Account Type
                        </h1>
                        <p className="text-lg md:text-xl text-primary-foreground/80">
                            Select whether you would like to sign up as a mechanic or a garage owner.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/auth/service-accounts/mechanic/signup"
                            className="bg-background p-6 md:p-8 lg:p-10 rounded-lg shadow-lg hover:bg-accent hover:text-accent-foreground transition-colors flex flex-col items-center justify-center gap-2"
                            prefetch={false}>
                            <WrenchIcon className="h-8 w-8 text-primary" />
                            <h2 className="text-2xl font-bold text-primary-foreground">Sign up as Mechanic</h2>
                            <p className="text-sm text-muted-foreground">Create an account to offer your services.</p>
                        </Link>
                        <Link
                            href="/auth/service-accounts/garage/signup"
                            className="bg-background p-6 md:p-8 lg:p-10 rounded-lg shadow-lg hover:bg-accent hover:text-accent-foreground transition-colors flex flex-col items-center justify-center gap-2"
                            prefetch={false}>
                            <BuildingIcon className="h-8 w-8 text-primary" />
                            <h2 className="text-2xl font-bold text-primary-foreground">Sign up as Garage Owner</h2>
                            <p className="text-sm text-muted-foreground">Create an account to manage your garage.</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
