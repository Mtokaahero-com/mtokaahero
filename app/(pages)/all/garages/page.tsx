/**
 * v0 by Vercel.
 * @see https://v0.dev/t/sG0FLuph8HV
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { JSX, SVGProps } from "react";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">Garages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>MtokaaHero Garage</CardTitle>
                <CardDescription>123 Main St, Anytown Kenya</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Services: Oil Change, Tire Rotation, Brake Repair</p>
                  <p>Hours: Mon-Fri 8am-6pm, Sat 8am-4pm</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  View Details
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Speedster Garage</CardTitle>
                <CardDescription>456 Oak Rd, Somewhere City</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    Services: Engine Repair, Transmission Service, Diagnostics
                  </p>
                  <p>Hours: Mon-Sat 7am-7pm</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  View Details
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Precision Auto</CardTitle>
                <CardDescription>789 Elm St, Othertown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Services: Bodywork, Painting, Detailing</p>
                  <p>Hours: Mon-Fri 9am-5pm, Sat 9am-3pm</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  View Details
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reliable Repairs</CardTitle>
                <CardDescription>321 Oak Ln, Somewhere Else</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Services: Electrical, Suspension, Alignment</p>
                  <p>Hours: Mon-Sat 8am-6pm</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  View Details
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Mechanics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>John Smith</CardTitle>
                <CardDescription>Master Technician</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Specialties: Engine Repair, Diagnostics</p>
                  <p>Rating: 4.8/5 (200 reviews)</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  View Profile
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sarah Lee</CardTitle>
                <CardDescription>Certified Technician</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Specialties: Brakes, Suspension</p>
                  <p>Rating: 4.6/5 (150 reviews)</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  View Profile
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Michael Johnson</CardTitle>
                <CardDescription>Master Technician</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Specialties: Electrical, HVAC</p>
                  <p>Rating: 4.9/5 (300 reviews)</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  View Profile
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Emily Davis</CardTitle>
                <CardDescription>Certified Technician</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Specialties: Transmission, Driveline</p>
                  <p>Rating: 4.7/5 (180 reviews)</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href="#"
                  className="text-primary hover:underline"
                  prefetch={false}
                >
                  View Profile
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <footer className="bg-muted text-muted-foreground py-4 px-6 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <p>&copy; 2024 MtokaaHero Automotive. All rights reserved.</p>
          <nav className="flex items-center gap-4">
            <Link href="#" className="hover:underline" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Terms of Service
            </Link>
            <Link href="#" className="hover:underline" prefetch={false}>
              Contact Us
            </Link>
          </nav>
        </div>
      </footer>
    </div>
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

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
