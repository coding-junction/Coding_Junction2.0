"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Code2, ExternalLink, Github, ArrowRight, Sparkles,
  Users, Plus, Layers
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
  featured?: boolean;
}

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        if (d?.projects) {
          // Take top 3 projects for the landing page
          setProjects(d.projects.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative w-full px-4 md:px-8 lg:px-16 xl:px-20 py-20 md:py-28 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Community Creations
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground dark:text-white tracking-tight">
              Featured{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Projects
              </span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-xl">
              Real projects built by UIT Burdwan students & Coding Junction members. Built in hackathons, workshops, and open-source sprints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/Dashboard?tab=projects"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Showcase Your Project
            </Link>
            <Link
              href="/Projects"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white/70 dark:bg-[#0c0d14]/70 backdrop-blur-md text-xs font-semibold text-foreground dark:text-white hover:border-indigo-500/40 transition-colors"
            >
              View All Projects
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Projects Grid or Empty State */}
        {loading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Loading showcase...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-transparent p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
              <Code2 className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">
              Be the First to Showcase a Project! 🚀
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
              Have you built something cool during a hackathon, college semester, or personal exploration? Submit your project from your dashboard to get featured right here!
            </p>
            <Link
              href="/Dashboard?tab=projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4" />
              Showcase Your Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-[#0c0d14]/80 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-44 w-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 overflow-hidden">
                    {proj.image ? (
                      <Image
                        src={proj.image}
                        alt={proj.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Code2 className="w-10 h-10 opacity-30" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white">
                      {proj.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-base text-foreground dark:text-white group-hover:text-indigo-500 transition-colors line-clamp-1 mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {proj.techStack?.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.04] text-muted-foreground"
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
                </div>

                {/* Footer */}
                <div className="px-5 pb-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                      {proj.author[0] || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-foreground dark:text-white truncate">
                        {proj.author}
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate">
                        {proj.authorCollege || "UIT Burdwan"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
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
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
