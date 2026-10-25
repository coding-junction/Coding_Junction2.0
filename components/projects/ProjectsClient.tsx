"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Github, ExternalLink, Star, Code2, Globe, Smartphone,
  BrainCircuit, Sparkles, Search, Users, Layers, Plus,
  ShieldCheck, ArrowRight
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  image?: string;
  github?: string;
  liveUrl?: string;
  author: string;
  authorCollege?: string;
  authorAvatar?: string;
  stars?: number;
  featured?: boolean;
}

const categories = ["All", "Web Development", "App Development", "AI / ML", "DSA", "IoT & Hardware", "Open Source"];

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "All": Layers,
  "Web Development": Globe,
  "App Development": Smartphone,
  "AI / ML": BrainCircuit,
  "DSA": Code2,
  "IoT & Hardware": Sparkles,
  "Open Source": Github,
};

const ProjectsClient = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        if (d?.projects) {
          setProjects(d.projects);
        }
      })
      .catch((err) => console.warn("Could not fetch live projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen">
      {/* Hero */}
      <section className="relative w-full px-4 md:px-8 lg:px-16 xl:px-20 pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-violet-500/8 dark:from-violet-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Code2 className="w-3.5 h-3.5" />
            Community Project Showcase
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground dark:text-white tracking-tight mb-4">
            Built by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400">
              Community Members
            </span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-6">
            Explore applications, machine learning models, and open source projects built by UIT Burdwan students & Coding Junction developers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link
              href="/Dashboard?tab=projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Showcase Your Project
            </Link>
            <a
              href="https://github.com/Coding-Junction"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] text-xs font-semibold text-foreground dark:text-white hover:border-violet-500/40 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub Organization
            </a>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, technologies, or authors..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-[#0c0d14] border border-black/[0.08] dark:border-white/[0.08] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all"
            />
          </div>
        </motion.div>
      </section>

      {/* Category Filters */}
      <section className="px-4 md:px-8 lg:px-16 xl:px-20 pb-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-4xl mx-auto justify-center flex-wrap">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || Code2;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat
                    ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                    : "bg-black/[0.04] dark:bg-white/[0.04] text-muted-foreground hover:text-foreground hover:bg-black/[0.08] dark:hover:bg-white/[0.08]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 md:px-8 lg:px-16 xl:px-20 pb-24">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="py-24 text-center text-sm text-muted-foreground">
              Loading community projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="h-7 w-7 text-violet-400" />
              </div>
              <p className="text-foreground dark:text-white font-semibold text-lg mb-2">
                {projects.length === 0 ? "No projects showcased yet" : "No matching projects"}
              </p>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                {projects.length === 0
                  ? "Be the first member to showcase a project on Coding Junction! Submit your build from your dashboard."
                  : "Try adjusting your search query or domain category filter."}
              </p>
              <Link
                href="/Dashboard?tab=projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25"
              >
                <Plus className="w-3.5 h-3.5" />
                Showcase Your Project
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="glass-card group h-full">
                      <div className="glass-card-inner p-0 h-full flex flex-col justify-between">
                        <div>
                          {/* Project Image */}
                          <div className="w-full h-44 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 dark:from-violet-500/20 dark:via-purple-500/10 dark:to-pink-500/20 rounded-t-2xl relative overflow-hidden">
                            {project.image ? (
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                unoptimized
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Code2 className="w-10 h-10 opacity-30" />
                              </div>
                            )}

                            {/* Badges Overlay */}
                            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white">
                                {project.category}
                              </span>
                              {project.featured && (
                                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/90 text-white flex items-center gap-1 shadow-sm">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            {/* Title */}
                            <h3 className="text-base md:text-lg font-bold text-foreground dark:text-white mb-2 group-hover:text-violet-500 transition-colors line-clamp-1">
                              {project.title}
                            </h3>

                            {/* Description */}
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                              {project.description}
                            </p>

                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {project.techStack.slice(0, 4).map((tech) => (
                                <span
                                  key={tech}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.06] text-muted-foreground"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.techStack.length > 4 && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.06] text-muted-foreground">
                                  +{project.techStack.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 pb-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            {project.authorAvatar ? (
                              <Image
                                src={project.authorAvatar}
                                alt={project.author}
                                width={20}
                                height={20}
                                unoptimized
                                className="rounded-full bg-black/10 flex-shrink-0"
                              />
                            ) : (
                              <Users className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-foreground dark:text-white truncate">
                                {project.author}
                              </p>
                              {project.authorCollege && (
                                <p className="text-[9px] text-muted-foreground truncate">
                                  {project.authorCollege}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all"
                                aria-label="GitHub"
                              >
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-violet-500 hover:bg-violet-500/10 transition-all"
                                aria-label="Live Demo"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectsClient;
