"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  Sparkles,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Github,
  QrCode,
  ShieldCheck,
  User,
  Zap,
  Cpu,
  Layers,
  Award,
  ExternalLink,
} from "lucide-react";
import QRCode from "qrcode";
import { useUser } from "@clerk/nextjs";
import { toPng } from "html-to-image";

type CardTheme = "quantum" | "matrix" | "amber" | "obsidian";

const ROLES = [
  "Full Stack Developer",
  "Web3 Architect",
  "AI / ML Engineer",
  "Competitive Programmer (DSA)",
  "Cloud & DevOps Engineer",
  "Cybersecurity Analyst",
  "UI / UX Designer",
  "Open Source Contributor",
];

const GENERATIONS = [
  "Gen 4 Core Team",
  "Gen 3 Coordinators",
  "Gen 2 Developers",
  "Founding Member (Gen 1)",
  "Member • Class of 2026",
  "Member • Class of 2027",
  "Member • Class of 2028",
];

export default function HoloCardStudio() {
  const { user } = useUser();

  const [name, setName] = useState("Aritra Konar");
  const [role, setRole] = useState("AI / ML Engineer");
  const [generation, setGeneration] = useState("Gen 3 Coordinators");
  const [githubUser, setGithubUser] = useState("Aritra203");
  const [theme, setTheme] = useState<CardTheme>("quantum");
  const [passId, setPassId] = useState("CJ-ID-2026-C1CB8");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [avatarDataUrl, setAvatarDataUrl] = useState<string>("");

  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 3D Tilt Physics State
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  // Sync user details and official Member ID if logged in with Clerk
  useEffect(() => {
    if (user?.fullName) {
      setName(user.fullName);
    }
    if (user?.username) {
      setGithubUser(user.username);
    }
    if (user?.id) {
      const rawId = user.id.replace("user_", "").slice(0, 6).toUpperCase();
      setPassId(`CJ-2026-${rawId}`);
    } else {
      const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
      setPassId(`CJ-2026-${randomHex}`);
    }
  }, [user]);

  // Generate real QR code image
  useEffect(() => {
    const verifyUrl = typeof window !== "undefined"
      ? `${window.location.origin}/verify?id=${encodeURIComponent(passId)}`
      : `https://coding-junction.in/verify?id=${passId}`;

    QRCode.toDataURL(verifyUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR generation failed", err));
  }, [passId]);

  // Avatar source resolution
  const avatarUrl = githubUser.trim()
    ? `https://avatars.githubusercontent.com/${encodeURIComponent(githubUser.trim())}`
    : "https://api.dicebear.com/7.x/bottts/png?seed=CJ";

  // Pre-fetch avatar to base64 data URL to guarantee zero CORS issues when capturing
  useEffect(() => {
    let active = true;
    if (!avatarUrl) return;

    fetch(avatarUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch avatar");
        return res.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (active && typeof reader.result === "string") {
            setAvatarDataUrl(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        console.warn("Avatar base64 conversion note:", err.message);
      });

    return () => {
      active = false;
    };
  }, [avatarUrl]);

  // Interactive 3D mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isDownloading) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -16;
    const rotY = ((x - centerX) / centerX) * 16;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.75,
    });
  };

  const handleMouseLeave = () => {
    if (isDownloading) return;
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  // Theme palettes configuration
  const themeConfig = {
    quantum: {
      cardBg: "from-[#0c0d1a] via-[#111328] to-[#070810]",
      border: "border-indigo-500/40 shadow-indigo-500/20",
      accent: "text-indigo-400",
      pill: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      foil: "linear-gradient(115deg, transparent 15%, rgba(239, 68, 68, 0.4) 30%, rgba(99, 102, 241, 0.45) 50%, rgba(16, 185, 129, 0.45) 70%, rgba(234, 179, 8, 0.4) 85%, transparent 100%)",
      glowRing: "from-indigo-500 via-purple-500 to-pink-500",
    },
    matrix: {
      cardBg: "from-[#05110c] via-[#081a13] to-[#020906]",
      border: "border-emerald-500/40 shadow-emerald-500/20",
      accent: "text-emerald-400",
      pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      foil: "linear-gradient(115deg, transparent 20%, rgba(16, 185, 129, 0.5) 40%, rgba(52, 211, 153, 0.6) 60%, rgba(6, 182, 212, 0.4) 80%, transparent 100%)",
      glowRing: "from-emerald-500 via-teal-500 to-cyan-500",
    },
    amber: {
      cardBg: "from-[#140e06] via-[#1e1509] to-[#0a0703]",
      border: "border-amber-500/40 shadow-amber-500/20",
      accent: "text-amber-400",
      pill: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      foil: "linear-gradient(115deg, transparent 20%, rgba(245, 158, 11, 0.5) 40%, rgba(249, 115, 22, 0.5) 60%, rgba(234, 179, 8, 0.4) 80%, transparent 100%)",
      glowRing: "from-amber-500 via-orange-500 to-yellow-400",
    },
    obsidian: {
      cardBg: "from-[#0a0a0f] via-[#121218] to-[#060608]",
      border: "border-zinc-400/30 shadow-white/10",
      accent: "text-zinc-200",
      pill: "bg-white/10 text-zinc-100 border-white/20",
      foil: "linear-gradient(115deg, transparent 15%, rgba(255, 0, 128, 0.35) 35%, rgba(0, 255, 255, 0.4) 55%, rgba(255, 255, 0, 0.35) 75%, transparent 95%)",
      glowRing: "from-white via-zinc-400 to-zinc-600",
    },
  }[theme];

  // High-Fidelity Canvas Fallback (Pixel-perfect mirror of the web preview)
  const drawCanvasFallback = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Card dimensions (standard 3.370 × 2.125 aspect ratio at 3x retina resolution)
    const cardW = 1000;
    const cardH = 632;
    canvas.width = cardW;
    canvas.height = cardH;

    // 1. Dark metallic base background
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 40);
    ctx.clip();

    const baseGrad = ctx.createLinearGradient(0, 0, cardW, cardH);
    if (theme === "quantum") {
      baseGrad.addColorStop(0, "#0c0d1a");
      baseGrad.addColorStop(0.5, "#111328");
      baseGrad.addColorStop(1, "#070810");
    } else if (theme === "matrix") {
      baseGrad.addColorStop(0, "#05110c");
      baseGrad.addColorStop(0.5, "#081a13");
      baseGrad.addColorStop(1, "#020906");
    } else if (theme === "amber") {
      baseGrad.addColorStop(0, "#140e06");
      baseGrad.addColorStop(0.5, "#1e1509");
      baseGrad.addColorStop(1, "#0a0703");
    } else {
      baseGrad.addColorStop(0, "#0a0a0f");
      baseGrad.addColorStop(0.5, "#121218");
      baseGrad.addColorStop(1, "#060608");
    }
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, cardW, cardH);

    // 2. Holographic iridescent foil gradient sweep
    const foilGrad = ctx.createLinearGradient(0, 0, cardW, cardH);
    foilGrad.addColorStop(0.15, "rgba(255,255,255,0)");
    foilGrad.addColorStop(0.35, "rgba(239, 68, 68, 0.35)");
    foilGrad.addColorStop(0.50, "rgba(99, 102, 241, 0.40)");
    foilGrad.addColorStop(0.68, "rgba(16, 185, 129, 0.40)");
    foilGrad.addColorStop(0.82, "rgba(234, 179, 8, 0.35)");
    foilGrad.addColorStop(0.98, "rgba(255,255,255,0)");
    ctx.fillStyle = foilGrad;
    ctx.fillRect(0, 0, cardW, cardH);

    // 3. Subtle circuit watermark
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 4;
    ctx.strokeRect(cardW - 380, cardH / 2 - 120, 220, 220);

    // 4. Header: EMV Golden Cyber Chip
    const chipX = 50;
    const chipY = 45;
    const chipW = 60;
    const chipH = 46;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, chipW, chipH, 10);
    const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
    chipGrad.addColorStop(0, "#fde68a");
    chipGrad.addColorStop(0.5, "#f59e0b");
    chipGrad.addColorStop(1, "#b45309");
    ctx.fillStyle = chipGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(254, 243, 199, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Chip contact traces
    ctx.strokeStyle = "rgba(120, 53, 15, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(chipX, chipY + 15);
    ctx.lineTo(chipX + chipW, chipY + 15);
    ctx.moveTo(chipX, chipY + 31);
    ctx.lineTo(chipX + chipW, chipY + 31);
    ctx.stroke();
    ctx.restore();

    // 5. Header Title & Subtitle
    ctx.font = "bold 20px 'Courier New', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("CODING JUNCTION CLUB", chipX + chipW + 20, chipY + 22);

    ctx.font = "12px 'Courier New', monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("UIT BURDWAN • DIGITAL PASS", chipX + chipW + 20, chipY + 40);

    // 6. Header: "AUTHENTIC" Pill Badge on Right
    const authPillW = 120;
    const authPillH = 30;
    const authX = cardW - 50 - authPillW;
    const authY = chipY + 8;

    ctx.beginPath();
    ctx.roundRect(authX, authY, authPillW, authPillH, 15);
    ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Green dot
    ctx.beginPath();
    ctx.arc(authX + 18, authY + 15, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#34d399";
    ctx.fill();

    // Authentic Text
    ctx.font = "bold 11px 'Courier New', monospace";
    ctx.fillStyle = "#34d399";
    ctx.fillText("AUTHENTIC", authX + 30, authY + 19);

    // Header divider line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 115);
    ctx.lineTo(cardW - 50, 115);
    ctx.stroke();

    // 7. Generation Badge Pill
    const genPillY = 160;
    ctx.font = "bold 13px 'Courier New', monospace";
    const genText = generation.toUpperCase();
    const genWidth = ctx.measureText(genText).width + 24;

    ctx.beginPath();
    ctx.roundRect(50, genPillY, genWidth, 28, 8);
    ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "rgba(99, 102, 241, 0.35)";
    ctx.stroke();

    ctx.fillStyle = "#a5b4fc";
    ctx.fillText(genText, 62, genPillY + 19);

    // 8. Recipient Name
    ctx.font = "bold 44px 'Inter', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(name || "Student Name", 50, genPillY + 75);

    // 9. Role
    ctx.font = "bold 20px 'Inter', sans-serif";
    ctx.fillStyle = theme === "amber" ? "#f59e0b" : theme === "matrix" ? "#34d399" : "#818cf8";
    ctx.fillText(role, 50, genPillY + 115);

    // 10. GitHub Handle
    if (githubUser) {
      ctx.font = "16px 'Courier New', monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`@${githubUser}`, 50, genPillY + 145);
    }

    // 11. Avatar with Glow Ring on Right
    const avatarSize = 130;
    const avatarX = cardW - 220;
    const avatarY = 150;

    // Outer glow ring
    ctx.beginPath();
    ctx.roundRect(avatarX - 5, avatarY - 5, avatarSize + 10, avatarSize + 10, 24);
    const ringGrad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
    ringGrad.addColorStop(0, "#6366f1");
    ringGrad.addColorStop(0.5, "#a855f7");
    ringGrad.addColorStop(1, "#ec4899");
    ctx.fillStyle = ringGrad;
    ctx.fill();

    // Avatar image container
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 18);
    ctx.clip();

    const imgToDraw = avatarDataUrl || avatarUrl;
    if (imgToDraw) {
      try {
        const avImg = new window.Image();
        avImg.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          avImg.onload = resolve;
          avImg.onerror = reject;
          avImg.src = imgToDraw;
        });
        ctx.drawImage(avImg, avatarX, avatarY, avatarSize, avatarSize);
      } catch {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
        ctx.font = "bold 36px 'Inter', sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(name.charAt(0).toUpperCase() || "C", avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 12);
        ctx.textAlign = "left";
      }
    }
    ctx.restore();

    // 12. Footer Divider Line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, cardH - 105);
    ctx.lineTo(cardW - 50, cardH - 105);
    ctx.stroke();

    // 13. Pass ID
    ctx.font = "11px 'Courier New', monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("CREDENTIAL LEDGER ID", 50, cardH - 65);

    ctx.font = "bold 18px 'Courier New', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(passId, 50, cardH - 40);

    // 14. QR Code in White Frame
    if (qrDataUrl) {
      const qrW = 75;
      const qrH = 75;
      const qrX = cardW - 50 - qrW;
      const qrY = cardH - 95;

      ctx.beginPath();
      ctx.roundRect(qrX, qrY, qrW, qrH, 12);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      const qrImg = new window.Image();
      await new Promise((resolve) => {
        qrImg.onload = resolve;
        qrImg.src = qrDataUrl;
      });
      ctx.drawImage(qrImg, qrX + 4, qrY + 4, qrW - 8, qrH - 8);
    }

    // 15. Outer Border with Rounded Corners
    ctx.restore(); // restore clipping
    ctx.beginPath();
    ctx.roundRect(0, 0, cardW, cardH, 40);
    ctx.strokeStyle = theme === "amber" ? "#f59e0b" : theme === "matrix" ? "#10b981" : "#6366f1";
    ctx.lineWidth = 3;
    ctx.stroke();

    const link = document.createElement("a");
    link.download = `CodingJunction_MemberPass_${name.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  // High-Resolution PNG Exporter
  const handleDownloadCard = async () => {
    try {
      setIsDownloading(true);

      // Save previous tilt & glare state
      const prevRotX = rotateX;
      const prevRotY = rotateY;

      // 1. Level the card flat and activate full holographic brilliance
      setRotateX(0);
      setRotateY(0);
      setGlarePos({ x: 50, y: 50, opacity: 0.85 });

      // Wait 150ms for CSS/motion to settle
      await new Promise((resolve) => setTimeout(resolve, 150));

      let exportedUrl = "";

      if (cardRef.current) {
        try {
          exportedUrl = await toPng(cardRef.current, {
            pixelRatio: 3, // Ultra-sharp 3x retina export
            cacheBust: true,
          });
        } catch (domErr) {
          console.warn("toPng snapshot failed, switching to high-fidelity canvas fallback:", domErr);
        }
      }

      // If toPng produced a URL, trigger download
      if (exportedUrl) {
        const link = document.createElement("a");
        link.download = `CodingJunction_MemberPass_${name.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
        link.href = exportedUrl;
        link.click();
      } else {
        // Fallback: draw pixel-perfect identical card on Canvas 2D
        await drawCanvasFallback();
      }

      // Restore tilt state
      setRotateX(prevRotX);
      setRotateY(prevRotY);
      setGlarePos({ x: 50, y: 50, opacity: 0 });
    } catch (err) {
      console.error("Export error:", err);
      // Ensure canvas fallback executes
      await drawCanvasFallback();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyShare = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/card`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Virtual Cyber Pass Studio
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Holographic{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Member Pass
          </span>
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
          Craft your personalized 3D holographic club pass with iridescent tilt physics, dynamic QR authentication, and 1-click export for LinkedIn and Instagram stories.
        </p>
      </div>

      {/* Main Grid: Card Canvas on Left, Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ─── LEFT: 3D Holographic Card Stage ─── */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div
            style={{ perspective: "1000px" }}
            className="w-full max-w-[540px] select-none py-4"
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{
                rotateX: isDownloading ? 0 : rotateX,
                rotateY: isDownloading ? 0 : rotateY,
                scale: 1,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{ transformStyle: "preserve-3d" }}
              className={`relative w-full aspect-[1.58/1] rounded-3xl border-2 p-6 sm:p-7 bg-gradient-to-br ${themeConfig.cardBg} ${themeConfig.border} shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing backdrop-blur-xl transition-colors duration-500`}
            >
              {/* Dynamic Iridescent Foil Layer */}
              <div
                style={{
                  background: themeConfig.foil,
                  opacity: isDownloading ? 0.85 : Math.max(0.35, glarePos.opacity),
                  mixBlendMode: "color-dodge",
                  transition: "opacity 0.2s ease",
                }}
                className="absolute inset-0 pointer-events-none rounded-3xl z-20"
              />

              {/* Cursor Specular Glare */}
              <div
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, transparent 60%)`,
                  opacity: isDownloading ? 0 : glarePos.opacity,
                  transition: "opacity 0.15s ease",
                }}
                className="absolute inset-0 pointer-events-none rounded-3xl z-30"
              />

              {/* Holographic Watermark Symbol */}
              <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none z-10">
                <Cpu className="w-56 h-56 text-white" />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between relative z-20 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  {/* EMV Cyber Chip */}
                  <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200/50 flex flex-col justify-between p-1 shadow-sm">
                    <div className="h-0.5 w-full bg-amber-800/40 rounded-full" />
                    <div className="flex justify-between">
                      <div className="w-2 h-2 rounded-full border border-amber-800/40" />
                      <div className="w-2 h-2 rounded-full border border-amber-800/40" />
                    </div>
                    <div className="h-0.5 w-full bg-amber-800/40 rounded-full" />
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-wider font-mono">
                      CODING JUNCTION CLUB
                    </h3>
                    <p className="text-[9px] text-zinc-400 font-mono">
                      UIT BURDWAN • DIGITAL PASS
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AUTHENTIC</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-5 pb-3 flex items-center justify-between relative z-20">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md ${themeConfig.pill}`}>
                      {generation}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {name || "Student Name"}
                  </h2>

                  <p className={`text-xs sm:text-sm font-semibold ${themeConfig.accent}`}>
                    {role}
                  </p>

                  {githubUser && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                      <Github className="w-3.5 h-3.5" />
                      <span>@{githubUser}</span>
                    </div>
                  )}
                </div>

                {/* Avatar with Glow Ring */}
                <div className="relative">
                  <div className={`p-1 rounded-2xl bg-gradient-to-tr ${themeConfig.glowRing} shadow-lg`}>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/60 relative">
                      <img
                        src={avatarDataUrl || avatarUrl}
                        alt={name}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Bar */}
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between pt-3 border-t border-white/[0.08] relative z-20 font-mono">
                <div className="space-y-0.5">
                  <p className="text-[8px] text-zinc-500 uppercase tracking-widest">
                    Credential Ledger ID
                  </p>
                  <p className="text-[11px] font-bold text-white tracking-wider">
                    {passId}
                  </p>
                </div>

                {qrDataUrl && (
                  <div className="p-1 rounded-lg bg-white border border-white/20 shadow-sm">
                    <img
                      src={qrDataUrl}
                      alt="Verify QR"
                      className="w-11 h-11 rounded"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5 pt-2">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Hover or drag your cursor across the card to experience live 3D holographic tilt physics.</span>
          </p>

          {/* Quick Actions Under Stage */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 w-full">
            <button
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className="flex-1 max-w-xs py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Exporting PNG...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download High-Res PNG</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyShare}
              className="py-3 px-4 rounded-2xl border border-black/[0.1] dark:border-white/[0.1] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Link Copied" : "Copy Studio Link"}</span>
            </button>
          </div>
        </div>

        {/* ─── RIGHT: Customization Studio Panel ─── */}
        <div className="lg:col-span-5 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.06] pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-foreground dark:text-white uppercase tracking-wider font-mono">
                Card Customizer
              </h3>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">Real-Time Sync</span>
          </div>

          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground dark:text-white flex items-center justify-between">
              <span>Full Name</span>
              <span className="text-[10px] text-muted-foreground font-mono">Display on Pass</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={28}
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              placeholder="e.g. Aritra Konar"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground dark:text-white flex items-center justify-between">
              <span>Club Role / Tech Stack</span>
              <span className="text-[10px] text-muted-foreground font-mono">Domain</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Generation / Batch */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground dark:text-white flex items-center justify-between">
              <span>Generation / Cohort</span>
              <span className="text-[10px] text-muted-foreground font-mono">Badge</span>
            </label>
            <select
              value={generation}
              onChange={(e) => setGeneration(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              {GENERATIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* GitHub Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Username</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Auto-fetches photo</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">
                @
              </span>
              <input
                type="text"
                value={githubUser}
                onChange={(e) => setGithubUser(e.target.value.replace(/^@/, ""))}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-muted/40 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                placeholder="github_username"
              />
            </div>
          </div>

          {/* Foil Theme Picker */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-foreground dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Holographic Foil Shader</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono uppercase">{theme}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme("quantum")}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  theme === "quantum"
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                    : "border-black/[0.08] dark:border-white/[0.08] hover:bg-muted/50"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 shadow-sm" />
                <div>
                  <p className="font-bold">Quantum</p>
                  <p className="text-[9px] text-muted-foreground">Cosmic Violet</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme("matrix")}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  theme === "matrix"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-black/[0.08] dark:border-white/[0.08] hover:bg-muted/50"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-sm" />
                <div>
                  <p className="font-bold">Matrix</p>
                  <p className="text-[9px] text-muted-foreground">Cyber Green</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme("amber")}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  theme === "amber"
                    ? "border-amber-500 bg-amber-500/10 text-amber-400"
                    : "border-black/[0.08] dark:border-white/[0.08] hover:bg-muted/50"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-sm" />
                <div>
                  <p className="font-bold">Amber</p>
                  <p className="text-[9px] text-muted-foreground">Solar Gold</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme("obsidian")}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  theme === "obsidian"
                    ? "border-zinc-400 bg-white/10 text-white"
                    : "border-black/[0.08] dark:border-white/[0.08] hover:bg-muted/50"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-600 shadow-sm" />
                <div>
                  <p className="font-bold">Obsidian</p>
                  <p className="text-[9px] text-muted-foreground">Stealth Mono</p>
                </div>
              </button>
            </div>
          </div>

          {/* Ledger Pass ID Info */}
          <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-muted/30 p-3 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[9px] text-muted-foreground block uppercase">Ledger Pass ID</span>
              <span className="font-bold text-foreground dark:text-white">{passId}</span>
            </div>
            <Link
              href={`/verify?id=${encodeURIComponent(passId)}`}
              className="text-[10px] text-indigo-500 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Ledger</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
