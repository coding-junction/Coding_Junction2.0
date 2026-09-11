"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import {
  LayoutDashboard, UserCog, Settings, Code2, Calendar, Trophy,
  CalendarDays, ArrowRight, ExternalLink, Sparkles, BookOpen,
  Users, MapPin, Bell, Bookmark, GraduationCap, Globe,
  Smartphone, ImageIcon, Clock, ChevronRight, Star, Zap, Award,
  ShieldCheck, ShieldAlert, Building2, CheckCircle2, Ticket
} from "lucide-react";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { sanity } from "@/lib/sanity";
import { motion, AnimatePresence } from "motion/react";
import { CertificatesTab } from "@/components/dashboard/CertificatesTab";
import { CollegeVerificationModal, VerifiedCollegeData } from "@/components/dashboard/CollegeVerificationModal";
import { MembershipCard } from "@/components/dashboard/MembershipCard";
import { EventPassesTab } from "@/components/dashboard/EventPassesTab";
import { LeaderboardTab } from "@/components/dashboard/LeaderboardTab";
import { ResourcesTab } from "@/components/dashboard/ResourcesTab";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";

/* ─── Types ─── */
interface SanityEvent {
  _id: string;
  title: string;
  date?: string;
  location?: string;
  description?: string;
  registerLink?: string;
  images?: { asset?: { _id?: string; url: string } }[];
  image?: { asset?: { url: string } };
  certificateTemplate?: { asset?: { url: string } };
}

/* ─── Dashboard Tabs ─── */
type TabKey = "overview" | "events" | "passes" | "leaderboard" | "certificates" | "profile" | "resources" | "settings";

/* ─── Standardized Nav Tabs ─── */
const navTabs: {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "events", label: "Events", icon: CalendarDays },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy, badge: "Soon" },
  { key: "certificates", label: "Certificates", icon: Award, badge: "Soon" },
  { key: "profile", label: "Profile", icon: UserCog },
  { key: "resources", label: "Resources", icon: BookOpen },
  { key: "settings", label: "Settings", icon: Settings },
];

/* ─── Isolated Sidebar Component (Prevents Main Dashboard Re-renders on Hover) ─── */
function DashboardSidebarNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
}) {
  const { open, setOpen } = useSidebar();
  const { user, isLoaded } = useUser();

  return (
    <SidebarBody className="justify-between gap-6">
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Logo / Brand Header */}
        <div className={`flex items-center border-b border-black/[0.06] dark:border-white/[0.06] pb-3 mb-4 transition-all ${open ? "gap-3 px-1" : "justify-center"}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 flex-shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          {open && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-bold text-sm tracking-tight text-foreground dark:text-white truncate">
                Coding Junction
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                Dashboard 2.0
              </span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col gap-1.5">
          {navTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setOpen(false);
                }}
                title={!open ? item.label : undefined}
                className={`relative flex items-center rounded-xl transition-all duration-150 cursor-pointer ${
                  open
                    ? "w-full gap-3 px-3 py-2.5 text-sm"
                    : "w-10 h-10 justify-center mx-auto"
                } ${
                  isActive
                    ? "bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/30 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? (item.badge ? "text-amber-500" : "text-indigo-500 dark:text-indigo-400") : ""}`} />
                {open && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Section at Bottom of Sidebar */}
      <div className={`pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center ${open ? "gap-3 px-1" : "justify-center"}`}>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        {open && isLoaded && user && (
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-foreground dark:text-white truncate">
              {user.fullName || user.firstName || "Member"}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {user.primaryEmailAddress?.emailAddress || "Verified Member"}
            </span>
          </div>
        )}
      </div>
    </SidebarBody>
  );
}

const DashboardMain = () => {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [events, setEvents] = useState<SanityEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  /* ─── College Verification State ─── */
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationData, setVerificationData] = useState<VerifiedCollegeData | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      const meta = user.unsafeMetadata?.collegeVerification as VerifiedCollegeData | undefined;
      if (meta?.isVerified && meta?.verifiedAt) {
        const verifiedTime = new Date(meta.verifiedAt).getTime();
        const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
        const isExpired = isNaN(verifiedTime) || (Date.now() - verifiedTime) >= ONE_YEAR_MS;

        if (isExpired) {
          // 1 Year has elapsed: Annual verification expired, revoke pass & auto-trigger modal
          setVerificationData(null);
          setIsVerificationModalOpen(true);
        } else {
          setVerificationData(meta);
        }
      } else {
        // Automatically prompt unverified students on login
        setVerificationData(null);
        setIsVerificationModalOpen(true);
      }
    }
  }, [isLoaded, user]);

  /* ─── Protect Dashboard Route ─── */
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  /* ─── Fetch events from Sanity ─── */
  useEffect(() => {
    sanity
      .fetch(
        `*[_type in ["event", "post"]] | order(date desc) {
          _id, title, date, location, description, registerLink,
          images[]{ asset->{ _id, url } },
          image{ asset->{ url } },
          certificateTemplate{ asset->{ url } }
        }`
      )
      .then((data: SanityEvent[]) => {
        setEvents(data);
        setEventsLoading(false);
      })
      .catch(() => setEventsLoading(false));
  }, []);

  /* ─── Helpers (Memoized) ─── */
  const getGreeting = React.useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const memberSince = React.useMemo(() => {
    return user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
      : "—";
  }, [user?.createdAt]);

  const upcomingEvents = React.useMemo(() => {
    return events.filter((e) => e.date && new Date(e.date) >= new Date());
  }, [events]);

  const pastEvents = React.useMemo(() => {
    return events.filter((e) => !e.date || new Date(e.date) < new Date());
  }, [events]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-background overflow-hidden">
      {/* ─── Sidebar ─── */}
      <Sidebar>
        <DashboardSidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </Sidebar>

      {/* ─── Main Content ─── */}
      <div className="flex-1 overflow-y-auto min-w-0">
        {/* Top Bar Header */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06] px-3 sm:px-6 md:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Breadcrumb / Title */}
          <div className="hidden sm:flex items-center gap-2 min-w-0 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">Portal</span>
            <span className="text-muted-foreground/40 text-xs hidden sm:inline">/</span>
            <span className="text-xs font-bold text-foreground dark:text-white capitalize flex items-center gap-1.5">
              {activeTab}
              {(activeTab === "certificates" || activeTab === "passes" || activeTab === "leaderboard") && (
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30">
                  Soon
                </span>
              )}
            </span>
          </div>

          {/* Centered Pill Nav (horizontally scrollable on mobile) */}
          <nav className="flex items-center gap-1 p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] overflow-x-auto scrollbar-hide flex-1 sm:flex-initial max-w-[calc(100vw-130px)] sm:max-w-none">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? "text-indigo-600 dark:text-white font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 rounded-lg bg-white dark:bg-[#181926] shadow-sm border border-black/[0.06] dark:border-white/[0.08]"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? (tab.badge ? "text-amber-400" : "text-indigo-500") : ""}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[8px] uppercase font-bold tracking-wider px-1 py-0.2 rounded bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30">
                        {tab.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors border border-black/[0.06] dark:border-white/[0.06]"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Website</span>
            </Link>

            <NotificationCenter
              events={events}
              user={user}
              verificationData={verificationData}
              onOpenVerification={() => setIsVerificationModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab as TabKey)}
            />

            <SignedIn>
              <div className="p-0.5 rounded-full border border-black/[0.08] dark:border-white/[0.08]">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <OverviewTab
                key="overview"
                user={user}
                isLoaded={isLoaded}
                getGreeting={getGreeting}
                memberSince={memberSince}
                upcomingEvents={upcomingEvents}
                pastEvents={pastEvents}
                eventsLoading={eventsLoading}
                totalEvents={events.length}
                verificationData={verificationData}
                onOpenVerification={() => setIsVerificationModalOpen(true)}
              />
            )}
            {activeTab === "events" && (
              <EventsTab
                key="events"
                upcomingEvents={upcomingEvents}
                pastEvents={pastEvents}
                eventsLoading={eventsLoading}
              />
            )}
            {activeTab === "leaderboard" && (
              <LeaderboardTab
                key="leaderboard"
                user={user}
                verificationData={verificationData}
                totalEvents={events.length}
              />
            )}
            {activeTab === "certificates" && (
              <CertificatesTab
                key="certificates"
                user={user}
                verificationData={verificationData}
                events={events}
                onBrowseEvents={() => setActiveTab("events")}
              />
            )}
            {activeTab === "profile" && (
              <ProfileTab
                key="profile"
                user={user}
                isLoaded={isLoaded}
                memberSince={memberSince}
                verificationData={verificationData}
                onOpenVerification={() => setIsVerificationModalOpen(true)}
              />
            )}
            {activeTab === "resources" && <ResourcesTab key="resources" />}
            {activeTab === "settings" && <SettingsTab key="settings" />}
          </AnimatePresence>
        </div>
      </div>

      {/* College ID Verification Modal */}
      <CollegeVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        user={user}
        onVerified={(data) => {
          setVerificationData(data);
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════
   TAB: Overview
   ═══════════════════════════════════════════════ */
const OverviewTab = React.memo(function OverviewTab({
  user, isLoaded, getGreeting, memberSince,
  upcomingEvents, pastEvents, eventsLoading, totalEvents,
  verificationData, onOpenVerification,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any; isLoaded: boolean; getGreeting: () => string; memberSince: string;
  upcomingEvents: SanityEvent[]; pastEvents: SanityEvent[]; eventsLoading: boolean;
  totalEvents: number;
  verificationData?: VerifiedCollegeData | null;
  onOpenVerification?: () => void;
}) {
  const quickStats = [
    { icon: Calendar, label: "Total Events", value: String(totalEvents), gradient: "from-blue-500 to-cyan-400", glowColor: "rgba(59,130,246,0.1)" },
    { icon: Trophy, label: "Upcoming", value: String(upcomingEvents.length), gradient: "from-amber-500 to-orange-400", glowColor: "rgba(245,158,11,0.1)" },
    { icon: Clock, label: "Member Since", value: memberSince.split(" ")[0] || "—", gradient: "from-emerald-500 to-teal-400", glowColor: "rgba(16,185,129,0.1)" },
    { icon: Code2, label: "Community", value: "500+", gradient: "from-violet-500 to-purple-400", glowColor: "rgba(139,92,246,0.1)" },
  ];

  interface QuickActionItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href?: string;
    gradient: string;
    description: string;
    badge?: string;
    onClick?: () => void;
  }

  const quickActions: QuickActionItem[] = [
    { icon: CalendarDays, label: "Browse Events", href: "/Events", gradient: "from-blue-500 to-indigo-500", description: "Explore past and upcoming events" },
    { icon: Users, label: "Meet the Team", href: "/Team", gradient: "from-emerald-500 to-teal-500", description: "Connect with club members" },
    { icon: ImageIcon, label: "View Gallery", href: "/Gallery", gradient: "from-amber-500 to-orange-500", description: "Photos from our events" },
    { icon: Smartphone, label: "Get the App", href: "/mobile-app", gradient: "from-violet-500 to-purple-500", description: "Download our mobile app" },
  ];

  const displayedOverviewEvents = upcomingEvents.length > 0 ? upcomingEvents : pastEvents;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      {/* Welcome Card */}
      <div className="relative rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-purple-500/10 p-6 md:p-8 mb-6 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-xl transform-gpu pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-xl transform-gpu pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {isLoaded && user?.imageUrl && (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/15 flex-shrink-0">
                <Image src={user.imageUrl} alt={user.fullName || "User"} width={64} height={64} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                  {getGreeting()}{user?.firstName ? `, ${user.firstName}` : ""} 👋
                </span>
                {verificationData?.isVerified ? (
                  <span
                    title={verificationData.collegeName}
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    {verificationData.collegeName.length > 24
                      ? `${verificationData.collegeName.slice(0, 22)}...`
                      : verificationData.collegeName}
                  </span>
                ) : (
                  <button
                    onClick={onOpenVerification}
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldAlert className="w-3 h-3 text-amber-500" />
                    Verify College ID
                  </button>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground dark:text-white tracking-tight">
                Welcome to your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">Dashboard</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Track events, certifications, achievements, and club announcements.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end shrink-0">
            <span className="text-xs text-muted-foreground">Today</span>
            <span className="text-sm font-semibold text-foreground dark:text-white">
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {eventsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-5 animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-black/[0.06] dark:bg-white/[0.06] mb-3" />
              <div className="h-5 w-12 rounded bg-black/[0.06] dark:bg-white/[0.06] mb-1.5" />
              <div className="h-3 w-16 rounded bg-black/[0.04] dark:bg-white/[0.04]" />
            </div>
          ))
        ) : (
          quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-5 hover:border-indigo-500/30 transition-all duration-200 shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-md transition-transform duration-200 group-hover:scale-105 flex-shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-foreground dark:text-white leading-tight tracking-tight">{stat.value}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* ─ Events Highlight (Upcoming or Recent) ─ */}
        <div className="lg:col-span-2 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-indigo-500" />
              <h3 className="font-semibold text-foreground dark:text-white text-sm">
                {upcomingEvents.length > 0 ? "Upcoming Events" : "Recent Events"}
              </h3>
            </div>
            <Link href="/Events" className="text-xs text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-5">
            {eventsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : displayedOverviewEvents.length > 0 ? (
              <div className="space-y-3">
                {displayedOverviewEvents.slice(0, 4).map((event) => {
                  const eventImg = event.images?.[0]?.asset?.url || event.image?.asset?.url;
                  return (
                    <div key={event._id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors border border-transparent hover:border-black/[0.04] dark:hover:border-white/[0.04]">
                      {eventImg ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-black/[0.06] dark:border-white/[0.06]">
                          <Image src={eventImg} alt={event.title} width={48} height={48} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <Calendar className="h-5 w-5 text-indigo-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground dark:text-white truncate">{event.title}</p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                          {event.date && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                      {event.registerLink && (
                        <a href={event.registerLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 transition-colors flex-shrink-0">
                          Register
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                </div>
                <p className="font-medium text-sm text-foreground dark:text-white mb-1">No events found</p>
                <p className="text-xs text-muted-foreground">Check back soon for new announcements!</p>
              </div>
            )}
          </div>
        </div>

        {/* ─ Quick Actions ─ */}
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 p-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <Zap className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold text-foreground dark:text-white text-sm">Quick Actions</h3>
          </div>
          <div className="p-3 space-y-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const content = (
                <>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${action.gradient} shadow-md transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-sm text-foreground dark:text-white">{action.label}</p>
                      {action.badge && (
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{action.description}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </>
              );

              if (action.onClick) {
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className="w-full text-left group flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link key={action.label} href={action.href || "#"} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─ Announcements + Community Highlights ─ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Announcements */}
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 p-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <Bell className="h-4 w-4 text-rose-500" />
            <h3 className="font-semibold text-foreground dark:text-white text-sm">Announcements</h3>
          </div>
          <div className="p-5 space-y-4">
            {[
              { title: "New semester, new events!", body: "Exciting workshops and hackathons planned. Stay tuned for registrations.", time: "Recently", color: "bg-indigo-500" },
              { title: "App update available", body: "Download the latest version of our mobile app for new features.", time: "This week", color: "bg-emerald-500" },
            ].map((ann, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-1.5 rounded-full flex-shrink-0 ${ann.color}`} />
                <div>
                  <p className="text-sm font-medium text-foreground dark:text-white">{ann.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{ann.body}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{ann.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Highlights */}
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 p-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <Star className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold text-foreground dark:text-white text-sm">Community Highlights</h3>
          </div>
          <div className="p-5 space-y-4">
            {[
              { icon: Users, label: "500+ members", sub: "and growing every day", gradient: "from-blue-500 to-cyan-500" },
              { icon: Trophy, label: "10+ hackathons", sub: "organized by our community", gradient: "from-amber-500 to-orange-500" },
              { icon: GraduationCap, label: "25+ workshops", sub: "across 5 tech domains", gradient: "from-emerald-500 to-teal-500" },
              { icon: Globe, label: "National reach", sub: "partnering with colleges across India", gradient: "from-violet-500 to-purple-500" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${item.gradient} shadow-sm flex-shrink-0`}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground dark:text-white">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════
   TAB: Events
   ═══════════════════════════════════════════════ */
const EventsTab = React.memo(function EventsTab({
  upcomingEvents, pastEvents, eventsLoading, onGoToPasses,
}: {
  upcomingEvents: SanityEvent[]; pastEvents: SanityEvent[]; eventsLoading: boolean;
  onGoToPasses?: () => void;
}) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const displayEvents = filter === "upcoming" ? upcomingEvents : filter === "past" ? pastEvents : [...upcomingEvents, ...pastEvents];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      {/* Digital Entry Passes Coming Soon Banner */}
      <div className="w-full mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-transparent border border-indigo-500/20 flex items-center justify-between gap-3 text-left shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center flex-shrink-0">
            <Ticket className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground dark:text-white truncate">
                Digital Event Passes & Entry Tickets
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 flex-shrink-0">
                Coming Soon
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              Scannable check-in QR tickets, instant RSVP tracking & calendar sync are currently under development.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-black/[0.04] dark:bg-white/[0.05] px-2.5 py-1 rounded-lg border border-black/[0.06] dark:border-white/[0.06] flex-shrink-0">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>In Development</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-white">Events</h2>
          <p className="text-sm text-muted-foreground mt-1">Browse all community events</p>
        </div>
        <div className="flex gap-2">
          {(["all", "upcoming", "past"] as const).map((f) => {
            const count =
              f === "upcoming"
                ? upcomingEvents.length
                : f === "past"
                ? pastEvents.length
                : upcomingEvents.length + pastEvents.length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  filter === f
                    ? "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-muted-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {eventsLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : displayEvents.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] shadow-sm p-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-indigo-400" />
          </div>
          <p className="font-semibold text-foreground dark:text-white mb-1">No events found</p>
          <p className="text-sm text-muted-foreground">
            {filter === "upcoming" ? "Check back soon for new events!" : "No past events to display."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayEvents.map((event) => {
            const isUpcoming = event.date ? new Date(event.date) >= new Date() : false;
            const eventImg = event.images?.[0]?.asset?.url || event.image?.asset?.url;
            return (
              <div
                key={event._id}
                className="group rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-5 hover:border-indigo-500/30 transition-all duration-200 shadow-sm flex gap-4"
              >
                {eventImg ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-black/[0.06] dark:border-white/[0.06]">
                    <Image src={eventImg} alt={event.title} width={64} height={64} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-indigo-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground dark:text-white truncate">{event.title}</p>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold flex-shrink-0 ${
                      isUpcoming
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-gray-500/10 text-gray-500 dark:text-gray-400"
                    }`}>
                      {isUpcoming ? "Upcoming" : "Past"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    {event.date && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{event.description}</p>
                  )}
                  {event.registerLink && isUpcoming && (
                    <a href={event.registerLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-600 mt-2 transition-colors">
                      Register <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════
   TAB: Profile
   ═══════════════════════════════════════════════ */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProfileTab = React.memo(function ProfileTab({
  user, isLoaded, memberSince, verificationData, onOpenVerification,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any; isLoaded: boolean; memberSince: string;
  verificationData?: VerifiedCollegeData | null;
  onOpenVerification?: () => void;
}) {
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">Your Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account information and view club credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Digital Membership Pass (Interactive 3D Card) */}
        <div className="lg:col-span-2 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-5 sm:p-6 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h4 className="font-bold text-foreground dark:text-white text-sm">Official Member Pass</h4>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] px-2 py-0.5 rounded-md">
              3D Interactive
            </span>
          </div>

          <MembershipCard
            user={user}
            memberSince={memberSince}
            verificationData={verificationData}
            onOpenVerification={onOpenVerification}
          />
        </div>

        {/* Details */}
        <div className="lg:col-span-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-6 shadow-sm">
          <h4 className="font-semibold text-foreground dark:text-white text-sm mb-4">Account Details</h4>
          <div className="space-y-4">
            {[
              { label: "Full Name", value: user?.fullName || "—" },
              { label: "Email", value: user?.primaryEmailAddress?.emailAddress || "—" },
              { label: "Username", value: user?.username || "Not set" },
              { label: "Member Since", value: memberSince },
              { label: "Account ID", value: user?.id ? `...${user.id.slice(-8)}` : "—" },
            ].map((field) => (
              <div key={field.label} className="flex items-center justify-between py-2 border-b border-black/[0.04] dark:border-white/[0.04] last:border-0">
                <p className="text-sm text-muted-foreground">{field.label}</p>
                <p className="text-sm font-medium text-foreground dark:text-white">{field.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => user && (window.location.href = "https://accounts.coding-junction.in/user")}
              className="px-4 py-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 transition-colors cursor-pointer"
            >
              Edit Profile
            </button>
            <Link
              href="/Gallery"
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors border border-black/[0.04] dark:border-white/[0.04]"
            >
              View Activity
            </Link>
          </div>
        </div>
      </div>

      {/* College ID Verification Card */}
      <div className="mt-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground dark:text-white text-sm">College Verification Status</h4>
              <p className="text-xs text-muted-foreground">Official AICTE Indian Colleges validation</p>
            </div>
          </div>
          {verificationData?.isVerified ? (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Student
            </span>
          ) : (
            <button
              onClick={onOpenVerification}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Verify College ID
            </button>
          )}
        </div>

        {verificationData?.isVerified ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]">
              <span className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">Institution Name</span>
              <p className="text-xs font-bold text-foreground dark:text-white mt-0.5">{verificationData.collegeName}</p>
            </div>
            {verificationData.university && (
              <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]">
                <span className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">Affiliated University</span>
                <p className="text-xs font-semibold text-foreground dark:text-white mt-0.5">{verificationData.university}</p>
              </div>
            )}
            <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]">
              <span className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">AICTE Permanent ID</span>
              <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{verificationData.aicteId}</p>
            </div>
            {verificationData.studentName && (
              <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]">
                <span className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">Verified Student Name</span>
                <p className="text-xs font-semibold text-foreground dark:text-white mt-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>{verificationData.studentName}</span>
                </p>
              </div>
            )}
            <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05]">
              <span className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">Location & Verified At</span>
              <p className="text-xs text-foreground dark:text-white mt-0.5">
                {verificationData.district ? `${verificationData.district}, ` : ""}{verificationData.state || "India"} • {new Date(verificationData.verifiedAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p>Your college identity card has not been verified yet. Upload your card to unlock full club credentials and certificates.</p>
            <button
              onClick={onOpenVerification}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0 cursor-pointer"
            >
              Upload ID Card &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Badges Section */}
      <div className="mt-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-4 w-4 text-amber-500" />
          <h4 className="font-semibold text-foreground dark:text-white text-sm">Badges & Achievements</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Star, name: "Early Adopter", desc: "Joined the community early", gradient: "from-amber-500 to-orange-500", unlocked: true },
            { icon: Code2, name: "Code Warrior", desc: "Participated in a hackathon", gradient: "from-blue-500 to-cyan-500", unlocked: false },
            { icon: Users, name: "Team Player", desc: "Contributed to a team project", gradient: "from-emerald-500 to-teal-500", unlocked: false },
            { icon: GraduationCap, name: "Scholar", desc: "Attended 5+ workshops", gradient: "from-violet-500 to-purple-500", unlocked: false },
          ].map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.name}
                className={`rounded-xl border border-black/[0.06] dark:border-white/[0.06] p-4 text-center transition-all ${
                  badge.unlocked ? "bg-black/[0.01] dark:bg-white/[0.02]" : "opacity-40 grayscale"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${badge.gradient} shadow-md mx-auto mb-2`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-xs font-semibold text-foreground dark:text-white">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{badge.desc}</p>
                {badge.unlocked && (
                  <span className="inline-block mt-1.5 text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Unlocked</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════
   TAB: Settings
   ═══════════════════════════════════════════════ */
const SettingsTab = React.memo(function SettingsTab() {
  const [notifications, setNotifications] = React.useState({
    events: true,
    announcements: true,
    newsletter: false,
  });

  const settingSections = [
    {
      title: "Appearance",
      icon: Sparkles,
      gradient: "from-violet-500 to-purple-500",
      description: "Customize how the dashboard looks.",
      items: [
        {
          label: "Theme",
          description: "Switch between light and dark mode using the toggle in the footer.",
          type: "info" as const,
        },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      gradient: "from-blue-500 to-cyan-500",
      description: "Control what notifications you receive.",
      items: [
        {
          label: "Event reminders",
          description: "Get notified about upcoming events and registration deadlines.",
          type: "toggle" as const,
          key: "events" as const,
        },
        {
          label: "Announcements",
          description: "Receive important community announcements.",
          type: "toggle" as const,
          key: "announcements" as const,
        },
        {
          label: "Newsletter",
          description: "Monthly digest of community highlights and resources.",
          type: "toggle" as const,
          key: "newsletter" as const,
        },
      ],
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences and account settings.</p>
      </div>

      <div className="space-y-6">
        {settingSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div
              key={section.title}
              className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] overflow-hidden shadow-sm"
            >
              <div className="flex items-center gap-3 p-5 border-b border-black/[0.06] dark:border-white/[0.06]">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${section.gradient} shadow-md`}>
                  <SectionIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground dark:text-white text-sm">{section.title}</h3>
                  <p className="text-[11px] text-muted-foreground">{section.description}</p>
                </div>
              </div>
              <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-4">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium text-foreground dark:text-white">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    {item.type === "toggle" && (
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key],
                          }))
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer ${
                          notifications[item.key]
                            ? "bg-indigo-500"
                            : "bg-black/10 dark:bg-white/10"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            notifications[item.key] ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    )}
                    {item.type === "info" && (
                      <span className="text-xs text-muted-foreground bg-black/[0.04] dark:bg-white/[0.04] px-3 py-1.5 rounded-lg">System default</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Account Management */}
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 p-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
              <UserCog className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground dark:text-white text-sm">Account</h3>
              <p className="text-[11px] text-muted-foreground">Manage your Clerk account and security settings.</p>
            </div>
          </div>
          <div className="p-5">
            <button
              onClick={() => window.open("https://accounts.coding-junction.in/user", "_blank")}
              className="px-5 py-2.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 transition-colors cursor-pointer"
            >
              Manage Account
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default DashboardMain;