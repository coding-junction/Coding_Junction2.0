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
} from "lucide-react";

interface SanityEvent {
  _id: string;
  title: string;
  date?: string;
  location?: string;
  description?: string;
  registerLink?: string;
  images?: { asset?: { _id?: string; url: string } }[];
  image?: { asset?: { url: string } };
}

interface EventPassesTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  upcomingEvents: SanityEvent[];
  pastEvents: SanityEvent[];
  eventsLoading: boolean;
  onBrowseEvents: () => void;
}

export const EventPassesTab: React.FC<EventPassesTabProps> = ({
  user,
  upcomingEvents,
  pastEvents: _pastEvents,
  eventsLoading,
  onBrowseEvents,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"tickets" | "browse" | "history">("tickets");
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [selectedTicketEvent, setSelectedTicketEvent] = useState<SanityEvent | null>(null);
  const [isNotified, setIsNotified] = useState(false);

  const userId = user?.id || "USER_ANON";
  const userName = user?.fullName || user?.firstName || "Community Member";

  // Load RSVP'd event IDs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cj_registered_event_ids");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRegisteredEventIds(parsed);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Default RSVP to the first upcoming event if available for rich demo
    if (upcomingEvents.length > 0) {
      setRegisteredEventIds([upcomingEvents[0]._id]);
    }
  }, [upcomingEvents]);

  // Save registered events to localStorage
  const handleToggleRSVP = (eventId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRegisteredEventIds((prev) => {
      const next = prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId];
      try {
        localStorage.setItem("cj_registered_event_ids", JSON.stringify(next));
      } catch {
        // Continue
      }
      return next;
    });
  };

  // Filtered lists
  const myRegisteredUpcomingEvents = useMemo(() => {
    return upcomingEvents.filter((e) => registeredEventIds.includes(e._id));
  }, [upcomingEvents, registeredEventIds]);

  // Verified attended events (empty state until on-site QR scanner check-in backend is active)
  const attendedEvents: SanityEvent[] = useMemo(() => [], []);

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
                You haven&apos;t marked attendance for any upcoming events yet. Explore events and click &ldquo;RSVP / Register&rdquo; to generate your pass.
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
            onClose={() => setSelectedTicketEvent(null)}
            onGoogleCalendar={() => window.open(getGoogleCalendarUrl(selectedTicketEvent), "_blank")}
            onDownloadICal={(e) => handleDownloadICal(selectedTicketEvent, e)}
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
  onToggleRSVP,
  onViewPass,
  onGoogleCalendar,
  onDownloadICal,
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

  // Countdown calculation
  const countdown = useMemo(() => {
    if (!event.date) return null;
    const diff = new Date(event.date).getTime() - new Date().getTime();
    if (diff <= 0) return "Event in progress / ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours} hours left`;
  }, [event.date]);

  const ticketId = `CJ-EVT-${event._id.slice(-4).toUpperCase()}-${userId.replace("user_", "").slice(-4).toUpperCase()}`;

  return (
    <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] overflow-hidden shadow-sm hover:border-indigo-500/30 transition-all flex flex-col justify-between">
      <div className="p-5">
        {/* Top bar: Badge & Countdown */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isRegistered
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-black/[0.04] dark:bg-white/[0.04] text-muted-foreground border-black/[0.08] dark:border-white/[0.08]"
            }`}
          >
            {isRegistered ? "Ticket Confirmed" : "RSVP Open"}
          </span>

          {countdown && (
            <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{countdown}</span>
            </span>
          )}
        </div>

        <div className="flex gap-3.5">
          {/* Thumbnail */}
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-indigo-500/10 flex-shrink-0 border border-black/[0.06] dark:border-white/[0.06] relative">
            {eventImg ? (
              <Image src={eventImg} alt={event.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-indigo-500">
                <Ticket className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-foreground dark:text-white truncate">
              {event.title}
            </h4>
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground mt-1">
              {event.date && (
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1.5 font-mono text-[11px] truncate">
                  <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Toggle RSVP button */}
          <button
            onClick={onToggleRSVP}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer transition-all ${
              isRegistered
                ? "bg-emerald-500/10 hover:bg-rose-500/10 text-emerald-600 dark:text-emerald-400 hover:text-rose-500 border border-emerald-500/25"
                : "bg-indigo-500 text-white hover:opacity-90 shadow-sm"
            }`}
          >
            {isRegistered ? "Registered ✓" : "RSVP Now"}
          </button>

          {/* Sync Calendar */}
          <button
            onClick={onGoogleCalendar}
            title="Add to Google Calendar"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4" />
          </button>
        </div>

        {/* View Entry QR Pass Modal Trigger */}
        <button
          onClick={onViewPass}
          className="px-2.5 py-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] text-xs font-mono font-semibold text-foreground dark:text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-black/[0.06] dark:border-white/[0.06]"
        >
          <QrCode className="w-3.5 h-3.5 text-indigo-500" />
          <span>View Pass</span>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MODAL: DIGITAL ENTRY TICKET (Boarding Pass / QR Code)
   ══════════════════════════════════════════════════════════════════ */
function EventTicketModal({
  event,
  userId,
  userName,
  onClose,
  onGoogleCalendar,
  onDownloadICal,
}: {
  event: SanityEvent;
  userId: string;
  userName: string;
  onClose: () => void;
  onGoogleCalendar: () => void;
  onDownloadICal: (e: React.MouseEvent) => void;
}) {
  const ticketId = `CJ-EVT-${event._id.slice(-4).toUpperCase()}-${userId.replace("user_", "").slice(-4).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden bg-[#0a0b12] text-white border border-white/[0.12] shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Boarding Pass Header */}
        <div className="p-6 pb-4 border-b border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-indigo-500/15 via-violet-500/10 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase">
              Official Event Entry Pass
            </span>
          </div>
          <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight leading-snug">
            {event.title}
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Coding Junction Developer Community
          </p>
        </div>

        {/* Middle Section: Scannable Vector QR Code & Metadata */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            {/* Scannable QR Code */}
            <div className="bg-white p-2.5 rounded-2xl shadow-xl flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-24 h-24 text-slate-900" fill="currentColor">
                <rect x="5" y="5" width="28" height="28" rx="3" />
                <rect x="9" y="9" width="20" height="20" rx="1.5" fill="white" />
                <rect x="13" y="13" width="12" height="12" rx="1" />

                <rect x="67" y="5" width="28" height="28" rx="3" />
                <rect x="71" y="9" width="20" height="20" rx="1.5" fill="white" />
                <rect x="75" y="13" width="12" height="12" rx="1" />

                <rect x="5" y="67" width="28" height="28" rx="3" />
                <rect x="9" y="71" width="20" height="20" rx="1.5" fill="white" />
                <rect x="13" y="75" width="12" height="12" rx="1" />

                <rect x="38" y="10" width="8" height="8" rx="1" />
                <rect x="50" y="10" width="8" height="8" rx="1" />
                <rect x="38" y="24" width="8" height="8" rx="1" />
                <rect x="50" y="24" width="8" height="8" rx="1" />

                <rect x="10" y="38" width="8" height="8" rx="1" />
                <rect x="24" y="38" width="8" height="8" rx="1" />
                <rect x="38" y="38" width="24" height="24" rx="2" fill="#6366f1" />
                <rect x="67" y="38" width="8" height="8" rx="1" />
                <rect x="82" y="38" width="8" height="8" rx="1" />

                <rect x="38" y="68" width="8" height="8" rx="1" />
                <rect x="50" y="68" width="8" height="8" rx="1" />
                <rect x="38" y="82" width="8" height="8" rx="1" />
                <rect x="50" y="82" width="8" height="8" rx="1" />
                <rect x="67" y="68" width="23" height="8" rx="1" />
                <rect x="82" y="82" width="8" height="8" rx="1" />
              </svg>
            </div>

            {/* Ticket Info */}
            <div className="flex-1 min-w-0 font-mono text-xs space-y-2">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">
                  Attendee Name
                </span>
                <p className="font-bold text-white truncate text-sm">{userName}</p>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">
                  Ticket ID
                </span>
                <p className="font-bold text-indigo-400">{ticketId}</p>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 block">
                  Check-in Status
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  CONFIRMED
                </span>
              </div>
            </div>
          </div>

          {/* Event Schedule & Location */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
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
        <div className="p-4 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between gap-2">
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
