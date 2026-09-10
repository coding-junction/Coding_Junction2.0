"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Code2,
  Globe,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  FileText,
  Layers,
  Map,
  ArrowUpRight,
} from "lucide-react";
import { InteractiveRoadmaps } from "./InteractiveRoadmaps";

export interface CuratedResource {
  id: string;
  category: string;
  name: string;
  url: string;
  desc: string;
  tag: string;
}

export interface SavedResource {
  id: string;
  name: string;
  url: string;
  desc?: string;
  note: string;
  savedAt: string;
  category?: string;
}

const DEFAULT_CURATED_RESOURCES: CuratedResource[] = [
  // Learning Paths
  {
    id: "res-roadmap-fe",
    category: "Learning Paths",
    name: "Frontend Developer Roadmap",
    url: "https://roadmap.sh/frontend",
    desc: "Step-by-step modern frontend development path with clear visual milestones.",
    tag: "Web Dev",
  },
  {
    id: "res-roadmap-be",
    category: "Learning Paths",
    name: "Backend Developer Roadmap",
    url: "https://roadmap.sh/backend",
    desc: "Comprehensive guide to APIs, databases, caching, and server architecture.",
    tag: "Backend",
  },
  {
    id: "res-dsa-leetcode",
    category: "Learning Paths",
    name: "LeetCode Practice Platform",
    url: "https://leetcode.com",
    desc: "Industry-standard algorithm problem sets and company-specific interview prep.",
    tag: "DSA",
  },
  {
    id: "res-sys-design",
    category: "Learning Paths",
    name: "System Design Primer",
    url: "https://github.com/donnemartin/system-design-primer",
    desc: "Learn how to build large-scale distributed systems and prepare for system design rounds.",
    tag: "Architecture",
  },

  // Community Tools
  {
    id: "res-cj-github",
    category: "Community Tools",
    name: "Coding Junction GitHub Organization",
    url: "https://github.com/Coding-Junction",
    desc: "Official club open-source repositories, project templates, and community contributions.",
    tag: "Club",
  },
  {
    id: "res-cj-app",
    category: "Community Tools",
    name: "Coding Junction Mobile App",
    url: "/mobile-app",
    desc: "Stay connected with announcements, live updates, and campus events on the go.",
    tag: "Mobile",
  },
  {
    id: "res-cj-partners",
    category: "Community Tools",
    name: "Community Partners & Hackathons",
    url: "/CommunityPartners",
    desc: "Partner tech clubs, hackathon organizers, and sponsor ecosystems collaborating with CJ.",
    tag: "Partners",
  },

  // Developer Platforms
  {
    id: "res-devfolio",
    category: "Useful Platforms",
    name: "Devfolio Hackathons",
    url: "https://devfolio.co",
    desc: "Discover upcoming national and global hackathons, apply with teammates, and win prizes.",
    tag: "Hackathons",
  },
  {
    id: "res-unstop",
    category: "Useful Platforms",
    name: "Unstop Opportunities",
    url: "https://unstop.com",
    desc: "Coding competitions, college hackathons, internships, and hiring challenges across India.",
    tag: "Competitions",
  },
  {
    id: "res-freecodecamp",
    category: "Useful Platforms",
    name: "freeCodeCamp Curriculum",
    url: "https://freecodecamp.org",
    desc: "Free certified curriculum covering web development, Python, algorithms, and data science.",
    tag: "Free Course",
  },
  {
    id: "res-mdn",
    category: "Documentation & Docs",
    name: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    desc: "The definitive encyclopedia for HTML, CSS, JavaScript APIs, and web platform standards.",
    tag: "Reference",
  },
  {
    id: "res-neetcode",
    category: "Documentation & Docs",
    name: "NeetCode 150 & Algorithms",
    url: "https://neetcode.io",
    desc: "Curated 150 coding interview problems grouped by algorithmic patterns with video explanations.",
    tag: "DSA Prep",
  },
];

export const ResourcesTab = React.memo(function ResourcesTab() {
  const [activeSubTab, setActiveSubTab] = useState<"roadmaps" | "curated" | "saved">("roadmaps");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newNote, setNewNote] = useState("");
  const [mounted, setMounted] = useState(false);

  // Load bookmarks & notes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cj_saved_resources_notes");
      if (stored) {
        setSavedResources(JSON.parse(stored));
      } else {
        // Initial sample saved resource with note
        const initial: SavedResource[] = [
          {
            id: "res-roadmap-fe",
            name: "Frontend Developer Roadmap",
            url: "https://roadmap.sh/frontend",
            desc: "Step-by-step modern frontend development path with clear visual milestones.",
            note: "Focus on React Server Components and Next.js 15 before the annual hackathon.",
            savedAt: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
            category: "Learning Paths",
          },
        ];
        setSavedResources(initial);
        localStorage.setItem("cj_saved_resources_notes", JSON.stringify(initial));
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const saveToStorage = (list: SavedResource[]) => {
    setSavedResources(list);
    try {
      localStorage.setItem("cj_saved_resources_notes", JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const isBookmarked = (id: string) => savedResources.some((r) => r.id === id);

  const toggleBookmark = (res: CuratedResource) => {
    if (isBookmarked(res.id)) {
      const updated = savedResources.filter((r) => r.id !== res.id);
      saveToStorage(updated);
    } else {
      const newItem: SavedResource = {
        id: res.id,
        name: res.name,
        url: res.url,
        desc: res.desc,
        note: "",
        savedAt: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        category: res.category,
      };
      saveToStorage([newItem, ...savedResources]);
    }
  };

  const handleStartEditNote = (item: SavedResource) => {
    setEditingNoteId(item.id);
    setNoteDraft(item.note || "");
  };

  const handleSaveNote = (id: string) => {
    const updated = savedResources.map((r) =>
      r.id === id ? { ...r, note: noteDraft } : r
    );
    saveToStorage(updated);
    setEditingNoteId(null);
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedResources.filter((r) => r.id !== id);
    saveToStorage(updated);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://") && !formattedUrl.startsWith("/")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const customItem: SavedResource = {
      id: `custom-${Date.now()}`,
      name: newTitle.trim(),
      url: formattedUrl,
      desc: "Custom saved resource",
      note: newNote.trim(),
      savedAt: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      category: "Personal Bookmark",
    };

    saveToStorage([customItem, ...savedResources]);
    setNewTitle("");
    setNewUrl("");
    setNewNote("");
    setShowAddCustomModal(false);
  };

  const filteredCurated = DEFAULT_CURATED_RESOURCES.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(
    new Set(filteredCurated.map((i) => i.category))
  );

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-6"
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-indigo-500" />
            Learning Paths &amp; Resources
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive checklists, curated engineering roadmaps, and personal note-taking.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab("roadmaps")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "roadmaps"
                ? "bg-white dark:bg-[#181926] text-indigo-600 dark:text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Map className="w-3.5 h-3.5 text-indigo-500" />
            <span>Learning Roadmaps</span>
          </button>
          <button
            onClick={() => setActiveSubTab("curated")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "curated"
                ? "bg-white dark:bg-[#181926] text-indigo-600 dark:text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Curated Resources</span>
          </button>
          <button
            onClick={() => setActiveSubTab("saved")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "saved"
                ? "bg-white dark:bg-[#181926] text-indigo-600 dark:text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>My Saved &amp; Notes</span>
            {savedResources.length > 0 && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400">
                {savedResources.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Sub-Tab 1: Interactive Learning Roadmaps ── */}
      {activeSubTab === "roadmaps" && <InteractiveRoadmaps />}

      {/* ── Sub-Tab 2: Curated Resources with 1-Click Bookmark ── */}
      {activeSubTab === "curated" && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tutorials, roadmaps, tools, platforms (e.g. Next.js, DSA, Hackathons)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#0c0d14] border border-black/[0.08] dark:border-white/[0.08] text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {/* Grouped Lists */}
          <div className="space-y-6">
            {categories.map((category) => {
              const items = filteredCurated.filter((i) => i.category === category);
              return (
                <div
                  key={category}
                  className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] overflow-hidden shadow-sm"
                >
                  <div className="flex items-center gap-2 p-4 sm:p-5 border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.01]">
                    <h3 className="font-bold text-foreground dark:text-white text-sm">{category}</h3>
                    <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.05]">
                      {items.length} resources
                    </span>
                  </div>

                  <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                    {items.map((item) => {
                      const bookmarked = isBookmarked(item.id);

                      return (
                        <div
                          key={item.id}
                          className="group flex items-center justify-between gap-4 p-4 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                        >
                          {/* Bookmark Action Button */}
                          <button
                            onClick={() => toggleBookmark(item)}
                            title={bookmarked ? "Remove from My Saved" : "Save to My Saved Resources"}
                            className={`p-2 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
                              bookmarked
                                ? "bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30"
                                : "text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                            }`}
                          >
                            {bookmarked ? (
                              <BookmarkCheck className="w-4 h-4 fill-amber-500/20" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <a
                                href={item.url}
                                target={item.url.startsWith("/") ? undefined : "_blank"}
                                rel={item.url.startsWith("/") ? undefined : "noopener noreferrer"}
                                className="font-semibold text-xs sm:text-sm text-foreground dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
                              >
                                <span>{item.name}</span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.05] text-muted-foreground">
                                {item.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>

                          {/* Direct External Link Button */}
                          <a
                            href={item.url}
                            target={item.url.startsWith("/") ? undefined : "_blank"}
                            rel={item.url.startsWith("/") ? undefined : "noopener noreferrer"}
                            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:bg-indigo-500/10 transition-colors flex-shrink-0"
                          >
                            <span>Open</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Sub-Tab 3: My Saved Resources & Personal Notes ── */}
      {activeSubTab === "saved" && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Bookmark className="w-4 h-4 fill-amber-500/20" />
              </div>
              <div>
                <h3 className="font-bold text-foreground dark:text-white text-sm">
                  My Saved Resources &amp; Personal Notes
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {savedResources.length} items saved • Add annotations, hackathon reminders &amp; personal takeaways.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddCustomModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Bookmark</span>
            </button>
          </div>

          {/* Saved Items List */}
          {savedResources.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-black/[0.12] dark:border-white/[0.12] p-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-foreground dark:text-white">
                No saved resources yet
              </h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Click the bookmark icon on any curated resource, or use &quot;Add Custom Bookmark&quot; to save personal links and notes.
              </p>
              <button
                onClick={() => setActiveSubTab("curated")}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-foreground dark:text-white transition-colors cursor-pointer"
              >
                Browse Curated Resources
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedResources.map((item) => {
                const isEditing = editingNoteId === item.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-5 flex flex-col justify-between shadow-sm hover:border-indigo-500/30 transition-all duration-200"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          {item.category && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                              {item.category}
                            </span>
                          )}
                          <h4 className="font-bold text-sm text-foreground dark:text-white truncate">
                            {item.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <a
                            href={item.url}
                            target={item.url.startsWith("/") ? undefined : "_blank"}
                            rel={item.url.startsWith("/") ? undefined : "noopener noreferrer"}
                            title="Open Link"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-500 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteSaved(item.id)}
                            title="Remove bookmark"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {item.desc && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">
                          {item.desc}
                        </p>
                      )}

                      {/* Personal Note Box */}
                      <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] p-3 mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                            <FileText className="w-3 h-3" />
                            <span>Personal Note</span>
                          </div>
                          {!isEditing && (
                            <button
                              onClick={() => handleStartEditNote(item)}
                              className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-2.5 h-2.5" />
                              <span>{item.note ? "Edit" : "Add Note"}</span>
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-2 mt-1">
                            <textarea
                              rows={3}
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              placeholder="Write your personal notes, key algorithms, or reminders..."
                              className="w-full text-xs p-2 rounded-lg bg-white dark:bg-[#181926] border border-black/[0.1] dark:border-white/[0.1] text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
                            />
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingNoteId(null)}
                                className="px-2.5 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveNote(item.id)}
                                className="px-3 py-1 rounded-md text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-foreground dark:text-white/90 italic leading-relaxed">
                            {item.note ? (
                              `"${item.note}"`
                            ) : (
                              <span className="text-muted-foreground/60 not-italic">
                                No custom notes added yet. Click &apos;Add Note&apos; to write reminders.
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-muted-foreground flex items-center justify-between pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
                      <span>Saved on {item.savedAt}</span>
                      <a
                        href={item.url}
                        target={item.url.startsWith("/") ? undefined : "_blank"}
                        rel={item.url.startsWith("/") ? undefined : "noopener noreferrer"}
                        className="text-indigo-500 hover:underline flex items-center gap-0.5"
                      >
                        Visit Link <ArrowUpRight className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Add Custom Bookmark Modal ── */}
      <AnimatePresence>
        {showAddCustomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-md rounded-2xl border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-[#0c0d14] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                <h3 className="text-base font-bold text-foreground dark:text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-indigo-500" />
                  Add Custom Resource Link
                </h3>
                <button
                  onClick={() => setShowAddCustomModal(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCustom} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-white mb-1">
                    Resource Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js Auth Tutorial or Kaggle Dataset"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-white mb-1">
                    URL Link *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://example.com/guide"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-white mb-1">
                    Personal Note / Takeaway (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Review before frontend interview; contains key optimization snippets."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
                  >
                    Save Resource
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
