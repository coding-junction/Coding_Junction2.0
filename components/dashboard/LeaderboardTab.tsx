"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  Zap,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Star,
  Code2,
  GitPullRequest,
  Users,
  GraduationCap,
  Bell,
  Check,
  Calendar,
} from "lucide-react";
import { VerifiedCollegeData } from "./CollegeVerificationModal";

interface LeaderboardTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  verificationData?: VerifiedCollegeData | null;
  totalEvents?: number;
}

export const LeaderboardTab = React.memo(function LeaderboardTab({
  user,
}: LeaderboardTabProps) {
  const [isNotified, setIsNotified] = useState(false);

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "Member";

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
            <span className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Gamification & Community Leaderboard
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30">
              Coming Soon
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Earn activity XP, unlock achievement badges, and climb the club leaderboard.
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

          {/* Glowing Trophy Emblem */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-[1px] shadow-2xl shadow-amber-500/25">
              <div className="w-full h-full rounded-2xl bg-black/85 dark:bg-black/95 backdrop-blur-xl flex items-center justify-center text-amber-400">
                <Trophy className="w-10 h-10" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-black flex items-center justify-center text-xs font-bold shadow-md">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Heading */}
          <h3 className="text-2xl md:text-3xl font-extrabold text-foreground dark:text-white tracking-tight mb-3">
            Gamification & Leaderboard System
          </h3>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8">
            Hey <span className="text-foreground dark:text-white font-medium">{firstName}</span>, we are preparing an interactive club rewards engine for all Coding Junction members. Soon you&apos;ll be able to earn XP, unlock verified achievement badges, and climb the community leaderboard.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsNotified(true)}
              disabled={isNotified}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-200 cursor-pointer ${
                isNotified
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default"
                  : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20"
              }`}
            >
              {isNotified ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>You will be notified for Season 1!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Notify Me When Season 1 Launches</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── 3 Feature Highlights (What to Expect) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Feature 1: Achievement Badges */}
        <div className="p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground dark:text-white">
              Achievement Badges
            </h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Earn exclusive badges for milestone accomplishments:
            </p>
          </div>
          <ul className="space-y-1.5 mt-auto pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
            {[
              "First Event Attended",
              "Hackathon Participant",
              "Verified Student",
              "Open Source Contributor",
              "Workshop Speaker",
            ].map((badge) => (
              <li key={badge} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span className="truncate">{badge}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Feature 2: Activity XP System */}
        <div className="p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground dark:text-white">
              Activity XP System
            </h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Award points and rank progress for authentic engagement:
            </p>
          </div>
          <ul className="space-y-1.5 mt-auto pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
            {[
              "Attending workshops & tech sessions",
              "Submitting hackathon & club projects",
              "Contributing to club repositories",
              "Speaking or mentoring junior peers",
              "Verifying college identification",
            ].map((activity) => (
              <li key={activity} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">{activity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Feature 3: Monthly Leaderboard */}
        <div className="p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground dark:text-white">
              Monthly Leaderboard
            </h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Friendly club rankings to foster healthy peer motivation:
            </p>
          </div>
          <ul className="space-y-1.5 mt-auto pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
            {[
              "Top 3 podium recognition & rewards",
              "Active learners & attendees ranking",
              "Monthly resets with historical records",
              "Domain-specific leaderboard filters",
              "Personal progress & tier tracking",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
});
