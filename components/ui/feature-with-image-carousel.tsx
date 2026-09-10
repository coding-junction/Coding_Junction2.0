"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target, Lightbulb, Users, Rocket } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const placeholderImages = [
  "https://res.cloudinary.com/dneogaofx/image/upload/v1717593096/IMG_20240604_204622_941_nu1lhz.webp",
  "https://res.cloudinary.com/dneogaofx/image/upload/v1717593136/IMG_20240604_204622_981_sptf3n.webp",
  "https://res.cloudinary.com/dneogaofx/image/upload/v1717593238/IMG_20240604_204623_101_lvxkdv.webp",
  "https://res.cloudinary.com/dneogaofx/image/upload/v1729775095/Yellow_Black_Modern_Course_YouTube_Thumbnail_vxyvne.jpg",
];

const missionPoints = [
  {
    icon: Target,
    title: "Bridge the Gap",
    description: "Connect classroom learning with real-world tech skills through hands-on projects.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Lightbulb,
    title: "Nurture Innovation",
    description: "Provide a platform where creative ideas can flourish into impactful projects.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Build Community",
    description: "Foster a culture of peer learning, collaboration, and knowledge sharing.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Rocket,
    title: "Launch Careers",
    description: "Prepare members for the industry through workshops, hackathons, and mentorship.",
    gradient: "from-violet-500 to-purple-500",
  },
];

function Feature() {
  return (
    <section className="w-full max-w-full overflow-hidden px-4 md:px-8 lg:px-16 xl:px-20 py-16 md:py-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        className="text-center mb-12 md:mb-16"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-400 mb-3 font-medium">
          About Us
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white">
          Our{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
            Vision
          </span>
        </h2>
        <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          Building a vibrant community where students learn, create, and innovate together.
        </p>
      </motion.div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Section - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="space-y-6"
          >
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Coding Junction is a college coding club for enthusiasts passionate
              about learning and building with code. We foster a supportive,
              inclusive community where students of all skill levels collaborate
              and grow.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Whether you&apos;re a beginner or experienced coder, join us to
              solve real-world problems and innovate with technology. Together, we
              build the future.
            </p>

            {/* Stats highlights */}
            <div className="flex flex-wrap gap-6 sm:gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-foreground dark:text-white">3+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Years Active</p>
              </div>
              <div className="hidden sm:block w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground dark:text-white">500+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Members</p>
              </div>
              <div className="hidden sm:block w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground dark:text-white">5</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Domains</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/Team"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:from-emerald-500 hover:to-teal-500 transition-all duration-300"
              >
                Meet Our Team
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right Section - Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="w-full max-w-lg mx-auto lg:mx-0"
          >
            <Carousel className="relative" opts={{ loop: true }}>
              <CarouselContent className="flex">
                {placeholderImages.map((image, index) => (
                  <CarouselItem key={index} className="flex-shrink-0 w-full">
                    <div className="group relative rounded-2xl aspect-video overflow-hidden border border-black/[0.08] dark:border-white/[0.08] shadow-lg">
                      <Image
                        src={image}
                        alt={`Coding Junction moment ${index + 1}`}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                <CarouselPrevious className="pointer-events-auto" />
                <CarouselNext className="pointer-events-auto" />
              </div>
            </Carousel>
          </motion.div>
        </div>

        {/* Mission Points Grid */}
        <div className="mt-16 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
              Our{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                Mission
              </span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {missionPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className="group glass-card"
                >
                  <div className="glass-card-inner p-6 md:p-7 flex flex-col items-center text-center gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${point.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="text-base font-semibold text-foreground dark:text-white mb-1">
                        {point.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export { Feature };