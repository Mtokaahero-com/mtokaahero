import { Button } from "@/components/ui/button";
import Footer from "@/components/fragments/Footer";


export default function Home() {
  return <main className="w-full  h-screen max-w-screen  space-y-20">
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


function NavBar() {

  const nav_links = [
    {
      title: "Home",
      location: "/"
    },
    {
      title: "Services",
      location: "/"
    },
    {
      title: "About",
      location: "/"
    },
    {
      title: "Contact",
      location: "/"
    },
    {
      title: "Help",
      location: "/"
    }
  ]
  return (
    <section className="absolute top-0 w-[90vw] h-20 flex flex-row items-center justify-between ">
      <div className="flex flex-row items-center justify-center space-x-8">
        <a href="/">
          <img src="/logo.svg" alt="logo" />
        </a>
        {
          nav_links.map(link => (
            <a className="text-black/60 hover:text-black" key={link.title} href={link.location}>{link.title} </a>
          ))
        }
      </div>
      <div className="space-x-4">
        <Button variant={"ghost"} className="w-28 hover:border hover:border-black/40 hover:bg-brand_pink p-2">Sign In</Button>
        <Button className="w-28 p-2">Sign Up</Button>
      </div>
    </section>
  )
}

function HeroSection() {
  return (
    <section className="relative p-36 space-y-10 w-auto h-full bg-brand_pink  flex flex-col items-start justify-center ">
      <NavBar />
      <Button variant={"ghost"} className="font-bold border border-black/40 rounded-2xl space-x-2 flex flex-row items-center justify-center">
        <span>Drive Your Dreams Forward </span>
        <span className="text-brand_blue">Explore</span>
      </Button>
      <h1 className="text-6xl font-bold w-[40vw] ">Welcome to MtokaaHero Your Ultimate Garage Solution</h1>
      <p>From  spare parts to vehichle repairs, we've got you covered.</p>
      <div className="space-x-4">
        <Button variant={"ghost"} className="w-28 border border-black/40 p-2 hover:bg-_brand_pink">Learn More</Button>
        <Button className="w-28 p-2">Get Started</Button>
      </div>
    </section>
  );
}


function StatsSection() {
  return (
    <section className="items-center justify-center w-full h-[70vh] flex md:flex-row flex-col bg-white ">
      <div className="w-[45%] h-full p-20 flex items-center justify-end">
        <div className="grid grid-cols-2 grid-rows-2 rounded-2xl h-[88%] w-[80%] ">
          <div className="space-y-2 row-span-1 col-span-1 border rounded-tl-xl flex flex-col items-center justify-center">
            <img src="/sold.svg" alt="" />
            <p className="text-black/60">Vehicles Sold</p>
            <h1 className="text-black text-3xl font-bold">5.5 million</h1>
          </div>
          <div className="space-y-2 row-span-1 col-span-1 border rounded-tr-xl flex flex-col items-center justify-center">
            <img src="/revenue.svg" alt="" />
            <p className="text-black/60">Revenue Generated</p>
            <h1 className="text-black text-3xl font-bold">24 billion</h1>
          </div>
          <div className="space-y-2 row-span-1 col-span-1 border rounded-bl-xl flex flex-col items-center justify-center">
            <img src="/customer.svg" alt="" />
            <p className="text-black/60">Customer Satisfaction</p>
            <h1 className="text-black text-3xl font-bold">99%</h1>
          </div>
          <div className="space-y-2 row-span-1 col-span-1 border rounded-bl-xl flex flex-col items-center justify-center">
            <img src="/repairs.svg" alt="" />
            <p className="text-black/60">Repairs Completed</p>
            <h1 className="text-black text-3xl font-bold">78, 513</h1>
          </div>
        </div>
      </div>
      <div className="w-[55%] h-full flex flex-col p-10 items-start justify-center space-y-4">
        <h1 className="text-black/60 font-bold">Drive Excellence</h1>
        <h1 className="text-black font-bold text-4xl w-[50%] ">
          Revolutionizing the Way You Experience Automotive Services
        </h1>
        <p className="font-light text-black">Revolutionizing the Way You Experience Automotive Services</p>
        <Button variant={"ghost"} className="rounded-xl w-36 border border-black/40 p-2 hover:bg-_brand_pink">Discover More</Button>
      </div>
    </section>
  )
}


function Testimonials() {
  return (
    <section className="items-center justify-center w-full h-[70vh] flex md:flex-row flex-col bg-white ">
      <div className="w-[50%] h-full p-20 flex items-center justify-end">
        <div className="h-full md:w-[60%] bg-black/10 border border-black/20">
          {/* img */}
        </div>
      </div>
      <div className="w-[50%] h-full flex flex-col p-10 items-start justify-center space-y-6">
        <h1 className="text-3xl font-bold text-black w-[50%] text-balance">
          Transform Your Car Care Experience with MtokaaHero
        </h1>
        <p className="w-[50%]">Discover a seamless way to buy spare parts, import cars, and book vehicle repair services all in one place. Join thousands of satisfied customers today.</p>
        <Button>Get Started Now</Button>
        <ReviewCard />
      </div>
    </section>
  )
}


interface ReviewCardProps {
  img?: string
  name: string
  rating: number | Float32Array;
  review_message: string
}

// TODO: swotch to the other card declaration to make it dynamic
function ReviewCard() {
  // function ReviewCard(props) {
  // const {img, name, rating, review_message} = props;

  const rating = 5
  return (
    <div className="border w-[50%] h-40 rounded-2xl p-4 flex flex-col space-y-2">
      <span className="flex flex-row items-center justify-start space-x-2">
        <span className="flex">
          {
            Array(rating).fill(null).map((_, index) => (
              <svg key={index} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FACC15" className="size-8">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
            ))
          }
        </span>
        <p className="text-black/60">{rating}.0</p>
      </span>
      <p className="text-black/60">MtokaaHero saved me so much time on car repairs and parts.</p>
      <span className="flex items-center space-x-2">
        <img className="h-8 w-8 rounded-full object-contain " src="/profile_user.jpg" alt="" />
        <p>Michael Johnson</p>
      </span>

    </div>
  )
}


function OurServices() {
  return (
    <section className="w-full h-[90vh] flex flex-col items-center justify-center space-y-2">
      <div className="w-[60%] h-20 flex flex-col items-start justify-center p-4 space-y-2">
        <p className="text-start">Revamp Your Ride with MtokaaHero!</p>
        <h1 className="text-start font-bold text-2xl">Our Services</h1>
      </div>
      <div className="w-[60%] h-full grid grid-cols-4 grid-rows-2 ">
        <div className="row-span-1 col-span-3 flex flex-col p-2 space-y-4">
          <div className="w-[100%] h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Spare Parts</h1>
            <p>Genuine Quality</p>
          </span>
        </div>
        <div className="row-span-1 col-span-1 flex flex-col p-2 space-y-4">
          <div className="w-[100%] h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Car Imports</h1>

            <p>Worldwide Reach</p>
          </span>
        </div>
        <div className="row-span-1 col-span-2 flex flex-col p-2 space-y-4">
          <div className="w-[100%] h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Vehicle Repair</h1>
            <p>Certified Experts</p>
          </span>
        </div>
        <div className="row-span-1 col-span-2 flex flex-col p-2 space-y-4">
          <div className="w-[100%] h-[100%] bg-black/10 border rounded-2xl  "></div>
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
    <section className="w-full h-[90vh] flex flex-col items-center justify-center">
      <div className="w-[60%] h-20 flex flex-col items-start justify-center p-4 space-y-2">
        <p className="text-start">Drive with Confidence , Choose MtokaaHero!</p>
        <h1 className="text-start font-bold text-2xl">Why Choose Us</h1>
      </div>
      <div className="w-[60%] h-full grid grid-cols-4 grid-rows-2 ">
        <div className="row-span-1 col-span-3 flex flex-col p-2 space-y-4">
          <div className="w-[100%] h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Spare Parts</h1>
            <p>Genuine Quality</p>
          </span>
        </div>
        <div className="row-span-1 col-span-1 flex flex-col p-2 space-y-4">
          <div className="w-[100%] h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Car Imports</h1>

            <p>Worldwide Reach</p>
          </span>
        </div>
        <div className="row-span-1 col-span-2 flex flex-col p-2 space-y-4">
          <div className="w-[100%] h-[100%] bg-black/10 border rounded-2xl  "></div>
          <span>
            <h1 className="font-bold text-xl">Vehicle Repair</h1>
            <p>Certified Experts</p>
          </span>
        </div>
        <div className="row-span-1 col-span-2 flex flex-col p-2 space-y-4">
          <div className="w-[100%] h-[100%] bg-black/10 border rounded-2xl  "></div>
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
    <section className="items-center justify-center w-full h-[70vh] flex md:flex-row flex-col bg-white " >

      <div className="w-[35%] h-full flex flex-col justify-center space-y-4  ">
        <img className="h-10 w-10" src="/bolt.svg" alt="" />
        <h1 className="text-4xl font-bold w-[90%] ">Discover MtokaaHero's Comprehensive Garage Solutions</h1>
        <p className="w-[65%] ">From spare parts to vehicle repairs, MtokaaHero has everything you need for your car.</p>
        <span className="flex flex-row items-center space-x-2">
          <button>
            <img className="h-10 w-10" src="/chev_left.svg" alt="" />
          </button>
          <button>
            <img className="h-10 w-10" src="/chev_right.svg" alt="" />
          </button>
        </span>
      </div>
      <div className="overflow-hidden w-[30%] h-full bg-black/10"></div>
      <img className="bg-black/10 object-cover " src="" alt="" />
    </section>
  )
}

function GuideSection() {
  return (
    <section className="items-center justify-center w-full h-[70vh] flex md:flex-row flex-col bg-white ">
      <div className="w-[50%] h-full p-20 flex items-center justify-end">
        <div className="h-full md:w-[60%] bg-black/10 border border-black/20">
          {/* img */}
        </div>
      </div>
      <div className="w-[50%] h-full flex flex-col p-10 items-start justify-center space-y-6">

        <Button variant={"ghost"} className="border rounded-xl font-bold">Your Car, Our Priority</Button>
        <h1 className="text-3xl font-bold text-black w-[50%] text-balance">
          One-Stop Solution for All Your Automotive Needs
        </h1>
        <p className="w-[50%]">
          From spare parts to car imports and repairs, MtokaaHero provides an all-in-one platform to cater to your vehicle's every requirement.
        </p>
        <div className="flex items-center space-x-4">

          <Button>Start Today</Button>
          <Button variant={"ghost"} className="border rounded-xl font-bold space-x-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
            </svg>
            <span>Watch Video</span>
          </Button>
        </div>
      </div>
    </section>
  )
}