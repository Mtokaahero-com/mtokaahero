"use client"
import { Button } from "../ui/button";


export function NavBar() {

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