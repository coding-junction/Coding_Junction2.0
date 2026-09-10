"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "motion/react";
import { Handshake, ExternalLink, Mail, Users } from "lucide-react";

interface Partner {
  id: number;
  name: string;
  logo: string;
  website: string;
  description?: string;
  status: 'current' | 'past';
}

const currentPartners: Partner[] = [
  // {
  //   id: 1,
  //   name: "DSU DEVHACK 2.0",
  //   logo: "/Assets/Logo/logoo 1.png",
  //   website: "https://www.dsudevhack2.tech",
  //   description: "DSU DEVHACK 2025 is a national-level hackathon taking place at DSU Harohalli, Bangalore, Karnataka. This event challenges participants to innovate in cutting-edge fields like AI, Machine Learning (ML), Internet of Things (IoT), Blockchain, Cybersecurity, and Cloud computing. The hackathon boasts a substantial prize pool, including a ₹2 lakh cash prize pool and an additional ₹10 lakh-plus worth of prizes.",
  //   status: 'current'
  // },
];

/* ─── Animated Hero (used in CommunityPartners/page.tsx) ─── */
export function CommunityPartnersHero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 dark:from-cyan-500/20 dark:via-blue-500/10 dark:to-indigo-500/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/10 via-transparent to-transparent dark:from-cyan-400/20" />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.8) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 md:pt-40 md:pb-28 relative">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 mb-6"
          >
            <Users className="h-8 w-8 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
          >
            Community{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500">
              Partners
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-base md:text-lg max-w-xl"
          >
            We collaborate with amazing organizations and communities to create meaningful impact in the tech ecosystem.
          </motion.p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full text-background">
          <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,30 1440,30 L1440,60 L0,60 Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function CommunityPartnersClient({ isStandalonePage = false }: { isStandalonePage?: boolean }) {
  const handlePartnerClick = (website: string) => {
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className={`w-full max-w-full overflow-hidden px-4 md:px-8 lg:px-16 xl:px-20 ${isStandalonePage ? 'py-12 md:py-16' : 'py-16 md:py-24'}`}>
      {/* Section Header — only on landing page, hero handles it on standalone page */}
      {!isStandalonePage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-indigo-400 mb-3 font-medium">
            Community Partners
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white">
            Our Trusted{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Partners
            </span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            We collaborate with amazing organizations and communities to create
            meaningful impact in the tech ecosystem.
          </p>
        </motion.div>
      )}

      {/* Partners */}
      <div className="max-w-3xl mx-auto space-y-16">
        {/* Current Partners */}
        <div>
          <div className="flex justify-center mb-8">
            {currentPartners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-full max-w-xl"
              >
                <Card
                  className="group relative cursor-pointer rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0a0a0f] hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-500 overflow-hidden"
                  onClick={() => handlePartnerClick(partner.website)}
                >
                  {/* Hover glow */}
                  <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" />

                  <CardContent className="p-8 md:p-10 text-center relative">
                    {/* Logo */}
                    <div className="mb-6 flex justify-center">
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white dark:bg-white/10 shadow-lg border border-black/5 dark:border-white/10 group-hover:scale-105 transition-transform duration-500">
                        <Image
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          fill
                          className="object-contain p-3"
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <h4 className="text-2xl font-bold text-foreground dark:text-white mb-3">
                      {partner.name}
                    </h4>

                    {/* Description */}
                    {partner.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
                        {partner.description}
                      </p>
                    )}

                    {/* CTA */}
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 px-6 py-2.5 font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePartnerClick(partner.website);
                      }}
                    >
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0a0a0f] p-8 md:p-10 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg mx-auto mb-5">
            <Handshake className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground dark:text-white mb-3">
            Interested in Partnering?
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Join our growing network of community partners and help us build
            a stronger tech ecosystem together.
          </p>
          <Button
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 font-semibold shadow-lg shadow-emerald-500/20"
            onClick={() => window.open('mailto:ranadebsaha@coding-junction.in', '_blank')}
          >
            <Mail className="mr-2 h-4 w-4" />
            Become a Partner
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
