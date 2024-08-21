'use client'

import MechanicStoreCard from '@/components/fragments/MechanicStorecard'
import ProfileSheet from '@/components/fragments/ProfileSheet'
import BookingDialog from '@/components/fragments/BookingDialog'
import Navigation from '@/components/fragments/getStartedNavigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

// TypeScript types
type MechanicOrGarage = {
    id: number
    name: string
    type: 'Mechanic' | 'Store'
    specialty: string
    rating: number
    isAvailable: boolean
}

// Dummy data
const mechanicsAndGarages: MechanicOrGarage[] = [
    { id: 1, name: "John's Auto Repair", type: 'Mechanic', specialty: 'Engine Repair', rating: 4.8, isAvailable: true },
    { id: 2, name: 'Quick Fix Garage', type: 'Store', specialty: 'General Repairs', rating: 4.5, isAvailable: false },
    { id: 3, name: 'Elite Car Care', type: 'Mechanic', specialty: 'Luxury Vehicles', rating: 4.9, isAvailable: true },
    { id: 4, name: 'Speedy Tire Shop', type: 'Store', specialty: 'Tire Services', rating: 4.3, isAvailable: true },
    {
        id: 5,
        name: 'AutoElectric Pros',
        type: 'Mechanic',
        specialty: 'Electrical Systems',
        rating: 4.7,
        isAvailable: false,
    },
    {
        id: 6,
        name: 'Transmission Experts',
        type: 'Store',
        specialty: 'Transmission Repair',
        rating: 4.6,
        isAvailable: true,
    },
]

const mechanics = mechanicsAndGarages.filter((item) => item.type === 'Mechanic')
const garages = mechanicsAndGarages.filter((item) => item.type === 'Store')

export default function MechanicsStoresPage() {
    const [selectedItem, setSelectedItem] = useState<MechanicOrGarage | null>(null)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isBookingOpen, setIsBookingOpen] = useState(false)

    const handleProfileClick = (item: MechanicOrGarage) => {
        setSelectedItem(item)
        setIsProfileOpen(true)
    }

    const handleBookSession = (item: MechanicOrGarage) => {
        setSelectedItem(item)
        setIsBookingOpen(true)
    }

    const renderContent = (items: MechanicOrGarage[]) => (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
                <MechanicStoreCard
                    key={item.id}
                    item={item}
                    onProfileClick={handleProfileClick}
                    onBookSession={handleBookSession}
                />
            ))}
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <Navigation />
            <h1 className="text-4xl font-bold mb-8 text-center">Mechanics and Garages</h1>
            <Tabs defaultValue="all" className="mb-8">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="mechanics">Mechanics</TabsTrigger>
                    <TabsTrigger value="garages">Garages</TabsTrigger>
                </TabsList>

                <TabsContent value="all">{renderContent(mechanicsAndGarages)}</TabsContent>
                <TabsContent value="mechanics">{renderContent(mechanics)}</TabsContent>
                <TabsContent value="garages">{renderContent(garages)}</TabsContent>
            </Tabs>

            {selectedItem && (
                <>
                    <ProfileSheet item={selectedItem} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
                    <BookingDialog item={selectedItem} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
                </>
            )}
        </div>
    )
}
