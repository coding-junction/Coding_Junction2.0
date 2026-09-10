import React, { Suspense } from "react";
import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
import EventsClient, { EventType } from "@/components/EventsClient";
import EventsHero from "@/components/EventsHero";

export const metadata: Metadata = {
  title: "Events | Coding Junction",
  description: "Stay updated with our latest tech events, workshops, and meetups at UIT Burdwan.",
  openGraph: {
    title: "Events | Coding Junction",
    description: "Stay updated with our latest tech events, workshops, and meetups at UIT Burdwan.",
  }
};

const query = `*[_type == "event"]{
  _id,
  title,
  date,
  location,
  description,
  images[]{
    asset->{
      _id,
      url
    }
  }
}`;

export const revalidate = 60;

function EventsLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading events...</p>
    </div>
  );
}

async function EventsDataLoader() {
  let events: EventType[] = [];
  try {
    const data = await sanity.fetch(query);
    events = [...data].sort((a, b) => {
      if (!a.date) return -1;
      if (!b.date) return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  } catch (error) {
    console.error("Failed to fetch events from Sanity:", error);
  }

  return <EventsClient initialEvents={events} />;
}

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <EventsHero />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <Suspense fallback={<EventsLoading />}>
          <EventsDataLoader />
        </Suspense>
      </div>
    </main>
  );
}