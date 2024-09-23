import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WrenchIcon } from '@/components/ui/icons';
export default function Component() {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md space-y-8">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <WrenchIcon className="h-12 w-12 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">MtokaaHero Auto Repair</h1>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Sign in to your account</CardTitle>
                        <CardDescription>
                            Enter your username and password to access the MtokaaHero Auto Repair platform.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="Enter your username" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="Enter your password" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Link
                                    href="#"
                                    className="text-sm font-medium text-primary-foreground hover:underline"
                                    prefetch={false}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
