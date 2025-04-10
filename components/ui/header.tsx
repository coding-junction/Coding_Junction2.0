"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";

export function Header1() {
    const [isOpen, setOpen] = useState(false);
    const router = useRouter();

    const navigationItems = [
        { title: "Home", href: "/" },
        { title: "Our App", href: "/App" },
        { title: "Meet Our Team", href: "/Team" },
        
    ];

    return (
        <>
            {/* Fixed Navbar */}
            <header className="fixed top-0 left-0 w-full bg-background shadow-md z-50">
                <div className="container mx-auto flex items-center justify-between py-4 px-6">
                    
                    {/* Left Side - Logo & Name */}
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="h-8 w-8" /> 
                        
                    </div>

                    {/* Center - Navigation */}
                    <div className="hidden lg:flex gap-6">
                        <NavigationMenu>
                            <NavigationMenuList className="flex gap-6">
                                {navigationItems.map((item) => (
                                    <NavigationMenuItem key={item.title}>
                                        <NavigationMenuLink asChild>
                                            <Link href={item.href} className="px-3 py-2 hover:bg-gray-800 rounded-md text-sm font-medium">
                                                {item.title}
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Right Side - Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        
                        <Button variant="outline" onClick={() => router.push("/sign-in")}>Sign in</Button>
                        <Button variant="outline" onClick={() => router.push("/sign-up")}>Sign Up</Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="fixed top-16 left-0 w-full bg-white shadow-md z-40">
                    <div className="flex flex-col p-4 space-y-4">
                        {navigationItems.map((item) => (
                            <Link key={item.title} href={item.href} className="block px-4 py-2 text-lg hover:bg-gray-100 rounded-md" onClick={() => setOpen(false)}>
                                {item.title}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-2">
                            <Button variant="outline" onClick={() => { router.push("/signin"); setOpen(false); }}>Sign in</Button>
                            <Button onClick={() => { router.push("/get-started"); setOpen(false); }}>Get started</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add padding to prevent content from being hidden behind the navbar */}
            <div className="pt-[70px]"></div>
        </>
    );
}
