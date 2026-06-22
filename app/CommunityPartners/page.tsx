import React, { Suspense } from "react";
import type { Metadata } from "next";
import NavBar from "../NavBar/page";
import Footer from "../Footer/page";
import CommunityPartnersClient from "@/components/CommunityPartnersClient";

export const metadata: Metadata = {
  title: "Community Partners | Global Network",
  description: "Explore the network of industry-leading organizations, universities, and tech companies that partner with Coding Junction.",
  openGraph: {
    title: "Community Partners | Global Network - Coding Junction",
    description: "Explore the network of industry-leading organizations, universities, and tech companies that partner with Coding Junction.",
  }
};

function PartnersLoading() {
  return (
    <div className="flex flex-1 pt-32 items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading community partners...</p>
      </div>
    </div>
  );
}

export default function CommunityPartnersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <NavBar />
      <Suspense fallback={<PartnersLoading />}>
        <CommunityPartnersClient />
      </Suspense>
      <Footer />
    </div>
  );
}
