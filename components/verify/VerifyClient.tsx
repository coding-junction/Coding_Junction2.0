"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck, Search, Award, CheckCircle2, AlertTriangle,
  Copy, Check, Share2, Building2, Calendar, Printer, ExternalLink
} from "lucide-react";

interface CertificateData {
  id: string;
  studentName: string;
  eventName: string;
  eventDate?: string;
  collegeName?: string;
  role?: string;
  issuer?: string;
  issuedAt?: string;
  status: string;
  grade?: string;
}

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [inputVal, setInputVal] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const verifyCertificate = async (idToVerify: string) => {
    const id = idToVerify.trim();
    if (!id) return;

    try {
      setLoading(true);
      setErrorMsg("");
      setCertificate(null);

      const res = await fetch(`/api/certificates/verify?id=${encodeURIComponent(id)}`);
      const data = await res.json();

      if (!res.ok || !data.valid) {
        throw new Error(data.error || "Credential ID not found in the official ledger.");
      }

      setCertificate(data.certificate);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to verify credential.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      verifyCertificate(initialId);
    }
  }, [initialId]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && certificate) {
      const url = `${window.location.origin}/verify?id=${encodeURIComponent(certificate.id)}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareLinkedIn = () => {
    if (typeof window !== "undefined" && certificate) {
      const url = `${window.location.origin}/verify?id=${encodeURIComponent(certificate.id)}`;
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedInUrl, "_blank", "width=600,height=600");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full min-h-screen">
      {/* ─── Hero & Search Section (HIDDEN ON PRINT) ─── */}
      <section className="relative w-full px-4 md:px-8 lg:px-16 xl:px-20 pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden print:hidden print-hidden no-print">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="text-center relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Credential Ledger
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground dark:text-white tracking-tight mb-4">
            Verify{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              Credentials
            </span>
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            Verify official certificates, awards, and event credentials issued by <strong>Coding Junction Club</strong>, the official tech community of University Institute of Technology (UIT), Burdwan.
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyCertificate(inputVal);
            }}
            className="max-w-xl mx-auto"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Credential ID (e.g. CJ-CERT-...)..."
                className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-white dark:bg-[#0c0d14] border border-black/[0.1] dark:border-white/[0.1] text-sm text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 shadow-lg shadow-black/5 transition-all font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ─── Result / Certificate Section ─── */}
      <section className="px-4 md:px-8 max-w-3xl mx-auto pb-24 print:p-0 print:m-0 print:max-w-full">
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-center print:hidden print-hidden no-print"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="font-bold text-base text-foreground dark:text-white mb-1">
                Credential Verification Failed
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                {errorMsg}
              </p>
              <p className="text-[11px] text-muted-foreground/70 mt-3 font-mono">
                Make sure the ID includes the &quot;CJ-&quot; prefix as printed on the certificate.
              </p>
            </motion.div>
          )}

          {certificate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              id="official-verification-sheet"
              className="printable-sheet relative rounded-3xl border-2 border-amber-500/30 bg-white dark:bg-[#0c0d16] p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-xl print:border-amber-600 print:bg-white print:text-slate-900 print:shadow-none"
            >
              {/* Corner Accents (Decorative on Screen) */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400 print:border-amber-600" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400 print:border-amber-600" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400 print:border-amber-600" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400 print:border-amber-600" />

              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] print:opacity-[0.05] pointer-events-none select-none">
                <Award className="w-96 h-96 text-amber-500" />
              </div>

              {/* Verified Badge Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-black/[0.08] dark:border-white/[0.08] print:border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 shadow-sm flex-shrink-0 print:border-emerald-600">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 print:text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse print:hidden" />
                      Officially Verified & Authentic
                    </div>
                    <p className="text-xs text-muted-foreground print:text-slate-600 font-mono">
                      Ledger ID: <span className="font-semibold text-foreground dark:text-white print:text-slate-900">{certificate.id}</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons (HIDDEN ON PRINT) */}
                <div className="flex items-center gap-2 print:hidden print-hidden no-print">
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied Link" : "Copy Link"}</span>
                  </button>
                  <button
                    onClick={handleShareLinkedIn}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] text-xs font-semibold border border-[#0077b5]/20 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on LinkedIn</span>
                  </button>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="py-8 space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 print:text-amber-700">
                    Recipient
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold text-foreground dark:text-white print:text-slate-900 mt-1">
                    {certificate.studentName}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground print:text-slate-500">
                      Event / Recognition
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-foreground dark:text-white print:text-slate-900 mt-1">
                      {certificate.eventName}
                    </p>
                    {certificate.role && (
                      <p className="text-xs text-muted-foreground print:text-slate-600 mt-0.5">
                        Role: {certificate.role}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground print:text-slate-500">
                      Issuing Organization
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-foreground dark:text-white print:text-slate-900 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      {certificate.issuer || "Coding Junction Club"}
                    </p>
                    <p className="text-xs text-muted-foreground print:text-slate-600 mt-0.5">
                      {certificate.collegeName || "University Institute of Technology, Burdwan"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground print:text-slate-500">
                      Date Issued
                    </span>
                    <p className="text-sm font-semibold text-foreground dark:text-white print:text-slate-900 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-muted-foreground print:text-slate-600" />
                      {certificate.eventDate || new Date(certificate.issuedAt || Date.now()).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground print:text-slate-500">
                      Issuing Authority & Validation
                    </span>
                    <p className="text-sm font-semibold text-foreground dark:text-white print:text-slate-900 mt-1">
                      Lead Organizer & Executive Board
                    </p>
                    <p className="text-xs text-muted-foreground print:text-slate-600 mt-0.5">
                      Coding Junction Club
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Security Footer */}
              <div className="pt-6 border-t border-black/[0.08] dark:border-white/[0.08] print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground print:text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Verified via Coding Junction Cryptographic Ledger</span>
                </div>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-foreground dark:text-white transition-colors cursor-pointer print:hidden print-hidden no-print"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Official Verification Sheet
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
