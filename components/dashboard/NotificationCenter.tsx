"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  CheckCircle2,
  CalendarDays,
  Award,
  Trophy,
  ShieldCheck,
  Megaphone,
  Check,
  Trash2,
  ChevronRight,
  Sparkles,
  X,
  AlertCircle,
  Ticket,
} from "lucide-react";
import { VerifiedCollegeData } from "./CollegeVerificationModal";

export interface SanityEvent {
  _id: string;
  title: string;
  date?: string;
  location?: string;
  description?: string;
  registerLink?: string;
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  category: "event" | "pass" | "security" | "community" | "announcement";
  read: boolean;
  actionTab?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationCenterProps {
  events?: SanityEvent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
  verificationData?: VerifiedCollegeData | null;
  onOpenVerification?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export function NotificationCenter({
  events = [],
  user,
  verificationData,
  onOpenVerification,
  onNavigateTab,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [lastMarkedAllReadAt, setLastMarkedAllReadAt] = useState<number>(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Storage key scoped to authenticated user ID
  const storageKey = user?.id ? `cj_notif_state_${user.id}` : "cj_notif_state_anon";

  // Load read / dismissed / lastMarkedAllReadAt from Clerk metadata & localStorage
  useEffect(() => {
    try {
      // 1. Clerk cloud metadata
      const clerkState = user?.unsafeMetadata?.notificationState as
        | { readIds?: string[]; dismissedIds?: string[]; lastMarkedAllReadAt?: number }
        | undefined;

      // 2. User-scoped localStorage or legacy fallback
      const saved =
        localStorage.getItem(storageKey) || localStorage.getItem("cj_notif_read_ids_v1");
      const legacyDismissed = localStorage.getItem("cj_notif_dismissed_ids_v1");

      let localParsed: { readIds?: string[]; dismissedIds?: string[]; lastMarkedAllReadAt?: number } = {};
      if (saved) {
        try {
          const p = JSON.parse(saved);
          if (Array.isArray(p)) {
            localParsed.readIds = p;
          } else if (p && typeof p === "object") {
            localParsed = p;
          }
        } catch {
          // ignore
        }
      }

      if (legacyDismissed) {
        try {
          const pD = JSON.parse(legacyDismissed);
          if (Array.isArray(pD)) {
            localParsed.dismissedIds = Array.from(
              new Set([...(localParsed.dismissedIds || []), ...pD])
            );
          }
        } catch {
          // ignore
        }
      }

      const mergedRead = Array.from(
        new Set([...(clerkState?.readIds || []), ...(localParsed.readIds || [])])
      );
      const mergedDismissed = Array.from(
        new Set([...(clerkState?.dismissedIds || []), ...(localParsed.dismissedIds || [])])
      );
      const mergedMarkedAllReadAt = Math.max(
        clerkState?.lastMarkedAllReadAt || 0,
        localParsed.lastMarkedAllReadAt || 0
      );

      setReadIds(mergedRead);
      setDismissedIds(mergedDismissed);
      setLastMarkedAllReadAt(mergedMarkedAllReadAt);

      const savedPasses = localStorage.getItem("cj_registered_event_ids");
      if (savedPasses) setRegisteredEventIds(JSON.parse(savedPasses));
    } catch {
      // ignore
    }
    setMounted(true);
  }, [user?.id, storageKey]);

  // Helper to persist state to both localStorage and Clerk Cloud User profile
  const persistState = (
    nextRead: string[],
    nextDismissed: string[],
    nextMarkedAllReadAt: number
  ) => {
    const payload = {
      readIds: nextRead,
      dismissedIds: nextDismissed,
      lastMarkedAllReadAt: nextMarkedAllReadAt,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
      localStorage.setItem("cj_notif_read_ids_v1", JSON.stringify(nextRead));
      localStorage.setItem("cj_notif_dismissed_ids_v1", JSON.stringify(nextDismissed));
    } catch {
      // ignore
    }

    if (user?.update) {
      user
        .update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            notificationState: payload,
          },
        })
        .catch(() => {
          // non-blocking if offline
        });
    }
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Mark single notification as read
  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      persistState(updated, dismissedIds, lastMarkedAllReadAt);
    }
  };

  // Mark all active notifications as read
  const markAllAsRead = (allCurrentIds: string[]) => {
    const now = Date.now();
    const updated = Array.from(new Set([...readIds, ...allCurrentIds]));
    setReadIds(updated);
    setLastMarkedAllReadAt(now);
    persistState(updated, dismissedIds, now);
  };

  // Dismiss notification
  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedDismissed = Array.from(new Set([...dismissedIds, id]));
    const updatedRead = Array.from(new Set([...readIds, id]));
    setDismissedIds(updatedDismissed);
    setReadIds(updatedRead);
    persistState(updatedRead, updatedDismissed, lastMarkedAllReadAt);
  };

  // Clear all notifications
  const clearAll = (allCurrentIds: string[]) => {
    const now = Date.now();
    const updatedDismissed = Array.from(new Set([...dismissedIds, ...allCurrentIds]));
    const updatedRead = Array.from(new Set([...readIds, ...allCurrentIds]));
    setDismissedIds(updatedDismissed);
    setReadIds(updatedRead);
    setLastMarkedAllReadAt(now);
    persistState(updatedRead, updatedDismissed, now);
  };

  // Check if item is read
  const isNotificationRead = (id: string, itemTimestamp?: number) => {
    if (readIds.includes(id)) return true;
    if (lastMarkedAllReadAt && itemTimestamp && itemTimestamp <= lastMarkedAllReadAt) {
      return true;
    }
    return false;
  };

  // ── Construct Real Notifications from Live Data ──
  const allNotifications: DashboardNotification[] = useMemo(() => {
    const list: DashboardNotification[] = [];

    // 1. Real Upcoming Sanity Events (Only upcoming events belong in the live notification stream)
    const upcomingEvents = events.filter((e) => e.date && new Date(e.date) >= new Date());
    upcomingEvents.slice(0, 3).forEach((event) => {
      const eventDate = new Date(event.date!);
      const formattedDate = eventDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const cleanDesc = event.description
        ? event.description.replace(/\n+/g, " ").trim().slice(0, 130) + (event.description.length > 130 ? "..." : "")
        : `Location: ${event.location || "Coding Junction Campus"}`;

      const notifId = `event-${event._id}`;
      const notifTime = eventDate.getTime();

      list.push({
        id: notifId,
        title: `Upcoming: ${event.title}`,
        message: cleanDesc,
        time: formattedDate,
        timestamp: notifTime,
        category: "event",
        read: isNotificationRead(notifId, notifTime),
        actionTab: "events",
        actionLabel: "View Details",
      });
    });

    // 2. Real Digital Entry Passes from EventPassesTab
    if (registeredEventIds.length > 0) {
      const registeredEvent = events.find((e) => registeredEventIds.includes(e._id));
      if (registeredEvent) {
        const passId = `pass-${registeredEvent._id}`;
        const passTime = registeredEvent.date
          ? new Date(registeredEvent.date).getTime() - 24 * 60 * 60 * 1000
          : 1730000000000;
        list.push({
          id: passId,
          title: `🎟️ Entry Pass Confirmed: ${registeredEvent.title}`,
          message: `Your dynamic check-in QR pass is issued and ready. Bring your mobile pass to ${registeredEvent.location || "the venue"}.`,
          time: "Pass Ready",
          timestamp: passTime,
          category: "pass",
          read: isNotificationRead(passId, passTime),
          actionTab: "passes",
          actionLabel: "Show QR Pass",
        });
      }
    }

    // 3. Real College Verification Notice
    if (verificationData?.isVerified) {
      const verId = "college-verified";
      const verTime = verificationData.verifiedAt
        ? new Date(verificationData.verifiedAt).getTime()
        : 1730000000000;
      list.push({
        id: verId,
        title: `🛡️ Verified Student: ${verificationData.collegeName}`,
        message: `ID card confirmed for ${verificationData.studentName || "Member"} (${verificationData.collegeName}). Digital 1-Year Membership Card is unlocked.`,
        time: verificationData.verifiedAt
          ? new Date(verificationData.verifiedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })
          : "Verified",
        timestamp: verTime,
        category: "security",
        read: isNotificationRead(verId, verTime),
        actionTab: "profile",
        actionLabel: "View Membership Card",
      });
    } else {
      const unverifiedId = "college-unverified";
      const unverifiedTime = user?.createdAt
        ? new Date(user.createdAt).getTime()
        : 1730000000000;
      list.push({
        id: unverifiedId,
        title: `⚠️ Complete College ID Verification`,
        message: `Verify your college identification to receive your official annual Coding Junction membership card and access members-only hackathons.`,
        time: "Action Required",
        timestamp: unverifiedTime,
        category: "security",
        read: isNotificationRead(unverifiedId, unverifiedTime),
        actionTab: "open-verification-modal",
        actionLabel: "Verify College ID",
        onAction: onOpenVerification,
      });
    }

    // 4. Real User Account Setup Notice
    if (user) {
      const welcomeId = `welcome-${user.id}`;
      const joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Recently";
      const welcomeTime = user.createdAt
        ? new Date(user.createdAt).getTime()
        : 1730000000000;

      list.push({
        id: welcomeId,
        title: `Welcome to Coding Junction, ${user.firstName || user.fullName || "Member"}!`,
        message: `Connected with ${user.primaryEmailAddress?.emailAddress || "your account"}. Access event passes, learning roadmaps, and community announcements.`,
        time: joinedDate,
        timestamp: welcomeTime,
        category: "announcement",
        read: isNotificationRead(welcomeId, welcomeTime),
        actionTab: "overview",
        actionLabel: "Explore Dashboard",
      });
    }

    // 5. Interactive Roadmaps Feature Notice
    const roadmapId = "roadmaps-available";
    const roadmapTime = 1738000000000; // Fixed launch timestamp
    list.push({
      id: roadmapId,
      title: `📚 Interactive Learning Roadmaps`,
      message: `Track your progress with checklists for Full-Stack Web Dev, DSA, AI/ML, and DevOps in the Resources tab. Save bookmarks with personal notes.`,
      time: "Available",
      timestamp: roadmapTime,
      category: "community",
      read: isNotificationRead(roadmapId, roadmapTime),
      actionTab: "resources",
      actionLabel: "Explore Roadmaps",
    });

    return list;
  }, [events, user, verificationData, registeredEventIds, readIds, lastMarkedAllReadAt, onOpenVerification]);

  // Filter out dismissed notifications
  const activeNotifications = useMemo(() => {
    return allNotifications.filter((n) => !dismissedIds.includes(n.id));
  }, [allNotifications, dismissedIds]);

  const unreadCount = activeNotifications.filter((n) => !n.read).length;

  const displayedList = useMemo(() => {
    return filter === "unread"
      ? activeNotifications.filter((n) => !n.read)
      : activeNotifications;
  }, [activeNotifications, filter]);

  const handleActionClick = (notif: DashboardNotification) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.onAction) {
      notif.onAction();
    } else if (notif.actionTab && onNavigateTab) {
      onNavigateTab(notif.actionTab);
    }
  };

  const getCategoryConfig = (cat: DashboardNotification["category"]) => {
    switch (cat) {
      case "event":
        return {
          icon: CalendarDays,
          gradient: "from-blue-500 to-indigo-500",
        };
      case "pass":
        return {
          icon: Ticket,
          gradient: "from-emerald-500 to-teal-500",
        };
      case "security":
        return {
          icon: ShieldCheck,
          gradient: "from-amber-500 to-orange-500",
        };
      case "community":
        return {
          icon: Trophy,
          gradient: "from-purple-500 to-violet-500",
        };
      case "announcement":
      default:
        return {
          icon: Megaphone,
          gradient: "from-rose-500 to-red-500",
        };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Bell Trigger Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open notifications"
        className={`relative p-2 rounded-xl transition-all cursor-pointer border ${
          isOpen
            ? "bg-black/[0.06] dark:bg-white/[0.08] border-indigo-500/30 text-foreground dark:text-white shadow-sm"
            : "border-transparent hover:border-black/[0.06] dark:hover:border-white/[0.06] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-muted-foreground hover:text-foreground"
        }`}
      >
        <Bell className="h-4 w-4" />
        {mounted && unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm animate-in fade-in zoom-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-[340px] sm:w-[410px] rounded-2xl border border-black/[0.1] dark:border-white/[0.1] bg-white/95 dark:bg-[#0c0d14]/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[580px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground dark:text-white flex items-center gap-1.5">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead(activeNotifications.map((n) => n.id))}
                    title="Mark all as read"
                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1 rounded-lg hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                {activeNotifications.length > 0 && (
                  <button
                    onClick={() => clearAll(activeNotifications.map((n) => n.id))}
                    title="Clear all notifications"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-black/[0.04] dark:border-white/[0.04] bg-black/[0.01] dark:bg-white/[0.01]">
              <button
                onClick={() => setFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter === "all"
                    ? "bg-black/[0.06] dark:bg-white/[0.08] text-foreground dark:text-white font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({activeNotifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter === "unread"
                    ? "bg-black/[0.06] dark:bg-white/[0.08] text-foreground dark:text-white font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Notification Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-black/[0.04] dark:divide-white/[0.04] scrollbar-thin">
              {displayedList.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground dark:text-white">
                    You&apos;re all caught up!
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {filter === "unread"
                      ? "No unread notifications right now."
                      : "No active announcements or notifications."}
                  </p>
                </div>
              ) : (
                displayedList.map((item) => {
                  const config = getCategoryConfig(item.category);
                  const Icon = config.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer ${
                        item.read
                          ? "hover:bg-black/[0.02] dark:hover:bg-white/[0.02] opacity-80"
                          : "bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05] hover:bg-indigo-500/[0.06]"
                      }`}
                    >
                      {/* Unread indicator bar */}
                      {!item.read && (
                        <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r-full" />
                      )}

                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br ${config.gradient} text-white shadow-sm flex-shrink-0 mt-0.5`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p
                            className={`text-xs leading-tight ${
                              item.read
                                ? "text-foreground dark:text-white font-medium"
                                : "text-foreground dark:text-white font-bold"
                            }`}
                          >
                            {item.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap font-mono">
                            {item.time}
                          </span>
                        </div>

                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                          {item.message}
                        </p>

                        {/* Action CTA Button */}
                        {item.actionLabel && (
                          <div className="mt-2 flex items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActionClick(item);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                            >
                              <span>{item.actionLabel}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>

                            <button
                              onClick={(e) => dismissNotification(item.id, e)}
                              title="Dismiss notification"
                              className="p-1 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Coding Junction Real-time Feed</span>
              </span>
              <span className="font-mono text-[10px]">Connected to Sanity &amp; Auth</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
