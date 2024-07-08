/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1Wk9T4nwO7M
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { JSX, SVGProps } from "react";

export default function Component() {
  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-primary text-primary-foreground">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <CarIcon className="w-6 h-6" />
        <span className="text-lg font-bold">MtokaaHeroHero</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Home
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Parts
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Vehicles
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Services
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          About
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Contact
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Create Account
        </Link>
      </nav>
      <div className="relative hidden md:block">
        <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search parts, vehicles, services..."
          className="pl-8 pr-4 py-2 rounded-md bg-primary-foreground text-primary focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ShoppingCartIcon className="h-6 w-6" />
          <span className="sr-only">Cart</span>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="md:hidden">
            <div className="grid gap-4 p-4">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
                prefetch={false}
              >
                <CarIcon className="w-6 h-6" />
                <span>MtokaaHeroHero</span>
              </Link>
              <Link href="#" className="text-sm font-medium" prefetch={false}>
                Home
              </Link>
              <Link href="#" className="text-sm font-medium" prefetch={false}>
                Parts
              </Link>
              <Link href="#" className="text-sm font-medium" prefetch={false}>
                Vehicles
              </Link>
              <Link href="#" className="text-sm font-medium" prefetch={false}>
                Services
              </Link>
              <Link href="#" className="text-sm font-medium" prefetch={false}>
                About
              </Link>
              <Link href="#" className="text-sm font-medium" prefetch={false}>
                Contact
              </Link>
              <Link href="#" className="text-sm font-medium" prefetch={false}>
                Create Account
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
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

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function ShoppingCartIcon(
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
