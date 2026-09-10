"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Award, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
}

export function CertificateModal({ isOpen, onClose, recipientName }: CertificateModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-gradient-to-b from-[#0c0d14] via-[#090a10] to-[#06070a] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          {/* Top Bar with Status and Close Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sample Certificate Template • Coming Soon</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Certificate Canvas */}
          <div className="p-6 md:p-10">
            <div className="relative p-6 sm:p-10 md:p-14 rounded-xl border-2 border-amber-500/40 bg-gradient-to-br from-[#0e0f17] via-[#090a0f] to-[#0d0e16] shadow-inner overflow-hidden text-center">
              {/* Ornate Corner Accents */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/80 pointer-events-none" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/80 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/80 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/80 pointer-events-none" />

              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <Image
                  src="/CodingJunction_withoutText_neonBackground.png"
                  alt="Coding Junction Seal"
                  width={400}
                  height={400}
                  className="object-contain"
                />
              </div>

              {/* "COMING SOON" Watermark diagonal banner */}
              <div className="absolute top-8 right-[-50px] rotate-45 bg-amber-500/20 border-y border-amber-400/40 text-amber-300 text-[10px] sm:text-xs tracking-[0.25em] font-mono py-1 px-14 shadow-lg pointer-events-none select-none">
                TEMPLATE PREVIEW
              </div>

              {/* Header Logos & Institution */}
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <Image
                    src="/CodingJunction_withText_black_withoutBackground.png"
                    alt="Coding Junction"
                    width={160}
                    height={48}
                    className="h-9 w-auto object-contain dark:invert"
                  />
                </div>
                <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-amber-300/80">
                  University Institute Of Technology, Burdwan
                </p>
                <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent my-1" />
              </div>

              {/* Main Title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-widest text-white uppercase font-bold mb-2">
                Certificate of Excellence
              </h2>
              <p className="text-xs sm:text-sm text-white/50 tracking-wider uppercase font-sans mb-6">
                This credential is proudly presented to
              </p>

              {/* Recipient Name */}
              <div className="my-6">
                <p className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 font-semibold px-4 py-1">
                  {recipientName || "Your Name"}
                </p>
                <div className="w-48 sm:w-72 mx-auto h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mt-2" />
              </div>

              {/* Citation */}
              <p className="text-xs sm:text-sm md:text-base text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
                in recognition of outstanding participation and successful completion of the competitive challenges in{" "}
                <span className="font-semibold text-white">Brain Battle 2.0 / Official Coding Junction Hackathon</span>, organized by the official tech community of UIT Burdwan.
              </p>

              {/* Footer / Signatures */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-white/[0.08] items-end mt-8">
                {/* Signature 1 */}
                <div className="text-center">
                  <div className="font-serif italic text-amber-300 text-base sm:text-lg font-medium">
                    Ranadeb Saha
                  </div>
                  <div className="w-32 mx-auto h-px bg-white/20 my-1" />
                  <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider">
                    Founder & Club Lead
                  </p>
                  <p className="text-[9px] text-white/30">Coding Junction</p>
                </div>

                {/* Seal in Center (Desktop) */}
                <div className="hidden md:flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-400/50 flex items-center justify-center bg-amber-500/10 shadow-lg shadow-amber-500/20">
                    <Award className="w-8 h-8 text-amber-400" />
                  </div>
                  <span className="text-[9px] text-amber-300/70 uppercase tracking-widest mt-1">Verified Credential</span>
                </div>

                {/* Signature 2 */}
                <div className="text-center">
                  <div className="font-serif italic text-amber-300 text-base sm:text-lg font-medium">
                    Faculty Coordinator
                  </div>
                  <div className="w-32 mx-auto h-px bg-white/20 my-1" />
                  <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider">
                    Dept. of CSE & IT
                  </p>
                  <p className="text-[9px] text-white/30">UIT, Burdwan</p>
                </div>
              </div>

              {/* Verification Metadata Bar */}
              <div className="mt-8 pt-4 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-3 text-[10px] text-white/40 font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Credential ID: CJ-DEMO-2025-XXXXXX</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Official Certificate Ledger</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-white/[0.02]">
            <p className="text-xs text-muted-foreground">
              Participate in upcoming events to earn your permanent verified certificates.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
