/**
 * v0 by Vercel.
 * @see https://v0.dev/t/L2kAdcqhti2
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Component() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-primary to-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32 xl:py-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground">
              Set up Your Garage Account
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80">
              Join our network of trusted automotive repair services and connect
              with customers in your area.
            </p>
          </div>
          <Card className="bg-background p-6 md:p-8 lg:p-10 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Set Up Your Garage Account
              </CardTitle>
                          <Link href="/auth/garage/signin" prefetch={false} className="text-center">
                              <span className="text-red-600 hover:text-primary/90">
                                  Sign in to your account
                              </span>
                          </Link>
              <CardDescription>
                Fill out the form below to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="garage-name">Garage Name</Label>
                    <Input
                      id="garage-name"
                      placeholder="Acme Auto Repair"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="owner-name">Owner Name</Label>
                    <Input id="owner-name" placeholder="John Doe" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, Anytown USA"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 555-5555"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full md:col-span-2">
                    Sign Up
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
