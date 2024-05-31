import NavBarComponent from "./components/Navbar/Nav.tsx";
import Categories from "./components/Categories/Categories.tsx";
import Hero from "./pages/Hero/Hero.tsx";
import Footer from "./components/Footer/Footer.tsx";



function App() {

  return (
    <main className="bg-blue-950 h-full w-full">
     <div>
        <NavBarComponent />
        <Categories />
        <Hero />
        <Footer />
     </div>
    </main>
  )
}

export default App
