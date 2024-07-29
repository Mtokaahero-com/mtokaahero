import Header from "@/components/fragments/Header";
import Hero from "@/components/fragments/Hero";


export default function Home() {
  return (
    <main className="">
      <Header />
      <Hero />
    </main>
  );
}

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/dwdVyMxLmCp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"

export default function Component() {
  return (
    <section className="w-full">
      <div className="container grid gap-10 py-12 md:grid-cols-2 md:py-24 lg:py-32">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <BikeIcon className="h-10 w-10" />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Motoka</h1>
          </div>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Your one-stop shop for vehicle spare parts, car imports, and repair services.
          </p>
          <Link
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Explore Motoka
          </Link>
        </div>
        <img
          src="/placeholder.svg"
          width={800}
          height={600}
          alt="Motoka Garage"
          className="mx-auto rounded-xl object-cover"
        />
      </div>
      <div className="container grid gap-6 py-12 md:grid-cols-3 md:py-24 lg:py-32">
        <div className="rounded-xl bg-muted p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <WrenchIcon className="h-10 w-10" />
            <h3 className="text-xl font-bold">Spare Parts</h3>
          </div>
          <p className="text-muted-foreground">Browse our extensive catalog of genuine vehicle spare parts.</p>
          <Link
            href="#"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            prefetch={false}
          >
            Explore Spare Parts
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-xl bg-muted p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <ImportIcon className="h-10 w-10" />
            <h3 className="text-xl font-bold">Car Imports</h3>
          </div>
          <p className="text-muted-foreground">Import your dream car from anywhere in the world.</p>
          <Link
            href="#"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            prefetch={false}
          >
            Explore Car Imports
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-xl bg-muted p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <WrenchIcon className="h-10 w-10" />
            <h3 className="text-xl font-bold">Repair Services</h3>
          </div>
          <p className="text-muted-foreground">Get your vehicle serviced by our team of expert mechanics.</p>
          <Link
            href="#"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            prefetch={false}
          >
            Explore Repair Services
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ArrowRightIcon(props) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}


function BikeIcon(props) {
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
      <circle cx="18.5" cy="17.5" r="3.5" />
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="15" cy="5" r="1" />
      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
    </svg>
  )
}


function ImportIcon(props) {
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
      <path d="M12 3v12" />
      <path d="m8 11 4 4 4-4" />
      <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" />
    </svg>
  )
}


function WrenchIcon(props) {
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
  )
}


function XIcon(props) {
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
  )
}