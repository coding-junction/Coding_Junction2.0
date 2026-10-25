"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Code2, Plus, Github, ExternalLink, Trash2,
  Sparkles, Check, Globe, Layers, AlertCircle, Eye
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  github?: string;
  liveUrl?: string;
  image?: string;
  author: string;
  authorCollege?: string;
  authorAvatar?: string;
  userId?: string;
  stars?: number;
  featured?: boolean;
  createdAt?: string;
}

const CATEGORIES = [
  "Web Development",
  "App Development",
  "AI / ML",
  "IoT & Hardware",
  "Cloud & DevOps",
  "Open Source",
  "Cybersecurity",
];

const PRESET_IMAGES = [
  { label: "Modern Web", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80" },
  { label: "Mobile Tech", url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80" },
  { label: "AI & Data", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80" },
  { label: "Abstract Code", url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80" },
];

export function ShowcaseTab() {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [techStackInput, setTechStackInput] = useState("");
  const [github, setGithub] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [image, setImage] = useState(PRESET_IMAGES[0].url);

  const fetchUserProjects = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/projects?userId=${user.id}`);
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to load user projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProjects();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg("Please fill in project title and description.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      const tags = techStackInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          techStack: tags.length > 0 ? tags : ["Tech"],
          github: github.trim(),
          liveUrl: liveUrl.trim(),
          image: image.trim(),
          authorCollege: "UIT Burdwan",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit project.");
      }

      setSuccessMsg("Project published! It is now live on the main website & showcase.");
      // Reset form
      setTitle("");
      setDescription("");
      setTechStackInput("");
      setGithub("");
      setLiveUrl("");
      setShowModal(false);

      // Refresh list
      fetchUserProjects();
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this project from showcase?")) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─ Showcase Banner ─ */}
      <div className="relative rounded-2xl overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.08] via-purple-500/[0.04] to-transparent p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Community Creator Hub
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground dark:text-white">
              Showcase Your Projects to the World 🚀
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Have you built a hackathon project, semester build, or open source repo? Submit it here and get featured on the official <strong>Coding Junction Projects Wall</strong> and the <strong>Landing Page</strong>!
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/Projects"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#12131f] text-sm font-semibold hover:border-indigo-500/40 transition-colors"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
              View Public Wall
            </Link>
            <button
              onClick={() => {
                setErrorMsg("");
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Showcase New Project
            </button>
          </div>
        </div>
      </div>

      {/* ─ Success Alert ─ */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium"
          >
            <Check className="w-4 h-4 flex-shrink-0" />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─ User's Projects List ─ */}
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-indigo-500" />
            <h3 className="font-semibold text-foreground dark:text-white text-sm">
              My Submitted Projects ({projects.length})
            </h3>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Loading your projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                <Code2 className="h-6 w-6 text-indigo-500" />
              </div>
              <p className="text-sm font-semibold text-foreground dark:text-white mb-1">
                You haven&apos;t showcased any projects yet
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-5">
                Share what you&apos;ve built with fellow developers and get recognized across the university community!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Submit Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="group rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.02] overflow-hidden flex flex-col justify-between hover:border-indigo-500/30 transition-all"
                >
                  <div className="relative h-36 w-full bg-black/10 dark:bg-white/5">
                    {proj.image ? (
                      <Image
                        src={proj.image}
                        alt={proj.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Code2 className="w-8 h-8 opacity-40" />
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/70 backdrop-blur-md text-white">
                      {proj.category}
                    </span>
                    <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Live on Site
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground dark:text-white text-sm line-clamp-1 mb-1">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {proj.techStack?.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.04] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {proj.techStack && proj.techStack.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{proj.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-black/[0.06] dark:border-white/[0.06] text-xs">
                      <div className="flex items-center gap-2">
                        {proj.github && (
                          <a
                            href={proj.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                            title="GitHub"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-indigo-500 transition-colors p-1"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="text-muted-foreground/60 hover:text-rose-500 transition-colors p-1"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─ Submit Project Modal ─ */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#10111a] p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
                <div>
                  <h3 className="text-lg font-bold text-foreground dark:text-white">
                    Showcase a Project 🌟
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your project will be visible on the public Projects Wall and Landing Page.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.05] text-muted-foreground"
                >
                  ✕
                </button>
              </div>

              {errorMsg && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-white mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Campus Connect / AI Resume Builder"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-white mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-sm text-foreground dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="dark:bg-[#10111a]">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-white mb-1.5">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly describe what your project does, problem it solves, and core highlights..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-white mb-1.5">
                    Tech Stack (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js, TypeScript, Tailwind, Supabase"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground dark:text-white mb-1.5">
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground dark:text-white mb-1.5">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourproject.vercel.app"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground dark:text-white mb-1.5">
                    Project Cover Image
                  </label>
                  <input
                    type="url"
                    placeholder="Image URL or choose preset below"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500 mb-2"
                  />
                  <div className="flex flex-wrap gap-2">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => setImage(preset.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          image === preset.url
                            ? "border-indigo-500 bg-indigo-500/10 text-indigo-500 font-semibold"
                            : "border-black/[0.06] dark:border-white/[0.06] text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Publishing..." : "Publish Project 🚀"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
