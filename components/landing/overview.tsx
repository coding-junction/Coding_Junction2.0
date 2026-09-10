"use client";

import React from "react";
import { Users, ShieldCheck, GraduationCap, Trophy, Calendar, Code2 } from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { motion } from "motion/react";

const stats = [
  {
    icon: Users,
    title: "Total Members",
    value: 500,
    suffix: "+",
    description: "Active community members",
    gradient: "from-blue-500 to-cyan-400",
    glowColor: "rgba(59, 130, 246, 0.15)",
    featured: true,
  },
  {
    icon: ShieldCheck,
    title: "Core Members",
    value: 21,
    suffix: "+",
    description: "Leadership & key contributors",
    gradient: "from-emerald-500 to-teal-400",
    glowColor: "rgba(16, 185, 129, 0.15)",
    featured: false,
  },
  {
    icon: GraduationCap,
    title: "Alumni",
    value: 5,
    suffix: "+",
    description: "Previous contributors",
    gradient: "from-violet-500 to-purple-400",
    glowColor: "rgba(139, 92, 246, 0.15)",
    featured: false,
  },
  {
    icon: Trophy,
    title: "Hackathons",
    value: 10,
    suffix: "+",
    description: "Events organized",
    gradient: "from-amber-500 to-orange-400",
    glowColor: "rgba(245, 158, 11, 0.15)",
    featured: true,
  },
  {
    icon: Calendar,
    title: "Workshops",
    value: 25,
    suffix: "+",
    description: "Sessions conducted",
    gradient: "from-rose-500 to-pink-400",
    glowColor: "rgba(244, 63, 94, 0.15)",
    featured: false,
  },
  {
    icon: Code2,
    title: "Projects",
    value: 15,
    suffix: "+",
    description: "Built by members",
    gradient: "from-indigo-500 to-blue-400",
    glowColor: "rgba(99, 102, 241, 0.15)",
    featured: false,
  },
];

const Overview = () => {
  return (
    <section className="w-full max-w-full px-4 md:px-8 lg:px-16 xl:px-20 py-16 md:py-24 overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        className="text-center mb-12 md:mb-16"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-400 mb-3 font-medium">
          Our Community
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white">
          Community{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
            Overview
          </span>
        </h2>
        <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          A snapshot of our growing community of builders, learners, and innovators.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 max-w-5xl mx-auto">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isFeatured = stat.featured;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className={`group glass-card ${
                isFeatured ? "sm:col-span-2" : ""
              }`}
            >
              <div className={`glass-card-inner h-full ${
                isFeatured ? "p-8 md:p-10" : "p-6 md:p-8"
              }`}>
                {/* Hover glow orb */}
                <div
                  className="absolute -top-16 -right-16 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
                  style={{ background: stat.glowColor }}
                />

                {/* Featured layout: horizontal on sm+ | All: vertical center on mobile */}
                <div className={`relative flex ${
                  isFeatured
                    ? "flex-col items-center justify-center gap-3 text-center sm:flex-row sm:items-center sm:text-left sm:gap-6"
                    : "flex-col items-center justify-center gap-3 text-center"
                }`}>
                  {/* Icon */}
                  <div
                    className={`rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                      isFeatured ? "w-14 h-14 flex-shrink-0" : "w-12 h-12"
                    }`}
                  >
                    <Icon className={`text-white ${isFeatured ? "h-7 w-7" : "h-6 w-6"}`} />
                  </div>

                  {/* Content */}
                  <div className={isFeatured ? "" : ""}>
                    {/* Number */}
                    <div className={`font-bold text-foreground dark:text-white ${
                      isFeatured ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
                    }`}>
                      <NumberTicker
                        value={stat.value}
                        className={`font-bold tracking-tight text-foreground dark:text-white ${
                          isFeatured ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
                        }`}
                      />
                      <span className="text-muted-foreground">{stat.suffix}</span>
                    </div>

                    {/* Label */}
                    <p className={`font-semibold text-foreground dark:text-white ${
                      isFeatured ? "text-base mt-1" : "text-sm mt-1"
                    }`}>
                      {stat.title}
                    </p>
                    <p className={`text-muted-foreground mt-0.5 ${
                      isFeatured ? "text-sm" : "text-xs hidden sm:block"
                    }`}>
                      {stat.description}
                    </p>
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

export default Overview;