/**
 * v0 by Vercel.
 * @see https://v0.dev/t/bfaG4ZJsD7H
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { JSX, SVGProps } from "react";

export default function Footer() {
  return (
    <footer className=" py-12 bg-foreground text-primary">
      <div className="container max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-start gap-4">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <CarIcon className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">MtokaaHero</span>
          </Link>
          <p className="text-muted-primary">
            Your one-stop shop for all your automotive needs.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Facebook" prefetch={false}>
              <FacebookIcon className="w-6 h-6 text-primary hover:text-primary transition-colors" />
            </Link>
            <Link href="#" aria-label="Twitter" prefetch={false}>
              <TwitterIcon className="w-6 h-6 text-primary hover:text-primary transition-colors" />
            </Link>
            <Link href="#" aria-label="Instagram" prefetch={false}>
              <InstagramIcon className="w-6 h-6 text-primary hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <Link
            href="#"
            className="text-primary hover:text-primary transition-colors"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-primary hover:text-primary transition-colors"
            prefetch={false}
          >
            Shop
          </Link>
          <Link
            href="#"
            className="text-primary hover:text-primary transition-colors"
            prefetch={false}
          >
            Vehicles
          </Link>
          <Link
            href="#"
            className="text-primary hover:text-primary transition-colors"
            prefetch={false}
          >
            Services
          </Link>
          <Link
            href="#"
            className="text-primary hover:text-primary transition-colors"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="#"
            className="text-primary hover:text-primary transition-colors"
            prefetch={false}
          >
            Contact
          </Link>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Contact</h3>
          <p className="text-primary">
            123 Main St, Nairobi Kenya
            <br />
            Phone: (123) 456-7890
            <br />
            Email: info@garageparts.com
          </p>
        </div>
        <div className="grid gap-2">
          <h3 className="text-lg font-semibold">Hours</h3>
          <p className="text-primary">
            Monday - Friday: 9am - 6pm
            <br />
            Saturday: 9am - 3pm
            <br />
            Sunday: Closed
          </p>
        </div>
      </div>
      <div className="container max-w-7xl mt-8 flex items-center justify-between">
        <p className="text-primary text-sm">
          &copy; 2024 MtokaaHero. All rights reserved.
        </p>
        <Link
          href="#"
          className="text-primary text-sm hover:text-primary transition-colors"
          prefetch={false}
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}

function CarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

function FacebookIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
