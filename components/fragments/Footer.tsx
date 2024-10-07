import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-600 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-primary">MtokaaHero</h2>
                        <p className="text-sm">Empowering automotive businesses with cutting-edge SaaS solutions.</p>
                        <div className="flex space-x-4">
                            <Link href="https://facebook.com" className="hover:text-primary">
                                <Facebook size={20} />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="https://twitter.com" className="hover:text-primary">
                                <Twitter size={20} />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="https://instagram.com" className="hover:text-primary">
                                <Instagram size={20} />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="https://linkedin.com" className="hover:text-primary">
                                <Linkedin size={20} />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="hover:text-primary">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-primary">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-primary">
                                    Our Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-primary">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Services</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/services/garage-management" className="hover:text-primary">
                                    Garage Management
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/mechanic-tools" className="hover:text-primary">
                                    Mechanic Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/inventory-tracking" className="hover:text-primary">
                                    Inventory Tracking
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/appointment-scheduling" className="hover:text-primary">
                                    Appointment Scheduling
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/financial-analytics" className="hover:text-primary">
                                    Financial Analytics
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2">
                                <Mail size={16} />
                                <span>info@mtokaahero.com</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone size={16} />
                                <span>+254 123 456 789</span>
                            </li>
                            <li>123 Automotive Street</li>
                            <li>Nairobi, Kenya</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                    <p>&copy; {new Date().getFullYear()} MtokaaHero. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
