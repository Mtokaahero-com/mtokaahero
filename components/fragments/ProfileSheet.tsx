import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ClockIcon, MapPinIcon, PhoneIcon, StarIcon } from 'lucide-react';
import { Wrench as ToolIcon } from 'lucide-react';
import { ProfileSheetProps } from '@/types/uiTypes';

const ProfileSheet = ({ item, isOpen, onClose }: ProfileSheetProps) => (
    <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>{item.name}</SheetTitle>
                <SheetDescription>{item.type}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                    <ToolIcon className="w-5 h-5" />
                    <span>Specialty: {item.specialty}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span>Rating: {item.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-5 h-5" />
                    <span>123 Auto Street, Carville, CV 12345</span>
                </div>
                <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-5 h-5" />
                    <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                    <ClockIcon className="w-5 h-5" />
                    <span>Mon-Fri: 8AM-6PM, Sat: 9AM-3PM</span>
                </div>
            </div>
        </SheetContent>
    </Sheet>
);

export default ProfileSheet;
