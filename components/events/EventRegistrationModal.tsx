"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "@clerk/nextjs";
import {
  CalendarDays, MapPin, ShieldCheck, CheckCircle2, Ticket,
  X, Sparkles, User, Mail, Phone, Building2, GraduationCap,
  Loader2, Download, ArrowRight, AlertCircle, Hash, Globe,
  Share2, School
} from "lucide-react";
import { registerForEvent, downloadEventPassPng } from "@/lib/eventPass";

export interface EventForModal {
  _id: string;
  title: string;
  date?: string;
  location?: string;
  description?: string;
  tag?: string;
  registerLink?: string;
  image?: { asset?: { url: string } };
  images?: { asset?: { _id?: string; url: string } }[];
}

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventForModal | null;
  onSuccess?: (ticketId: string) => void;
}

export function EventRegistrationModal({
  isOpen,
  onClose,
  event,
  onSuccess,
}: EventRegistrationModalProps) {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  // ─── Form Fields (All Required) ───
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("2nd Year");
  const [rollNumber, setRollNumber] = useState("");
  const [githubOrLinkedIn, setGithubOrLinkedIn] = useState("");
  const [referralSource, setReferralSource] = useState("Coding Junction WhatsApp Group");

  // ─── UI & Submission States ───
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedTicketId, setConfirmedTicketId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // College verification info from Clerk metadata
  const collegeMeta = user?.unsafeMetadata?.collegeVerification as {
    isVerified?: boolean;
    collegeName?: string;
    university?: string;
    aicteId?: string;
    studentName?: string;
  } | undefined;

  const isCollegeVerified = Boolean(collegeMeta?.isVerified);

  // ─── Reset modal state ONLY when modal opens or event changes ───
  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setConfirmedTicketId(null);
    }
  }, [isOpen, event?._id]);

  // ─── 1. Pre-fill from Clerk Metadata & User Session ───
  useEffect(() => {
    if (!user || !isOpen || confirmedTicketId) return;

    // Name
    const nameFromUser = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
    setFullName((prev) => prev || nameFromUser || collegeMeta?.studentName || "");

    // Email
    const emailFromUser = user.primaryEmailAddress?.emailAddress || "";
    setEmail((prev) => prev || emailFromUser);

    // Phone
    const phoneFromUser =
      user.phoneNumbers?.[0]?.phoneNumber ||
      (user.unsafeMetadata?.phone as string) ||
      (user.unsafeMetadata?.profile as any)?.phone ||
      "";
    if (phoneFromUser) setPhone((prev) => prev || phoneFromUser);

    // College & University
    const collegeFromMeta =
      collegeMeta?.collegeName ||
      (user.unsafeMetadata?.collegeName as string) ||
      (user.unsafeMetadata?.profile as any)?.collegeName ||
      "";
    if (collegeFromMeta) setCollegeName((prev) => prev || collegeFromMeta);

    const universityFromMeta =
      collegeMeta?.university ||
      (user.unsafeMetadata?.university as string) ||
      (user.unsafeMetadata?.profile as any)?.university ||
      "";
    if (universityFromMeta) setUniversity((prev) => prev || universityFromMeta);

    // Department, Year, Roll, Social
    const profileMeta = (user.unsafeMetadata?.profile as any) || {};
    if (profileMeta.department) setDepartment((prev) => prev || profileMeta.department);
    if (profileMeta.yearOfStudy) setYearOfStudy((prev) => prev || profileMeta.yearOfStudy);
    if (profileMeta.rollNumber) setRollNumber((prev) => prev || profileMeta.rollNumber);
    if (profileMeta.githubOrLinkedIn) setGithubOrLinkedIn((prev) => prev || profileMeta.githubOrLinkedIn);
    if (profileMeta.referralSource) setReferralSource((prev) => prev || profileMeta.referralSource);
  }, [user, isOpen, collegeMeta, confirmedTicketId]);

  // ─── 2. In Parallel: Fetch & Pre-fill from Supabase Profile ───
  useEffect(() => {
    async function fetchSupabaseProfile() {
      if (!isOpen || !isSignedIn) return;
      setIsLoadingProfile(true);
      try {
        const res = await fetch("/api/user/app-data");
        if (res.ok) {
          const json = await res.json();
          const sp = json?.profile;
          if (sp) {
            setFullName((prev) => prev || sp.full_name?.trim() || "");
            setEmail((prev) => prev || sp.email?.trim() || "");
            setPhone((prev) => prev || sp.phone || "");
            setCollegeName((prev) => prev || sp.college_name?.trim() || "");
            setUniversity((prev) => prev || sp.university?.trim() || sp.department?.trim() || "");
            setDepartment((prev) => prev || sp.department?.trim() || "");
            if (sp.year_of_study) {
              setYearOfStudy(sp.year_of_study);
            } else if (sp.year) {
              const yrStr = sp.year === 1 ? "1st Year" : sp.year === 2 ? "2nd Year" : sp.year === 3 ? "3rd Year" : `${sp.year}th Year`;
              setYearOfStudy(yrStr);
            }
            const roll = sp.roll_no || sp.roll_number || "";
            if (roll) setRollNumber((prev) => prev || roll.trim());
            setGithubOrLinkedIn((prev) => prev || sp.github_url || sp.linkedin_url || "");
          }
        }
      } catch (err) {
        console.warn("Notice checking Supabase profile pre-fill:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    fetchSupabaseProfile();
  }, [isOpen, isSignedIn]);

  if (!isOpen || !event) return null;

  const eventImage = event.images?.[0]?.asset?.url || event.image?.asset?.url;

  // ─── 3. Strict Validation & Submission ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user) {
      setErrorMsg("Please sign in to complete your registration.");
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg("Full Name is required.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Email address is required.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("WhatsApp / Contact phone number is required.");
      return;
    }
    if (!collegeName.trim()) {
      setErrorMsg("College / Institution name is required.");
      return;
    }
    if (!department.trim()) {
      setErrorMsg("Department / Branch of study is required.");
      return;
    }
    if (!yearOfStudy.trim()) {
      setErrorMsg("Year of study is required.");
      return;
    }
    if (!rollNumber.trim()) {
      setErrorMsg("Roll Number / Student Registration ID is required for verification.");
      return;
    }
    if (!githubOrLinkedIn.trim()) {
      setErrorMsg("GitHub or LinkedIn profile link is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Send registration payload to API
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          collegeName: collegeName.trim(),
          university: university.trim(),
          department: department.trim(),
          yearOfStudy,
          rollNumber: rollNumber.trim(),
          githubOrLinkedIn: githubOrLinkedIn.trim(),
          referralSource,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register for the event.");
      }

      const generatedTicket = data.ticketId || `CJ-${event._id.slice(-4).toUpperCase()}`;

      // Immediately transition modal to the confirmed pass screen!
      setConfirmedTicketId(generatedTicket);
      if (onSuccess) {
        onSuccess(generatedTicket);
      }

      // 2. Persist pass state locally & in Clerk metadata
      try {
        await registerForEvent(event._id, user);
      } catch (regErr) {
        console.warn("Could not save to local passes storage:", regErr);
      }

      // 3. Cache all newly provided academic/profile details in Clerk user metadata
      // so all future event registrations will be 100% pre-filled with zero typing!
      if (typeof user.update === "function") {
        try {
          await user.update({
            unsafeMetadata: {
              ...(user.unsafeMetadata || {}),
              phone: phone.trim(),
              collegeName: collegeName.trim(),
              university: university.trim(),
              profile: {
                ...((user.unsafeMetadata?.profile as any) || {}),
                phone: phone.trim(),
                collegeName: collegeName.trim(),
                university: university.trim(),
                department: department.trim(),
                yearOfStudy,
                rollNumber: rollNumber.trim(),
                githubOrLinkedIn: githubOrLinkedIn.trim(),
                referralSource,
              },
            },
          });
        } catch (metaErr) {
          console.warn("Could not save preferences to user metadata:", metaErr);
        }
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTicket = async () => {
    if (!confirmedTicketId) return;
    setIsDownloading(true);
    try {
      await downloadEventPassPng({
        eventTitle: event.title,
        attendeeName: fullName || "Valued Attendee",
        date: event.date,
        location: event.location,
        ticketId: confirmedTicketId,
        isVerified: isCollegeVerified,
      });
    } catch (err) {
      console.error("Failed to download ticket:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-2xl bg-card dark:bg-[#0c0d14] border border-black/[0.1] dark:border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden my-auto z-10 max-h-[92vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Event Header Banner */}
          <div className="relative w-full h-32 sm:h-36 bg-gradient-to-tr from-indigo-950 via-slate-900 to-violet-950 flex-shrink-0 overflow-hidden flex items-end p-5">
            {eventImage && (
              <Image
                src={eventImage}
                alt={event.title}
                fill
                className="object-cover opacity-25"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="relative z-10 w-full pr-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 mb-1.5 backdrop-blur-md">
                <Ticket className="w-3 h-3" />
                Official Event Pass Registration
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-1">
                {event.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 font-mono">
                {event.date && (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3 text-indigo-400" />
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-400" />
                    <span className="truncate max-w-[220px]">{event.location}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
            {confirmedTicketId ? (
              /* ─── SUCCESS SCREEN ─── */
              <div className="text-center py-4 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 animate-bounce" />
                </div>

                <div>
                  <h4 className="text-xl font-bold text-foreground dark:text-white">
                    You're Officially Registered!
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
                    A confirmation email with your Ticket ID & Event Pass instructions has been sent to{" "}
                    <span className="font-semibold text-foreground dark:text-white">{email}</span>.
                  </p>
                </div>

                {/* Digital Ticket Preview Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <div>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Ticket ID</span>
                      <p className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">{confirmedTicketId}</p>
                    </div>
                    {isCollegeVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Student
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Attendee</span>
                      <p className="font-semibold text-foreground dark:text-white truncate">{fullName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Roll / ID</span>
                      <p className="font-semibold text-foreground dark:text-white truncate">{rollNumber}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Institution</span>
                      <p className="font-semibold text-foreground dark:text-white truncate">{collegeName || "Coding Junction Community"}</p>
                    </div>
                  </div>

                  {/* Barcode Visual */}
                  <div className="pt-2 flex items-center justify-between border-t border-black/[0.06] dark:border-white/[0.08]">
                    <div className="font-mono text-[9px] tracking-widest text-muted-foreground">
                      ||| | |||| | ||| |||| | ||
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Admission Confirmed
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadTicket}
                    disabled={isDownloading}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Download Digital Pass (PNG)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push("/Dashboard");
                    }}
                    className="py-2.5 px-4 rounded-xl border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold text-foreground dark:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View in Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* ─── PROFESSIONAL REGISTRATION FORM (ALL REQUIRED) ─── */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Auto-fill notification badge */}
                {/* <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <p className="text-xs text-indigo-700 dark:text-indigo-300">
                      <span className="font-semibold">Auto-prefilled from your profile:</span> Credentials verified via Clerk &amp; Supabase.
                    </p>
                  </div>
                  {isLoadingProfile && (
                    <Loader2 className="w-3 h-3 text-indigo-500 animate-spin flex-shrink-0" />
                  )}
                </div> */}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-500">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* ─── SECTION 1: PERSONAL IDENTITY ─── */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3 h-3 text-indigo-500" />
                    <span>Attendee Identity</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-foreground dark:text-slate-300 flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1">
                          <span>Full Name</span>
                          <span className="text-rose-500 font-bold">*</span>
                        </span>
                        <span className="text-[9px] text-muted-foreground font-mono">From Account</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your Full Legal Name"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] focus:border-indigo-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-foreground dark:text-slate-300 flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1">
                          <span>Official Email</span>
                          <span className="text-rose-500 font-bold">*</span>
                        </span>
                        <span className="text-[9px] text-emerald-500 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      </label>
                      <input
                        type="email"
                        required
                        readOnly
                        value={email}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] text-muted-foreground cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-foreground dark:text-slate-300 flex items-center gap-1 mb-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span>WhatsApp / Contact Number</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-mono font-semibold text-muted-foreground pointer-events-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={phone.replace(/^\+91\s*/, "")}
                        onChange={(e) => setPhone(`+91 ${e.target.value.replace(/[^0-9]/g, "").slice(0, 10)}`)}
                        placeholder="9876543210"
                        className="w-full pl-12 pr-3 py-2 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] focus:border-indigo-500 focus:outline-none transition-colors font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Used for event notifications, team coordination, and venue entry SMS.
                    </p>
                  </div>
                </div>

                {/* ─── SECTION 2: ACADEMIC & INSTITUTION CREDENTIALS ─── */}
                <div className="space-y-3 pt-2 border-t border-black/[0.05] dark:border-white/[0.05]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-indigo-500" />
                    <span>Academic &amp; Institution Credentials</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-foreground dark:text-slate-300 flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1">
                          <span>College / Institution</span>
                          <span className="text-rose-500 font-bold">*</span>
                        </span>
                        {isCollegeVerified && (
                          <span className="text-[9px] text-emerald-500 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" /> AICTE Verified
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        required
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="e.g. University Institute of Technology, BU"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] focus:border-indigo-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-foreground dark:text-slate-300 flex items-center gap-1 mb-1">
                        <School className="w-3 h-3 text-muted-foreground" />
                        <span>Affiliated University / Board</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="e.g. Burdwan University / MAKAUT"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] focus:border-indigo-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-foreground dark:text-slate-300 flex items-center gap-1 mb-1">
                        <GraduationCap className="w-3 h-3 text-muted-foreground" />
                        <span>Department / Branch</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Computer Science &amp; Engg (CSE)"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] focus:border-indigo-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-foreground dark:text-slate-300 flex items-center gap-1 mb-1">
                        <CalendarDays className="w-3 h-3 text-muted-foreground" />
                        <span>Year of Study</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        required
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] focus:border-indigo-500 focus:outline-none transition-colors text-foreground dark:text-white"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Alumni / Professional">Alumni / Professional</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-foreground dark:text-slate-300 flex items-center gap-1 mb-1">
                        <Hash className="w-3 h-3 text-muted-foreground" />
                        <span>Roll / Registration No.</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="e.g. 12022002011045"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] focus:border-indigo-500 focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* ─── SECTION 3: VERIFICATION & COMMUNITY ─── */}
                <div className="space-y-3 pt-2 border-t border-black/[0.05] dark:border-white/[0.05]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-indigo-500" />
                    <span>Professional Profile &amp; Verification</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-foreground dark:text-slate-300 flex items-center gap-1 mb-1">
                        <span>GitHub or LinkedIn Profile URL</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={githubOrLinkedIn}
                        onChange={(e) => setGithubOrLinkedIn(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] focus:border-indigo-500 focus:outline-none transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-foreground dark:text-slate-300 flex items-center gap-1 mb-1">
                        <Share2 className="w-3 h-3 text-muted-foreground" />
                        <span>How did you hear about this event?</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        required
                        value={referralSource}
                        onChange={(e) => setReferralSource(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] focus:border-indigo-500 focus:outline-none transition-colors text-foreground dark:text-white"
                      >
                        <option value="Coding Junction WhatsApp Group">Coding Junction WhatsApp Group</option>
                        <option value="LinkedIn Post">LinkedIn Post</option>
                        <option value="Instagram">Instagram</option>
                        <option value="College Classmates &amp; Faculty">College Classmates &amp; Faculty</option>
                        <option value="Coding Junction Website">Coding Junction Website</option>
                        <option value="Other Community">Other Community</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming Registration &amp; Generating Pass...</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4" />
                        <span>Confirm Registration &amp; Unlock Digital Pass</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-muted-foreground mt-2">
                    Official admission pass with Ticket ID &amp; QR code will be generated immediately.
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
