"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sanity } from "@/lib/sanity";
import { motion } from "motion/react";
import { CalendarDays, MapPin, ArrowRight, Sparkles, Ticket, Check, LogIn } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { registerForEvent, getRegisteredEventIds } from "@/lib/eventPass";

interface EventType {
  _id: string;
  title: string;
  date?: string;
  location?: string;
  description?: string;
  tag?: string;
  images?: { asset?: { _id?: string; url: string } }[];
  image?: {
    asset?: {
      url: string;
    };
  };
  registerLink?: string;
  passcode?: string;
}

const Event = () => {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  useEffect(() => {
    setRegisteredIds(getRegisteredEventIds(user));

    const handleSync = () => {
      setRegisteredIds(getRegisteredEventIds(user));
    };

    window.addEventListener("cj:event-registered", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("cj:event-registered", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [user]);

  // If a user clicked register while logged out, automatically claim the pass once signed in
  useEffect(() => {
    if (isSignedIn && user) {
      try {
        const pendingEventId = sessionStorage.getItem("cj_pending_event_register");
        const pendingLink = sessionStorage.getItem("cj_pending_event_link");
        if (pendingEventId) {
          sessionStorage.removeItem("cj_pending_event_register");
          sessionStorage.removeItem("cj_pending_event_link");
          registerForEvent(pendingEventId, user).then(() => {
            setRegisteredIds((prev) => Array.from(new Set([...prev, pendingEventId])));
          });
          if (pendingLink) {
            window.open(pendingLink, "_blank", "noopener,noreferrer");
          }
        }
      } catch {
        // Ignore session storage errors
      }
    }
  }, [isSignedIn, user]);

  const handleRegisterClick = async (event: EventType) => {
    // Strictly require authentication before registering
    if (!isSignedIn || !user) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("cj_pending_event_register", event._id);
        if (event.registerLink) {
          sessionStorage.setItem("cj_pending_event_link", event.registerLink);
        }
      }
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }

    // 1. Immediately generate the digital Event Pass
    await registerForEvent(event._id, user);
    setRegisteredIds((prev) => Array.from(new Set([...prev, event._id])));

    // 2. Open official registration form in a new tab
    if (event.registerLink) {
      window.open(event.registerLink, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    sanity
      .fetch(
        `*[_type in ["event", "post"]] | order(date asc) {
          _id,
          title,
          date,
          location,
          description,
          tag,
          passcode,
          images[]{ asset->{ _id, url } },
          image{ asset->{ url } },
          registerLink
        }`
      )
      .then((data: EventType[]) => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const futureEvents = (data || [])
          .filter((event) => {
            if (!event.date) return false;
            const eventDate = new Date(event.date);
            return !isNaN(eventDate.getTime()) && eventDate >= startOfToday;
          })
          .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

        setEvents(futureEvents);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch events from Sanity:", error);
        setEvents([]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="w-full px-4 md:px-8 lg:px-16 xl:px-20 py-16 md:py-24 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/5 dark:from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        className="text-center mb-12 md:mb-16 relative z-10"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-400 mb-3 font-medium">
          What&apos;s Next
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white">
          Upcoming{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400">
            Events
          </span>
        </h2>
        <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          Stay updated with our next big gathering. Unforgettable moments await.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-8 justify-center w-full relative z-10">
        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading events...</p>
          </div>
        )}
        {!loading && events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 max-w-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="h-7 w-7 text-indigo-400" />
            </div>
            <p className="text-foreground dark:text-white font-semibold text-lg mb-2">No upcoming events</p>
            <p className="text-sm text-muted-foreground">Check back soon for new announcements and exciting events!</p>
          </motion.div>
        )}
        {events.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="w-full max-w-xl"
          >
            <div className="glass-card group">
              <div className="glass-card-inner p-8 sm:p-10 flex flex-col items-center">
                {/* Event image */}
                {(() => {
                  const imgUrl = event.images?.[0]?.asset?.url || event.image?.asset?.url;
                  return imgUrl ? (
                    <div className="relative w-full max-w-sm rounded-xl overflow-hidden mb-6">
                      <Image
                        src={imgUrl}
                        alt={event.title}
                        height={340}
                        width={340}
                        className="object-cover rounded-xl w-full border border-black/5 dark:border-white/10 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-sm h-[200px] flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-xl mb-6 border border-border">
                      <CalendarDays className="h-10 w-10 text-muted-foreground" />
                    </div>
                  );
                })()}

                {/* Tag */}
                {event.tag && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 mb-4">
                    {event.tag}
                  </span>
                )}

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white mb-2 tracking-tight text-center">
                  {event.title}
                </h3>

                {/* Meta info */}
                {(event.date || event.location) && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {event.date && (
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                <p className="text-sm md:text-base text-muted-foreground mb-8 text-center leading-relaxed max-w-md">
                  {event.description}
                </p>

                {/* CTA */}
                {(() => {
                  const isRegistered = registeredIds.includes(event._id);

                  if (isRegistered) {
                    return (
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                          <Check className="w-3.5 h-3.5" />
                          Pass Generated
                        </span>
                        <Link
                          href="/Dashboard"
                          className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300"
                        >
                          <Ticket className="h-4 w-4" />
                          <span>View Event Pass</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </div>
                    );
                  }

                  if (event.registerLink) {
                    if (isLoaded && !isSignedIn) {
                      return (
                        <div className="flex flex-col items-center gap-2">
                          <button
                            onClick={() => handleRegisterClick(event)}
                            className="group/btn inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                          >
                            <LogIn className="h-4 w-4 text-indigo-200" />
                            <span>Sign In / Sign up to Register</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                          </button>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            Free sign-in / sign-up required to register for event
                          </span>
                        </div>
                      );
                    }

                    return (
                      <button
                        onClick={() => handleRegisterClick(event)}
                        className="group/btn inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                      >
                        <Ticket className="h-4 w-4 text-indigo-200" />
                        <span>Register & Get Pass</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    );
                  }

                  return (
                    <button
                      disabled
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gray-200 dark:bg-white/10 text-muted-foreground font-semibold text-sm cursor-not-allowed"
                    >
                      Registration Closed
                    </button>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Event;
