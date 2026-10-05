import type { PartnerApplication, PartnerApplicationInput, PartnerProgram } from '@/lib/api/partners';

export const program: PartnerProgram = {
    capabilities: [
        { id: 'engine', label: 'Engine Overhaul', detail: 'Major mechanical repairs' },
        { id: 'brakes', label: 'Brake Specialists', detail: 'Hydraulics & ABS tuning' },
        { id: 'diagnostics', label: 'Computer Diagnostics', detail: 'OBD2 & ECU reprogramming' },
        { id: 'rescue', label: '24/7 Mobile Rescue', detail: 'Roadside breakdown SOS' },
        { id: 'towing', label: 'Flatbed Towing', detail: 'Emergency winch recovery' },
        { id: 'parts', label: 'Parts Retail Store', detail: 'Direct inventory selling' },
    ],
    radiusKm: {
        min: 5,
        max: 60,
        default: 25,
        marks: [
            { km: 5, label: '5 km (Local Suburb)' },
            { km: 30, label: '30 km (Metropolitan)' },
            { km: 60, label: '60 km (Inter-County Highway)' },
        ],
    },
    advantages: [
        { icon: 'hub', tone: 'primary', title: '25,000+ Active Motorists', body: 'Instant exposure to distressed drivers on expressways and bypass roads.' },
        { icon: 'verified_user', tone: 'amber', title: 'Guaranteed Escrow Settlement', body: 'Funds are pre-authorized before you roll a truck or turn a wrench. No bad debts.' },
        { icon: 'inventory_2', tone: 'tint', title: 'Free Workshop & Parts ERP', body: 'Included digital hoist scheduler, automated billing, and catalog sync software.' },
        { icon: 'stars', tone: 'rescue', title: 'Verified Reputation Badging', body: 'Motorists trust high-rated shops. Grow your authentic ratings with every job.' },
    ],
    testimonial: {
        name: 'Francis Kariuki',
        business: 'Apex Auto Clinic • 4 Hoists',
        photo: '/images/market/partner-francis.jpg',
        quote: 'Since connecting our 4 bays to the MtokaaHero dispatch grid, our turnaround rate skyrocketed. We went from idling mechanics to predictable highway breakdown work.',
        monthlyPayout: { amount: 1094600, currency: 'KES' },
        rating: 4.94,
        reviewCount: 218,
    },
    dispatch: { avgMinutes: 14, targetMinutes: 20, onTimeRate: 98.4 },
    support: { label: 'Chat with Ops', href: '/contact' },
};

export function submitApplication(input: PartnerApplicationInput): PartnerApplication {
    return {
        id: `app_${crypto.randomUUID()}`,
        organizationId: input.organizationId,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
    };
}
