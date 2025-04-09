"use client";
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger, 
  DialogTitle 
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import json from "./team.json";
import { Button } from "@/components/ui/button";
import { DribbbleIcon, TwitchIcon, Mail } from "lucide-react";
import { TwitterLogoIcon, LinkedInLogoIcon, GitHubLogoIcon,InstagramLogoIcon } from "@radix-ui/react-icons";
import { Footer } from "../Footer/page";
import { NavBar } from "../NavBar/page";

export default function Team() {
  const teamArray = json.teamArray;
  
  const Gen = [
    { label: "President", key: "p" },
    { label: "Alumni", key: "a" },
    { label: "Gen 1", key: "1" },
    { label: "Gen 2", key: "2" },
    { label: "Gen 3", key: "3" }
  ];

  const [selectedGen, setSelectedGen] = useState("p");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-neutral-800">
        <NavBar/>
      {/* Mobile Header with Generations Dropdown */}
      <div className="md:hidden sticky top-0 z-50 bg-white dark:bg-neutral-900 shadow-sm">
        <div className="flex justify-between items-center p-4">
          <Logo />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-64 max-w-full">
              <DialogTitle className="sr-only">Select Team Generation</DialogTitle>
              <div className="flex flex-col gap-4">
                {Gen.map((gen) => (
                  <Button 
                    key={gen.key} 
                    variant={selectedGen === gen.key ? "default" : "outline"}
                    onClick={() => {
                      setSelectedGen(gen.key);
                      // You might want to close the dialog here
                    }}
                    className="w-full"
                  >
                    {gen.label}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 bg-white dark:bg-neutral-900 p-6 flex-col border-r dark:border-neutral-700">
          <Logo />
          <div className="mt-8 space-y-2">
            {Gen.map((gen) => (
              <Button 
                key={gen.key} 
                variant={selectedGen === gen.key ? "default" : "ghost"}
                onClick={() => setSelectedGen(gen.key)}
                className="w-full justify-start"
              >
                {gen.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto sm:mt-10 md:mt-20 lg:mt-25">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamArray.filter(member => member.gen === selectedGen).map(member => (
              <div 
                key={member.name} 
                className="flex flex-col items-center text-center gap-4 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 dark:border-neutral-700"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {member.role}
                    </p>
                  )}
                  <div className="mt-4 flex justify-center gap-3">
                    {member.tw && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        asChild 
                        className="text-blue-500 hover:bg-blue-500"
                      >
                        <Link href={member.tw} target="_blank" rel="noopener noreferrer">
                          <TwitterLogoIcon className="h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                    {member.li && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        asChild 
                        className="text-indigo-500 hover:bg-indigo-500"
                      >
                        <Link href={member.li} target="_blank" rel="noopener noreferrer">
                          <LinkedInLogoIcon className="h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                    {member.gh && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        asChild 
                        className="text-indigo-500 hover:bg-black-500"
                      >
                        <Link href={member.gh} target="_blank" rel="noopener noreferrer">
                          <GitHubLogoIcon className="h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                    {member.ig && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        asChild 
                        className="text-indigo-500 hover:bg-red-500"
                      >
                        <Link href={member.ig} target="_blank" rel="noopener noreferrer">
                          <InstagramLogoIcon className="h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                    {member.em && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        asChild 
                        className="text-pink-500 hover:bg-pink-500"
                      >
                        <Link href={`mailto:${member.em}`} target="_blank" rel="noopener noreferrer">
                          <Mail className="h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export const Logo = () => (
  <Link href="#" className="flex space-x-2 items-center text-lg font-bold text-black dark:text-white">
    <div className="h-6 w-7 bg-black dark:bg-white rounded-lg" />
    <span className="whitespace-pre">Coding Junction</span>
  </Link>
);