
import Link from "next/link";
import { JSX, SVGProps } from "react";

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="max-w-md w-full space-y-4 px-4">
        <h1 className="text-3xl font-bold text-foreground">
          Choose Your Account Type
        </h1>
        <p className="text-muted-foreground">
          Select whether you would like to sign up as a mechanic or a garage owner.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/auth/service-accounts/mechanic/signup"
            className="bg-card p-6 rounded-lg shadow-md hover:bg-accent hover:text-accent-foreground transition-colors flex flex-col items-center justify-center gap-2"
            prefetch={false}
          >
            <WrenchIcon className="size-8 text-primary" />
            <h2 className="text-xl font-bold">Sign up as Mechanic</h2>
            <p className="text-sm text-muted-foreground">
              Create an account to offer your services.
            </p>
          </Link>
          <Link
            href="/auth/service-accounts/garage/signup"
            className="bg-card p-6 rounded-lg shadow-md hover:bg-accent hover:text-accent-foreground transition-colors flex flex-col items-center justify-center gap-2"
            prefetch={false}
          >
            <BuildingIcon className="size-8 text-primary" />
            <h2 className="text-xl font-bold">Sign up as Garage Owner</h2>
            <p className="text-sm text-muted-foreground">
              Create an account to manage your garage.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function BuildingIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
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
