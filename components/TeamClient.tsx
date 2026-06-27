"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import json from "../app/Team/team.json"; // Adjusted path
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { TwitterLogoIcon, LinkedInLogoIcon, GitHubLogoIcon, InstagramLogoIcon } from "@radix-ui/react-icons";
import { useIsMobile } from "@/hooks/use-mobile";

const TeamClient = () => {
  const teamArray = json.teamArray;
  const isMobile = useIsMobile();

  const Gen = [
    { label: "President", key: "p" },
    // { label: "Alumni", key: "a" },
    { label: "Gen 1", key: "1" },
    { label: "Gen 2", key: "2" },
    { label: "Gen 3", key: "3" },
    { label: "Gen 4", key: "4" }
  ];

  const [selectedGen, setSelectedGen] = useState("p");

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
    <>
      {/* Mobile Floating Generation Selector */}
      <AnimatePresence>
        {isMobile && (
          <motion.div
            className="fixed top-24 left-0 right-0 z-40 flex justify-center pointer-events-auto"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.div
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
      </AnimatePresence>
      {/* Main Content Area */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 bg-white dark:bg-neutral-900 p-6 flex-col border-r dark:border-neutral-700 md:sticky md:top-32 md:mt-32 md:h-[calc(100vh-8rem)]">
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
        </div>
        {/* Team Members Grid */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto mt-24 md:mt-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-6">
            {teamArray
              .filter(member => member.gen === selectedGen)
              .map((member, idx) => (
                <motion.div
                  key={member.name}
                  className="flex flex-col items-center text-center gap-5 bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: idx * 0.08,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 120,
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  layout
                >
                  <motion.div
                    className="h-36 w-36 rounded-full overflow-hidden border-4 border-gray-200 dark:border-neutral-700"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.08 + 0.2, type: "spring", stiffness: 180 }}
                    whileHover={{ scale: 1.12, boxShadow: "0 4px 24px 0 rgba(0,0,0,0.18)" }}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={144}
                      height={144}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                  <div>
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
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamClient;
