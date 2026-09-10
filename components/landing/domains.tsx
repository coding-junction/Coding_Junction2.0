"use client";

import { motion } from "motion/react";
import {
  Globe,
  Sparkles,
  Smartphone,
  Code2,
  BrainCircuit,
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

const domains = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Crafting modern, responsive websites and web applications using cutting-edge frameworks, design systems, and performance-first architecture.",
    gradient: "from-blue-500 to-cyan-400",
    glowColor: "rgba(59, 130, 246, 0.35)",
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Building native and cross-platform mobile applications that deliver seamless user experiences on Android and iOS devices.",
    gradient: "from-emerald-500 to-teal-400",
    glowColor: "rgba(16, 185, 129, 0.35)",
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
  },
  {
    icon: Code2,
    title: "C / C++",
    description:
      "Mastering systems programming, memory management, and high-performance computing with the foundational languages of computer science.",
    gradient: "from-orange-500 to-amber-400",
    glowColor: "rgba(249, 115, 22, 0.35)",
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
  },
  {
    icon: BrainCircuit,
    title: "AI / ML",
    description:
      "Exploring neural networks, deep learning, and intelligent systems that push the boundaries of what machines can learn and create.",
    gradient: "from-violet-500 to-purple-400",
    glowColor: "rgba(139, 92, 246, 0.35)",
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
  },
  {
    icon: Sparkles,
    title: "DSA",
    description:
      "Sharpening problem-solving skills through data structures and algorithms — the backbone of competitive programming and technical interviews.",
    gradient: "from-rose-500 to-pink-400",
    glowColor: "rgba(244, 63, 94, 0.35)",
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]",
  },
];

const Domains = () => {
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
          What We Do
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white">
          Our{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">
            Domains
          </span>
        </h2>
        <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          We explore and build across multiple disciplines of technology,
          empowering members to grow in their area of passion.
        </p>
      </motion.div>

      {/* Grid */}
      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-5 xl:max-h-[36rem] xl:grid-rows-2">
        {domains.map((domain, index) => (
          <GridItem key={domain.title} index={index} {...domain} />
        ))}
      </ul>
    </section>
  );
};

interface GridItemProps {
  area: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  glowColor: string;
  index: number;
}

const GridItem = ({
  area,
  icon: Icon,
  title,
  description,
  gradient,
  glowColor,
  index,
}: GridItemProps) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={cn("min-h-[14rem] list-none", area)}
    >
      <div className="group relative h-full rounded-2xl border border-black/[0.08] dark:border-white/[0.08] p-[1px] bg-gradient-to-b from-black/[0.03] dark:from-white/[0.05] to-transparent transition-all duration-500">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div
          className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-2xl p-6 md:p-8 bg-white dark:bg-[#0a0a0f] transition-all duration-500 shadow-sm dark:shadow-none"
        >
          {/* Subtle gradient orb in background */}
          <div
            className="absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
            style={{ background: glowColor }}
          />

          <div className="relative flex flex-1 flex-col justify-between gap-4">
            {/* Icon */}
            <div
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
                gradient
              )}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white transition-colors">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
};

export default Domains;