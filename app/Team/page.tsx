"use client";
import React, { useState } from "react";
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogTrigger, 
//   DialogTitle 
// } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import json from "./team.json";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { TwitterLogoIcon, LinkedInLogoIcon, GitHubLogoIcon,InstagramLogoIcon } from "@radix-ui/react-icons";
import Footer from "../Footer/page";
import NavBar from "../NavBar/page";
import { useIsMobile } from "@/hooks/use-mobile";

const Team = () => {
  const teamArray = json.teamArray;
  const isMobile = useIsMobile();
  
  const Gen = [
    { label: "President", key: "p" },
    { label: "Alumni", key: "a" },
    { label: "Gen 1", key: "1" },
    { label: "Gen 2", key: "2" },
    { label: "Gen 3", key: "3" }
  ];

  const [selectedGen, setSelectedGen] = useState("p");
  
  // Navigate to prev/next generation
  const navigateGeneration = (direction: 'prev' | 'next') => {
    const currentIndex = Gen.findIndex(g => g.key === selectedGen);
    if (direction === 'prev') {
      const newIndex = currentIndex <= 0 ? Gen.length - 1 : currentIndex - 1;
      setSelectedGen(Gen[newIndex].key);
    } else {
      const newIndex = currentIndex >= Gen.length - 1 ? 0 : currentIndex + 1;
      setSelectedGen(Gen[newIndex].key);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-neutral-800">
      <NavBar/>
        {/* Mobile Floating Generation Selector */}      <AnimatePresence>
        {isMobile && (
          <motion.div 
            className="fixed top-24 left-0 right-0 z-40 flex justify-center pointer-events-auto"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          ><motion.div 
              className="flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-lg py-3 px-5 rounded-full shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/70 hover:text-white h-8 w-8 p-0 flex items-center justify-center"
                onClick={() => navigateGeneration('prev')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <span className="text-white font-medium px-3 min-w-[100px] text-center">
                {Gen.find(g => g.key === selectedGen)?.label}
              </span>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/70 hover:text-white h-8 w-8 p-0 flex items-center justify-center"
                onClick={() => navigateGeneration('next')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      {/* Main Content Area */}
      <div className="flex flex-1 pt-24 md:pt-0">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 bg-white dark:bg-neutral-900 p-6 flex-col border-r dark:border-neutral-700 mt-24">
          <div className="mt-8 space-y-3">
            {Gen.map((gen) => (
              <Button 
                key={gen.key} 
                variant={selectedGen === gen.key ? "default" : "ghost"}
                onClick={() => setSelectedGen(gen.key)}
                className="w-full justify-start h-10 text-base"
              >
                {gen.label}
              </Button>
            ))}
          </div>
        </div>        {/* Team Members Grid */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto sm:mt-20 md:mt-24 lg:mt-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-6">
            {teamArray.filter(member => member.gen === selectedGen).map(member => (              <div 
                key={member.name} 
                className="flex flex-col items-center text-center gap-5 bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-36 w-36 rounded-full object-cover border-4 border-gray-200 dark:border-neutral-700"
                />                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
                      {member.role}
                    </p>
                  )}
                  <div className="mt-5 flex justify-center gap-4">
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
        </div>      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Team;