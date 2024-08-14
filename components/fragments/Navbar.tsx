"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { title: "Home", location: "/" },
  { title: "Services", location: "/services" },
  { title: "Shop", location: "/shop" },
  { title: "Contact", location: "/contact" },
  { title: "Help", location: "/help" },
];

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

const NavLink = ({ href, children }: NavLinkProps) => (
  <Link
    href={href}
    className="text-black/60 hover:text-black transition-colors duration-200"
  >
    {children}
  </Link>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 h-29 ${
          scrolled ? "shadow-lg bg-white" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between  h-24">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={250}
                  height={250}
                  className="h-34 w-34"
                />
              </Link>
            </div>
            <div className="hidden md:block ">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <NavLink key={link.title} href={link.location}>
                    <span
                      className={` text-2xl font-bold ${scrolled ? " text-black" : "text-white"}  }`}
                    >
                      {link.title}
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              <Button
                variant="default"
                size="default"
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
              >
                Get Started
              </Button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="block h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.location}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          <div className="mt-4 px-3">
            <Button
              variant="default"
              size="default"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
