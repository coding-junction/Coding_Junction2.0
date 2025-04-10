"use client";
import React from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
//import Image from "next/image";//

export function Event() {
  return (
    <section className="w-full px-4 md:px-8 lg:px-16 xl:px-20 py-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground dark:text-white">
        Our Upcoming Events
      </h2>
      <div className="flex justify-center">
        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900 shadow-lg">
          <img
            src="https://th.bing.com/th/id/OIP.LyXE6eshZtpEz8LP7FtcAgHaCt?rs=1&pid=ImgDetMain"
            alt="cj"
            height={400}
            width={400}
            className="object-contain rounded-lg"
          />
          <p className="text-lg sm:text-xl font-semibold text-black mt-4 mb-2 dark:text-neutral-200">
            BB2
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            BB2
          </p>
          <button className="rounded-full px-5 py-2 text-white flex items-center justify-center space-x-2 bg-black mt-4 text-sm font-bold dark:bg-zinc-800 hover:bg-gray-800 dark:hover:bg-zinc-700 transition duration-300">
            <span>Register Now</span>
          </button>
        </BackgroundGradient>
      </div>
    </section>
  );
}
