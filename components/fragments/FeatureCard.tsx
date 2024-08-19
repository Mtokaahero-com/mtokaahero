import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FeatureCardProps } from '@/types/uiTypes';

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
    <Card>
        <CardHeader>
            <div className="flex items-center space-x-2">
                {icon}
                <CardTitle>{title}</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <CardDescription>{description}</CardDescription>
        </CardContent>
    </Card>
);

export default FeatureCard;
