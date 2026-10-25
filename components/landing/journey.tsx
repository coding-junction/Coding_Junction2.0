"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Rocket, Users, Trophy, Calendar, Code2, Star,
  GraduationCap, Globe, Zap, Award
} from "lucide-react";

const milestones = [
  {
    year: "2022",
    title: "The Beginning",
    description:
      "Coding Junction was founded by a small group of passionate students at UIT Burdwan with a vision to create a thriving tech community.",
    icon: Rocket,
    gradient: "from-rose-500 to-pink-400",
    glowColor: "rgba(244, 63, 94, 0.15)",
    stats: "5 Founding Members",
  },
  {
    year: "2023",
    title: "First Hackathon",
    description:
      "Organized our inaugural hackathon with 100+ participants, marking the beginning of a tradition of innovative events and competitions.",
    icon: Code2,
    gradient: "from-indigo-500 to-blue-400",
    glowColor: "rgba(99, 102, 241, 0.15)",
    stats: "100+ Participants",
  },
  {
    year: "2023",
    title: "Community Growth",
    description:
      "Membership soared past 200, with dedicated domain leads for Web Dev, App Dev, AI/ML, DSA, and C/C++ driving knowledge-sharing sessions.",
    icon: Users,
    gradient: "from-emerald-500 to-teal-400",
    glowColor: "rgba(16, 185, 129, 0.15)",
    stats: "200+ Members",
  },
  {
    year: "2024",
    title: "Workshop Series",
    description:
      "Launched a structured workshop series covering modern frameworks, cloud computing, competitive programming, and interview preparation.",
    icon: GraduationCap,
    gradient: "from-violet-500 to-purple-400",
    glowColor: "rgba(139, 92, 246, 0.15)",
    stats: "25+ Workshops",
  },
  {
    year: "2024",
    title: "Digital Transformation",
    description:
      "Launched the Coding Junction 2.0 website with a member dashboard, digital event passes, certificate generation, and college verification system.",
    icon: Globe,
    gradient: "from-cyan-500 to-blue-400",
    glowColor: "rgba(6, 182, 212, 0.15)",
    stats: "Complete Platform",
  },
  {
    year: "2024",
    title: "Community Partnerships",
    description:
      "Partnered with tech communities across multiple colleges, expanding our reach and enabling inter-college collaborations and joint events.",
    icon: Zap,
    gradient: "from-amber-500 to-orange-400",
    glowColor: "rgba(245, 158, 11, 0.15)",
    stats: "Multi-College Network",
  },
  {
    year: "2025",
    title: "500+ Strong",
    description:
      "Crossed 500 community members, with active participation in hackathons, open-source contributions, and an expanding alumni network.",
    icon: Star,
    gradient: "from-yellow-500 to-amber-400",
    glowColor: "rgba(234, 179, 8, 0.15)",
    stats: "500+ Members",
  },
  {
    year: "2025",
    title: "The Future",
    description:
      "Continuing to innovate with a mobile app, AI-powered learning tools, national hackathon participation, and industry mentorship programs.",
    icon: Award,
    gradient: "from-indigo-500 to-violet-500",
    glowColor: "rgba(99, 102, 241, 0.2)",
    stats: "And Growing...",
  },
];

const Journey = () => {
  return (
    <section className="w-full max-w-full px-4 md:px-8 lg:px-16 xl:px-20 py-16 md:py-24 overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/5 to-violet-500/5 dark:from-indigo-500/10 dark:to-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        className="text-center mb-12 md:mb-16 relative z-10"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-400 mb-3 font-medium">
          Our Story
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white">
          The{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
            Journey
          </span>
        </h2>
        <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          From a small idea to a thriving community — follow our path of
          building, learning, and innovating together.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Center line */}
        <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent md:-translate-x-px" />

        {milestones.map((milestone, index) => {
          const Icon = milestone.icon;
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className={`relative flex items-start gap-6 mb-8 md:mb-12 ${
                isLeft
                  ? "md:flex-row md:pr-[calc(50%+2rem)]"
                  : "md:flex-row-reverse md:pl-[calc(50%+2rem)]"
              } pl-14 md:pl-0`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-3.5 md:left-1/2 md:-translate-x-1/2 top-2 w-3 h-3 rounded-full bg-gradient-to-br ${milestone.gradient} shadow-lg ring-4 ring-background z-10`}
              />

              {/* Card */}
              <div className="glass-card group flex-1">
                <div className="glass-card-inner p-5 md:p-6 relative">
                  {/* Hover glow */}
                  <div
                    className="absolute -top-16 -right-16 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
                    style={{ background: milestone.glowColor }}
                  />

                  <div className="relative">
                    {/* Year badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono">
                        {milestone.year}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {milestone.stats}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${milestone.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-foreground dark:text-white mb-1">
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Journey;
