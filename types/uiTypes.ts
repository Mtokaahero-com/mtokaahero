export interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}


export interface TestimonialCardProps {
    quote: string;
    author: string;
    role: string;
}


export interface MechanicStoreCardProps {
    item: {
        name: string;
        type: string;
        specialty: string;
        rating: number;
        isAvailable: boolean;
    };
    onProfileClick: (item: any) => void;
    onBookSession: (item: any) => void;
}


export interface ProfileSheetProps {
    item: {
        name: string;
        type: string;
        specialty: string;
        rating: number;
    };
    isOpen: boolean;
    onClose: () => void;
}


export interface BookingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
}
