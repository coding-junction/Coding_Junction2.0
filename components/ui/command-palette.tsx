"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Home, CalendarDays, Users, ImageIcon, Code2,
  BookOpen, MessageCircle, Smartphone, LayoutDashboard,
  LogIn, ChevronRight, Command, Folder, Award, Handshake,
  ShieldCheck, X, Terminal, Zap, Sparkles
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  category: string;
}

const allCommands: CommandItem[] = [
  { id: "terminal", label: "Open CJ Developer Terminal", description: "Interactive shell with Matrix rain & cyber tools (Ctrl + `)", icon: Terminal, href: "#terminal", category: "Developer Tools" },
  { id: "member-pass", label: "Official 3D Member Pass", description: "Your verified 3D holographic club pass with iridescent foil", icon: Sparkles, href: "/Dashboard?tab=profile", category: "Dashboard" },
  { id: "home", label: "Home", description: "Landing page", icon: Home, href: "/", category: "Pages" },
  { id: "events", label: "Events", description: "Browse all events", icon: CalendarDays, href: "/Events", category: "Pages" },
  { id: "team", label: "Team", description: "Meet the team", icon: Users, href: "/Team", category: "Pages" },
  { id: "gallery", label: "Gallery", description: "Photo gallery", icon: ImageIcon, href: "/Gallery", category: "Pages" },
  { id: "blog", label: "Blog", description: "Tech articles & tutorials", icon: BookOpen, href: "/Blog", category: "Pages" },
  { id: "projects", label: "Projects", description: "Project showcase", icon: Code2, href: "/Projects", category: "Pages" },
  { id: "verify", label: "Verify Certificate", description: "Official credential ledger", icon: ShieldCheck, href: "/verify", category: "Pages" },
  { id: "contact", label: "Contact Us", description: "Get in touch", icon: MessageCircle, href: "/contact", category: "Pages" },
  { id: "partners", label: "Community Partners", description: "Our partners", icon: Handshake, href: "/CommunityPartners", category: "Pages" },
  { id: "app", label: "Mobile App", description: "Download our app", icon: Smartphone, href: "/mobile-app", category: "Pages" },
  { id: "dashboard", label: "Dashboard", description: "Member portal", icon: LayoutDashboard, href: "/Dashboard", category: "Dashboard" },
  { id: "dashboard-projects", label: "Showcase Project", description: "Submit your project to showcase", icon: Code2, href: "/Dashboard?tab=projects", category: "Dashboard" },
  { id: "dashboard-events", label: "My Events", description: "Registered events", icon: CalendarDays, href: "/Dashboard?tab=events", category: "Dashboard" },
  { id: "dashboard-passes", label: "Event Passes", description: "Digital passes & QR codes", icon: Folder, href: "/Dashboard?tab=passes", category: "Dashboard" },
  { id: "dashboard-certificates", label: "Certificates", description: "Earned credentials", icon: Award, href: "/Dashboard?tab=certificates", category: "Dashboard" },
  { id: "dashboard-profile", label: "Profile", description: "Your profile", icon: Users, href: "/Dashboard?tab=profile", category: "Dashboard" },
  { id: "dashboard-resources", label: "Resources", description: "Learning materials", icon: BookOpen, href: "/Dashboard?tab=resources", category: "Dashboard" },
  { id: "privacy", label: "Privacy Policy", description: "Our privacy policy", icon: ChevronRight, href: "/privacy", category: "Legal" },
  { id: "terms", label: "Terms of Service", description: "Terms and conditions", icon: ChevronRight, href: "/terms", category: "Legal" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  // Filter commands
  const commands = allCommands.filter((cmd) => {
    // Hide dashboard items for non-authenticated users
    if (cmd.category === "Dashboard" && !isSignedIn) return false;

    if (!query) return true;
    const q = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Group by category
  const grouped = commands.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  const flatList = Object.values(grouped).flat();

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selected index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected into view
  useEffect(() => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll("[data-command-item]");
      items[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      if (href === "#terminal") {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("cj:open-terminal"));
        }
        return;
      }
      router.push(href);
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatList.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && flatList[selectedIndex]) {
        e.preventDefault();
        navigate(flatList[selectedIndex].href);
      }
    },
    [flatList, selectedIndex, navigate]
  );

  return (
    <>
      {/* Modal (Triggered globally via Cmd+K / Ctrl+K) */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-[90vw] max-w-lg"
            >
              <div className="rounded-2xl border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#0c0d14] shadow-2xl shadow-black/20 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                  <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search pages, dashboard tabs..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button
                    onClick={() => setOpen(false)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Results */}
                <div
                  ref={listRef}
                  className="max-h-[50vh] overflow-y-auto py-2"
                >
                  {flatList.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No results found for &ldquo;{query}&rdquo;
                    </div>
                  ) : (
                    Object.entries(grouped).map(([category, items]) => (
                      <div key={category}>
                        <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                          {category}
                        </p>
                        {items.map((item) => {
                          const globalIndex = flatList.indexOf(item);
                          const isSelected = globalIndex === selectedIndex;
                          const Icon = item.icon;

                          return (
                            <button
                              key={item.id}
                              data-command-item
                              onClick={() => navigate(item.href)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-indigo-500/10 dark:bg-indigo-500/15"
                                  : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected
                                    ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                                    : "bg-black/[0.04] dark:bg-white/[0.06] text-muted-foreground"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-medium truncate ${
                                    isSelected
                                      ? "text-indigo-600 dark:text-indigo-400"
                                      : "text-foreground dark:text-white"
                                  }`}
                                >
                                  {item.label}
                                </p>
                                {item.description && (
                                  <p className="text-[11px] text-muted-foreground truncate">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <ChevronRight
                                className={`w-3.5 h-3.5 flex-shrink-0 transition-opacity ${
                                  isSelected
                                    ? "opacity-100 text-indigo-500"
                                    : "opacity-0"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer hint */}
                <div className="px-4 py-2 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.08] font-mono text-[9px]">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.08] font-mono text-[9px]">↵</kbd>
                      Open
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.08] font-mono text-[9px]">Esc</kbd>
                      Close
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
