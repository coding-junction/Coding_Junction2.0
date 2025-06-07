"use client";
import React, { useEffect, useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { sanity } from "@/lib/sanity";

interface EventType {
  _id: string;
  title: string;
  date?: string;
  location?: string;
  description: string;
  tag?: string;
  image?: {
    asset?: {
      url: string;
    };
  };
  registerLink?: string;
}

const Event = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanity
      .fetch(
        `*[_type == "post"]{
          _id,
          title,
          date,
          location,
          description,
          tag,
          image{asset->{url}},
          registerLink
        }`
      )
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  return (
    <section className="w-full px-4 md:px-8 lg:px-16 xl:px-20 py-20 flex flex-col items-center bg-background dark:bg-background relative overflow-hidden">
      {/* Animated Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-gradient-to-br from-blue-300 via-blue-200 to-transparent dark:from-blue-900 dark:via-blue-800 rounded-full opacity-30 blur-3xl pointer-events-none z-0 animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-tr from-blue-400 via-blue-200 to-transparent dark:from-blue-700 dark:via-blue-900 rounded-full opacity-20 blur-3xl pointer-events-none z-0 animate-pulse" />

      <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-400 to-pink-400 dark:from-blue-200 dark:via-blue-400 dark:to-pink-300 tracking-tight z-10 drop-shadow-xl">
        Upcoming Event
      </h2>
      <p className="text-xl md:text-2xl text-blue-700 dark:text-blue-200 mb-12 max-w-2xl text-center z-10 font-medium">
        Don’t miss out on our next big gathering!<br className="hidden md:block" />
        <span className="text-pink-500 dark:text-pink-300 font-bold">Unforgettable moments await.</span>
      </p>
      <div className="flex flex-wrap gap-8 justify-center w-full z-10">
        {loading && (
          <div className="text-center text-blue-400">Loading events...</div>
        )}
        {!loading && events.length === 0 && (
          <div className="text-center text-blue-400">No events found.</div>
        )}
        {events.map((event) => (
          <BackgroundGradient
            key={event._id}
            className="rounded-3xl max-w-xl w-full p-0 bg-transparent shadow-none"
          >
            <div className="bg-white/90 dark:bg-zinc-900/90 rounded-3xl shadow-2xl p-8 sm:p-14 flex flex-col items-center relative overflow-hidden">
              {/* Animated Sparkles */}
              <div className="absolute top-4 right-8 text-yellow-400 text-3xl animate-bounce">✨</div>
              <div className="absolute bottom-4 left-8 text-pink-400 text-2xl animate-pulse">★</div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-blue-400 text-2xl animate-spin-slow">✦</div>
              {event.image?.asset?.url ? (
                <img
                  src={event.image.asset.url}
                  alt={event.title}
                  height={340}
                  width={340}
                  className="object-cover rounded-2xl shadow-2xl mb-6 w-full max-w-xs border-4 border-blue-100 dark:border-blue-900 transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full max-w-xs h-[220px] flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-2xl mb-6 text-blue-400 dark:text-blue-200 text-lg font-semibold">
                  No Image Available
                </div>
              )}
              {event.tag && (
                <span className="inline-block bg-gradient-to-r from-blue-100 via-blue-300 to-pink-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-5 py-2 rounded-full mb-4 shadow-lg tracking-wider uppercase">
                  {event.tag}
                </span>
              )}
              <h3 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-white mb-2 tracking-tight text-center">
                {event.title}
              </h3>
              <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 mb-8 text-center">
                {event.description}
              </p>
              {event.registerLink ? (
                <a
                  href={event.registerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-10 py-4 text-white bg-gradient-to-r from-blue-600 via-pink-400 to-blue-600 dark:from-blue-800 dark:via-pink-500 dark:to-blue-600 font-bold shadow-xl hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200 text-lg tracking-wide flex items-center gap-2"
                >
                  <span className="animate-bounce">🚀</span> Register Now
                </a>
              ) : (
                <button
                  disabled
                  className="rounded-full px-10 py-4 text-white bg-gray-400 dark:bg-gray-700 font-bold shadow-xl text-lg tracking-wide flex items-center gap-2 opacity-60 cursor-not-allowed"
                >
                  Registration Closed
                </button>
              )}
            </div>
          </BackgroundGradient>
        ))}
      </div>
    </section>
  );
};

export default Event;
