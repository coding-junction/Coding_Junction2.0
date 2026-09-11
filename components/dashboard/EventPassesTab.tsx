"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Ticket,
  QrCode,
  Calendar,
  CalendarPlus,
  Clock,
  Sparkles,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Download,
  Share2,
  ChevronRight,
  ShieldCheck,
  Bell,
  Check,
  X,
  History,
  AlertCircle,
  ScanLine,
  KeyRound,
  Award,
  RefreshCw,
} from "lucide-react";

import { registerForEvent, getRegisteredEventIds } from "@/lib/eventPass";

interface SanityEvent {
  _id: string;
  title: string;
  date?: string;
  location?: string;
  description?: string;
  registerLink?: string;
  images?: { asset?: { _id?: string; url: string } }[];
  image?: { asset?: { url: string } };
  passcode?: string;
}

interface EventPassesTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  upcomingEvents: SanityEvent[];
  pastEvents: SanityEvent[];
  eventsLoading: boolean;
  onBrowseEvents: () => void;
  onNavigateToCertificates?: () => void;
}

export const EventPassesTab: React.FC<EventPassesTabProps> = ({
  user,
  upcomingEvents,
  pastEvents: _pastEvents,
  eventsLoading,
  onBrowseEvents,
  onNavigateToCertificates,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"tickets" | "browse" | "history">("tickets");
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [selectedTicketEvent, setSelectedTicketEvent] = useState<SanityEvent | null>(null);
  const [isNotified, setIsNotified] = useState(false);
  const [localAttendedIds, setLocalAttendedIds] = useState<string[]>([]);

  const userId = user?.id || "USER_ANON";
  const userName = user?.fullName || user?.firstName || "Community Member";

  // Load RSVP'd event IDs from shared event pass system & listen for live events
  useEffect(() => {
    setRegisteredEventIds(getRegisteredEventIds(user));

    const handleSync = () => {
      setRegisteredEventIds(getRegisteredEventIds(user));
    };

    window.addEventListener("cj:event-registered", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("cj:event-registered", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [user, user?.unsafeMetadata?.registeredEventIds]);

  // Save or toggle registered events
  const handleToggleRSVP = async (eventId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const isCurrentlyReg = registeredEventIds.includes(eventId);

    if (!isCurrentlyReg) {
      await registerForEvent(eventId, user);
      setRegisteredEventIds((prev) => Array.from(new Set([...prev, eventId])));
    } else {
      const next = registeredEventIds.filter((id) => id !== eventId);
      setRegisteredEventIds(next);
      try {
        localStorage.setItem("cj_registered_event_ids_v2", JSON.stringify(next));
      } catch {
        // Continue
      }
      if (user && typeof user.update === "function") {
        try {
          await user.update({
            unsafeMetadata: {
              ...(user.unsafeMetadata || {}),
              registeredEventIds: next,
            },
          });
        } catch (err) {
          console.error("Failed to unregister event in Clerk:", err);
        }
      }
    }
  };

  // Filtered lists
  const myRegisteredUpcomingEvents = useMemo(() => {
    return upcomingEvents.filter((e) => registeredEventIds.includes(e._id));
  }, [upcomingEvents, registeredEventIds]);

  // Load initial attended event IDs from Clerk and local storage
  useEffect(() => {
    try {
      const fromClerk = (user?.unsafeMetadata?.attendedEventIds as string[]) || [];
      const local = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(`cj_attended_event_ids_${user?.id || "guest"}`) || "[]")
        : [];
      const combined = Array.from(new Set([...fromClerk, ...local]));
      setLocalAttendedIds(combined);
    } catch {
      // Fallback
    }
  }, [user?.id, user?.unsafeMetadata?.attendedEventIds]);

  // Verified attended events synchronized from Clerk, local storage, and instant React state
  const attendedEventIds = useMemo(() => {
    try {
      const fromClerk = (user?.unsafeMetadata?.attendedEventIds as string[]) || [];
      const local = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem(`cj_attended_event_ids_${user?.id || "guest"}`) || "[]")
        : [];
      return Array.from(new Set([...fromClerk, ...local, ...localAttendedIds]));
    } catch {
      return localAttendedIds;
    }
  }, [user?.id, user?.unsafeMetadata?.attendedEventIds, localAttendedIds]);

  // Zero-backend gate verification: checks entered code against event-specific & venue passcodes
  const handleVerifyPasscode = async (
    event: SanityEvent,
    inputCode: string
  ): Promise<{ success: boolean; message: string }> => {
    const rawClean = inputCode.trim().toUpperCase();
    const code = rawClean.replace(/[^A-Z0-9]/g, "");
    if (!code) {
      return { success: false, message: "Please enter the event check-in passcode." };
    }

    // 1. Master & universal venue passcodes
    const acceptableCodes = new Set<string>([
      "CJ2026",
      "CJUIUX",
      "CJVENUE",
      "CJEVENT",
      "CJPASS",
      "PASS2026",
      "CODINGJUNCTION",
    ]);

    // 2. Sanity event passcode (if configured in Sanity Studio)
    if (event.passcode) {
      const sanityPasscode = event.passcode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (sanityPasscode) {
        acceptableCodes.add(sanityPasscode);
      }
    }

    // 3. Title-derived codes (e.g. CJFAREWELL, CJLAB, CJCODING)
    const words = (event.title || "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.toUpperCase());

    words.forEach((word) => {
      acceptableCodes.add(`CJ${word}`);
      if (word.length >= 4) {
        acceptableCodes.add(`CJ${word.slice(0, 4)}`);
      }
    });

    // 4. ID-derived code (e.g. CJ + last 4 chars)
    if (event._id) {
      const tail = event._id.slice(-4).toUpperCase().replace(/[^A-Z0-9]/g, "");
      acceptableCodes.add(`CJ${tail}`);
    }

    const isMatch = acceptableCodes.has(code) || acceptableCodes.has(rawClean);

    if (!isMatch) {
      return {
        success: false,
        message: "Invalid passcode. Please check the code announced at the event (e.g. CJ2026).",
      };
    }

    // Save attendance directly without needing any backend server
    const nextAttended = Array.from(
      new Set([
        ...attendedEventIds,
        event._id,
        `cert_${event._id}`,
        "cert_official_cj_2026",
      ])
    );

    // 1. Update React state immediately
    setLocalAttendedIds(nextAttended);

    // 2. Persist to localStorage
    try {
      localStorage.setItem(
        `cj_attended_event_ids_${user?.id || "guest"}`,
        JSON.stringify(nextAttended)
      );
    } catch (err) {
      console.error("Failed to persist attendance to localStorage:", err);
    }

    // 3. Persist to Clerk user unsafeMetadata (client-side Clerk update)
    if (user && typeof user.update === "function") {
      try {
        await user.update({
          unsafeMetadata: {
            ...(user.unsafeMetadata || {}),
            attendedEventIds: nextAttended,
          },
        });
      } catch (err) {
        console.error("Failed to update Clerk metadata:", err);
      }
    }

    return {
      success: true,
      message: "Attendance verified successfully! Your certificate is unlocked.",
    };
  };

  const allEvents = useMemo(() => [...upcomingEvents, ..._pastEvents], [upcomingEvents, _pastEvents]);
  const attendedEvents: SanityEvent[] = useMemo(() => {
    return allEvents.filter((e) => attendedEventIds.includes(e._id));
  }, [allEvents, attendedEventIds]);

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (event: SanityEvent) => {
    const title = encodeURIComponent(`Coding Junction: ${event.title}`);
    const details = encodeURIComponent(
      `${event.description || "Official Coding Junction Event"}\n\nJoin the developer community: https://coding-junction.in`
    );
    const location = encodeURIComponent(event.location || "Coding Junction Hub");

    let dates = "";
    if (event.date) {
      const start = new Date(event.date);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2-hour duration
      const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
      dates = `&dates=${fmt(start)}/${fmt(end)}`;
    }

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${dates}`;
  };

  // Download iCal (.ics) file
  const handleDownloadICal = (event: SanityEvent, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const start = event.date ? new Date(event.date) : new Date();
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Coding Junction//Event Pass//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:Coding Junction: ${event.title}`,
      `DESCRIPTION:${(event.description || "Coding Junction Event").replace(/\n/g, "\\n")}`,
      `LOCATION:${event.location || "Online"}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `CJ-${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-6"
    >
      {/* ─── Header with "Coming Soon" Badge ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-foreground dark:text-white tracking-tight flex items-center gap-2">
              <Ticket className="w-6 h-6 text-indigo-500" />
              <span>Event Passes & Entry Tickets</span>
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30">
              Coming Soon
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Digital QR tickets for fast check-in, RSVP tracking, countdown timers, and event calendar sync.
          </p>
        </div>

        {/* Action Button: Notify Me */}
        <button
          onClick={() => setIsNotified(true)}
          disabled={isNotified}
          className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all duration-200 cursor-pointer flex-shrink-0 ${
            isNotified
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/25"
          }`}
        >
          {isNotified ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>You will be notified!</span>
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5" />
              <span>Notify When Live</span>
            </>
          )}
        </button>
      </div>

      {/* ─── Coming Soon Beta Notice Banner ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 dark:border-amber-500/30 bg-gradient-to-r from-amber-500/[0.08] via-indigo-500/[0.04] to-transparent p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground dark:text-white">
                  Automated Check-in System [Beta Preview]
                </h3>
                <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500">
                  Feature In Dev
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl leading-relaxed">
                We are setting up on-site digital QR ticket scanners for upcoming club workshops and hackathons. You can preview your interactive digital ticket, sync dates to Google Calendar, and check attendance history below!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-mono text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] px-3 py-1.5 rounded-lg border border-black/[0.06] dark:border-white/[0.06]">
              Launch: Q4 2026
            </span>
          </div>
        </div>
      </div>

      {/* ─── Sub Navigation Tabs ─── */}
      <div className="flex items-center gap-2 border-b border-black/[0.06] dark:border-white/[0.06] pb-3">
        <button
          onClick={() => setActiveSubTab("tickets")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === "tickets"
              ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
              : "text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>My Passes ({myRegisteredUpcomingEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("browse")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === "browse"
              ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
              : "text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>All Upcoming ({upcomingEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("history")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === "history"
              ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
              : "text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Attendance History ({attendedEvents.length})</span>
        </button>
      </div>

      {/* ─── TAB 1: MY ACTIVE PASSES & TICKETS ─── */}
      {activeSubTab === "tickets" && (
        <div className="space-y-4">
          {eventsLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : myRegisteredUpcomingEvents.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3 text-indigo-500">
                <Ticket className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground dark:text-white text-base">No Active Passes</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                You haven&apos;t registered for any event passes yet. Digital entry passes will appear here once the feature goes live.
              </p>
              <button
                onClick={() => setActiveSubTab("browse")}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold font-mono hover:opacity-90 transition-opacity cursor-pointer"
              >
                Browse Upcoming Events &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRegisteredUpcomingEvents.map((event) => (
                <TicketCard
                  key={event._id}
                  event={event}
                  userId={userId}
                  userName={userName}
                  isRegistered={true}
                  onToggleRSVP={(e) => handleToggleRSVP(event._id, e)}
                  onViewPass={() => setSelectedTicketEvent(event)}
                  onGoogleCalendar={() => window.open(getGoogleCalendarUrl(event), "_blank")}
                  onDownloadICal={(e) => handleDownloadICal(event, e)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: BROWSE & RSVP TO GENERATE TICKETS ─── */}
      {activeSubTab === "browse" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => {
              const isRegistered = registeredEventIds.includes(event._id);
              return (
                <TicketCard
                  key={event._id}
                  event={event}
                  userId={userId}
                  userName={userName}
                  isRegistered={isRegistered}
                  onToggleRSVP={(e) => handleToggleRSVP(event._id, e)}
                  onViewPass={() => setSelectedTicketEvent(event)}
                  onGoogleCalendar={() => window.open(getGoogleCalendarUrl(event), "_blank")}
                  onDownloadICal={(e) => handleDownloadICal(event, e)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 3: ATTENDANCE HISTORY ─── */}
      {activeSubTab === "history" && (
        <div className="space-y-4">
          {attendedEvents.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3 text-emerald-500">
                <History className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground dark:text-white text-base">
                No Attended Sessions on Record
              </h4>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-md mx-auto leading-relaxed">
                No attended sessions on record yet. Scan your QR pass at our next event to log attendance.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-[11px] font-mono text-muted-foreground">
                <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>QR scanner check-in active at upcoming offline sessions</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-500" />
                  <h4 className="font-bold text-sm text-foreground dark:text-white">
                    Verified Attendance Record
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  {attendedEvents.length} {attendedEvents.length === 1 ? "Session" : "Sessions"} Logged
                </span>
              </div>

              <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {attendedEvents.map((event) => (
                  <div key={event._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-foreground dark:text-white truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono mt-0.5">
                        <span>
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Past Event"}
                        </span>
                        {event.location && <span>• {event.location}</span>}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Attended</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── MODAL: INTERACTIVE DIGITAL ENTRY QR TICKET ─── */}
      <AnimatePresence>
        {selectedTicketEvent && (
          <EventTicketModal
            event={selectedTicketEvent}
            userId={userId}
            userName={userName}
            isAttended={attendedEventIds.includes(selectedTicketEvent._id)}
            onVerifyPasscode={(code) => handleVerifyPasscode(selectedTicketEvent, code)}
            onClose={() => setSelectedTicketEvent(null)}
            onGoogleCalendar={() => window.open(getGoogleCalendarUrl(selectedTicketEvent), "_blank")}
            onDownloadICal={(e) => handleDownloadICal(selectedTicketEvent, e)}
            onNavigateToCertificates={onNavigateToCertificates}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   CARD COMPONENT: TICKET ITEM (With Countdown & Quick Actions)
   ══════════════════════════════════════════════════════════════════ */
function TicketCard({
  event,
  userId,
  userName,
  isRegistered,
  onToggleRSVP: _onToggleRSVP,
  onViewPass,
  onGoogleCalendar,
  onDownloadICal: _onDownloadICal,
}: {
  event: SanityEvent;
  userId: string;
  userName: string;
  isRegistered: boolean;
  onToggleRSVP: (e: React.MouseEvent) => void;
  onViewPass: () => void;
  onGoogleCalendar: () => void;
  onDownloadICal: (e: React.MouseEvent) => void;
}) {
  const eventImg = event.images?.[0]?.asset?.url || event.image?.asset?.url;

  return (
    <div className="group rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] overflow-hidden p-4 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-200 shadow-sm relative">
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          {eventImg ? (
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-black/[0.06] dark:border-white/[0.06]">
              <Image
                src={eventImg}
                alt={event.title}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20 flex items-center justify-center flex-shrink-0 text-indigo-500">
              <Ticket className="w-6 h-6" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-500 font-semibold">
                Event Pass
              </span>
              {isRegistered && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/25">
                  <Check className="w-2.5 h-2.5" />
                  RSVP Confirmed
                </span>
              )}
            </div>
            <h4 className="font-bold text-foreground dark:text-white text-sm tracking-tight leading-snug line-clamp-1">
              {event.title}
            </h4>
          </div>
        </div>

        {/* Date & Location Pills */}
        <div className="space-y-1.5 mb-4 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="truncate">
              {event.date
                ? new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Date Announced Soon"}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
        <div className="flex items-center gap-1.5">
          {event.registerLink ? (
            <a
              href={event.registerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1 p-1"
            >
              <span>Register</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[11px] font-mono text-muted-foreground px-2 py-1 rounded bg-black/[0.03] dark:bg-white/[0.04]">
              Details Announced
            </span>
          )}

          {/* Sync Calendar */}
          <button
            onClick={onGoogleCalendar}
            title="Add to Google Calendar"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
          </button>
        </div>

        {/* If registered, show View Pass */}
        {isRegistered ? (
          <button
            onClick={onViewPass}
            className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-500/25"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>View Pass</span>
          </button>
        ) : (
          <button
            onClick={onViewPass}
            className="px-2.5 py-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] text-foreground dark:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-black/[0.08] dark:border-white/[0.08]"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Claim Pass</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MODAL: DIGITAL ENTRY TICKET (Boarding Pass & Verification Stub)
   ══════════════════════════════════════════════════════════════════ */
function EventTicketModal({
  event,
  userId,
  userName,
  isAttended = false,
  onVerifyPasscode,
  onClose,
  onGoogleCalendar,
  onDownloadICal,
  onNavigateToCertificates,
}: {
  event: SanityEvent;
  userId: string;
  userName: string;
  isAttended?: boolean;
  onVerifyPasscode: (code: string) => Promise<{ success: boolean; message: string }>;
  onClose: () => void;
  onGoogleCalendar: () => void;
  onDownloadICal: (e: React.MouseEvent) => void;
  onNavigateToCertificates?: () => void;
}) {
  const [passcode, setPasscode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(false);

  const effectiveAttended = isAttended || verifySuccess;

  const ticketId = `CJ-EVT-${event._id.slice(-4).toUpperCase()}-${userId.replace("user_", "").slice(-4).toUpperCase()}`;

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setIsVerifying(true);
    setVerifyError("");
    try {
      const res = await onVerifyPasscode(passcode);
      if (res.success) {
        setVerifySuccess(true);
      } else {
        setVerifyError(res.message);
      }
    } catch {
      setVerifyError("Verification failed. Please check the code and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden bg-[#0a0b12] text-white border border-white/[0.14] shadow-2xl max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close pass modal"
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Boarding Pass Header */}
        <div className="p-6 pb-4 border-b border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-transparent flex-shrink-0">
          <div className="flex items-center justify-between gap-2 mb-2 pr-8">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase font-semibold">
                Official Event Entry Pass
              </span>
            </div>
            {effectiveAttended ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                VERIFIED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-mono font-bold bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                <Clock className="w-3 h-3" />
                ACTIVE PASS
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight leading-snug">
            {event.title}
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Coding Junction Developer Community
          </p>
        </div>

        {/* Middle Section: Boarding Pass Body & Barcode Stub */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Attendee Details Card */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] font-mono text-xs space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">
                  Attendee Name
                </span>
                <p className="font-bold text-white text-sm truncate mt-0.5">{userName}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">
                  Ticket ID
                </span>
                <p className="font-bold text-indigo-400 truncate mt-0.5">{ticketId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">
                  Access Level
                </span>
                <p className="font-semibold text-slate-300 text-xs mt-0.5">All-Access Pass</p>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">
                  Physical Status
                </span>
                {effectiveAttended ? (
                  <p className="font-semibold text-emerald-400 text-xs mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Checked In
                  </p>
                ) : (
                  <p className="font-semibold text-amber-400 text-xs mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending Check-in
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Authentic Conference Ticket Barcode Stub */}
          <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-center gap-[3px] h-9 w-full max-w-[260px] opacity-75">
              {[4, 2, 6, 1, 3, 5, 2, 4, 1, 3, 6, 2, 5, 1, 4, 3, 2, 6, 1, 4, 5, 2, 3, 1, 4, 6, 2, 5, 1, 3, 4, 2].map(
                (w, i) => (
                  <div
                    key={i}
                    style={{ width: `${w}px` }}
                    className="h-full bg-slate-300 rounded-sm"
                  />
                )
              )}
            </div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-slate-400 mt-2 uppercase font-medium">
              {ticketId}
            </span>
          </div>

          {/* Physical Attendance Verification Form or Unlocked Certificate */}
          {effectiveAttended ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider">
                  Pass Verified & Checked In!
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                Physical check-in has been successfully validated. Your official verified certificate of participation is now unlocked and ready for download.
              </p>
              {onNavigateToCertificates && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToCertificates();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98]"
                >
                  <Award className="w-4 h-4" />
                  <span>Download Official Certificate</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.09] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide">
                    Venue Gate Check-in
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Required
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                Enter the passcode announced by event organizers at the venue entrance to confirm attendance and unlock your certificate.
              </p>

              <form onSubmit={handlePasscodeSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value.toUpperCase());
                      setVerifyError("");
                    }}
                    placeholder="e.g. CJ2026"
                    maxLength={14}
                    disabled={isVerifying}
                    className="flex-1 uppercase font-mono tracking-widest text-center text-xs py-2.5 px-3 rounded-xl bg-black/50 border border-white/[0.14] text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isVerifying || !passcode.trim()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20 transition-all flex-shrink-0 active:scale-[0.98]"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Checking...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Check In</span>
                      </>
                    )}
                  </button>
                </div>

                {verifyError && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{verifyError}</span>
                  </div>
                )}
              </form>

              <p className="text-[10px] text-slate-500 font-mono">
                💡 Passcode tip: You can enter the passcode announced at the venue or use <strong className="text-slate-300">CJ2026</strong>.
              </p>
            </div>
          )}

          {/* Event Schedule & Location */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              <span>
                {event.date
                  ? new Date(event.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Date TBA"}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between gap-2 flex-shrink-0">
          <button
            onClick={onGoogleCalendar}
            className="flex-1 py-2 px-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Google Cal</span>
          </button>

          <button
            onClick={onDownloadICal}
            className="py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            title="Download .ics Calendar File"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.ics</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
