// ServiceItem.jsx
import React from 'react';

interface ServiceItemProps {
    icon: React.ElementType;
    text: string;
}

const ServiceItem = ({ icon: Icon, text }: ServiceItemProps) => {
    return (
        <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5" />
            <span>{text}</span>
        </div>
    );
};

export default ServiceItem;
