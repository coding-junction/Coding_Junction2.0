"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenGlobalSplash');
    
    if (hasSeenSplash) {
      // If they have already seen it, immediately hide it
      setShowSplash(false);
    } else {
      // First visit: hold the splash screen, then hide
      sessionStorage.setItem('hasSeenGlobalSplash', 'true');
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[999999] flex h-screen w-full items-center justify-center bg-white dark:bg-black overflow-hidden"
        >
          {/* Background ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 dark:bg-cyan-500/10 blur-[150px] rounded-full" />

          <div className="relative flex flex-col items-center gap-10 z-10">
            {/* Neon Trace Logo */}
            <div className="relative flex items-center justify-center">
              <div
                className="absolute w-52 h-52 rounded-full border border-cyan-500/20 dark:border-cyan-400/20"
                style={{ animation: 'pulse-ring 3s ease-in-out infinite' }}
              />
              <div
                className="absolute w-64 h-64 rounded-full border border-blue-500/10 dark:border-blue-400/10"
                style={{ animation: 'pulse-ring 3s ease-in-out infinite 0.5s' }}
              />

              <svg
                viewBox="0 0 375 375"
                xmlns="http://www.w3.org/2000/svg"
                className="w-36 h-36 relative z-10"
                aria-label="Coding Junction Logo"
              >
                <path
                  d="M 228.394531 248.652344 L 187.449219 319.515625 L 187.441406 319.523438 L 50.941406 83.324219 L 50.929688 83.3125 L 132.839844 83.324219 L 160.136719 130.550781 L 160.144531 130.5625 L 173.789062 154.175781 L 146.492188 154.175781 L 119.191406 106.9375 L 91.894531 106.9375 L 187.429688 272.265625 L 201.082031 248.640625 L 173.777344 201.414062 L 201.082031 201.414062 Z M 228.375 106.9375 L 242.019531 83.332031 L 242.027344 83.332031 L 242.027344 83.324219 L 160.136719 83.324219 L 173.777344 106.9375 Z M 255.679688 106.9375 L 282.984375 106.9375 L 282.984375 106.945312 L 242.039062 177.789062 L 228.386719 154.175781 L 242.027344 130.5625 L 187.441406 130.5625 L 242.039062 225.039062 L 323.929688 83.324219 L 323.929688 83.3125 L 269.320312 83.324219 Z"
                  className="fill-black/80 dark:fill-white/10 transition-colors duration-300"
                />
                <path
                  d="M 228.394531 248.652344 L 187.449219 319.515625 L 187.441406 319.523438 L 50.941406 83.324219 L 50.929688 83.3125 L 132.839844 83.324219 L 160.136719 130.550781 L 160.144531 130.5625 L 173.789062 154.175781 L 146.492188 154.175781 L 119.191406 106.9375 L 91.894531 106.9375 L 187.429688 272.265625 L 201.082031 248.640625 L 173.777344 201.414062 L 201.082031 201.414062 Z"
                  fill="none"
                  stroke="url(#neonGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 2000,
                    strokeDashoffset: 2000,
                    animation: 'trace-draw 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate',
                    filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.8))',
                  }}
                />
                <path
                  d="M 228.375 106.9375 L 242.019531 83.332031 L 242.027344 83.324219 L 160.136719 83.324219 L 173.777344 106.9375 Z"
                  fill="none"
                  stroke="url(#neonGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 800,
                    strokeDashoffset: 800,
                    animation: 'trace-draw 2.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s infinite alternate',
                    filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.8))',
                  }}
                />
                <path
                  d="M 255.679688 106.9375 L 282.984375 106.9375 L 282.984375 106.945312 L 242.039062 177.789062 L 228.386719 154.175781 L 242.027344 130.5625 L 187.441406 130.5625 L 242.039062 225.039062 L 323.929688 83.324219 L 323.929688 83.3125 L 269.320312 83.324219 Z"
                  fill="none"
                  stroke="url(#neonGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 1500,
                    strokeDashoffset: 1500,
                    animation: 'trace-draw 2.2s cubic-bezier(0.4, 0, 0.2, 1) 0.6s infinite alternate',
                    filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.8))',
                  }}
                />

                <defs>
                  <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Brand text */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-cyan-500 dark:to-cyan-400" />
                <p
                  className="text-xs font-bold tracking-[0.35em] text-gray-500 dark:text-gray-400 uppercase"
                  style={{ animation: 'fade-pulse 2s ease-in-out infinite' }}
                >
                  Coding Junction
                </p>
                <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-cyan-500 dark:to-cyan-400" />
              </div>

              {/* Thin progress bar */}
              <div className="w-40 h-[2px] bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ animation: 'scan-bar 1.8s ease-in-out infinite' }}
                />
              </div>
            </div>
          </div>

          {/* Keyframe definitions */}
          <style>{`
            @keyframes trace-draw {
              0% { stroke-dashoffset: var(--dash-start, 2000); opacity: 0; }
              20% { opacity: 1; }
              80% { opacity: 1; }
              100% { stroke-dashoffset: 0; opacity: 0.9; }
            }
            @keyframes fade-pulse {
              0%, 100% { opacity: 0.5; }
              50% { opacity: 1; }
            }
            @keyframes scan-bar {
              0% { width: 0%; margin-left: 0%; }
              50% { width: 60%; margin-left: 20%; }
              100% { width: 0%; margin-left: 100%; }
            }
            @keyframes pulse-ring {
              0%, 100% { transform: scale(1); opacity: 0.3; }
              50% { transform: scale(1.05); opacity: 0.6; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
