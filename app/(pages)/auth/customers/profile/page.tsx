
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { JSX, SVGProps } from "react";
import Image from "next/image";

export default function Component() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 md:py-12">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 md:mb-12">
        <div className="flex-shrink-0">
          <Avatar className="w-24 h-24 md:w-32 md:h-32">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">John Doe</h1>
          <p className="text-muted-foreground">
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MailIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-muted-foreground">john@example.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-muted-foreground">+1 (555) 555-5555</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LocateIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Address</div>
                <div className="text-muted-foreground">
                  123 Main St, Anytown USA
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Account Details</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Username</div>
              <div className="text-muted-foreground">johndoe123</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium">Joined</div>
              <div className="text-muted-foreground">June 1, 2021</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium">Plan</div>
              <div className="text-muted-foreground">Pro</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium">Subscription</div>
              <div className="text-muted-foreground">
                Expires on September 30, 2023
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Order History</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/placeholder.svg"
                  alt="Product Image"
                  width={64}
                  height={64}
                  className="rounded-md"
                />
                <div>
                  <div className="font-medium">Acme Widgets</div>
                  <div className="text-muted-foreground">Order #12345</div>
                </div>
              </div>
              <div className="text-muted-foreground">
                <div>$99.99</div>
                <div>Delivered on June 15, 2023</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/placeholder.svg"
                  alt="Product Image"
                  width={64}
                  height={64}
                  className="rounded-md"
                />
                <div>
                  <div className="font-medium">Acme Gizmos</div>
                  <div className="text-muted-foreground">Order #67890</div>
                </div>
              </div>
              <div className="text-muted-foreground">
                <div>$49.99</div>
                <div>Delivered on April 22, 2023</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LocateIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

function MailIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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
