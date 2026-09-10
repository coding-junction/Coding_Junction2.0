import React, { Suspense } from "react";
import type { Metadata } from "next";
import CommunityPartnersClient from "@/components/CommunityPartnersClient";
import CommunityPartnersHero from "@/components/CommunityPartnersHero";

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
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading community partners...</p>
      </div>
    </div>
  );
}

export default function CommunityPartnersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <CommunityPartnersHero />
      <Suspense fallback={<PartnersLoading />}>
        <CommunityPartnersClient isStandalonePage />
      </Suspense>
    </div>
  );
}
