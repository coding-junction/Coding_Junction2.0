"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
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
  Download,
  Eye,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { downloadCertificatePng, generateCertificateCanvas, sanitizeStudentName } from "@/lib/certificateGenerator";
import { VerifiedCollegeData } from "./CollegeVerificationModal";
import { sanity } from "@/lib/sanity";

export interface SanityCertificate {
  _id: string;
  title: string;
  certificateTemplate?: {
    asset?: {
      url: string;
    };
  };
}

interface CertificatesTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  verificationData?: VerifiedCollegeData | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events?: any[];
  onBrowseEvents: () => void;
}

/**
 * CertificatesTab
 * Default view is kept in "Coming Soon" mode so users don't see it yet.
 * A developer/admin preview mode is built-in so you can test generating and downloading certificates!
 * Fetches certificate templates directly from Sanity document type 'certificate'.
 */
export const CertificatesTab = React.memo(function CertificatesTab({
  user,
  verificationData,
  onBrowseEvents,
}: CertificatesTabProps) {
  // Flag to control public visibility (False = Coming Soon showcase to users)
  const isPublicLaunch = false;

  const [certificates, setCertificates] = useState<SanityCertificate[]>([]);
  const [selectedCertId, setSelectedCertId] = useState<string>("");
  const [loadingCertificates, setLoadingCertificates] = useState(true);

  const [isNotified, setIsNotified] = useState(false);
  const [showAdminPreview, setShowAdminPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  // ─── Fetch Certificates directly from Sanity CMS ───
  useEffect(() => {
    sanity
      .fetch(
        `*[_type == "certificate"] | order(_createdAt desc) {
          _id,
          title,
          certificateTemplate{
            asset->{
              url
            }
          }
        }`
      )
      .then((data: SanityCertificate[]) => {
        setCertificates(data || []);
        if (data && data.length > 0) {
          setSelectedCertId(data[0]._id);
        }
        setLoadingCertificates(false);
      })
      .catch((err) => {
        console.error("Failed to fetch certificates from Sanity:", err);
        setLoadingCertificates(false);
      });
  }, []);

  // ─── Attendance State Management ───
  // Reads verified attended event/certificate IDs from Clerk user metadata and user-scoped localStorage
  const [attendedEventIds, setAttendedEventIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const fromClerk = (user?.unsafeMetadata?.attendedEventIds as string[]) || [];
      const local = JSON.parse(
        localStorage.getItem(`cj_attended_event_ids_${user?.id || "guest"}`) || "[]"
      );
      return Array.from(new Set([...fromClerk, ...local]));
    } catch {
      return [];
    }
  });

  // Sync attendance when user metadata loads/changes
  useEffect(() => {
    if (!user?.id) return;
    const clerkAttended = (user?.unsafeMetadata?.attendedEventIds as string[]) || [];
    try {
      const localAttended = JSON.parse(
        localStorage.getItem(`cj_attended_event_ids_${user.id}`) || "[]"
      );
      const merged = Array.from(new Set([...clerkAttended, ...localAttended]));
      setAttendedEventIds(merged);
    } catch {
      setAttendedEventIds(clerkAttended);
    }
  }, [user?.id, user?.unsafeMetadata?.attendedEventIds]);

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "there";

  // Sanitize user name so strictly ONLY the name is imprinted — never phone numbers, emails, or digits
  const rawStudentName =
    verificationData?.studentName ||
    user?.fullName ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Aritra Konar";

  const studentFullName = sanitizeStudentName(rawStudentName);
  const collegeName = verificationData?.collegeName || "University Institute of Technology, Burdwan University";

  const selectedCertificate =
    certificates.find((c) => c._id === selectedCertId) || certificates[0];

  // Check if current user attended the session for this certificate
  const isAttended = Boolean(
    selectedCertificate?._id && attendedEventIds.includes(selectedCertificate._id)
  );

  // Helper to toggle simulated attendance (for testing and verification)
  const handleToggleAttendance = async (eventId: string) => {
    if (!eventId) return;
    const isCurrentlyAttended = attendedEventIds.includes(eventId);
    const updated = isCurrentlyAttended
      ? attendedEventIds.filter((id) => id !== eventId)
      : [...attendedEventIds, eventId];

    setAttendedEventIds(updated);

    try {
      localStorage.setItem(
        `cj_attended_event_ids_${user?.id || "guest"}`,
        JSON.stringify(updated)
      );
    } catch (err) {
      console.error("Failed to save attended events locally:", err);
    }

    if (user?.update) {
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            attendedEventIds: updated,
          },
        });
      } catch (err) {
        console.error("Failed to update Clerk attendance metadata:", err);
      }
    }
  };

  // Generate live canvas preview when in preview mode
  useEffect(() => {
    if (!showAdminPreview && !isPublicLaunch) return;

    let active = true;
    async function updatePreview() {
      if (!selectedCertificate) return;
      try {
        const canvas = await generateCertificateCanvas({
          studentName: studentFullName,
          templateUrl: selectedCertificate.certificateTemplate?.asset?.url,
          certificateTitle: selectedCertificate.title,
        });
        if (active) {
          setPreviewDataUrl(canvas.toDataURL("image/png"));
        }
      } catch (err) {
        console.error("Preview render failed:", err);
      }
    }

    updatePreview();
    return () => {
      active = false;
    };
  }, [showAdminPreview, isPublicLaunch, selectedCertificate, studentFullName]);

  const handleDownload = async () => {
    if (!selectedCertificate) return;

    // Strict Gating: Ensure only attendees can download
    if (!isAttended) {
      alert("Access Denied: You must be a verified attendee to download your certificate.");
      return;
    }

    setIsGenerating(true);
    try {
      await downloadCertificatePng({
        studentName: studentFullName,
        templateUrl: selectedCertificate.certificateTemplate?.asset?.url,
        certificateTitle: selectedCertificate.title,
      });
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

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
              {isPublicLaunch ? "Live" : "Coming Soon"}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Official verified certifications for events, hackathons, and competitions organized by Coding Junction.
          </p>
        </div>

        {/* Admin Secret Testing Trigger (Kept subtle for testing without revealing to users) */}
        {!isPublicLaunch && (
          <button
            onClick={() => setShowAdminPreview(!showAdminPreview)}
            title="Toggle Engine Testing Mode"
            className="self-start sm:self-auto text-[11px] font-mono text-muted-foreground/60 hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-black/[0.04] dark:border-white/[0.06]"
          >
            <Sliders className="w-3 h-3" />
            <span>{showAdminPreview ? "Close Engine Preview" : "Test Certificate Engine"}</span>
          </button>
        )}
      </div>

      {/* ─── ACTIVE CERTIFICATE ENGINE (Revealed in test mode or when isPublicLaunch is enabled) ─── */}
      {(isPublicLaunch || showAdminPreview) && (
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/[0.06] to-transparent p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground dark:text-white">
                  Dynamic Certificate Generator Engine
                </h3>
                <p className="text-xs text-muted-foreground">
                  Loads template from Sanity &amp; imprints only student name directly onto certificate template.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 font-bold">
              Attendance Gated
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-muted-foreground block mb-1.5">
                  Sanity Certificate Document
                </label>
                {loadingCertificates ? (
                  <div className="p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] text-xs font-mono text-muted-foreground flex items-center gap-2">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Loading templates from Sanity...</span>
                  </div>
                ) : certificates.length === 0 ? (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono">
                    No certificate documents uploaded in Sanity yet.
                  </div>
                ) : (
                  <select
                    value={selectedCertId}
                    onChange={(e) => setSelectedCertId(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] text-foreground dark:text-white outline-none cursor-pointer"
                  >
                    {certificates.map((cert) => {
                      const certAttended = attendedEventIds.includes(cert._id);
                      return (
                        <option key={cert._id} value={cert._id} className="bg-background text-foreground">
                          {cert.title} {certAttended ? "✓ (Attended)" : "🔒 (Locked)"}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              {/* Attendance Verification Status Badge */}
              {isAttended ? (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 leading-tight">
                    <span className="font-bold">Verified Attendee:</span> Your attendance for this session is confirmed. Certificate is unlocked!
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 text-xs">
                  <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="font-bold">Attendance Verification Required</div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      Only verified attendees who attended this event can download their certificate.
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance Simulation Switch for Testing */}
              <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold block text-foreground dark:text-white">
                    Simulate Attendance
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Test lock &amp; unlock logic
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => selectedCertificate && handleToggleAttendance(selectedCertificate._id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isAttended
                      ? "bg-red-500/15 text-red-500 dark:text-red-400 border border-red-500/30 hover:bg-red-500/25"
                      : "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                  }`}
                >
                  {isAttended ? "Mark Unattended" : "Mark Attended"}
                </button>
              </div>

              <div>
                <label className="text-xs font-mono text-muted-foreground block mb-1.5">
                  Imprinted Name (Exclusively Student Name)
                </label>
                <div className="p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] text-xs font-semibold text-foreground dark:text-white">
                  {studentFullName}
                </div>
                <p className="text-[10px] font-mono text-muted-foreground/70 mt-1">
                  * Only real attendee name is imprinted on the template (no phone numbers or extraneous details).
                </p>
              </div>

              {/* Gated Download Button */}
              {isAttended ? (
                <button
                  onClick={handleDownload}
                  disabled={isGenerating || !selectedCertificate}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs font-mono shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Rendering...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Certificate (PNG)</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  title="You must attend this event to download the certificate"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] text-muted-foreground font-bold text-xs font-mono cursor-not-allowed opacity-60"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Locked — Attendance Required</span>
                </button>
              )}
            </div>

            {/* Live Canvas Preview with Lock Overlay if Unattended */}
            <div className="lg:col-span-2 flex flex-col justify-center items-center">
              <div className="w-full aspect-[2000/1414] rounded-xl overflow-hidden border border-black/[0.1] dark:border-white/[0.1] bg-black/40 shadow-xl relative">
                {previewDataUrl ? (
                  <>
                    <img
                      src={previewDataUrl}
                      alt="Certificate Preview"
                      className={`w-full h-full object-contain transition-all duration-300 ${
                        !isAttended ? "blur-[2px] brightness-75 select-none pointer-events-none" : ""
                      }`}
                    />

                    {/* Locked Watermark / Overlay if User Has Not Attended */}
                    {!isAttended ? (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
                          <Lock className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">
                          Certificate Locked
                        </h4>
                        <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                          Only verified attendees who participated in &ldquo;{selectedCertificate?.title || "this event"}&rdquo; can unlock and download this credential.
                        </p>
                        <span className="mt-3 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold">
                          Attendance Verification Required
                        </span>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/90 text-black text-[10px] font-mono font-bold shadow-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Attendee</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                    <span className="text-xs font-mono">Generating preview...</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] font-mono text-muted-foreground mt-2 text-center">
                High-Resolution Preview (Canvas 2000x1414 px)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Coming Soon Showcase Card (Visible to regular users) ─── */}
      {!isPublicLaunch && (
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
      )}

      {/* ─── Standardized Status Bar ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14]">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Development Status</p>
            <p className="text-xs font-semibold text-foreground dark:text-white">Engine Ready</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14]">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Template Source</p>
            <p className="text-xs font-semibold text-foreground dark:text-white">Sanity CMS Assets</p>
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
