import React, { Suspense } from "react";
import type { Metadata } from "next";
import NavBar from "../NavBar/page";
import Footer from "../Footer/page";
import TeamClient from "@/components/TeamClient";

export const metadata: Metadata = {
  title: "Team | Coding Junction",
  description: "Meet the brilliant minds and dedicated leaders driving the Coding Junction community.",
  openGraph: {
    title: "Team | Coding Junction",
    description: "Meet the brilliant minds and dedicated leaders driving the Coding Junction community.",
  }
};

function TeamLoading() {
  return (
    <div className="flex flex-1 pt-32 items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading amazing team members...</p>
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-neutral-800">
      <NavBar />
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<TeamLoading />}>
          <TeamClient />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}