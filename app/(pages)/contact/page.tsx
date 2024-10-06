'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import Footer from '@/components/fragments/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

const useVisibleOnScroll = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Stop observing after it becomes visible
                }
            },
            { threshold: 0.1 }, // Trigger when 10% is visible
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return { ref, isVisible };
};

export default function ContactFAQPage() {
    const { ref, isVisible } = useVisibleOnScroll();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', { name, email, message });
        toast.success('Message sent successfully!');
        // Reset form fields
        setName('');
        setEmail('');
        setMessage('');
    };

    const navLinks = [
        { title: 'Home', location: '/' },
        { title: 'Services', location: '/services' },
        { title: 'Shop', location: '/shop' },
        { title: 'Contact', location: '/contact' },
        { title: 'Imports ', location: '/imports' },
    ];
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
        <Link href
        ={href} className="text-black/60 hover:text-black transition-colors duration-200">
            {children}
        </Link>
    );

    return (
        <div ref={ref} className={`fade-in ${isVisible ? 'visible' : ''}`}>
            <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 h-29 bg-transparent ">
                <div className="container mx-auto px-4 flex items-center justify-between h-full">
                    <div>
                        <Link href="/" passHref>
                                <Image src="/logo.svg" alt="MtokaaHero" width={120} height={40} />
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 text-black">
                        {navLinks.map((link) => (
                            <NavLink key={link.location} href={link.location}>
                                {link.title}
                            </NavLink>
                        ))}
                    </div>
                    <div className="md:hidden">
                        <Button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                            className="p-2 rounded-md">
                            {isMenuOpen ? <X /> : <Menu />}
                        </Button>
                    </div>
                </div>
            </nav>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Get in Touch</CardTitle>
                            <CardDescription>
                                Fill out the form below and we'll get back to you as soon as possible.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        placeholder="Your message here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <Send className="mr-2 h-4 w-4" /> Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div>
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    <li className="flex items-center">
                                        <Mail className="mr-2 h-5 w-5 text-primary" />
                                        <span>info@mtokaahero.com</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Phone className="mr-2 h-5 w-5 text-primary" />
                                        <span>+254 123 456 789</span>
                                    </li>
                                    <li className="flex items-center">
                                        <MapPin className="mr-2 h-5 w-5 text-primary" />
                                        <span>123 Automotive Street, Nairobi, Kenya</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>What is MtokaaHero?</AccordionTrigger>
                                        <AccordionContent>
                                            MtokaaHero is a comprehensive SaaS platform designed to empower automotive
                                            businesses, including garage managers and mechanics, with tools for
                                            efficient management, scheduling, and analytics.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>How can I sign up for MtokaaHero?</AccordionTrigger>
                                        <AccordionContent>
                                            You can sign up for MtokaaHero by visiting our homepage and clicking on the
                                            "Sign Up" button. Follow the prompts to create your account as either a
                                            garage manager or a mechanic.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
                                        <AccordionContent>
                                            Yes, we offer a 14-day free trial for all new users. This allows you to
                                            explore all features of the platform before committing to a subscription.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>What kind of support do you offer?</AccordionTrigger>
                                        <AccordionContent>
                                            We offer 24/7 customer support via email and live chat. Our support team is
                                            always ready to assist you with any questions or issues you may encounter
                                            while using MtokaaHero.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>
                                            Can I integrate MtokaaHero with other software?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes, MtokaaHero offers integrations with various popular business tools and
                                            software. For specific integration inquiries, please contact our support
                                            team.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
