import React from 'react';

import { BatteryIcon, BracketsIcon, FuelIcon, MonitorCheckIcon, ServerIcon, WrenchIcon } from '@/components/ui/icons';
function OurServices() {
    return (
        <div className="flex flex-col">
            <section id="services" className="py-12 md:py-20 ">
                <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3 md:px-6">
                    <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
                        <FuelIcon className="h-12 w-12 text-primary" />
                        <h3 className="mt-4 text-xl font-semibold">Oil Change</h3>
                        <p className="mt-2 text-muted-foreground">
                            Keep your engine running smoothly with our expert oil change service.
                        </p>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
                        <WrenchIcon className="h-12 w-12 text-primary" />
                        <h3 className="mt-4 text-xl font-semibold">Tire Rotation</h3>
                        <p className="mt-2 text-muted-foreground">
                            Extend the life of your tires with our professional tire rotation service.
                        </p>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
                        <MonitorCheckIcon className="h-12 w-12 text-primary" />
                        <h3 className="mt-4 text-xl font-semibold">Engine Diagnostics</h3>
                        <p className="mt-2 text-muted-foreground">
                            Identify and resolve any issues with our comprehensive engine diagnostics.
                        </p>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
                        <BracketsIcon className="h-12 w-12 text-primary" />
                        <h3 className="mt-4 text-xl font-semibold">Brake Service</h3>
                        <p className="mt-2 text-muted-foreground">
                            Ensure your safety with our expert brake inspection and repair services.
                        </p>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
                        <BatteryIcon className="h-12 w-12 text-primary" />
                        <h3 className="mt-4 text-xl font-semibold">Battery Replacement</h3>
                        <p className="mt-2 text-muted-foreground">
                            Keep your vehicle powered with our reliable battery replacement service.
                        </p>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
                        <ServerIcon className="h-12 w-12 text-primary" />
                        <h3 className="mt-4 text-xl font-semibold">Transmission Service</h3>
                        <p className="mt-2 text-muted-foreground">
                            Maintain your transmission with our expert service and repair solutions.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}


export default OurServices;