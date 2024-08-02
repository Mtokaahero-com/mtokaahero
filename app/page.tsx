"use client"

import { Button } from "@/components/ui/button";
import Footer from "@/components/fragments/Footer";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";


const services = [
  {
    title: "Spare Parts",
    description: "Genuine Quality",
    image: "/spareparts.jpg",
  },
  {
    title: "Car Imports",
    description: "Worldwide Reach",
    image: "/export.png",
  },
  {
    title: "Vehicle Repair",
    description: "Certified Experts",
    image: "/maintenance.jpg",
  },
]


export default function Home() {
  return <main className="w-full  h-screen max-w-screen">
    <HeroSection />
    <StatsSection />
    <OurServices />
    <WhyChooseUs />
    <Testimonials />
    <Discovery />
    <GuideSection />
    <Footer />
  </main>;
}


export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
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
            className="font-bold text-4xl text-white border-white/40 rounded-full px-6 py-2 bg-transparent hover:bg-white/10 transition-colors duration-300"
          >
            <span className="mr-2 ">Drive Your Dreams Forward</span>
            <span className="text-brand_blue">Explore</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <h1 className="text-4xl md:text-6xl font-bold text-white max-w-2xl">
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
          >
          </motion.div> 
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="items-center justify-center w-screen md:h-[70vh] flex md:flex-row flex-col bg-white pt-9 ">
      <div className="md:w-[45%] w-96 h-full md:p-20 flex items-center justify-end">
        <div className="grid grid-cols-2 grid-rows-2 rounded-2xl md:h-[88%] md:w-[80%] h-full w-full">
          <div className="space-y-2 row-span-1 col-span-1 border rounded-tl-xl flex flex-col items-center justify-center">
            <Image
              src="/sold.svg"
              alt="Vehicle Market"
              width={100}
              height={100}
            />
            <p className="text-black/60 text-sm md:text-base font-bold">Vehicle Market</p>
            <h1 className="text-black   text-sm md:text-lg">
              {/* We help you sell your car */}
            </h1>
          </div>
          <div className="space-y-2 row-span-1 col-span-1 border rounded-tr-xl flex flex-col items-center justify-center">
            <Image
              src="/revenue.svg"
              alt="Garage Manager"
              width={100}
              height={100}
            />
            <p className="text-black/60 text-sm md:text-base font-bold">Garage Manager</p>
            <h1 className="text-black  text-sm md:text-lg text-center">
              {/* Manage your garage with ease online! */}
            </h1>
          </div>
          <div className="space-y-2 row-span-1 col-span-1 border rounded-bl-xl flex flex-col items-center justify-center">
            <Image
              src="/customer.svg"
              alt="Customer Satisfaction"
              width={100}
              height={100}
            />
            <p className="text-black/60 text-sm md:text-base font-bold">
              High Client Satisfaction
            </p>
            <h1 className="text-black text-sm md:text-3xl text-center">
              {/* Your Satisfaction is our Priority */}
            </h1>
          </div>
          <div className="space-y-2 row-span-1 col-span-1 border rounded-bl-xl flex flex-col items-center justify-center">
            <Image
              src="/repairs.svg"
              alt="Repairs Completed"
              height={100}
              width={100}
            />
            <p className="text-black/60 text-sm md:text-base font-bold">
              Car Imports 
            </p>
            <h1 className="text-black font-bold text-2xl md:text-3xl">
              {/* 78,513 */}
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[55%] h-full flex flex-col p-10 items-start justify-center space-y-4">
        <h1 className="text-black/60 font-bold text-base md:text-lg">
          Drive Excellence
        </h1>
        <h1 className="text-black font-bold text-2xl md:text-4xl w-80 md:w-[50%]">
          Revolutionizing the Way You Experience Automotive Services
        </h1>
        <p className="font-light text-black text-sm md:text-base">
          Revolutionizing the Way You Experience Automotive Services
        </p>
        <Button
          variant={"ghost"}
          className="hover:border-brand_blue rounded-xl w-36 border border-black/40 p-2 hover:bg-_brand_pink hover:bg-brand_blue transition-all duration-300 ease-linear hover:text-white"
        >
          Discover More
        </Button>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="items-center justify-center w-full h-[70vh] flex md:flex-row flex-col bg-white ">
      <div className="md:w-[50%] h-full md:p-20 p-10 flex items-center justify-end">
        <div className="h-full md:w-[60%] bg-black/10 border border-black/20">
          {/* Image */}
        </div>
      </div>
      <div className="md:w-[50%] h-full flex flex-col p-10 items-start justify-center space-y-6">
        <h1 className="text-3xl font-bold text-black w-96 md:w-[50%] text-balance">
          Transform Your Car Care Experience with MtokaaHero
        </h1>
        <p className="md:w-[50%]">
          Discover a seamless way to buy spare parts, import cars, and book
          vehicle repair services all in one place. Join thousands of satisfied
          customers today.
        </p>
        <Button>Get Started Now</Button>
        <ReviewCard />
      </div>
    </section>
  );
}


interface ReviewCardProps {
  Image?: string;
  name: string;
  rating: number | Float32Array;
  review_message: string;
}

// TODO: swotch to the other card declaration to make it dynamic
function ReviewCard() {
  // function ReviewCard(props) {
  // const {Image, name, rating, review_message} = props;

  const rating = 5;
  return (
    <div className="hover:border-brand_violet transition-all duration-300 ease-in-out hover:shadow-lg border md:w-[50%] h-40 rounded-2xl p-4 flex flex-col space-y-2">
      <span className="flex flex-row items-center justify-start space-x-2">
        <span className="flex">
          {Array(rating)
            .fill(null)
            .map((_, index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#FACC15"
                className="size-8"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
        </span>
        <p className="text-black/60">{rating}.0</p>
      </span>
      <p className="text-black/60">
        MtokaaHero saved me so much time on car repairs and parts.
      </p>
      <span className="flex items-center space-x-2">
        <Image
          className="h-8 w-8 rounded-full object-contain "
          src="/profile_user.jpg"
          alt=""
          height={32}
          width={32}
        />
        <p>Michael Johnson</p>
      </span>
    </div>
  );
}


function OurServices() {
  return (
    <section className="w-full md:h-[90vh] h-auto flex flex-col items-center justify-center space-y-2">
      <div className="md:w-[60%] w-full h-20 flex flex-col items-start justify-center p-4 space-y-2">
        <p className="text-start">Revamp Your Ride with MtokaaHero!</p>
        <h1 className="text-start font-bold text-2xl">Our Services</h1>
      </div>
      <div className="md:w-[60%] w-96 h-full grid md:grid-cols-4 md:grid-rows-2 grid-cols-1 grid-rows-4 ">
        <div className="md:row-span-1 md:col-span-3 flex flex-col col-span-1 row-span-1 p-2 space-y-4">
          <div className="h-80 w-[100%] md:h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Spare Parts</h1>
            <p>Genuine Quality</p>
          </span>
        </div>
        <div className="md:row-span-1 md:col-span-1 flex flex-col col-span-1 row-span-1 p-2 space-y-4">
          <div className="h-80 w-[100%] md:h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Car Imports</h1>

            <p>Worldwide Reach</p>
          </span>
        </div>
        <div className="md:row-span-1 md:col-span-2 flex flex-col col-span-1 row-span-1 p-2 space-y-4">
          <div className="h-80 w-[100%] md:h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Vehicle Repair</h1>
            <p>Certified Experts</p>
          </span>
        </div>
        <div className="md:row-span-1 md:col-span-2 flex flex-col col-span-1 row-span-1 p-2 space-y-4">
          <div className="h-80 w-fit md:h-fit bg-black/10 border rounded-2xl flex justify-center p-2 ">
            {/* Image */}
            <Image src="/customerservice.jpg" alt="alt"
              width={500}
              height={100}
              quality={100}
              loading="lazy"
            />
          </div>
          <span>
            <h1 className="font-bold text-xl">Customer Support</h1>
            <p>24/7 Assitance</p>
          </span>
        </div>
      </div>
    </section>
  )
}


function WhyChooseUs() {
  return (
    <section className="w-full md:h-[90vh] h-auto flex flex-col items-center justify-center">
      <div className="w-full md:w-[60%] h-20 flex flex-col items-start justify-center p-4 space-y-2">
        <p className="text-start">Drive with Confidence , Choose MtokaaHero!</p>
        <h1 className="text-start font-bold text-2xl">Why Choose Us</h1>
      </div>
      <div className="md:w-[60%] w-96 h-full grid md:grid-cols-4 md:grid-rows-2 grid-rows-4 grid-cols-1">
        <div className="md:row-span-1 md:col-span-3 row-span-1 col-span-1 flex flex-col p-2 space-y-4">
          <div className="w-80 h-80 md:w-[100%] md:h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Spare Parts</h1>
            <p>Genuine Quality</p>
          </span>
        </div>
        <div className="md:row-span-1 md:col-span-1 row-span-1 col-span-1 flex flex-col p-2 space-y-4">
          <div className="w-80 h-80 md:w-[100%] md:h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Car Imports</h1>

            <p>Worldwide Reach</p>
          </span>
        </div>
        <div className="md:row-span-1 md:col-span-2 row-span-1 col-span-1 flex flex-col p-2 space-y-4">
          <div className="w-80 h-80 md:w-[100%] md:h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Vehicle Repair</h1>
            <p>Certified Experts</p>
          </span>
        </div>
        <div className="md:row-span-1 md:col-span-2 row-span-1 col-span-1 flex flex-col p-2 space-y-4">
          <div className="w-80 h-80 md:w-[100%] md:h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Customer Support</h1>
            <p>24/7 Assitance</p>
          </span>
        </div>
      </div>
    </section>
  )
}


function Discovery() {
  return (
    <section className="space-y-4 md:space-y-0 items-center justify-center w-full md:h-[70vh] h-auto flex md:flex-row flex-col bg-white ">
      <div className="w-80 md:w-[35%] h-full flex flex-col justify-center space-y-4  ">
        <Image className="h-10 w-10" src="/bolt.svg" alt="" width={100} height={100}/>
        <h1 className="text-4xl font-bold md:w-[90%] w-full">
          Discover MtokaaHero Comprehensive Garage Solutions
        </h1>
        <p className="md:w-[65%] w-full">
          From spare parts to vehicle repairs, MtokaaHero has everything you
          need for your car.
        </p>
        <span className="flex flex-row items-center space-x-2">
          <button>
            <Image className="h-10 w-10" src="/chev_left.svg" alt="" height={10}  width={10}/>
          </button>
          <button>
            <Image className="h-10 w-10" src="/chev_right.svg" alt="" height={10} width={10}/>
          </button>
        </span>
      </div>
      <div className="overflow-hidden md:w-[30%] h-96 w-full md:h-full bg-black/10"></div>
      <Image className="bg-black/10 object-cover " src="" alt="" />
    </section>
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
          One-Stop Solution for All Your Automotive Needs
        </h1>
        <p className="md:w-[50%] w-full">
          From spare parts to car imports and repairs, MtokaaHero provides an
          all-in-one platform to cater to your vehicles every requirement.
        </p>
        <div className="flex items-center space-x-4">
          <Button>Start Today</Button>
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