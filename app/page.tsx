import { Button } from "@/components/ui/button";
import Footer from "@/components/fragments/Footer";
import Navbar from "@/components/fragments/Navbar";
import Image from "next/image";


export default function Home() {
  return <main className="w-full  h-screen max-w-screen space-y-20">
    <HeroSection />
    <StatsSection />
    <Testimonials />
    <OurServices />
    <WhyChooseUs />
    <Discovery />
    <GuideSection />
    <Footer />
  </main>;
}



function HeroSection() {
  return (
    <section className="relative p-2 md:p-36 space-y-6 md:space-y-10 md:w-auto w-full h-full bg-brand_pink  flex flex-col items-start justify-center ">
      <Navbar />
      <Button
        variant={"ghost"}
        className="font-bold border border-black/40 rounded-2xl space-x-2 flex flex-row items-center justify-center"
      >
        <span>Drive Your Dreams Forward </span>
        <span className="text-brand_blue">Explore</span>
      </Button>
      <h1 className="md:text-6xl text-5xl font-bold w-96 md:w-[40%] ">
        Welcome to MtokaaHero Your Ultimate Garage Solution
      </h1>
      <p>From spare parts to vehichle repairs, we got you covered.</p>
      <div className="space-x-4">
        <Button
          variant={"ghost"}
          className="w-28 border border-black/40 p-2 hover:bg-_brand_pink"
        >
          Learn More
        </Button>
        <Button className="w-28 p-2">Get Started</Button>
      </div>
    </section>
  );
}


function StatsSection() {
  return (
    <section className="items-center justify-center w-screen md:h-[70vh] flex md:flex-row flex-col bg-white ">
      <div className="md:w-[45%] w-96 h-full md:p-20 flex items-center justify-end ">
        <div className="grid grid-cols-2 grid-rows-2 rounded-2xl md:h-[88%] md:w-[80%] h-full w-full">
          <div className="space-y-2 row-span-1 col-span-1 border rounded-tl-xl flex flex-col items-center justify-center">
            <Image src="/sold.svg" alt="" />
            <p className="text-black/60">Vehicles Sold</p>
            <h1 className="text-black md:text-3xl text-2xl font-bold">
              5.5 million
            </h1>
          </div>
          <div className="space-y-2 row-span-1 col-span-1 border rounded-tr-xl flex flex-col items-center justify-center">
            <Image src="/revenue.svg" alt="" />
            <p className="text-black/60">Revenue Generated</p>
            <h1 className="text-black md:text-3xl text-2xl font-bold">
              24 billion
            </h1>
          </div>
          <div className="space-y-2 row-span-1 col-span-1 border rounded-bl-xl flex flex-col items-center justify-center">
            <Image src="/customer.svg" alt="" />
            <p className="text-black/60">Customer Satisfaction</p>
            <h1 className="text-black md:text-3xl text-2xl font-bold">99%</h1>
          </div>
          <div className="space-y-2 row-span-1 col-span-1 border rounded-bl-xl flex flex-col items-center justify-center">
            <Image src="/repairs.svg" alt="" />
            <p className="text-black/60">Repairs Completed</p>
            <h1 className="text-black md:text-3xl text-2xl font-bold">
              78, 513
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[55%] h-full flex flex-col p-10 items-start justify-center space-y-4">
        <h1 className="text-black/60 font-bold">Drive Excellence</h1>
        <h1 className="text-black font-bold text-4xl w-80 md:w-[50%] ">
          Revolutionizing the Way You Experience Automotive Services
        </h1>
        <p className="font-light text-black">
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
          <div className="h-80 w-[100%] md:h-[100%] bg-black/10 border rounded-2xl  "></div>
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
        <Image className="h-10 w-10" src="/bolt.svg" alt="" />
        <h1 className="text-4xl font-bold md:w-[90%] w-full">
          Discover MtokaaHero Comprehensive Garage Solutions
        </h1>
        <p className="md:w-[65%] w-full">
          From spare parts to vehicle repairs, MtokaaHero has everything you
          need for your car.
        </p>
        <span className="flex flex-row items-center space-x-2">
          <button>
            <Image className="h-10 w-10" src="/chev_left.svg" alt="" />
          </button>
          <button>
            <Image className="h-10 w-10" src="/chev_right.svg" alt="" />
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