/* eslint-disable react/no-unescaped-entities */
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/qyC6WwYNYDd
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JSX, SVGProps } from "react";
import Image from "next/image";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-12 md:py-24 px-6">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Top Selling Parts</h2>
              <p className="text-muted-foreground">
                Check out our most popular spare parts.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <Image
                  src="/brakepad.jpg"
                  width="300"
                  height="200"
                  alt="Part Image"
                  className="rounded-t-md"
                />
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-bold">Brake Pads</h3>
                  <p className="text-muted-foreground">$29.99</p>
                  <Button variant="destructive">Add to Cart</Button>
                </CardContent>
              </Card>
              <Card>
                <Image
                  src="/engine-oil.jpg"
                  width="300"
                  height="200"
                  alt="Part Image"
                  className="rounded-t-md"
                />
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-bold">Engine Oil</h3>
                  <p className="text-muted-foreground">$24.99</p>
                  <Button variant="destructive">Add to Cart</Button>
                </CardContent>
              </Card>
              <Card>
                <Image
                  src="/tires.jpg"
                  width="300"
                  height="200"
                  alt="Part Image"
                  className="rounded-t-md"
                />
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-bold">Tires </h3>
                  <p className="text-muted-foreground">$12.99</p>
                  <Button variant="destructive">Add to Cart</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="bg-muted-foreground py-12 md:py-24 px-6">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Imported Vehicles</h2>
              <p className="text-muted-foreground">
                Browse our selection of high-quality imported vehicles.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <Image
                  src="/toyota.jpg"
                  width="300"
                  height="200"
                  alt="Vehicle Image"
                  className="rounded-t-md"
                />
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-bold">Toyota Corolla</h3>
                  <p className="text-muted-foreground">$18,999</p>
                  <Button variant="destructive">View Details</Button>
                </CardContent>
              </Card>
              <Card>
                <Image
                  src="/honda.jpg"
                  width="300"
                  height="200"
                  alt="Vehicle Image"
                  className="rounded-t-md"
                />
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-bold">Honda Civic</h3>
                  <p className="text-muted-foreground">$22,499</p>
                  <Button variant="destructive">View Details</Button>
                </CardContent>
              </Card>
              <Card>
                <Image
                  src="/nissan.jpg"
                  width="300"
                  height="200"
                  alt="Vehicle Image"
                  className="rounded-t-md"
                />
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-bold">Nissan Altima</h3>
                  <p className="text-muted-foreground">$20,999</p>
                  <Button variant="destructive">View Details</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 px-6">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Our Services</h2>
              <p className="text-muted-foreground">
                Let our expert mechanics take care of your vehicle.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <WrenchIcon className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-bold">Maintenance</h3>
                  <p className="text-muted-foreground">
                    Regular maintenance to keep your vehicle running smoothly.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <BoltIcon className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-bold">Repairs</h3>
                  <p className="text-muted-foreground">
                    Expert repairs for all your vehicle's needs.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <ClipboardIcon className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-bold">Diagnostics</h3>
                  <p className="text-muted-foreground">
                    Comprehensive diagnostics to identify and fix any issues.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="bg-muted py-12 md:py-24 px-6">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Contact Us</h2>
              <p className="text-muted-foreground">
                Get in touch with us for all your automotive needs.
              </p>
            </div>
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" placeholder="Enter your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="Enter your email" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Enter your message"
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

function BoltIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function ClipboardIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
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

function WrenchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
