"use client";

import { Button } from "@/components/ui/button";
import Footer from "@/components/fragments/Footer";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BatteryIcon,
  BracketsIcon,
  FuelIcon,
  MonitorCheckIcon,
  ServerIcon,
  WrenchIcon,
  CheckIcon,
} from "@/components/ui/icons";
import Navbar from "@/components/fragments/Navbar";

export default function Home() {
  return (
    <main className="w-full  h-screen max-w-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <OurServices />
      <WhyChooseUs />
      {/* <Testimonials /> */}
      {/* <Discovery /> */}
      <GuideSection />
      <Footer />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden ">
      {/* Background video */}
      <video
        autoPlay={true}
        loop={true}
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/dazptrvgj/video/upload/v1722592933/7565182-uhd_4096_2160_25fps_zsffdo.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to darken the video */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 md:space-y-8"
        >
          <Button
            variant="outline"
            className="font-bold text-2xl text-white border-white/40 rounded-full px-6 py-2 bg-transparent hover:bg-white/10 transition-colors duration-300"
          >
            <span className="mr-2 ">Drive Your Dreams Forward</span>
            <span className="text-brand_blue">Explore</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <h1 className="text-4xl md:text-4xl font-bold text-white max-w-2xl">
            Welcome to MtokaaHero
            <span className="block text-brand_blue">
              Your Ultimate Garage Solution
            </span>
          </h1>

          <p className="text-xl text-white/80 max-w-xl">
            From spare parts to vehicle repairs, we ve got you covered.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Button
              variant="outline"
              className="w-40 text-black border-white/40 hover:bg-white hover:text-black transition-colors duration-300"
            >
              Learn More
            </Button>
            <Button className="w-40 bg-brand_blue hover:bg-brand_blue/80 transition-colors duration-300">
              Get Started
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12"
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section
      className="relative items-center justify-center w-screen md:h-[70vh] flex md:flex-row flex-col bg-cover bg-center pt-9"
      style={{ backgroundImage: "url('/stats3.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 w-full md:w-[55%] h-full flex flex-col p-10 items-start justify-center space-y-4">
        <h1 className="text-white font-bold text-base md:text-lg">
          Drive Excellence
        </h1>
        <h1 className="text-white font-bold text-2xl md:text-4xl w-80 md:w-[50%]">
          Revolutionizing the Way You Experience Automotive Services
        </h1>
        <p className="text-white font-light text-sm md:text-base">
          Revolutionizing the Way You Experience Automotive Services
        </p>
        <Button
          variant={"secondary"}
          className="hover:border-brand_blue rounded-xl w-36 border border-white p-2 hover:bg-_brand_pink hover:bg-brand_blue transition-all duration-300 ease-linear hover:text-white"
        >
          Discover More
        </Button>
      </div>
    </section>
  );
}

function OurServices() {
  return (
    <div className="flex flex-col">
      <section id="services" className="py-12 md:py-20 ">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3 md:px-6">
          <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
            <FuelIcon className="h-12 w-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Oil Change</h3>
            <p className="mt-2 text-muted-foreground">
              Keep your engine running smoothly with our expert oil change
              service.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
            <WrenchIcon className="h-12 w-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Tire Rotation</h3>
            <p className="mt-2 text-muted-foreground">
              Extend the life of your tires with our professional tire rotation
              service.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
            <MonitorCheckIcon className="h-12 w-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Engine Diagnostics</h3>
            <p className="mt-2 text-muted-foreground">
              Identify and resolve any issues with our comprehensive engine
              diagnostics.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
            <BracketsIcon className="h-12 w-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Brake Service</h3>
            <p className="mt-2 text-muted-foreground">
              Ensure your safety with our expert brake inspection and repair
              services.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
            <BatteryIcon className="h-12 w-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Battery Replacement</h3>
            <p className="mt-2 text-muted-foreground">
              Keep your vehicle powered with our reliable battery replacement
              service.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm transition-colors hover:bg-card-hover">
            <ServerIcon className="h-12 w-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Transmission Service</h3>
            <p className="mt-2 text-muted-foreground">
              Maintain your transmission with our expert service and repair
              solutions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function WhyChooseUs() {
  return (
    <div className="flex flex-col  w-full  items-center justify-center">
      <main className="flex-1 grid md:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16 items-center bg-slate-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Create a Mechanic/Garage Account
          </h2>
          <p className="text-muted-foreground">
            Streamline your automotive services with our powerful tools and
            features:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">Sign In</Button>
            <Button>Create Account</Button>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <CheckIcon className="h-4 w-4 mr-2 inline-block" />
              Manage customer appointments and service history
            </li>
            <li>
              <CheckIcon className="h-4 w-4 mr-2 inline-block" />
              Track inventory and order parts seamlessly
            </li>
            <li>
              <CheckIcon className="h-4 w-4 mr-2 inline-block" />
              Generate detailed invoices and reports
            </li>
          </ul>
        </section>
        <section className="space-y-4">
          {/* //? CUSTOMERS */}
          <h2 className="text-2xl font-bold">Our Customers</h2>
          <p className="text-muted-foreground">
            Find the best mechanics and schedule services with ease:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href={"/auth/customers/signin"}>
              <Button variant="outline">Sign In</Button>
            </Link>
            <Button>Find Garages</Button>
            <Button>Book Service</Button>
          </div>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <CheckIcon className="h-4 w-4 mr-2 inline-block" />
              Search and compare local mechanics and garages
            </li>
            <li>
              <CheckIcon className="h-4 w-4 mr-2 inline-block" />
              Schedule appointments for maintenance and repairs
            </li>
            <li>
              <CheckIcon className="h-4 w-4 mr-2 inline-block" />
              Track the status of your vehicles service
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function GuideSection() {
  return (
    <section className="md:mt-0 mt-20 items-center justify-center w-full md:h-[70vh] h-auto flex md:flex-row flex-col bg-white ">
      <div className="md:w-[50%] w-full h-full md:p-20 p-2 flex items-center justify-end">
        <div className="w-full md:h-full h-80 md:w-[60%] bg-black/10 border border-black/20">
          {/* Image */}
        </div>
      </div>
      <div className="md:w-[50%] h-full flex flex-col p-10 items-start justify-center space-y-6">
        <Button variant={"ghost"} className="border rounded-xl font-bold">
          Your Car, Our Priority
        </Button>
        <h1 className="text-3xl font-bold text-black w-full md:w-[50%] text-balance">
          One-Stop Solution for All Your Import Needs
        </h1>
        <p className="md:w-[50%] w-full">
          From spare parts to car imports and repairs, MtokaaHero provides an
          all-in-one platform to cater to your vehicles every requirement.
        </p>
        <div className="flex items-center space-x-4">
          <Button>Import With US Today</Button>
          <Button
            variant={"ghost"}
            className="border rounded-xl font-bold space-x-2 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
              />
            </svg>
            <span>Watch Video</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
