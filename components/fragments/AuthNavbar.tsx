

import Link from 'next/link';
import { useState } from 'react';


const NavbarAuth = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 h-29 bg-white`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between  h-24">
                        <div className="flex items-center">
                            <Link href="/">
                                <h2 className="text-2xl font-bold text-primary">M-Tokaa</h2>
                            </Link>
                        </div>
                        <div className="hidden md:block ">
                            <div className="ml-10 flex items-baseline space-x-4 text:sm">
                                <Link href="/">
                                    <span className="text-black/60 hover:text-black transition-colors duration-200">
                                        Home
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}



export default NavbarAuth;