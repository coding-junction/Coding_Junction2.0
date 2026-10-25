"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal as TerminalIcon,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";
import teamJson from "@/app/Team/team.json";

interface HistoryItem {
  id: string;
  type: "input" | "output" | "error" | "ascii" | "matrix-start";
  content: React.ReactNode;
}

const CJ_ASCII = `
   ____ ___  ____  ___ _   _  ____ 
  / ___/ _ \\|  _ \\|_ _| \\ | |/ ___|
 | |  | | | | | | || ||  \\| | |  _ 
 | |__| |_| | |_| || || |\\  | |_| |
  \\____\\___/|____/|___|_| \\_|\\____|
      _ _   _ _   _  ____ _____ ___ ___  _   _ 
     | | | | | \\ | |/ ___|_   _|_ _/ _ \\| \\ | |
  _  | | | | |  \\| | |     | |  | | | | |  \\| |
 | |_| | |_| | |\\  | |___  | |  | | |_| | |\\  |
  \\___/ \\___/|_| \\_|\\____| |_| |___\\___/|_| \\_|
           • UIT BURDWAN TECH COMMUNITY •      
`;

const COMMANDS_HELP = [
  { cmd: "help", desc: "List all available terminal commands" },
  { cmd: "matrix", desc: "Launch full-screen Matrix digital rain (ESC to quit)" },
  { cmd: "hack", desc: "Run simulated Hollywood cyber intrusion sequence" },
  { cmd: "events", desc: "Display official Coding Junction events archive & schedule" },
  { cmd: "team [filter]", desc: "Meet club team: 'team', 'team pres', 'team gen4', 'team alumni'" },
  { cmd: "verify <id>", desc: "Verify official credential directly in shell" },
  { cmd: "projects", desc: "Browse member project showcase on /Projects" },
  { cmd: "quote", desc: "Print an inspiring programmer / hacker quote" },
  { cmd: "ascii", desc: "Display the official Coding Junction ASCII logo" },
  { cmd: "socials", desc: "Show official community links & handles" },
  { cmd: "theme <color>", desc: "Change theme: matrix, cyber, amber, classic" },
  { cmd: "audio", desc: "Toggle terminal acoustic feedback on/off" },
  { cmd: "sudo", desc: "Attempt superuser authentication" },
  { cmd: "clear", desc: "Clear terminal buffer" },
  { cmd: "exit", desc: "Close the terminal" },
];

const QUOTES = [
  "\"Talk is cheap. Show me the code.\" — Linus Torvalds",
  "\"Programs must be written for people to read, and only incidentally for machines to execute.\" — Harold Abelson",
  "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" — Martin Fowler",
  "\"First, solve the problem. Then, write the code.\" — John Johnson",
  "\"Simplicity is prerequisite for reliability.\" — Edsger W. Dijkstra",
  "\"Code is like humor. When you have to explain it, it’s bad.\" — Cory House",
];

// Official Sanity events database record
const OFFICIAL_EVENTS = [
  {
    title: "Coding Junction Induction Event",
    date: "November 17, 2022",
    location: "University Institute of Technology, Burdwan University",
    status: "Completed",
    category: "Club Inauguration & Welcome",
  },
  {
    title: "Sparks Contest",
    date: "November 24, 2022",
    location: "University Institute of Technology, Burdwan University",
    status: "Completed",
    category: "Algorithmic & Competitive Coding Contest",
  },
  {
    title: "CJ Lab Assessment",
    date: "June 20, 2025",
    location: "Online / UIT Computer Labs",
    status: "Completed",
    category: "Technical Skill & Logic Evaluation",
  },
  {
    title: "Coding Junction Farewell 2025",
    date: "July 10, 2025",
    location: "University Institute of Technology, Burdwan University",
    status: "Completed",
    category: "Annual Senior Honors & Send-off",
  },
];

export default function CjTerminal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<"matrix" | "cyber" | "amber" | "classic">("matrix");
  const [isMatrixActive, setIsMatrixActive] = useState(false);

  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: "init-1",
      type: "ascii",
      content: <pre className="font-mono text-[9px] sm:text-xs leading-tight text-emerald-400 select-none whitespace-pre overflow-x-auto no-scrollbar">{CJ_ASCII}</pre>,
    },
    {
      id: "init-2",
      type: "output",
      content: (
        <div className="space-y-1 text-xs font-mono text-zinc-300">
          <p>
            Welcome to <span className="text-emerald-400 font-bold">Coding Junction Interactive Shell (v2.4.0)</span>
          </p>
          <p className="text-zinc-500 text-[11px]">
            Official Technical Community • University Institute of Technology (UIT), The University of Burdwan.
          </p>
          <p className="text-zinc-400 text-[11px] pt-1">
            Type <span className="text-amber-400 font-bold">&apos;help&apos;</span> to explore commands, <span className="text-emerald-400 font-bold">&apos;team&apos;</span> to see club leadership, or <span className="text-cyan-400 font-bold">&apos;matrix&apos;</span> for cyber rain.
          </p>
        </div>
      ),
    },
  ]);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle synth click / beep
  const playBeep = (freq = 800, type: OscillatorType = "sine", duration = 0.04) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  // Global hotkey & event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "`" || e.key === "~")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        if (isMatrixActive) {
          setIsMatrixActive(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("cj:open-terminal", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("cj:open-terminal", handleCustomOpen);
    };
  }, [isMatrixActive, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Execute terminal command
  const handleCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    playBeep(950, "sine", 0.03);

    // Save to history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const [cmd, ...args] = trimmed.split(" ");
    const lowerCmd = cmd.toLowerCase();

    // Push input row
    const inputItem: HistoryItem = {
      id: Math.random().toString(36),
      type: "input",
      content: (
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-emerald-400 font-bold">visitor@cj:~$</span>
          <span className="text-zinc-100">{trimmed}</span>
        </div>
      ),
    };

    let outputItem: HistoryItem | null = null;

    switch (lowerCmd) {
      case "help":
      case "commands":
        outputItem = {
          id: Math.random().toString(36),
          type: "output",
          content: (
            <div className="space-y-2 py-1 font-mono text-xs">
              <p className="text-amber-400 font-bold border-b border-zinc-800 pb-1">AVAILABLE COMMANDS</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                {COMMANDS_HELP.map((c) => (
                  <div key={c.cmd} className="flex items-baseline gap-2">
                    <span className="text-emerald-400 font-bold min-w-[110px]">{c.cmd}</span>
                    <span className="text-zinc-400 text-[11px]">{c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        };
        break;

      case "matrix":
        setIsMatrixActive(true);
        outputItem = {
          id: Math.random().toString(36),
          type: "output",
          content: (
            <p className="text-xs font-mono text-emerald-400 animate-pulse">
              [+] Initializing Neural Digital Rain... Press ESC or click anywhere to exit.
            </p>
          ),
        };
        break;

      case "hack":
        playBeep(300, "sawtooth", 0.3);
        outputItem = {
          id: Math.random().toString(36),
          type: "output",
          content: <HackSimulation onFinish={() => playBeep(1200, "triangle", 0.2)} />,
        };
        break;

      case "events":
        outputItem = {
          id: Math.random().toString(36),
          type: "output",
          content: (
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                <span className="text-cyan-400 font-bold">CODING JUNCTION OFFICIAL EVENTS ARCHIVE</span>
                <span className="text-[10px] text-zinc-500 font-mono">Sanity CMS Verified</span>
              </div>
              <div className="space-y-1.5 text-zinc-300">
                {OFFICIAL_EVENTS.map((ev, i) => (
                  <div key={i} className="p-2.5 rounded bg-white/[0.03] border border-white/[0.06] space-y-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <p className="text-emerald-400 font-bold">{ev.title}</p>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {ev.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      📅 {ev.date} • 📍 {ev.location}
                    </p>
                    <p className="text-[10px] text-zinc-500">{ev.category}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-zinc-400 pt-1">
                Type <span className="text-emerald-400 font-bold">&apos;goto events&apos;</span> to view official photos and gallery.
              </p>
            </div>
          ),
        };
        break;

      case "team": {
        const sub = args[0]?.toLowerCase();
        const allMembers = teamJson.teamArray;

        let filtered = allMembers.filter((m) => m.gen === "p");
        let headerLabel = "PRESIDENTS & LEADERSHIP • CODING JUNCTION";

        if (sub === "gen4" || sub === "4") {
          filtered = allMembers.filter((m) => m.gen === "4");
          headerLabel = "GEN 4 CORE WORKING GROUP • CODING JUNCTION";
        } else if (sub === "gen3" || sub === "3") {
          filtered = allMembers.filter((m) => m.gen === "3");
          headerLabel = "GEN 3 COORDINATORS • CODING JUNCTION";
        } else if (sub === "gen2" || sub === "2") {
          filtered = allMembers.filter((m) => m.gen === "2");
          headerLabel = "GEN 2 DEVELOPERS • CODING JUNCTION";
        } else if (sub === "alumni" || sub === "gen1" || sub === "1" || sub === "a") {
          filtered = allMembers.filter((m) => m.gen === "1" || m.gen === "a");
          headerLabel = "FOUNDING BATCH & ALUMNI • CODING JUNCTION";
        } else if (sub === "all") {
          filtered = allMembers;
          headerLabel = "ALL ACTIVE MEMBERS & ALUMNI • CODING JUNCTION";
        }

        outputItem = {
          id: Math.random().toString(36),
          type: "output",
          content: (
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
                <span className="text-amber-400 font-bold">{headerLabel}</span>
                <span className="text-[10px] text-zinc-500 font-mono">Total: {filtered.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
                {filtered.map((member, i) => (
                  <div key={i} className="p-2 rounded bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-emerald-400 font-bold">{member.name.trim()}</p>
                    <p className="text-[11px] text-zinc-400">{member.role || "Core Member"}</p>
                    {member.gen === "p" && (
                      <span className="inline-block mt-1 text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25">
                        President
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 pt-1">
                Filters: <span className="text-zinc-300">&apos;team pres&apos;</span>, <span className="text-zinc-300">&apos;team gen4&apos;</span>, <span className="text-zinc-300">&apos;team gen3&apos;</span>, <span className="text-zinc-300">&apos;team gen2&apos;</span>, <span className="text-zinc-300">&apos;team alumni&apos;</span>
              </p>
            </div>
          ),
        };
        break;
      }

      case "verify": {
        const certId = args[0];
        if (!certId) {
          outputItem = {
            id: Math.random().toString(36),
            type: "error",
            content: (
              <p className="text-xs font-mono text-rose-400">
                Usage: verify &lt;CREDENTIAL_ID&gt; (e.g. verify CJ-CERT-...)
              </p>
            ),
          };
        } else {
          outputItem = {
            id: Math.random().toString(36),
            type: "output",
            content: <TerminalVerifier certId={certId} />,
          };
        }
        break;
      }

      case "projects":
        outputItem = {
          id: Math.random().toString(36),
          type: "output",
          content: (
            <div className="space-y-2 font-mono text-xs">
              <p className="text-purple-400 font-bold">COMMUNITY PROJECT SHOWCASE</p>
              <p className="text-zinc-300">
                Coding Junction members build real web apps, mobile solutions, AI systems, and dev tools.
              </p>
              <p className="text-zinc-300">
                All approved projects are showcased live on <span className="text-emerald-400 font-bold">/Projects</span>.
              </p>
              <p className="text-[11px] text-zinc-500 pt-1">
                Type <span className="text-emerald-400">&apos;goto projects&apos;</span> to visit the public project wall, or submit your repo from the Dashboard.
              </p>
            </div>
          ),
        };
        break;

      case "quote": {
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        outputItem = {
          id: Math.random().toString(36),
          type: "output",
          content: <p className="text-xs font-mono text-amber-300 italic py-1">{randomQuote}</p>,
        };
        break;
      }

      case "ascii":
        outputItem = {
          id: Math.random().toString(36),
          type: "ascii",
          content: <pre className="font-mono text-[9px] sm:text-xs leading-tight text-emerald-400 select-none whitespace-pre overflow-x-auto no-scrollbar">{CJ_ASCII}</pre>,
        };
        break;

      case "socials":
        outputItem = {
          id: Math.random().toString(36),
          type: "output",
          content: (
            <div className="space-y-1 font-mono text-xs">
              <p className="text-cyan-400 font-bold">OFFICIAL COMMUNITY LINKS</p>
              <p className="text-zinc-300">GitHub: <a href="https://github.com/Coding-Junction" target="_blank" rel="noreferrer" className="text-emerald-400 underline">github.com/Coding-Junction</a></p>
              <p className="text-zinc-300">LinkedIn: <a href="https://linkedin.com/company/coding-junction" target="_blank" rel="noreferrer" className="text-emerald-400 underline">linkedin.com/company/coding-junction</a></p>
              <p className="text-zinc-300">Instagram: <a href="https://instagram.com/codingjunction_uitbu" target="_blank" rel="noreferrer" className="text-emerald-400 underline">@codingjunction_uitbu</a></p>
            </div>
          ),
        };
        break;

      case "theme": {
        const targetTheme = args[0]?.toLowerCase();
        if (["matrix", "cyber", "amber", "classic"].includes(targetTheme)) {
          setTheme(targetTheme as typeof theme);
          outputItem = {
            id: Math.random().toString(36),
            type: "output",
            content: <p className="text-xs font-mono text-emerald-400">[✓] Terminal color scheme changed to: {targetTheme}</p>,
          };
        } else {
          outputItem = {
            id: Math.random().toString(36),
            type: "error",
            content: <p className="text-xs font-mono text-rose-400">Available themes: matrix, cyber, amber, classic</p>,
          };
        }
        break;
      }

      case "audio":
        setSoundEnabled((prev) => !prev);
        outputItem = {
          id: Math.random().toString(36),
          type: "output",
          content: <p className="text-xs font-mono text-amber-400">Acoustic feedback toggled {soundEnabled ? "OFF" : "ON"}.</p>,
        };
        break;

      case "goto": {
        const dest = args[0]?.toLowerCase();
        if (dest === "events") router.push("/Events");
        else if (dest === "projects") router.push("/Projects");
        else if (dest === "blog") router.push("/Blog");
        else if (dest === "verify") router.push("/verify");
        else if (dest === "dashboard") router.push("/Dashboard");
        else router.push("/");
        outputItem = {
          id: Math.random().toString(36),
          type: "output",
          content: <p className="text-xs font-mono text-cyan-400">Navigating to /{dest || ""}...</p>,
        };
        break;
      }

      case "sudo":
        playBeep(200, "sawtooth", 0.4);
        outputItem = {
          id: Math.random().toString(36),
          type: "error",
          content: (
            <p className="text-xs font-mono text-rose-400">
              [!] Permission Denied: User &apos;visitor&apos; is not in the sudoers file. This incident has been logged and reported to Aritra Konar &amp; Krittika Biswas. 😉
            </p>
          ),
        };
        break;

      case "clear":
      case "cls":
        setHistory([]);
        setInputVal("");
        return;

      case "exit":
      case "quit":
        setIsOpen(false);
        setInputVal("");
        return;

      default:
        playBeep(250, "sawtooth", 0.1);
        outputItem = {
          id: Math.random().toString(36),
          type: "error",
          content: (
            <p className="text-xs font-mono text-rose-400">
              Command not found: &apos;{trimmed}&apos;. Type <span className="text-amber-400 font-bold">&apos;help&apos;</span> for available commands.
            </p>
          ),
        };
        break;
    }

    setHistory((prev) => [...prev, inputItem, ...(outputItem ? [outputItem] : [])]);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex + 1 < commandHistory.length) {
        setHistoryIndex(historyIndex + 1);
        setInputVal(commandHistory[historyIndex + 1]);
      } else {
        setHistoryIndex(-1);
        setInputVal("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;
      const matched = COMMANDS_HELP.find((c) => c.cmd.startsWith(current));
      if (matched) {
        setInputVal(matched.cmd.split(" ")[0]);
      }
    }
  };

  // Color theme palettes
  const themeClasses = {
    matrix: "border-emerald-500/30 text-emerald-400 bg-black/95 selection:bg-emerald-500/30",
    cyber: "border-cyan-500/30 text-cyan-300 bg-[#070b19]/95 selection:bg-cyan-500/30",
    amber: "border-amber-500/30 text-amber-400 bg-[#120e06]/95 selection:bg-amber-500/30",
    classic: "border-zinc-500/30 text-zinc-100 bg-[#0c0d14]/95 selection:bg-zinc-500/30",
  }[theme];

  return (
    <>
      {/* ─── Full-Screen Matrix Digital Rain Mode ─── */}
      <AnimatePresence>
        {isMatrixActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black cursor-pointer overflow-hidden"
            onClick={() => setIsMatrixActive(false)}
          >
            <MatrixRainCanvas />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center gap-2 backdrop-blur-md pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>THE MATRIX HAS YOU • CLICK OR PRESS ESC TO EXIT</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Centered Terminal Window ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[9995] bg-black/60 backdrop-blur-sm print:hidden print-hidden no-print"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: "-48%", x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: "-48%", x: "-50%" }}
              transition={{ duration: 0.2 }}
              className={`fixed left-1/2 top-1/2 z-[9999] shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden border ${themeClasses} ${
                isMaximized
                  ? "inset-2 sm:inset-6 !translate-x-0 !translate-y-0 !left-auto !top-auto !w-auto !h-auto rounded-2xl"
                  : "w-[92vw] sm:w-[720px] max-w-[760px] h-[520px] max-h-[85vh] rounded-2xl"
              }`}
            >
              {/* Window Title Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-black/40 select-none">
                <div className="flex items-center gap-2">
                  {/* Traffic lights */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors cursor-pointer"
                    title="Close"
                  />
                  <button
                    onClick={() => setIsMaximized((prev) => !prev)}
                    className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer"
                    title="Minimize / Restore"
                  />
                  <button
                    onClick={() => setIsMaximized((prev) => !prev)}
                    className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer"
                    title="Maximize"
                  />
                  <div className="ml-3 flex items-center gap-1.5 text-xs font-mono text-zinc-300">
                    <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>coding-junction@uit: ~ (zsh)</span>
                  </div>
                </div>

                {/* Title bar tools */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled((prev) => !prev)}
                    className="p-1 rounded hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title={soundEnabled ? "Mute audio" : "Enable audio"}
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setIsMaximized((prev) => !prev)}
                    className="p-1 rounded hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Terminal Body */}
              <div
                className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs scrollbar-thin scrollbar-thumb-white/10"
                onClick={() => inputRef.current?.focus()}
              >
                {history.map((item) => (
                  <div key={item.id} className="leading-relaxed">
                    {item.content}
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>

              {/* Command Input Prompt Bar */}
              <div className="p-3 border-t border-white/[0.08] bg-black/50 flex items-center gap-2 font-mono text-xs">
                <span className="text-emerald-400 font-bold flex-shrink-0">visitor@cj:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    playBeep(1100, "sine", 0.015);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type 'help', 'events', 'team', 'matrix', 'hack'..."
                  className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 font-mono text-xs caret-emerald-400"
                  autoFocus
                />
                <span className="text-[10px] text-zinc-600 font-mono hidden sm:inline">TAB: autocomplete</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Real-Time In-Terminal Certificate Verifier ───
function TerminalVerifier({ certId }: { certId: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/certificates/verify?id=${encodeURIComponent(certId)}`);
        const json = await res.json();
        if (!isMounted) return;
        if (!res.ok || !json.valid) {
          setError(json.error || "Credential not found in registry.");
        } else {
          setData(json.certificate);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to verify credential.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [certId]);

  if (loading) {
    return <p className="text-xs font-mono text-amber-400 animate-pulse">[~] Querying Coding Junction Cryptographic Ledger for ID: {certId}...</p>;
  }

  if (error) {
    return (
      <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs space-y-1">
        <p className="font-bold">[✗] VERIFICATION REJECTED</p>
        <p className="text-[11px] text-zinc-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-1.5 text-zinc-200">
      <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-emerald-500/20 pb-1">
        <span>[✓] OFFICIALLY VERIFIED CREDENTIAL</span>
        <span>{data?.id}</span>
      </div>
      <p><span className="text-zinc-400">Recipient:</span> <strong className="text-white">{data?.studentName}</strong></p>
      <p><span className="text-zinc-400">Event:</span> {data?.eventName}</p>
      <p><span className="text-zinc-400">Issuer:</span> {data?.issuer || "Coding Junction Club"}</p>
      <p><span className="text-zinc-400">Status:</span> <span className="text-emerald-400 font-semibold">{data?.status}</span></p>
    </div>
  );
}

// ─── Hollywood Hacker Sequence Animation ───
function HackSimulation({ onFinish }: { onFinish?: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const sequences = [
      "[*] Resolving gateway: proxy.uit-burdwan.edu.in:8080...",
      "[*] Initiating handshake with Coding Junction core...",
      "[*] Decrypting SHA-512 club cryptographic ledger...",
      "[*] Querying Sanity CMS event nodes...",
      "[*] Synchronizing UIT developer registry...",
      "[!] Authenticating executive protocols: Aritra Konar & Krittika Biswas...",
      "[+] Handshake acknowledged. Payload delivered successfully.",
      "[✓] ACCESS GRANTED: WELCOME TO CODING JUNCTION ROOT SHELL.",
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < sequences.length) {
        const line = sequences[current];
        current++;
        setLogs((prev) => [...prev, line]);
      } else {
        clearInterval(interval);
        setDone(true);
        onFinish?.();
      }
    }, 280);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1 font-mono text-xs py-1">
      {logs.map((log, i) => (
        <p
          key={i}
          className={
            log.startsWith("[!]")
              ? "text-amber-400 font-bold"
              : log.startsWith("[✓]")
              ? "text-emerald-400 font-bold text-sm"
              : "text-zinc-300"
          }
        >
          {log}
        </p>
      ))}
      {!done && <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse align-middle" />}
    </div>
  );
}

// ─── Fullscreen Matrix Digital Rain Canvas ───
function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF<>/*{}[]=+#~";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
