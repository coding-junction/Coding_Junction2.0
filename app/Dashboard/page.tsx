"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, Settings } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Dashboard = () => {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <UserCog className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />,
    }
  ];
  
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-neutral-800">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SignedIn>
            <UserButton/>
            </SignedIn>
          </div>
        </SidebarBody>
      </Sidebar>
      <DashboardContent />
    </div>
  );
}

export const Logo = () => (
  <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
    <div className="h-5 w-6 bg-black dark:bg-white rounded-lg" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium text-black dark:text-white whitespace-pre">
      Coding Junction
    </motion.span>
  </Link>
);

export const LogoIcon = () => (
  <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
    <div className="h-5 w-6 bg-black dark:bg-white rounded-lg" />
  </Link>
);

const DashboardContent = () => (
  <div className="flex flex-1 p-4 md:p-8 bg-white dark:bg-neutral-900 h-full w-full">
    <div className="flex flex-col w-full h-full">
    <h1 className="text-base sm:text-lg md:text-4xl text-dark/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">Welcome to Coding Junction</h1>
      {/* Top Cards */}
      <div className="flex gap-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 flex-1 rounded-lg bg-gray-200 dark:bg-neutral-800 animate-pulse" />
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="flex gap-4 flex-1">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-full w-1/2 rounded-lg bg-gray-200 dark:bg-neutral-800 animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

export default Dashboard;