"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const nav_links = [
    {
      title: "Home",
      location: "/",
    },
    {
      title: "Services",
      location: "/",
    },
    {
      title: "About",
      location: "/",
    },
    {
      title: "Contact",
      location: "/",
    },
    {
      title: "Help",
      location: "/",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <section className="absolute top-0 w-full h-20 flex flex-row items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <a href="/">
          <Image src="/logo.png" alt="logo" width={150} height={150} />
        </a>
      </div>
      <div className="hidden md:flex flex-row items-center justify-center space-x-8">
        {nav_links.map((link) => (
          <a
            className="text-black/60 hover:text-black"
            key={link.title}
            href={link.location}
          >
            {link.title}
          </a>
        ))}
      </div>
      <div className="flex space-x-4">
        <Button
          variant={"ghost"}
          className="w-28 hover:border hover:border-black/40 hover:bg-brand_pink p-2"
        >
          Sign In
        </Button>
        <Button className="w-28 p-2">Sign Up</Button>
      </div>
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className="outline-none mobile-menu-button"
        >
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-md z-50">
          <ul className="flex flex-col items-center space-y-4 p-4">
            {nav_links.map((link) => (
              <li key={link.title}>
                <a
                  className="text-black/60 hover:text-black"
                  href={link.location}
                >
                  {link.title}
                </a>
              </li>
            ))}
            <li>
              <Button
                variant={"ghost"}
                className="w-full hover:border hover:border-black/40 hover:bg-brand_pink p-2"
              >
                Sign In
              </Button>
            </li>
            <li>
              <Button className="w-full p-2">Sign Up</Button>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}
