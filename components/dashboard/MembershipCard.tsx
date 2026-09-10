"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  Code2,
  Terminal,
  Cpu,
  Globe,
  Binary,
  Brain,
  Smartphone,
  Check,
  Copy,
  RotateCw,
  Share2,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Download,
  RefreshCw,
  Calendar,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { VerifiedCollegeData } from "./CollegeVerificationModal";

export type DomainKey = "web" | "dsa" | "aiml" | "android" | "cpp";

export interface DomainMeta {
  key: DomainKey;
  label: string;
  tag: string;
  role: string;
  accent: string;
  accentHex: string;
  badgeBg: string;
  borderColor: string;
  glowColor: string;
  gradient: string;
  command: string;
  codeLine1: string;
  codeLine2: string;
}

export const DOMAINS: Record<DomainKey, DomainMeta> = {
  web: {
    key: "web",
    label: "Web Development",
    tag: "WEB_DEV",
    role: "Full-Stack Engineer",
    accent: "text-cyan-400",
    accentHex: "#22d3ee",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    borderColor: "border-cyan-500/30 hover:border-cyan-400/60",
    glowColor: "rgba(6, 182, 212, 0.25)",
    gradient: "from-cyan-500/10 via-indigo-500/5 to-transparent",
    command: "$ npm run build --target=production",
    codeLine1: "const stack = ['Next.js', 'TypeScript', 'Node'];",
    codeLine2: "await app.deploy({ status: 200, valid: '1_YEAR' });",
  },
  dsa: {
    key: "dsa",
    label: "DSA",
    tag: "DSA_ALGO",
    role: "Algorithm Specialist",
    accent: "text-emerald-400",
    accentHex: "#34d399",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    borderColor: "border-emerald-500/30 hover:border-emerald-400/60",
    glowColor: "rgba(16, 185, 129, 0.25)",
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    command: "$ g++ -O3 solution.cpp && ./solve",
    codeLine1: "template <typename T> void solve(Graph& g);",
    codeLine2: "Complexity: Time O(log N) • Space O(1)",
  },
  aiml: {
    key: "aiml",
    label: "AI / ML",
    tag: "AI_ML",
    role: "Machine Learning Engineer",
    accent: "text-violet-400",
    accentHex: "#c084fc",
    badgeBg: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    borderColor: "border-violet-500/30 hover:border-violet-400/60",
    glowColor: "rgba(168, 85, 247, 0.25)",
    gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    command: "$ python train.py --epochs=100 --cuda",
    codeLine1: "model = Transformer(d_model=768, heads=12)",
    codeLine2: "loss = criterion(model(x), targets) # 0.002",
  },
  android: {
    key: "android",
    label: "Android Development",
    tag: "ANDROID_DEV",
    role: "Mobile App Architect",
    accent: "text-teal-400",
    accentHex: "#2dd4bf",
    badgeBg: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    borderColor: "border-teal-500/30 hover:border-teal-400/60",
    glowColor: "rgba(20, 184, 166, 0.25)",
    gradient: "from-teal-500/10 via-emerald-500/5 to-transparent",
    command: "$ ./gradlew assembleRelease --stacktrace",
    codeLine1: "val app = ComposeNavigation { HomeScreen() }",
    codeLine2: "lifecycleScope.launch(Dispatchers.Main) { ... }",
  },
  cpp: {
    key: "cpp",
    label: "C / C++",
    tag: "CPP_SYSTEMS",
    role: "Systems Programmer",
    accent: "text-amber-400",
    accentHex: "#fbbf24",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    borderColor: "border-amber-500/30 hover:border-amber-400/60",
    glowColor: "rgba(245, 158, 11, 0.25)",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    command: "$ cmake --build . && ./core_binary",
    codeLine1: "#include <iostream> • int* ptr = &memory;",
    codeLine2: "std::atomic<uint64_t> thread_cycles{0};",
  },
};

const domainIcons: Record<DomainKey, React.ComponentType<{ className?: string }>> = {
  web: Globe,
  dsa: Binary,
  aiml: Brain,
  android: Smartphone,
  cpp: Cpu,
};

interface MembershipCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  memberSince?: string;
  verificationData?: VerifiedCollegeData | null;
  onOpenVerification?: () => void;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  user,
  memberSince = "2026",
  verificationData,
  onOpenVerification,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainKey | null>(null);
  const [activeDomain, setActiveDomain] = useState<DomainKey | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize domain from Clerk metadata or localStorage
  useEffect(() => {
    const savedClerkDomain = user?.unsafeMetadata?.primaryDomain as DomainKey | undefined;
    const localDomain = typeof window !== "undefined" ? (localStorage.getItem("cj_primary_domain") as DomainKey | null) : null;
    const initial = savedClerkDomain || localDomain;

    if (initial && DOMAINS[initial]) {
      setActiveDomain(initial);
      setSelectedDomain(initial);
    }
  }, [user]);

  // 1-Year Membership Validity Calculation
  const issueDate = useMemo(() => {
    if (verificationData?.verifiedAt) {
      return new Date(verificationData.verifiedAt);
    }
    if (user?.createdAt) {
      return new Date(user.createdAt);
    }
    return new Date();
  }, [verificationData?.verifiedAt, user?.createdAt]);

  const expiryDate = useMemo(() => {
    const d = new Date(issueDate);
    d.setFullYear(d.getFullYear() + 1);
    return d;
  }, [issueDate]);

  const isExpired = useMemo(() => {
    return new Date().getTime() > expiryDate.getTime();
  }, [expiryDate]);

  const formattedIssueDate = useMemo(() => {
    return issueDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" }).toUpperCase();
  }, [issueDate]);

  const formattedExpiryDate = useMemo(() => {
    return expiryDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" }).toUpperCase();
  }, [expiryDate]);

  // Unique member ID derived from user object
  const rawId = user?.id || "CJ-DEV";
  const memberId = `CJ-2026-${rawId.replace("user_", "").slice(0, 6).toUpperCase()}`;
  const username = user?.username || user?.firstName?.toLowerCase() || "dev";

  // Subtle 3D tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 160,
    damping: 20,
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 160,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Generate card handler (permanent selection)
  const handleGenerateCard = async () => {
    if (!selectedDomain) return;
    setIsGenerating(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("cj_primary_domain", selectedDomain);
    }

    try {
      if (user?.update) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            primaryDomain: selectedDomain,
          },
        });
      }
    } catch {
      // Continue even if Clerk metadata update is slow/offline
    }

    setTimeout(() => {
      setActiveDomain(selectedDomain);
      setIsGenerating(false);
    }, 600);
  };

  const handleCopyId = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(memberId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const domainMeta = activeDomain ? DOMAINS[activeDomain] : null;
    const shareData = {
      title: "Coding Junction Developer Pass",
      text: `My official Coding Junction Member Pass (${memberId}) - ${domainMeta?.role || "Developer"}!`,
      url: window.location.href,
    };
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch {
        handleCopyId();
      }
    } else {
      handleCopyId();
    }
  };

  // Ultra-Cool High-Resolution ID Card Canvas Generator (1400 x 860 Retina)
  const handleDownloadCard = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1400;
      canvas.height = 860;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const accentColor = currentDomainMeta ? currentDomainMeta.accentHex : "#6366f1";

      // 1. Deep Space Obsidian Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1400, 860);
      bgGrad.addColorStop(0, "#06070d");
      bgGrad.addColorStop(0.5, "#0b0d18");
      bgGrad.addColorStop(1, "#0e1122");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1400, 860);

      // 2. Neon Ambient Glows
      const glowGrad1 = ctx.createRadialGradient(1250, 150, 10, 1250, 150, 450);
      glowGrad1.addColorStop(0, `${accentColor}33`);
      glowGrad1.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad1;
      ctx.fillRect(0, 0, 1400, 860);

      const glowGrad2 = ctx.createRadialGradient(150, 750, 10, 150, 750, 400);
      glowGrad2.addColorStop(0, "rgba(99, 102, 241, 0.15)");
      glowGrad2.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad2;
      ctx.fillRect(0, 0, 1400, 860);

      // 3. Cyberpunk Mesh Dot Grid
      ctx.fillStyle = "rgba(255, 255, 255, 0.035)";
      for (let x = 40; x < 1360; x += 32) {
        for (let y = 40; y < 820; y += 32) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Double Cyber Bezel Borders
      // Outer border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(24, 24, 1352, 812);

      // Inner glowing border with rounded corner effect
      ctx.strokeStyle = isVerified ? "#10b98155" : `${accentColor}44`;
      ctx.lineWidth = 3;
      ctx.strokeRect(32, 32, 1336, 796);

      // Corner accent brackets
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      // Top-left bracket
      ctx.beginPath(); ctx.moveTo(32, 60); ctx.lineTo(32, 32); ctx.lineTo(60, 32); ctx.stroke();
      // Top-right bracket
      ctx.beginPath(); ctx.moveTo(1340, 60); ctx.lineTo(1368, 32); ctx.lineTo(1340, 32); ctx.stroke();
      // Bottom-left bracket
      ctx.beginPath(); ctx.moveTo(32, 800); ctx.lineTo(32, 828); ctx.lineTo(60, 828); ctx.stroke();
      // Bottom-right bracket
      ctx.beginPath(); ctx.moveTo(1340, 828); ctx.lineTo(1368, 828); ctx.lineTo(1368, 800); ctx.stroke();

      // 5. Header: Terminal Dots & Title
      ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(70, 72, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(95, 72, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#10b981"; ctx.beginPath(); ctx.arc(120, 72, 8, 0, Math.PI * 2); ctx.fill();

      ctx.font = "bold 22px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("CODING JUNCTION // DIGITAL DEVELOPER PASS", 155, 80);

      // 1-Year Badge on Header
      ctx.fillStyle = isExpired ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)";
      ctx.fillRect(800, 52, 230, 38);
      ctx.strokeStyle = isExpired ? "#ef4444" : "#10b981";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(800, 52, 230, 38);
      ctx.fillStyle = isExpired ? "#f87171" : "#34d399";
      ctx.font = "bold 15px monospace";
      ctx.textAlign = "center";
      ctx.fillText(isExpired ? "EXPIRED (RE-VERIFY)" : "VALID 1 YEAR", 915, 76);

      // Domain Badge Pill
      if (currentDomainMeta) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
        ctx.fillRect(1050, 52, 260, 38);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(1050, 52, 260, 38);
        ctx.fillStyle = accentColor;
        ctx.font = "bold 17px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`[ ${currentDomainMeta.tag} ]`, 1180, 77);
        ctx.textAlign = "left";
      }

      // Divider line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(40, 115); ctx.lineTo(1360, 115); ctx.stroke();

      // 6. Member Photo or Avatar Monogram
      const avatarBoxX = 70;
      const avatarBoxY = 150;
      const avatarSize = 175;

      // Draw Avatar Box Background
      ctx.fillStyle = "#121426";
      ctx.fillRect(avatarBoxX, avatarBoxY, avatarSize, avatarSize);

      // Attempt to load and render user profile photo
      let photoLoaded = false;
      if (user?.imageUrl) {
        try {
          const avatarImg = await new Promise<HTMLImageElement | null>((resolve) => {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = async () => {
              try {
                const res = await fetch(user.imageUrl);
                const blob = await res.blob();
                const blobUrl = URL.createObjectURL(blob);
                const fallbackImg = new window.Image();
                fallbackImg.onload = () => resolve(fallbackImg);
                fallbackImg.onerror = () => resolve(null);
                fallbackImg.src = blobUrl;
              } catch {
                resolve(null);
              }
            };
            img.src = user.imageUrl;
            setTimeout(() => resolve(null), 2500);
          });

          if (avatarImg) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(avatarBoxX, avatarBoxY, avatarSize, avatarSize);
            ctx.clip();
            ctx.drawImage(avatarImg, avatarBoxX, avatarBoxY, avatarSize, avatarSize);
            ctx.restore();
            photoLoaded = true;
          }
        } catch {
          photoLoaded = false;
        }
      }

      // Fallback Initials Monogram if user has no photo
      if (!photoLoaded) {
        ctx.fillStyle = "#818cf8";
        ctx.font = "bold 80px monospace";
        ctx.textAlign = "center";
        ctx.fillText(user?.firstName?.[0] || "CJ", avatarBoxX + avatarSize / 2, avatarBoxY + 115);
        ctx.textAlign = "left";
      }

      // Draw avatar box cyber border
      ctx.strokeStyle = isVerified ? "#10b981" : accentColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(avatarBoxX, avatarBoxY, avatarSize, avatarSize);

      // Online Status Tag below Avatar
      ctx.fillStyle = isExpired ? "#ef4444" : "#10b981";
      ctx.beginPath();
      ctx.arc(avatarBoxX + 18, avatarBoxY + avatarSize + 22, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isExpired ? "#f87171" : "#34d399";
      ctx.font = "bold 14px monospace";
      ctx.fillText(isExpired ? "EXPIRED (RE-VERIFY ID)" : "ACTIVE MEMBER PASS", avatarBoxX + 32, avatarBoxY + avatarSize + 27);

      // 7. Member Information Details
      const detailsX = 285;
      // Member Name
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px monospace";
      ctx.fillText(user?.fullName || user?.firstName || "Community Member", detailsX, 195);

      // Domain Role with comment prefix
      ctx.fillStyle = accentColor;
      ctx.font = "bold 28px monospace";
      ctx.fillText(`// ${currentDomainMeta?.role || "Software Developer"}`, detailsX, 240);

      // College / Institution line
      ctx.fillStyle = "#94a3b8";
      ctx.font = "22px monospace";
      const collegeText = verificationData?.collegeName
        ? `🏛️ ${verificationData.collegeName}`
        : "🏛️ Coding Junction Developer Community";
      ctx.fillText(collegeText.length > 52 ? `${collegeText.slice(0, 50)}...` : collegeText, detailsX, 285);

      // Verification seal badge
      if (isVerified) {
        ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
        ctx.fillRect(detailsX, 310, 310, 32);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(detailsX, 310, 310, 32);
        ctx.fillStyle = "#34d399";
        ctx.font = "bold 15px monospace";
        ctx.fillText("✓ AICTE OFFICIAL VERIFIED", detailsX + 14, 332);
      }

      // 8. Metallic Smart Chip Graphic (Cyber Realism)
      const chipX = 1180;
      const chipY = 160;
      ctx.fillStyle = "#b45309";
      ctx.fillRect(chipX, chipY, 120, 90);
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 2;
      ctx.strokeRect(chipX, chipY, 120, 90);
      // Chip contacts pattern
      ctx.fillStyle = "#78350f";
      ctx.fillRect(chipX + 8, chipY + 8, 104, 74);
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(chipX + 40, chipY); ctx.lineTo(chipX + 40, chipY + 90);
      ctx.moveTo(chipX + 80, chipY); ctx.lineTo(chipX + 80, chipY + 90);
      ctx.moveTo(chipX, chipY + 45); ctx.lineTo(chipX + 120, chipY + 45);
      ctx.stroke();

      // 9. Glassmorphism Code Terminal Window
      const termX = 70;
      const termY = 380;
      const termW = 1260;
      const termH = 115;
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.fillRect(termX, termY, termW, termH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(termX, termY, termW, termH);

      // Terminal Code Syntax Lines
      ctx.font = "21px monospace";
      ctx.fillStyle = "#818cf8";
      ctx.fillText("> ", termX + 25, termY + 45);
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText(currentDomainMeta?.codeLine1 || "const member = new Developer();", termX + 55, termY + 45);

      ctx.fillStyle = "#818cf8";
      ctx.fillText("> ", termX + 25, termY + 85);
      ctx.fillStyle = accentColor;
      ctx.fillText(currentDomainMeta?.codeLine2 || "await member.ship({ valid: '1_YEAR' });", termX + 55, termY + 85);

      // 10. Metadata Grid with 1-Year Expiry Data
      const metaY = 530;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(40, metaY); ctx.lineTo(1360, metaY); ctx.stroke();

      // Column 1: Pass ID
      ctx.fillStyle = "#64748b";
      ctx.font = "16px monospace";
      ctx.fillText("MEMBER PASS ID", 70, metaY + 40);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px monospace";
      ctx.fillText(memberId, 70, metaY + 80);

      // Column 2: Issued Date
      ctx.fillStyle = "#64748b";
      ctx.font = "16px monospace";
      ctx.fillText("ISSUED DATE", 450, metaY + 40);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 26px monospace";
      ctx.fillText(formattedIssueDate, 450, metaY + 80);

      // Column 3: Valid Thru (1 Year)
      ctx.fillStyle = "#64748b";
      ctx.font = "16px monospace";
      ctx.fillText("VALID THRU (1 YEAR)", 720, metaY + 40);
      ctx.fillStyle = isExpired ? "#ef4444" : "#34d399";
      ctx.font = "bold 26px monospace";
      ctx.fillText(formattedExpiryDate, 720, metaY + 80);

      // Column 4: Scannable Vector QR Code Graphic
      const qrX = 1170;
      const qrY = metaY + 15;
      const qrSize = 135;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(qrX, qrY, qrSize, qrSize);

      // QR Markers
      ctx.fillStyle = "#0f172a";
      // Top-Left
      ctx.fillRect(qrX + 10, qrY + 10, 36, 36);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(qrX + 16, qrY + 16, 24, 24);
      ctx.fillStyle = "#0f172a"; ctx.fillRect(qrX + 22, qrY + 22, 12, 12);
      // Top-Right
      ctx.fillRect(qrX + 89, qrY + 10, 36, 36);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(qrX + 95, qrY + 16, 24, 24);
      ctx.fillStyle = "#0f172a"; ctx.fillRect(qrX + 101, qrY + 22, 12, 12);
      // Bottom-Left
      ctx.fillRect(qrX + 10, qrY + 89, 36, 36);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(qrX + 16, qrY + 95, 24, 24);
      ctx.fillStyle = "#0f172a"; ctx.fillRect(qrX + 22, qrY + 101, 12, 12);
      // Center data points
      ctx.fillRect(qrX + 55, qrY + 20, 14, 14);
      ctx.fillRect(qrX + 70, qrY + 50, 14, 14);
      ctx.fillRect(qrX + 55, qrY + 75, 20, 20);
      ctx.fillRect(qrX + 90, qrY + 70, 12, 12);
      ctx.fillRect(qrX + 20, qrY + 60, 15, 15);

      // 11. Holographic Security Foil Strip
      const foilY = 720;
      const foilGrad = ctx.createLinearGradient(70, foilY, 1330, foilY);
      foilGrad.addColorStop(0, "rgba(99, 102, 241, 0.4)");
      foilGrad.addColorStop(0.25, "rgba(34, 211, 238, 0.4)");
      foilGrad.addColorStop(0.5, "rgba(236, 72, 153, 0.4)");
      foilGrad.addColorStop(0.75, "rgba(245, 158, 11, 0.4)");
      foilGrad.addColorStop(1, "rgba(99, 102, 241, 0.4)");
      ctx.fillStyle = foilGrad;
      ctx.fillRect(70, foilY, 1050, 28);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px monospace";
      ctx.fillText("★ CODING JUNCTION OFFICIAL PASS • ANNUAL STUDENT MEMBERSHIP • ENCRYPTED ID PASS ★", 100, foilY + 19);

      // 12. Footer Notice: 1 Year Validity & Re-verification Mandate
      ctx.fillStyle = "#64748b";
      ctx.font = "15px monospace";
      ctx.fillText("NOTICE: Membership is valid for exactly 1 year from issue date. Annual re-verification of College ID is required thereafter.", 70, 790);

      ctx.fillStyle = "#475569";
      ctx.font = "14px monospace";
      ctx.fillText("coding-junction.in", 1180, 790);

      // Trigger instant PNG download
      const link = document.createElement("a");
      link.download = `${memberId}-pass.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2500);
    } catch (err) {
      console.error("Failed to download card:", err);
    }
  };

  // Check if active valid verification exists for the current year (within 365 days)
  const isVerified = useMemo(() => {
    if (!verificationData?.isVerified || !verificationData?.verifiedAt) return false;
    const verifiedTime = new Date(verificationData.verifiedAt).getTime();
    if (isNaN(verifiedTime)) return false;
    const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
    return (Date.now() - verifiedTime) < ONE_YEAR_MS;
  }, [verificationData]);

  const currentDomainMeta = activeDomain ? DOMAINS[activeDomain] : null;
  const ActiveIcon = activeDomain ? domainIcons[activeDomain] : Code2;

  return (
    <div className="flex flex-col items-center w-full">
      {/* ══════════════════════════════════════════════════════════
          STATE 0: UNVERIFIED / EXPIRED PASS (No Membership Card)
         ══════════════════════════════════════════════════════════ */}
      {!isVerified ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[#0c0d14] text-white p-6 shadow-xl relative overflow-hidden text-center"
        >
          <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center mx-auto mb-3.5 shadow-md shadow-amber-500/10">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <span>Pass Locked • Verification Required</span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-white font-mono">
            College ID Verification Required
          </h3>

          <p className="text-xs text-slate-400 mt-1.5 font-mono leading-relaxed">
            Coding Junction Membership Passes are issued annually only to verified students and valid for exactly 1 year. Verify your college ID to generate and unlock your digital pass for this year.
          </p>

          <div className="mt-5">
            <button
              onClick={onOpenVerification}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/25"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify College ID to Issue Pass &rarr;</span>
            </button>
          </div>

          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Valid for 1 year from verification date • Annual renewal</span>
          </div>
        </motion.div>
      ) : !activeDomain ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-[#0c0d14] text-white p-5 sm:p-6 shadow-xl relative overflow-hidden"
        >
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] font-mono text-slate-400 ml-1.5 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-indigo-400" />
                <span>setup-domain.sh</span>
              </span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/30">
              1-YEAR PASS
            </span>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-sm sm:text-base text-white">
              Select Your Primary Domain
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono leading-relaxed">
              Choose your core domain. Your official developer pass is valid for 1 year and will be minted with domain-specific syntax accents.
            </p>
          </div>

          {/* Domain Selection Options */}
          <div className="space-y-2 mb-4">
            {(Object.keys(DOMAINS) as DomainKey[]).map((key) => {
              const item = DOMAINS[key];
              const Icon = domainIcons[key];
              const isSelected = selectedDomain === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDomain(key)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? `bg-white/[0.08] border-white/40 shadow-md`
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? item.badgeBg : "bg-white/[0.05] text-slate-400"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white tracking-tight">
                          {item.label}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-500 text-white"
                        : "border-white/20 bg-transparent"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Live Preview Command Preview */}
          {selectedDomain && (
            <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.06] font-mono text-[11px] mb-4 text-slate-300 flex items-center justify-between">
              <span className="truncate">{DOMAINS[selectedDomain].command}</span>
              <span className={`text-[10px] uppercase font-bold ml-2 ${DOMAINS[selectedDomain].accent}`}>
                READY
              </span>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateCard}
            disabled={!selectedDomain || isGenerating}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold font-mono tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Compiling Pass...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Confirm & Generate Digital Pass &rarr;</span>
              </>
            )}
          </button>
        </motion.div>
      ) : (
        /* ══════════════════════════════════════════════════════════
            STATE 2: THE SIMPLISTIC DEVELOPER PASS (Generated)
           ══════════════════════════════════════════════════════════ */
        <div className="flex flex-col items-center w-full">
          {/* Expiration Warning Banner if expired */}
          {isExpired && (
            <div className="w-full max-w-[440px] mb-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-rose-200 leading-snug">
                  Annual Pass Expired
                </p>
                <p className="text-[11px] text-rose-300/90 mt-0.5 leading-tight">
                  Your 1-year membership has ended. Please re-verify your College ID to reactivate your credentials.
                </p>
                {onOpenVerification && (
                  <button
                    onClick={onOpenVerification}
                    className="mt-2 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-500 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                  >
                    Re-verify College ID &rarr;
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Fixed Bounding Box for 3D Flip (Prevents Any Element Shifting) */}
          <div
            className="w-full max-w-[440px] h-[250px] perspective-[1000px] select-none cursor-pointer"
            onClick={() => setIsFlipped((prev) => !prev)}
          >
            {/* Outer Motion Wrapper: Handles Tilt Physics */}
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX: rotateXSpring,
                rotateY: rotateYSpring,
                transformStyle: "preserve-3d",
              }}
              className="w-full h-full"
            >
              {/* Inner Motion Wrapper: Handles 180° Flip Rotation */}
              <motion.div
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="w-full h-full relative"
              >
                {/* ──────────────────────────────────────────
                    CARD FRONT (Clean Minimalist Code Vibe)
                   ────────────────────────────────────────── */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                  className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden p-5 flex flex-col justify-between border ${
                    isExpired
                      ? "border-rose-500/50"
                      : isVerified
                      ? "border-emerald-500/35"
                      : "border-white/[0.12]"
                  } bg-[#0a0b12] text-white shadow-xl`}
                >
                  {/* Subtle Grid Watermark */}
                  <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                      backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* 1. Terminal Header */}
                  <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 tracking-tight ml-1">
                        cj://members/{username}.dev
                      </span>
                    </div>

                    {/* Domain Tag Badge */}
                    {currentDomainMeta && (
                      <span
                        className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${currentDomainMeta.badgeBg}`}
                      >
                        <ActiveIcon className="w-2.5 h-2.5" />
                        <span>{currentDomainMeta.tag}</span>
                      </span>
                    )}
                  </div>

                  {/* 2. Developer Bio & Avatar */}
                  <div className="relative z-10 flex items-center gap-3.5 my-auto">
                    <div className="relative flex-shrink-0">
                      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-white/20 bg-slate-900 shadow-md">
                        {user?.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt={user.fullName || "Member"}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-300 font-mono font-bold text-base">
                            {user?.firstName?.[0] || ">_"}
                          </div>
                        )}
                      </div>
                      {isExpired ? (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center border border-[#0a0b12]" title="Expired">
                          <AlertTriangle className="w-2.5 h-2.5" />
                        </div>
                      ) : isVerified ? (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-[#0a0b12]" title="AICTE Verified">
                          <ShieldCheck className="w-2.5 h-2.5" />
                        </div>
                      ) : (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center border border-[#0a0b12]" title="Member">
                          <Code2 className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-white truncate tracking-tight font-mono">
                        {user?.fullName || user?.firstName || "Community Member"}
                      </h3>
                      <p className="text-[11px] text-slate-300 font-mono flex items-center gap-1 mt-0.5">
                        <span className="text-slate-500">//</span>
                        <span className={`font-semibold ${currentDomainMeta?.accent || "text-indigo-400"}`}>
                          {currentDomainMeta?.role || "Software Developer"}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                        {verificationData?.collegeName ? (
                          <span className="text-slate-300 truncate">
                            {verificationData.collegeName}
                          </span>
                        ) : (
                          <span className="text-slate-500">Student Developer • Coding Junction</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* 3. Dev Code Vibe Bar */}
                  {currentDomainMeta && (
                    <div className="relative z-10 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/[0.06] font-mono text-[10px] text-slate-400 flex items-center justify-between">
                      <span className="truncate text-slate-300">
                        <span className="text-indigo-400">&gt;</span> {currentDomainMeta.codeLine1}
                      </span>
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ml-2 flex-shrink-0 ${
                          isExpired
                            ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                            : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        }`}
                      >
                        {isExpired ? "EXPIRED" : "1 YR ACTIVE"}
                      </span>
                    </div>
                  )}

                  {/* 4. Footer: ID, 1-Year Valid Thru, Flip Hint */}
                  <div className="relative z-10 pt-2 border-t border-white/[0.08] flex items-center justify-between font-mono text-[10px]">
                    <div>
                      <span className="text-slate-500 text-[8px] uppercase tracking-wider block">Pass ID</span>
                      <span className="font-bold text-slate-200">{memberId}</span>
                    </div>

                    <div className="text-center">
                      <span className="text-slate-500 text-[8px] uppercase tracking-wider block">Valid Thru</span>
                      <span className={`font-semibold ${isExpired ? "text-rose-400 font-bold" : "text-slate-300"}`}>
                        {formattedExpiryDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] text-slate-400 hover:text-white bg-white/[0.04] px-2 py-1 rounded border border-white/[0.06] transition-colors">
                      <RotateCw className="w-2.5 h-2.5 text-indigo-400" />
                      <span>Flip</span>
                    </div>
                  </div>
                </div>

                {/* ──────────────────────────────────────────
                    CARD BACK (Clean Terminal Verification)
                   ────────────────────────────────────────── */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden p-5 flex flex-col justify-between border border-white/[0.12] bg-[#0a0b12] text-white shadow-xl"
                >
                  {/* Back Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Terminal className="w-3 h-3 text-indigo-400" />
                      <span>$ cj verify --id={memberId}</span>
                    </div>
                    <span
                      className={`font-bold text-[9px] px-1.5 py-0.5 rounded border ${
                        isExpired
                          ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                          : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      }`}
                    >
                      {isExpired ? "RENEWAL_REQUIRED" : "1_YEAR_VALID"}
                    </span>
                  </div>

                  {/* QR & Diagnostics */}
                  <div className="flex items-center justify-between gap-4 my-auto">
                    <div className="bg-white p-2 rounded-xl shadow-md flex-shrink-0">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-18 h-18 text-slate-900"
                        fill="currentColor"
                      >
                        <rect x="5" y="5" width="28" height="28" rx="3" />
                        <rect x="9" y="9" width="20" height="20" rx="1.5" fill="white" />
                        <rect x="13" y="13" width="12" height="12" rx="1" />

                        <rect x="67" y="5" width="28" height="28" rx="3" />
                        <rect x="71" y="9" width="20" height="20" rx="1.5" fill="white" />
                        <rect x="75" y="13" width="12" height="12" rx="1" />

                        <rect x="5" y="67" width="28" height="28" rx="3" />
                        <rect x="9" y="71" width="20" height="20" rx="1.5" fill="white" />
                        <rect x="13" y="75" width="12" height="12" rx="1" />

                        <rect x="38" y="10" width="8" height="8" rx="1" />
                        <rect x="50" y="10" width="8" height="8" rx="1" />
                        <rect x="38" y="24" width="8" height="8" rx="1" />
                        <rect x="50" y="24" width="8" height="8" rx="1" />

                        <rect x="10" y="38" width="8" height="8" rx="1" />
                        <rect x="24" y="38" width="8" height="8" rx="1" />
                        <rect x="38" y="38" width="24" height="24" rx="2" />
                        <rect x="67" y="38" width="8" height="8" rx="1" />
                        <rect x="82" y="38" width="8" height="8" rx="1" />

                        <rect x="38" y="68" width="8" height="8" rx="1" />
                        <rect x="50" y="68" width="8" height="8" rx="1" />
                        <rect x="38" y="82" width="8" height="8" rx="1" />
                        <rect x="50" y="82" width="8" height="8" rx="1" />
                        <rect x="67" y="68" width="23" height="8" rx="1" />
                        <rect x="82" y="82" width="8" height="8" rx="1" />

                        <rect x="42" y="42" width="16" height="16" rx="2" fill="#4f46e5" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0 font-mono text-[10px] space-y-1 text-slate-300">
                      <p className="truncate text-slate-400">
                        <span className="text-indigo-400">&gt;</span> DOMAIN:{" "}
                        <span className="text-white font-semibold">{currentDomainMeta?.label}</span>
                      </p>
                      <p className="truncate text-slate-400">
                        <span className="text-indigo-400">&gt;</span> ISSUED:{" "}
                        <span className="text-slate-200">{formattedIssueDate}</span>
                      </p>
                      <p className="truncate text-slate-400">
                        <span className="text-indigo-400">&gt;</span> VALID_THRU:{" "}
                        <span className={isExpired ? "text-rose-400 font-bold" : "text-emerald-400 font-semibold"}>
                          {formattedExpiryDate} (1 YR)
                        </span>
                      </p>
                      <p className="truncate text-slate-400">
                        <span className="text-indigo-400">&gt;</span> STATUS:{" "}
                        <span className={isExpired ? "text-rose-400" : "text-emerald-400"}>
                          {isExpired ? "EXPIRED_ANNUAL" : "ACTIVE_MEMBER"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Back Footer */}
                  <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <span>coding-junction.in</span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <RotateCw className="w-2.5 h-2.5" />
                      <span>Click to flip front</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              ACTION CONTROLS (With Download Button, No Track Change)
             ══════════════════════════════════════════════════════════ */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 w-full max-w-[440px]">
            {/* Flip Card Button */}
            <button
              onClick={() => setIsFlipped((prev) => !prev)}
              className="flex-1 min-w-[95px] py-1.5 px-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-xs font-mono text-foreground dark:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <RotateCw className="w-3 h-3 text-indigo-500" />
              <span>{isFlipped ? "Show Front" : "Flip Pass"}</span>
            </button>

            {/* Small ID Card Download Button (Icon Only) */}
            <button
              onClick={handleDownloadCard}
              className="py-1.5 px-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="Download ID Card (PNG)"
            >
              {isDownloaded ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Copy ID Button */}
            <button
              onClick={handleCopyId}
              className="py-1.5 px-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-xs font-mono text-foreground dark:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Copy Member ID"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>ID</span>
                </>
              )}
            </button>

            {/* Share Pass */}
            <button
              onClick={handleShare}
              className="py-1.5 px-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-xs font-mono text-slate-400 hover:text-foreground flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Share Pass"
            >
              {shareSuccess ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Share2 className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* 1-Year Membership Notice */}
          <div className="w-full max-w-[440px] mt-2.5 flex items-center justify-center gap-1 text-[10px] font-mono text-muted-foreground">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>Valid for 1 year ({formattedIssueDate} – {formattedExpiryDate}) • Annual verification required</span>
          </div>

          {/* Unverified or Re-verify Callout Prompt */}
          {(!isVerified || isExpired) && onOpenVerification && (
            <div
              className={`w-full max-w-[440px] mt-2.5 p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                isExpired
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300"
              }`}
            >
              <span className="text-[11px] font-mono flex items-center gap-1.5">
                <ShieldAlert className={`w-3.5 h-3.5 flex-shrink-0 ${isExpired ? "text-rose-500" : "text-amber-500"}`} />
                {isExpired
                  ? "Annual pass expired. Re-verify your College ID to renew."
                  : "Get \"Verified Student\" seal on your pass"}
              </span>
              <button
                onClick={onOpenVerification}
                className={`text-[11px] font-mono font-bold hover:underline flex-shrink-0 cursor-pointer ${
                  isExpired ? "text-rose-400" : "text-amber-700 dark:text-amber-400"
                }`}
              >
                {isExpired ? "Renew &rarr;" : "Verify &rarr;"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
