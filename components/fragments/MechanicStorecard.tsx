

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';
import { MechanicStoreCardProps } from '@/types/uiTypes';



const MechanicStoreCard = ({ item, onProfileClick, onBookSession }: MechanicStoreCardProps) => (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center">
                        {item.name}
                        {item.isAvailable && (
                            <span className="ml-2 w-3 h-3 bg-green-500 rounded-full" title="Available"></span>
                        )}
                    </CardTitle>
                    <CardDescription>{item.type}</CardDescription>
                </div>
                <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{item.rating}</span>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-sm">Specialty: {item.specialty}</p>
        </CardContent>
        <CardFooter className="mt-auto flex justify-between">
            <Button variant="outline" onClick={() => onProfileClick(item)}>
                View Profile
            </Button>
            <Button onClick={() => onBookSession(item)}>Book Session</Button>
        </CardFooter>
    </Card>
);


export default MechanicStoreCard;