import {useState} from 'react';
import {GiHamburgerMenu} from 'react-icons/gi';
import Logo from '../../assets/logo.png';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <img className="h-[132px]" src={Logo} alt="Logo"/>
                        </div>
                    </div>
                    <div className="hidden md:flex md:items-center">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a href="#"
                               className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </a>
                            <a href="#"
                               className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                About
                            </a>
                            <a href="#"
                               className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                Contact
                            </a>
                            <a href="#"
                               className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                Services
                            </a>
                            <a href="#"
                               className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                Blog
                            </a>
                            <a href="#"
                               className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                Careers
                            </a>
                            <a href="#"
                               className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                Login
                            </a>
                        </div>
                    </div>
                    <div className=" md:flex md:items-center">
                        <button className="bg-blue-950 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full">
                            Sign In
                        </button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button
                            className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
                            onClick={toggleMenu}
                        >
                            <GiHamburgerMenu className="h-6 w-6"/>
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-blue-900 bg-opacity-70">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <a href="#"
                           className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                            Home
                        </a>
                        <a href="#"
                           className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                            About
                        </a>
                        <a href="#"
                           className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                            Contact
                        </a>
                        <a href="#"
                           className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                            Services
                        </a>
                        <a href="#"
                           className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                            Blog
                        </a>
                        <a href="#"
                           className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                            Careers
                        </a>
                        <a href="#"
                           className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                            Login
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;