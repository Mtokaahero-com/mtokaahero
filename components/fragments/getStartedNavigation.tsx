import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, MenuIcon, ShoppingCartIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Navigation = () => (
    <nav className="sticky top-0 z-10 flex items-center justify-between flex-wrap bg-gray-800 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
            <span className="font-semibold text-xl tracking-tight">MtokaaHero</span>
        </div>
       
        <div className="hidden lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
                <Link href="#" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                    Home
                </Link>
                <Link href="#" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                    Services
                </Link>
                <Link href="#" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                    Mechanics
                </Link>
                <Link href="#" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4">
                    Products
                </Link>
                <Link href="#" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400">
                    Contact
                </Link>
            </div>
        </div>
        <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-white relative">
                <ShoppingCartIcon className="h-[1.2rem] w-[1.2rem]" />
                <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs font-bold rounded-full">
                    3
                </Badge>
                <span className="sr-only">Shopping cart</span>
            </Button>
        </div>

         <div className="block lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button >
                        <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <div className="mt-6 flex flex-col space-y-2">
                        <a href="#" className="text-gray-800 hover:text-gray-600">
                            Home
                        </a>
                        <a href="#" className="text-gray-800 hover:text-gray-600">
                            Services
                        </a>
                        <a href="#" className="text-gray-800 hover:text-gray-600">
                            Mechanics
                        </a>
                        <a href="#" className="text-gray-800 hover:text-gray-600">
                            Products
                        </a>
                        <a href="#" className="text-gray-800 hover:text-gray-600">
                            Contact
                        </a>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    </nav>
);

export default Navigation;
