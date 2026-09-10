"use client";

import { useRef, useState } from "react";
import { motion, Variants, useMotionValue, useAnimationFrame } from "motion/react";
import { Circle, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";


function HeroGeometric({
    badge = "Design Collective",
    title1 = "WE ARE THE",
    title2 = "CODING JUNCTION",
}: {
    badge?: string;
    title1?: string;
    title2?: string;
}) {
    const fadeUpVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    // Motion values synced to video playback time
    const orb1Y = useMotionValue(0);
    const orb1Opacity = useMotionValue(0.5);
    const orb2Y = useMotionValue(0);
    const orb2Opacity = useMotionValue(0.4);
    const orb3Y = useMotionValue(0);
    const orb3Scale = useMotionValue(1);
    const sym1Y = useMotionValue(0);
    const sym1Rotate = useMotionValue(0);
    const sym1Opacity = useMotionValue(0.12);
    const sym2Y = useMotionValue(0);
    const sym2Opacity = useMotionValue(0.1);
    const orb4Y = useMotionValue(0);
    const orb4Opacity = useMotionValue(0.4);
    const orb5Y = useMotionValue(0);
    const orb5Opacity = useMotionValue(0.5);
    const orb6Y = useMotionValue(0);
    const orb6Scale = useMotionValue(1);
    const sym3Y = useMotionValue(0);
    const sym3Rotate = useMotionValue(0);
    const sym3Opacity = useMotionValue(0.1);
    const sym4Y = useMotionValue(0);
    const sym4Opacity = useMotionValue(0.1);

    useAnimationFrame(() => {
        if (!videoRef.current) return;
        const t = videoRef.current.currentTime;

        // Top orbs - driven by video time
        orb1Y.set(Math.sin(t * 0.8) * 15);
        orb1Opacity.set(0.5 + Math.sin(t * 0.6) * 0.4);

        orb2Y.set(Math.sin(t * 0.65 + 1) * 12);
        orb2Opacity.set(0.4 + Math.sin(t * 0.5 + 1) * 0.4);

        orb3Y.set(Math.sin(t * 0.5 + 2) * 8);
        orb3Scale.set(1 + Math.sin(t * 0.4 + 0.5) * 0.1);

        // Top symbols
        sym1Y.set(Math.sin(t * 0.7) * 10);
        sym1Rotate.set(Math.sin(t * 0.5) * 5);
        sym1Opacity.set(0.12 + Math.sin(t * 0.6) * 0.13);

        sym2Y.set(Math.sin(t * 0.6 + 2) * 8);
        sym2Opacity.set(0.1 + Math.sin(t * 0.5 + 2) * 0.1);

        // Bottom orbs
        orb4Y.set(Math.sin(t * 0.7 + 3) * 10);
        orb4Opacity.set(0.4 + Math.sin(t * 0.55 + 2) * 0.4);

        orb5Y.set(Math.sin(t * 0.8 + 1) * 12);
        orb5Opacity.set(0.5 + Math.sin(t * 0.65 + 0.5) * 0.35);

        orb6Y.set(Math.sin(t * 0.55 + 4) * 8);
        orb6Scale.set(1 + Math.sin(t * 0.45 + 1.5) * 0.15);

        // Bottom symbols
        sym3Y.set(Math.sin(t * 0.6 + 1.5) * 8);
        sym3Rotate.set(Math.sin(t * 0.45 + 1.5) * -3);
        sym3Opacity.set(0.1 + Math.sin(t * 0.55 + 1.5) * 0.12);

        sym4Y.set(Math.sin(t * 0.5 + 3) * 6);
        sym4Opacity.set(0.1 + Math.sin(t * 0.45 + 3) * 0.1);
    });
    return (
        <div className="relative min-h-screen w-full max-w-full flex items-center justify-center overflow-hidden bg-[#030303]">
            {/* Video Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-contain md:object-cover"
                >
                    <source src="/hero-bg.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none" />

            {/* Mobile decorative elements for black bar areas — synced to video time */}
            <div className="absolute inset-0 pointer-events-none md:hidden overflow-hidden">
                {/* Dot grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.20]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "28px 28px",
                    }}
                />

                {/* Top area orbs — driven by video time */}
                <motion.div
                    style={{ y: orb1Y, opacity: orb1Opacity }}
                    className="absolute top-10 right-8 h-32 w-32 rounded-full bg-indigo-500/40 blur-2xl"
                />
                <motion.div
                    style={{ y: orb2Y, opacity: orb2Opacity }}
                    className="absolute top-20 left-4 h-28 w-28 rounded-full bg-rose-500/35 blur-2xl"
                />
                <motion.div
                    style={{ y: orb3Y, scale: orb3Scale }}
                    className="absolute top-6 left-1/2 -translate-x-1/2 h-24 w-24 rounded-full bg-violet-500/25 blur-xl"
                />

                {/* Floating code symbols - top — driven by video time */}
                <motion.span
                    style={{ y: sym1Y, rotate: sym1Rotate, opacity: sym1Opacity }}
                    className="absolute top-16 left-1/2 -translate-x-1/2 text-white text-6xl font-mono select-none"
                >
                    {"</>"}
                </motion.span>
                <motion.span
                    style={{ y: sym2Y, opacity: sym2Opacity }}
                    className="absolute top-28 right-12 text-white text-4xl font-mono select-none"
                >
                    {"//"}
                </motion.span>

                {/* Bottom area orbs — driven by video time */}
                <motion.div
                    style={{ y: orb4Y, opacity: orb4Opacity }}
                    className="absolute bottom-20 left-8 h-32 w-32 rounded-full bg-violet-500/35 blur-2xl"
                />
                <motion.div
                    style={{ y: orb5Y, opacity: orb5Opacity }}
                    className="absolute bottom-12 right-6 h-28 w-28 rounded-full bg-amber-500/35 blur-2xl"
                />
                <motion.div
                    style={{ y: orb6Y, scale: orb6Scale }}
                    className="absolute bottom-28 left-1/2 -translate-x-1/3 h-24 w-24 rounded-full bg-indigo-400/25 blur-xl"
                />

                {/* Floating code symbols - bottom — driven by video time */}
                <motion.span
                    style={{ y: sym3Y, rotate: sym3Rotate, opacity: sym3Opacity }}
                    className="absolute bottom-24 right-1/3 text-white text-5xl font-mono select-none"
                >
                    {"{ }"}
                </motion.span>
                <motion.span
                    style={{ y: sym4Y, opacity: sym4Opacity }}
                    className="absolute bottom-16 left-10 text-white text-3xl font-mono select-none"
                >
                    {"=>"}
                </motion.span>

                {/* Subtle connecting lines */}
                <div className="absolute top-0 left-1/4 w-px h-[25%] bg-gradient-to-b from-transparent via-white/[0.12] to-transparent" />
                <div className="absolute top-0 right-1/3 w-px h-[20%] bg-gradient-to-b from-transparent via-indigo-400/[0.15] to-transparent" />
                <div className="absolute bottom-0 left-1/3 w-px h-[20%] bg-gradient-to-t from-transparent via-white/[0.12] to-transparent" />
                <div className="absolute bottom-0 right-1/4 w-px h-[25%] bg-gradient-to-t from-transparent via-rose-400/[0.15] to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
                    >
                        <Circle className="h-2 w-2 fill-rose-500/80" />
                        <span className="text-sm text-white/60 tracking-wide">
                            {badge}
                        </span>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300"
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
                            University Institute Of Technology, Bardhaman
                        </p>
                    </motion.div>
                    <Button onClick={() => router.push(isSignedIn ? "/Dashboard" : "/sign-in")}>
                        {isSignedIn ? "Go to Dashboard" : "Get Started"}
                    </Button>
                </div>
            </div>

            {/* Subtle gradient edges for blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />

            {/* Mute/Unmute Toggle */}
            <button
                onClick={toggleMute}
                className="absolute bottom-6 right-4 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300 cursor-pointer"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
        </div>
    );
}

export { HeroGeometric }
