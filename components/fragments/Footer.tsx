import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps } from "react";

export default function Component() {
  const the_links = [
    {
      title: "Spare Parts",
      location: "/",
    },
    {
      title: "Car Imports",
      location: "/",
    },

    {
      title: "Vehicle Repairs",
      location: "/",
    },

    {
      title: "Online Booking",
      location: "/",
    },
    {
      title: "User Accounts",
      location: "/",
    },
  ];

  return (
    <footer className="border-t-[0.5px] p-10">
      <div className="w-[50%] p-10 flex md:flex-row justify-between flex-col ">
        <QuickLinks section_title="Features" links={the_links} />
        <QuickLinks section_title="Features" links={the_links} />
        <QuickLinks section_title="Features" links={the_links} />
        <QuickLinks section_title="Features" links={the_links} />
      </div>
      <div className="container max-w-7xl mt-8 flex flex-col items-start p-8 space-y-2 justify-center text-xs text-muted-foreground">
        <span className="flex flex-row items-center space-x-2">
          {/* <Image src="/logo.svg" alt="" /> */}
          <h1 className="font-bold text-sm  text-black">
            MtokaaHero - Your Ultimate Garage Solution
          </h1>
        </span>
        <p>&copy; 2024 MtokaaHero Auto Parts. All rights reserved.</p>
      </div>
    </footer>
  );
}

interface Link {
  location: string;
  title: string;
}

interface PropData {
  links: Link[];
  section_title: string;
}

function QuickLinks({ links, section_title }: PropData) {
  return (
    <div className="flex flex-col ">
      <h1 className="text-black/60 text-xl">{section_title}</h1>
      <div className="flex flex-col space-y-2 mt-4">
        {links.map((link: Link, index: number) => (
          <a key={index} href={link.location}>
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );
}
