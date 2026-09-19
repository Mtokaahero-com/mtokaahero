import { AlertCircle } from 'lucide-react';

export function FormError({ message }: { message?: string | null }) {
    if (!message) return null;
    return (
        <p role="alert" className="flex items-start gap-2 rounded-md bg-rescue-subtle px-3 py-2 text-sm text-rescue">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {message}
        </p>
    );
}
