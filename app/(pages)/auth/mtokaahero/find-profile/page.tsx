"use client"

import { useState, FormEvent, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Loader2, User, Building2 } from 'lucide-react'

interface Profile {
    type: 'garage' | 'mechanic'
    name: string
    address?: string
    specialty?: string
}

// Mock function to simulate fetching profile
const fetchProfile = async (email: string): Promise<Profile> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const profiles: { [key: string]: Profile } = {
        'garage@example.com': { type: 'garage', name: 'SuperFix Garage', address: '123 Main St' },
        'mechanic@example.com': { type: 'mechanic', name: 'John Doe', specialty: 'Engine Repair' },
    }
    if (email in profiles) return profiles[email]
    throw new Error('Profile not found')
}

export default function Component() {
    const [email, setEmail] = useState<string>('')
    const [profile, setProfile] = useState<Profile | null>(null)
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

    const handleFetchProfile = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            const fetchedProfile = await fetchProfile(email)
            setProfile(fetchedProfile)
            setIsDialogOpen(true)
        } catch (err) {
            setError('Failed to fetch profile. Please check your email.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogin = (e: FormEvent) => {
        e.preventDefault()
        console.log('Logging in with', { email, password })
        setIsDialogOpen(false)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                <p className="text-gray-600 dark:text-gray-400">Enter your email to fetch your profile and log in.</p>
            </header>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Fetch your profile to proceed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFetchProfile} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Fetch Profile'}
                        </Button>
                    </form>

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{' '}
                        <a href="#" className="text-blue-500 hover:underline">
                            Sign up
                        </a>
                    </p>
                </CardFooter>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Your Profile</DialogTitle>
                        <DialogDescription>Confirm your details and enter your password to log in.</DialogDescription>
                    </DialogHeader>
                    {profile && (
                        <div className="flex items-center space-x-4 mb-4">
                            {profile.type === 'garage' ? (
                                <Building2 className="h-10 w-10 text-blue-500" />
                            ) : (
                                <User className="h-10 w-10 text-green-500" />
                            )}
                            <div>
                                <h3 className="font-semibold">{profile.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {profile.type === 'garage' ? profile.address : profile.specialty}
                                </p>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Log In
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
