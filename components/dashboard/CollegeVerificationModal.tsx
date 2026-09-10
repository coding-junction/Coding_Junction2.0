"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  UploadCloud, Scan, CheckCircle2, ShieldCheck, Building2,
  Search, GraduationCap, X, AlertCircle, RefreshCw, Loader2, Sparkles,
  MapPin, Check, UserCheck, UserX, AlertTriangle
} from "lucide-react";
import { createWorker } from "tesseract.js";

export interface VerifiedCollegeData {
  isVerified: boolean;
  collegeName: string;
  aicteId: string;
  university?: string;
  district?: string;
  state?: string;
  verifiedAt: string;
  cardImageUrl?: string;
  studentName?: string;
  nameVerified?: boolean;
}

interface CollegeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  onVerified: (data: VerifiedCollegeData) => void;
  isMandatory?: boolean;
}

interface CandidateInstitution {
  id: string;
  name: string;
  university: string;
  state: string;
  district: string;
  matchScore?: number;
}

export function CollegeVerificationModal({
  isOpen,
  onClose,
  user,
  onVerified,
  isMandatory = false,
}: CollegeVerificationModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("");
  const [ocrText, setOcrText] = useState("");

  const [matchedCollege, setMatchedCollege] = useState<CandidateInstitution | null>(null);
  const [candidates, setCandidates] = useState<CandidateInstitution[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Student name matching state
  const [nameMatch, setNameMatch] = useState<{
    matched: boolean;
    matchedName: string | null;
    confidence: number;
    message: string;
  } | null>(null);
  const [userConfirmedName, setUserConfirmedName] = useState(false);

  // Search override / refinement
  const [manualSearch, setManualSearch] = useState("");
  const [isSearchingManual, setIsSearchingManual] = useState(false);
  const [searchResults, setSearchResults] = useState<CandidateInstitution[]>([]);
  const [showManualSearch, setShowManualSearch] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up object URL when file changes or modal closes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    setErrorMsg("");
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setMatchedCollege(null);
    setCandidates([]);
    setOcrText("");
    startOcrProcess(selectedFile, objectUrl);
  };

  const startOcrProcess = async (imageFile: File, imageUrl: string) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStatus("Initializing OCR recognition engine...");

    let worker: any = null;
    try {
      worker = await createWorker("eng");

      setScanProgress(40);
      setScanStatus("Scanning ID card and extracting text...");

      const ret = await worker.recognize(imageUrl);
      const text = ret.data.text || "";
      setOcrText(text);

      setScanProgress(75);
      setScanStatus("Verifying institution and student name against database...");

      const accountUserName =
        user?.fullName ||
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
        user?.firstName ||
        "";

      // Call our verification API with both rawText and account user name
      const res = await fetch("/api/institutions/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: text, userName: accountUserName }),
      });

      const data = await res.json();
      setScanProgress(100);

      if (data.nameMatch) {
        setNameMatch(data.nameMatch);
        if (data.nameMatch.matched) {
          setUserConfirmedName(true);
        }
      }

      if (data.success && data.bestMatch) {
        setMatchedCollege(data.bestMatch);
        setCandidates(data.candidates || []);
        setScanStatus("Institution & name processed successfully!");
      } else if (data.candidates && data.candidates.length > 0) {
        setMatchedCollege(data.candidates[0]);
        setCandidates(data.candidates);
        setScanStatus("Potential matches found. Please confirm your college.");
      } else {
        setScanStatus("Text scanned. Please select or verify your college below.");
        setShowManualSearch(true);
      }
    } catch (err) {
      console.error("OCR / Verification error:", err);
      setScanStatus("OCR scan complete. Please confirm your college details.");
      setShowManualSearch(true);
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch {
          // Worker termination fallback
        }
      }
      setIsScanning(false);
    }
  };

  const handleManualSearch = async (query: string) => {
    setManualSearch(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearchingManual(true);
    try {
      const res = await fetch(`/api/institutions/verify?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Manual search error:", err);
    } finally {
      setIsSearchingManual(false);
    }
  };

  const handleConfirmVerification = async () => {
    if (!matchedCollege) {
      setErrorMsg("Please select or confirm your verified college first.");
      return;
    }

    if (nameMatch && !nameMatch.matched && !userConfirmedName) {
      setErrorMsg("Please confirm that this student ID card belongs to you before completing verification.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    const accountUserName =
      user?.fullName ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
      user?.firstName ||
      "";

    const verificationPayload: VerifiedCollegeData = {
      isVerified: true,
      collegeName: matchedCollege.name,
      aicteId: matchedCollege.id,
      university: matchedCollege.university,
      district: matchedCollege.district,
      state: matchedCollege.state,
      verifiedAt: new Date().toISOString(),
      studentName: nameMatch?.matchedName || accountUserName,
      nameVerified: nameMatch?.matched || userConfirmedName,
    };

    try {
      // Save metadata to Clerk user object
      if (user?.update) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            collegeVerification: verificationPayload,
          },
        });
      }

      onVerified(verificationPayload);
      onClose();
    } catch (err) {
      console.error("Failed to save verification metadata:", err);
      setErrorMsg("Failed to save verification. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#0e0f17] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Glow ambient decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-foreground dark:text-white tracking-tight">
                  Student ID Verification
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  AICTE Verified
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload your College ID card. The system will automatically recognize your institution.
              </p>
            </div>
          </div>

          {!isMandatory && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="relative p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload Dropzone */}
          {!previewUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              className="group border-2 border-dashed border-indigo-500/30 dark:border-indigo-500/20 hover:border-indigo-500/60 rounded-3xl p-8 text-center cursor-pointer transition-all bg-gradient-to-b from-indigo-500/5 to-transparent hover:bg-indigo-500/[0.08]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                }}
              />
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-foreground dark:text-white text-base">
                Click to upload or drag & drop College ID Card
              </h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Supports JPG, PNG, or WebP up to 10MB. Ensure college name, logo, and your student credentials are readable.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05] text-xs text-muted-foreground border border-black/[0.05] dark:border-white/[0.05]">
                <Scan className="w-3.5 h-3.5 text-indigo-400" />
                <span>Instant automated OCR recognition</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview & Scanning Overlay */}
              <div className="relative rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-black/40 h-52 flex items-center justify-center">
                <Image
                  src={previewUrl}
                  alt="Uploaded ID Card"
                  fill
                  className="object-contain"
                />

                {/* Scanning Animation Bar */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                    <motion.div
                      animate={{ y: ["0%", "450%", "0%"] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      className="w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-violet-500 shadow-[0_0_15px_rgba(99,102,241,0.9)]"
                    />
                    <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[1px]" />
                  </div>
                )}

                {/* Change photo button */}
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                    setMatchedCollege(null);
                    setCandidates([]);
                    setNameMatch(null);
                    setUserConfirmedName(false);
                  }}
                  className="absolute top-3 right-3 px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change Card</span>
                </button>
              </div>

              {/* Progress Bar & Status */}
              {isScanning && (
                <div className="space-y-2 p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
                  <div className="flex items-center justify-between text-xs font-medium text-foreground dark:text-white">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                      {scanStatus}
                    </span>
                    <span className="text-indigo-500 font-bold">{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Verified Result Card */}
              {matchedCollege && !isScanning && (
                <div className="rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-5 relative overflow-hidden shadow-lg shadow-emerald-500/5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/30">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3" /> AICTE Verified Institution
                          </span>
                          {matchedCollege.matchScore && (
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {Math.round(matchedCollege.matchScore * 100)}% Confidence
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-foreground dark:text-white text-base mt-1.5 leading-snug">
                          {matchedCollege.name}
                        </h4>
                        {matchedCollege.university && matchedCollege.university !== "NOT APPLICABLE" && (
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                            <span>{matchedCollege.university}</span>
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{matchedCollege.district}, {matchedCollege.state}</span>
                          <span className="mx-1">•</span>
                          <span className="font-mono text-[10px] bg-black/[0.04] dark:bg-white/[0.06] px-1.5 py-0.5 rounded border border-black/[0.06] dark:border-white/[0.06]">
                            AICTE: {matchedCollege.id}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Option to change match */}
                  <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Is this your institution?
                    </span>
                    <button
                      onClick={() => setShowManualSearch(!showManualSearch)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                    >
                      {showManualSearch ? "Hide alternatives" : "Choose different college"}
                    </button>
                  </div>
                </div>
              )}

              {/* Student Name Verification Card */}
              {nameMatch && !isScanning && (
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    nameMatch.matched
                      ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20"
                      : "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        nameMatch.matched
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {nameMatch.matched ? (
                        <UserCheck className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-foreground dark:text-white">
                          {nameMatch.matched
                            ? "Student Name Verified"
                            : "Name Check Warning"}
                        </h5>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            nameMatch.matched
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {nameMatch.matched ? "Matched" : "Review Needed"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {nameMatch.message}
                      </p>
                      {nameMatch.matchedName && (
                        <p className="text-[11px] text-foreground dark:text-white mt-1.5">
                          Detected on card:{" "}
                          <span className="font-semibold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded font-mono">
                            {nameMatch.matchedName}
                          </span>
                        </p>
                      )}
                      {!nameMatch.matched && (
                        <label className="mt-3 flex items-start gap-2 text-xs text-foreground dark:text-white cursor-pointer select-none bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20">
                          <input
                            type="checkbox"
                            checked={userConfirmedName}
                            onChange={(e) => setUserConfirmedName(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className="leading-snug">
                            I confirm this is my official student ID card and I am{" "}
                            <strong>
                              {user?.fullName ||
                                `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                                user?.firstName ||
                                "the account owner"}
                            </strong>
                            .
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Multiple Candidate Selection or Manual Refinement */}
              {(showManualSearch || (!matchedCollege && !isScanning && previewUrl)) && (
                <div className="space-y-3 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground dark:text-white flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-indigo-400" />
                      Search & Select From AICTE Database (39,000+ Colleges)
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={manualSearch}
                      onChange={(e) => handleManualSearch(e.target.value)}
                      placeholder="Type college name (e.g. University Institute of Technology, Burdwan...)"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-[#12131e] border border-black/[0.08] dark:border-white/[0.08] text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:border-indigo-500"
                    />
                    {isSearchingManual && (
                      <Loader2 className="w-4 h-4 text-indigo-500 animate-spin absolute right-3 top-2.5" />
                    )}
                  </div>

                  {/* Search / Candidate Results List */}
                  <div className="max-h-44 overflow-y-auto space-y-1.5 divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                    {(searchResults.length > 0 ? searchResults : candidates).map((inst) => (
                      <button
                        key={inst.id}
                        onClick={() => {
                          setMatchedCollege(inst);
                          setShowManualSearch(false);
                          setErrorMsg("");
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start justify-between gap-3 hover:bg-indigo-500/10 transition-colors cursor-pointer ${
                          matchedCollege?.id === inst.id ? "bg-indigo-500/15 border border-indigo-500/30" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground dark:text-white truncate">
                            {inst.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {inst.university && inst.university !== "NOT APPLICABLE" ? `${inst.university} • ` : ""}
                            {inst.district}, {inst.state}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0">
                          {inst.id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-3 bg-black/[0.01] dark:bg-white/[0.01]">
          <div>
            {!isMandatory ? (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Skip for now
              </button>
            ) : (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Required for member verification
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {matchedCollege && (
              <button
                onClick={handleConfirmVerification}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Verification...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Complete Verification</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
