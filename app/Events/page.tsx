"use client";
import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/page";
import Footer from "../Footer/page";
import { motion, AnimatePresence } from "framer-motion";
import { sanity } from "@/lib/sanity";

interface EventType {
  _id: string;
  title: string;
  date?: string;
  location?: string;
  description?: string;
  images?: {
    asset?: {
      _id: string;
      url: string;
    };
  }[];
}

// GROQ query for your event schema
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

const EventCard = ({
  event,
  expanded,
  onClick,
}: {
  event: EventType;
  expanded: boolean;
  onClick: () => void;
}) => (
  <motion.div
    className="bg-white/20 dark:bg-neutral-900/70 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md border border-white/10 flex flex-col cursor-pointer transition-all"
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
    whileHover={{
      scale: 1.03,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
    }}
    onClick={onClick}
  >
    {/* Main event image */}
    {event.images && event.images[0]?.asset?.url && (
      <img
        src={event.images[0].asset.url}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-6 flex flex-col flex-1">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        {event.title}
      </h3>
      <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">
        <span>
          {event.date ? new Date(event.date).toLocaleDateString() : ""}
        </span>
        {event.location && (
          <>
            &middot; <span>{event.location}</span>
          </>
        )}
      </div>
      <p className="text-gray-700 dark:text-gray-200 flex-1 mb-2">
        {event.description}
      </p>
      <AnimatePresence>
        {expanded && event.images && event.images.length > 1 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4"
          >
            <div className="font-semibold text-white mb-2">Gallery:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {event.images.slice(1).map(
                (img, idx) =>
                  img.asset?.url && (
                    <img
                      key={img.asset._id || idx}
                      src={img.asset.url}
                      alt={`Gallery image ${idx + 1}`}
                      className="rounded-md border border-white/10 object-cover w-full h-28 sm:h-32"
                      loading="lazy"
                    />
                  )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-4 text-primary font-semibold text-center">
        {expanded
          ? "Click to collapse"
          : event.images && event.images.length > 1
          ? "Click to view gallery"
          : ""}
      </div>
    </div>
  </motion.div>
);

const EventsPage = () => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<EventType[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    sanity.fetch(query).then(setEvents);
  }, []);

  const filteredEvents = events.filter((event) => {
    const searchText = search.toLowerCase();
    return (
      event.title?.toLowerCase().includes(searchText) ||
      event.description?.toLowerCase().includes(searchText) ||
      event.location?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Past <span className="text-primary">Events</span>
          </h1>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Stay updated with our latest events, workshops, and meetups.
          </p>
        </motion.div>
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-black"
          />
        </div>
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  expanded={expandedId === event._id}
                  onClick={() =>
                    setExpandedId(expandedId === event._id ? null : event._id)
                  }
                />
              ))
            ) : (
              <motion.div
                className="col-span-full text-center text-gray-400 py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No events found.
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;