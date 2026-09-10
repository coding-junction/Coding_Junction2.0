"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Riddhiman Das",
    role: "Core Member",
    avatar: "",
    initials: "RD",
    quote:
      "Coding Junction transformed my approach to problem-solving. The mentorship and collaborative environment pushed me to build projects I never thought possible.",
    rating: 5,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Aritra Mondal",
    role: "Web Lead",
    avatar: "",
    initials: "AM",
    quote:
      "The web development workshops here are top-notch. I went from knowing basic HTML to building full-stack apps in just a few months.",
    rating: 5,
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    name: "Sneha Roy",
    role: "AI/ML Lead",
    avatar: "",
    initials: "SR",
    quote:
      "Being part of the AI/ML domain opened doors to research opportunities I didn't even know existed. Best coding community at UIT!",
    rating: 5,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Rahul Sharma",
    role: "App Developer",
    avatar: "",
    initials: "RS",
    quote:
      "The hackathons organized by Coding Junction are incredibly well-managed. I've won two competitions and made lifelong friends here.",
    rating: 5,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    name: "Priya Chatterjee",
    role: "DSA Enthusiast",
    avatar: "",
    initials: "PC",
    quote:
      "The DSA sessions and competitive programming meetups helped me crack my dream internship. Forever grateful to this community.",
    rating: 4,
    gradient: "from-rose-500 to-pink-500",
  },
  {
    name: "Sourav Banerjee",
    role: "Open Source Contributor",
    avatar: "",
    initials: "SB",
    quote:
      "Coding Junction introduced me to open source. The guidance from seniors and the culture of knowledge-sharing is truly unmatched.",
    rating: 5,
    gradient: "from-violet-500 to-purple-500",
  },
];

function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  useEffect(() => {
    if (!api) return;

    setTotalSlides(api.scrollSnapList().length);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", onSelect);

    const interval = setInterval(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        api.scrollTo(0);
      } else {
        api.scrollNext();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-8 md:px-6 lg:px-8 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col gap-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-400 mb-3 font-medium">
              Testimonials
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground dark:text-white">
              What Our{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
                Coders Say
              </span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
              Hear from the members who&apos;ve grown, built, and thrived as
              part of Coding Junction.
            </p>
          </motion.div>

          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Carousel
              setApi={setApi}
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                    key={index}
                  >
                    <div className="group relative h-full rounded-2xl border border-black/[0.06] dark:border-white/[0.06] p-[1px] bg-gradient-to-b from-black/[0.02] dark:from-white/[0.04] to-transparent transition-all duration-500 hover:border-black/[0.12] dark:hover:border-white/[0.12]">
                      <div className="relative flex flex-col justify-between h-full rounded-2xl bg-white dark:bg-[#0a0a0f] p-6 md:p-7 overflow-hidden shadow-sm dark:shadow-none">
                        {/* Hover glow */}
                        <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" />

                        {/* Quote icon */}
                        <Quote className="h-8 w-8 text-indigo-500/30 mb-4 rotate-180" />

                        {/* Stars */}
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Quote text */}
                        <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 dark:text-gray-300 mb-6 flex-1">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>

                        {/* Divider */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent mb-5" />

                        {/* Author */}
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                            <span className="text-white text-xs font-bold tracking-wide">
                              {testimonial.initials}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {testimonial.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    current === index
                      ? "w-8 bg-indigo-500"
                      : "w-2 bg-black/15 hover:bg-black/30 dark:bg-white/20 dark:hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { Testimonials };
