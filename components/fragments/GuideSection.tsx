import React from 'react';


import { Button } from '@/components/ui/button';
function GuideSection() {
    return (
        <section className="md:mt-0 mt-20 items-center justify-center w-full md:h-[70vh] h-auto flex md:flex-row flex-col bg-white ">
            <div className="md:w-[50%] w-full h-full md:p-20 p-2 flex items-center justify-end">
                <div className="w-full md:h-full h-80 md:w-[60%] bg-black/10 border border-black/20">{/* Image */}</div>
            </div>
            <div className="md:w-[50%] h-full flex flex-col p-10 items-start justify-center space-y-6">
                <Button variant={'ghost'} className="border rounded-xl font-bold">
                    Your Car, Our Priority
                </Button>
                <h1 className="text-3xl font-bold text-black w-full md:w-[50%] text-balance">
                    One-Stop Solution for All Your Import Needs
                </h1>
                <p className="md:w-[50%] w-full">
                    From spare parts to car imports and repairs, MtokaaHero provides an all-in-one platform to cater to
                    your vehicles every requirement.
                </p>
                <div className="flex items-center space-x-4">
                    <Button>Import With US Today</Button>
                    <Button variant={'ghost'} className="border rounded-xl font-bold space-x-2 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                            />
                        </svg>
                        <span>Watch Video</span>
                    </Button>
                </div>
            </div>
        </section>
    );
}



export default GuideSection;