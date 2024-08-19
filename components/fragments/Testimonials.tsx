import { Card, CardContent } from '@/components/ui/card';

import { TestimonialCardProps } from '@/types/uiTypes';

const Testimonial = ({ quote, author, role }: TestimonialCardProps) => (
    <Card>
        <CardContent className="pt-6">
            <blockquote className="text-lg font-semibold">&ldquo;{quote}&rdquo;</blockquote>
            <footer className="mt-4">
                <p className="text-sm font-medium">{author}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
            </footer>
        </CardContent>
    </Card>
);


export default Testimonial;