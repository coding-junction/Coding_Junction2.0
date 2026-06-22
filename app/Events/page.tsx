import React, { Suspense } from "react";
import type { Metadata } from "next";
import NavBar from "../NavBar/page";
import Footer from "../Footer/page";
import { sanity } from "@/lib/sanity";
import EventsClient, { EventType } from "@/components/EventsClient";

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

// Refresh data occasionally
export const revalidate = 60;

function EventsLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading amazing events...</p>
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-24">
        <Suspense fallback={<EventsLoading />}>
          <EventsDataLoader />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}