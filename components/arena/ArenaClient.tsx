"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  RotateCcw,
  Trophy,
  Timer,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  Code2,
  Sparkles,
  ArrowRight,
  Flame,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface TestCase {
  input: any[];
  expected: any;
  label: string;
}

interface Challenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  description: string;
  starterCode: string;
  fnName: string;
  hints: string[];
  testCases: TestCase[];
}

const CHALLENGES: Challenge[] = [
  {
    id: "two-sum",
    title: "1. Two Sum (Target Pair)",
    difficulty: "Easy",
    category: "Arrays & HashMaps",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume each input would have exactly one solution, and you may not use the same element twice.",
    fnName: "twoSum",
    hints: [
      "Try using a hash map to store complements (target - num).",
      "Look up if target - nums[i] is already in your map as you iterate.",
    ],
    starterCode: `function twoSum(nums, target) {
  // Your solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], label: "nums = [2,7,11,15], target = 9" },
      { input: [[3, 2, 4], 6], expected: [1, 2], label: "nums = [3,2,4], target = 6" },
      { input: [[3, 3], 6], expected: [0, 1], label: "nums = [3,3], target = 6" },
    ],
  },
  {
    id: "is-palindrome",
    title: "2. Valid Palindrome",
    difficulty: "Easy",
    category: "String Manipulation",
    description:
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Return `true` if it is a palindrome, or `false` otherwise.",
    fnName: "isPalindrome",
    hints: [
      "Sanitize the string with a regex: s.toLowerCase().replace(/[^a-z0-9]/g, '')",
      "Compare the cleaned string with its reverse: cleaned === cleaned.split('').reverse().join('')",
    ],
    starterCode: `function isPalindrome(s) {
  // Return true if s is a palindrome after sanitizing
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
    testCases: [
      { input: ["A man, a plan, a canal: Panama"], expected: true, label: "s = 'A man, a plan, a canal: Panama'" },
      { input: ["race a car"], expected: false, label: "s = 'race a car'" },
      { input: [" "], expected: true, label: "s = ' '" },
      { input: ["0P"], expected: false, label: "s = '0P'" },
    ],
  },
  {
    id: "valid-parentheses",
    title: "3. Valid Parentheses Stack",
    difficulty: "Medium",
    category: "Stacks & Parsing",
    description:
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
    fnName: "isValid",
    hints: [
      "Use a stack (an array). Push opening brackets.",
      "When encountering a closing bracket, pop the stack and check if it matches.",
    ],
    starterCode: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
    testCases: [
      { input: ["()[]{}"], expected: true, label: "s = '()[]{}'" },
      { input: ["(]"], expected: false, label: "s = '(]'" },
      { input: ["([{}])"], expected: true, label: "s = '([{}])'" },
      { input: ["((("], expected: false, label: "s = '((('" },
    ],
  },
  {
    id: "chunk-array",
    title: "4. Array Chunker",
    difficulty: "Easy",
    category: "Data Structures",
    description:
      "Given an array `arr` and a chunk size `size`, return a chunked array. A chunked array contains the original elements in sub-arrays each of length `size`. The length of the last sub-array may be less than `size` if `arr.length` is not evenly divisible.",
    fnName: "chunk",
    hints: [
      "Use a loop incrementing by `size`: for (let i = 0; i < arr.length; i += size)",
      "Slice segments: arr.slice(i, i + size)",
    ],
    starterCode: `function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}`,
    testCases: [
      { input: [[1, 2, 3, 4, 5], 1], expected: [[1], [2], [3], [4], [5]], label: "arr = [1,2,3,4,5], size = 1" },
      { input: [[1, 9, 6, 3, 2], 3], expected: [[1, 9, 6], [3, 2]], label: "arr = [1,9,6,3,2], size = 3" },
      { input: [[], 2], expected: [], label: "arr = [], size = 2" },
    ],
  },
  {
    id: "fibonacci",
    title: "5. N-th Fibonacci Number",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description:
      "The Fibonacci numbers are defined by: F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1. Given `n`, calculate F(n). Must run in O(n) time or better to pass edge cases.",
    fnName: "fib",
    hints: [
      "Avoid naive recursion (which is O(2^n)). Use iterative dynamic programming with two variables.",
    ],
    starterCode: `function fib(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}`,
    testCases: [
      { input: [2], expected: 1, label: "n = 2" },
      { input: [3], expected: 2, label: "n = 3" },
      { input: [4], expected: 3, label: "n = 4" },
      { input: [10], expected: 55, label: "n = 10" },
    ],
  },
];

interface TestResult {
  label: string;
  passed: boolean;
  actual?: any;
  expected: any;
  error?: string;
  durationMs: number;
}

export default function ArenaClient() {
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const activeChallenge = CHALLENGES[activeChallengeIndex];

  const [code, setCode] = useState(activeChallenge.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [allPassed, setAllPassed] = useState(false);

  // Timer stopwatch
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound FX toggle
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Brag share
  const [copiedShare, setCopiedShare] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Confetti trigger canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync code when challenge changes
  useEffect(() => {
    setCode(activeChallenge.starterCode);
    setTestResults(null);
    setAllPassed(false);
    setShowHint(false);
    resetTimer();
  }, [activeChallengeIndex]);

  // Audio tone helper
  const playBeep = (freq = 880, type: OscillatorType = "sine", duration = 0.05) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  const playSuccessChord = () => {
    if (!soundEnabled) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => playBeep(freq, "triangle", 0.3), idx * 80);
    });
  };

  // Timer controls
  const startTimer = () => {
    if (!timerRunning) {
      setTimerRunning(true);
      const startTime = Date.now() - elapsedMs;
      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTime);
      }, 100);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setElapsedMs(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Format stopwatch: 01:24.5s
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${tenths}s`;
  };

  // Confetti Particle Physics
  const launchConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#38bdf8"];
    const particles = Array.from({ length: 120 }, () => ({
      x: canvas.width / 2,
      y: canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.vRot;
        p.alpha -= 0.012; // fade

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    render();
  };

  // Run Test Suite
  const handleRunCode = () => {
    setIsRunning(true);
    playBeep(600, "sine", 0.03);

    // If timer wasn't running, start it
    if (!timerRunning && elapsedMs === 0) {
      startTimer();
    }

    setTimeout(() => {
      try {
        // Construct sandbox evaluation
        // eslint-disable-next-line no-new-func
        const evaluatedFn = new Function(`
          ${code}
          if (typeof ${activeChallenge.fnName} !== 'function') {
            throw new Error("Function '${activeChallenge.fnName}' is not defined.");
          }
          return ${activeChallenge.fnName};
        `)();

        const results: TestResult[] = [];
        let allPassedAccumulator = true;

        for (const tc of activeChallenge.testCases) {
          const t0 = performance.now();
          let actualVal: any;
          let passed = false;
          let errorMsg = "";

          try {
            // Deep clone input args to prevent mutations
            const clonedArgs = JSON.parse(JSON.stringify(tc.input));
            actualVal = evaluatedFn(...clonedArgs);
            const actualStr = JSON.stringify(actualVal);
            const expectedStr = JSON.stringify(tc.expected);
            passed = actualStr === expectedStr;
          } catch (err: any) {
            passed = false;
            errorMsg = err.message || "Runtime Exception";
          }
          const t1 = performance.now();

          if (!passed) allPassedAccumulator = false;

          results.push({
            label: tc.label,
            passed,
            actual: actualVal,
            expected: tc.expected,
            error: errorMsg,
            durationMs: Math.max(0.1, Number((t1 - t0).toFixed(2))),
          });
        }

        setTestResults(results);
        setAllPassed(allPassedAccumulator);

        if (allPassedAccumulator) {
          stopTimer();
          playSuccessChord();
          launchConfetti();
        } else {
          playBeep(220, "sawtooth", 0.15);
        }
      } catch (compileErr: any) {
        setAllPassed(false);
        setTestResults([
          {
            label: "Compilation & Syntax",
            passed: false,
            expected: "Valid JavaScript",
            error: compileErr.message || "Syntax Error in code buffer.",
            durationMs: 0,
          },
        ]);
        playBeep(180, "sawtooth", 0.2);
      } finally {
        setIsRunning(false);
      }
    }, 150);
  };

  const handleShareResult = () => {
    if (typeof window !== "undefined") {
      const text = `⚡ I just solved "${activeChallenge.title}" in ${formatTime(elapsedMs)} on Coding Junction Code Arena! Can you beat my time? https://coding-junction.in/Arena`;
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Confetti Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-black/[0.08] dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Competitive Arena • Coding Junction
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Code{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Arena
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Test your algorithmic reflexes against the clock. Solve live coding duels, pass test suites, and earn community speed bragging rights.
          </p>
        </div>

        {/* Global Sound & Timer Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#0c0d14] border border-black/[0.08] dark:border-white/[0.08] shadow-sm font-mono text-sm">
            <Timer className={`w-4 h-4 ${timerRunning ? "text-amber-500 animate-pulse" : "text-muted-foreground"}`} />
            <span className="font-bold text-foreground dark:text-white">{formatTime(elapsedMs)}</span>
          </div>

          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#0c0d14] border border-black/[0.08] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title={soundEnabled ? "Mute Arena FX" : "Enable Arena FX"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Challenge Selector Pills */}
      <div className="flex items-center gap-2 py-6 overflow-x-auto no-scrollbar">
        {CHALLENGES.map((ch, idx) => (
          <button
            key={ch.id}
            onClick={() => setActiveChallengeIndex(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
              activeChallengeIndex === idx
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-500/50 shadow-md shadow-indigo-500/20"
                : "bg-white/50 dark:bg-[#0c0d14]/80 border-black/[0.08] dark:border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
            }`}
          >
            <span className="font-mono">{idx + 1}.</span>
            <span>{ch.title.split(".")[1]?.trim() || ch.title}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                ch.difficulty === "Easy"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : ch.difficulty === "Medium"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {ch.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Arena Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Statement & Hints */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c0d14] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-indigo-500 uppercase tracking-wider">
                {activeChallenge.category}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  activeChallenge.difficulty === "Easy"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                    : activeChallenge.difficulty === "Medium"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25"
                }`}
              >
                {activeChallenge.difficulty}
              </span>
            </div>

            <h2 className="text-xl font-bold text-foreground dark:text-white">
              {activeChallenge.title}
            </h2>

            <div className="text-xs md:text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>{activeChallenge.description}</p>
            </div>

            {/* Test Case Examples Preview */}
            <div className="space-y-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Sample Test Cases:
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {activeChallenge.testCases.slice(0, 2).map((tc, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] text-zinc-300">
                    <p className="text-zinc-400 text-[11px] font-semibold">{tc.label}</p>
                    <p className="text-emerald-400 text-[11px] mt-0.5">Expected: {JSON.stringify(tc.expected)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint Accordion */}
            <div className="pt-2">
              <button
                onClick={() => setShowHint((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-semibold cursor-pointer transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? "Hide Algorithm Hints" : "Need a Hint?"}</span>
              </button>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 space-y-1"
                >
                  {activeChallenge.hints.map((h, i) => (
                    <p key={i}>• {h}</p>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Brag / Victory Banner if all passed */}
          <AnimatePresence>
            {allPassed && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/10 p-6 shadow-xl text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground dark:text-white">
                  Duel Conquered! ⚡
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  All test cases passed in <span className="text-emerald-400 font-bold">{formatTime(elapsedMs)}</span>.
                </p>
                <button
                  onClick={handleShareResult}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedShare ? "Brag Copied to Clipboard!" : "Copy Brag to Share"}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Code Editor & Execution Console */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-[#0c0d14] overflow-hidden shadow-2xl flex flex-col">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-black/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-zinc-400 ml-2">solution.js</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCode(activeChallenge.starterCode);
                    playBeep(440, "sine", 0.02);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                  title="Reset to starter template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-mono font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? "animate-spin" : ""}`} />
                  <span>{isRunning ? "Executing..." : "Run Tests (Ctrl+Enter)"}</span>
                </button>
              </div>
            </div>

            {/* Code Textarea with Tab Support */}
            <div className="relative p-4 font-mono text-xs sm:text-sm">
              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (!timerRunning && elapsedMs === 0) startTimer();
                }}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleRunCode();
                  } else if (e.key === "Tab") {
                    e.preventDefault();
                    const target = e.target as HTMLTextAreaElement;
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    const newCode = code.substring(0, start) + "  " + code.substring(end);
                    setCode(newCode);
                    setTimeout(() => {
                      target.selectionStart = target.selectionEnd = start + 2;
                    }, 0);
                  }
                }}
                spellCheck={false}
                rows={14}
                className="w-full bg-transparent text-emerald-400 dark:text-emerald-300 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed caret-white"
              />
            </div>

            {/* Test Results Output Console */}
            <div className="border-t border-white/[0.08] bg-black/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                  Test Execution Console
                </span>
                {testResults && (
                  <span
                    className={`text-xs font-mono font-bold ${
                      allPassed ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {testResults.filter((r) => r.passed).length} / {testResults.length} Passed
                  </span>
                )}
              </div>

              {!testResults ? (
                <div className="p-4 rounded-xl border border-dashed border-white/[0.08] text-center text-xs text-zinc-500 font-mono">
                  Click &quot;Run Tests&quot; or press Ctrl+Enter to execute test suite.
                </div>
              ) : (
                <div className="space-y-2">
                  {testResults.map((tr, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border font-mono text-xs space-y-1 transition-all ${
                        tr.passed
                          ? "bg-emerald-500/5 border-emerald-500/20 text-zinc-300"
                          : "bg-rose-500/5 border-rose-500/20 text-rose-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold">
                          {tr.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <span>Test Case #{idx + 1}: {tr.label}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-normal">
                          {tr.durationMs}ms
                        </span>
                      </div>

                      {tr.error ? (
                        <p className="text-[11px] text-rose-400 pl-6">{tr.error}</p>
                      ) : !tr.passed ? (
                        <div className="pl-6 text-[11px] text-zinc-400 space-y-0.5">
                          <p>Expected: <span className="text-emerald-400">{JSON.stringify(tr.expected)}</span></p>
                          <p>Received: <span className="text-rose-400">{JSON.stringify(tr.actual)}</span></p>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
