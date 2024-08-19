import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { BookingDialogProps } from '@/types/uiTypes';

const BookingDialog = ({ isOpen, onClose, item }: BookingDialogProps) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Book a Session with {item?.name}</DialogTitle>
                <DialogDescription>
                    Fill out the form below to book your session. We will get back to you with a confirmation.
                </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                        Email
                    </Label>
                    <Input id="email" type="email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                        Phone
                    </Label>
                    <Input id="phone" type="tel" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                        Date
                    </Label>
                    <Input id="date" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="service" className="text-right">
                        Service
                    </Label>
                    <Input id="service" className="col-span-3" />
                </div>
            </form>
            <DialogFooter>
                <Button type="submit">Book Session</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default BookingDialog;
