import { Icon } from '@/components/brand/Icon';

export function FormError({ message }: { message?: string | null }) {
    if (!message) return null;
    return (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-error-container px-3 py-2.5 font-body-sm text-body-sm text-on-error-container">
            <Icon name="error" className="text-[16px] mt-px shrink-0" />
            {message}
        </p>
    );
}
