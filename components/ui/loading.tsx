import React, { useEffect, useState } from "react";
import Image from "next/image"; // Assuming you're using Next.js

const wordsToDisplayWhenLoading = [
  "We are curating a good experience for you",
  "We are almost done",
  "We are getting there",
  "We are almost there",
  "Hang in there",
];

export default function Loading() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex(
        (prevIndex) => (prevIndex + 1) % wordsToDisplayWhenLoading.length
      );
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="flex items-center justify-center mb-8">
        <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                {/* <Image
                    src="/logo.svg"
                    alt="Logo"
                    layout="fill"
                    objectFit="contain"
                    objectPosition="center"
                    /> */}
        </div>
      </div>
      <h1 className="mt-8 text-3xl font-bold tracking-tighter text-gray-800 sm:text-4xl transition-opacity duration-1000 ease-in-out">
        {/* {wordsToDisplayWhenLoading[currentWordIndex]} */}
      </h1>
    </div>
  );
}
