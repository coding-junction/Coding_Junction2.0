"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Award,
  Sparkles,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Clock,
  Lock,
  Flame,
  Check,
} from "lucide-react";

interface CertificatesTabProps {
  user: any;
  onBrowseEvents: () => void;
}

export const CertificatesTab = React.memo(function CertificatesTab({ user, onBrowseEvents }: CertificatesTabProps) {
  const [isNotified, setIsNotified] = useState(false);

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "there";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-6"
    >
      {/* ─── Standardized Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-white tracking-tight flex items-center gap-2.5">
            <span>Certificates & Credentials</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30">
              Coming Soon
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Official verified certifications for events, hackathons, and competitions organized by Coding Junction.
          </p>
        </div>
      </div>

      {/* ─── Coming Soon Showcase Card ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 dark:border-amber-500/30 bg-gradient-to-b from-amber-500/[0.07] via-indigo-500/[0.03] to-transparent p-8 md:p-12 text-center">
        {/* Ambient Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-xl transform-gpu pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-xl transform-gpu pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Feature In Development</span>
          </div>

          {/* Glowing Award Emblem */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-[1px] shadow-2xl shadow-amber-500/25">
              <div className="w-full h-full rounded-2xl bg-black/85 dark:bg-black/95 backdrop-blur-xl flex items-center justify-center text-amber-400">
                <Award className="w-10 h-10" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-black flex items-center justify-center text-xs font-bold shadow-md">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Heading */}
          <h3 className="text-2xl md:text-3xl font-extrabold text-foreground dark:text-white tracking-tight mb-3">
            Automated Event Certification
          </h3>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8">
            Hey <span className="text-foreground dark:text-white font-medium">{firstName}</span>, we are building an automated certificate issuance system. Whenever you register for and participate in Coding Junction events (such as <span className="text-foreground dark:text-white font-medium">Brain Battle</span> and <span className="text-foreground dark:text-white font-medium">CodeClash</span>), your official verified certificate will automatically unlock right here.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsNotified(true)}
              disabled={isNotified}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-200 cursor-pointer ${
                isNotified
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/20"
              }`}
            >
              {isNotified ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>You will be notified!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Notify Me on Launch</span>
                </>
              )}
            </button>

            <button
              onClick={onBrowseEvents}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-foreground dark:text-white border border-black/10 dark:border-white/10 font-semibold text-xs md:text-sm transition-all duration-200 cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              <span>Explore Upcoming Events</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Standardized Status Bar ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14]">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Development Status</p>
            <p className="text-xs font-semibold text-foreground dark:text-white">Active Development</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14]">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Target Release</p>
            <p className="text-xs font-semibold text-foreground dark:text-white">Next Coding Contest</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14]">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Verification Engine</p>
            <p className="text-xs font-semibold text-foreground dark:text-white">Tamper-Proof ID Hash</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
