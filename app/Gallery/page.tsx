"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

/* ─── Image Data ─── */
interface GalleryImage {
  src: string;
  category: "all" | "workshops" | "hackathons" | "meetups";
  alt: string;
}

const images: GalleryImage[] = [
  { src: "/Assets/Images/gallery_image.jpg", category: "workshops", alt: "Workshop session" },
  { src: "/Assets/Images/cj9.jpg", category: "hackathons", alt: "Hackathon event" },
  { src: "/Assets/Images/08.jpg", category: "meetups", alt: "Community meetup" },
  { src: "/Assets/Images/cj1.jpg", category: "workshops", alt: "Coding workshop" },
  { src: "/Assets/Images/cj2.jpg", category: "hackathons", alt: "Team collaboration" },
  { src: "/Assets/Images/cj3.jpg", category: "meetups", alt: "Group discussion" },
  { src: "/Assets/Images/cj4.jpg", category: "workshops", alt: "Hands-on session" },
  { src: "/Assets/Images/cj5.jpg", category: "hackathons", alt: "Hackathon winners" },
  { src: "/Assets/Images/cj6.jpg", category: "meetups", alt: "Community gathering" },
  { src: "/Assets/Images/cj7.jpg", category: "workshops", alt: "Learning together" },
  { src: "/Assets/Images/cj8.jpg", category: "hackathons", alt: "Building projects" },
];

const categories = [
  { key: "all" as const, label: "All Photos" },
  { key: "workshops" as const, label: "Workshops" },
  { key: "hackathons" as const, label: "Hackathons" },
  { key: "meetups" as const, label: "Meetups" },
];

/* ─── Lightbox Component ─── */
function Lightbox({
  images: imgs,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const current = imgs[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 md:top-4 md:right-4 z-10 p-1.5 md:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs md:text-sm font-medium">
        {currentIndex + 1} / {imgs.length}
      </div>

      {/* Previous */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-2 md:left-4 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Image */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-[85vw] md:max-w-[90vw] max-h-[80vh] md:max-h-[85vh] flex items-center justify-center px-10 md:px-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current.src}
          alt={current.alt}
          width={1200}
          height={800}
          className="max-h-[80vh] md:max-h-[85vh] w-auto h-auto object-contain rounded-lg"
          priority
        />
      </motion.div>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-2 md:right-4 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    </motion.div>
  );
}

/* ─── Main Gallery Page ─── */
const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState<GalleryImage["category"] | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : prev <= 0 ? filteredImages.length - 1 : prev - 1
    );
  }, [lightboxIndex, filteredImages.length]);

  const nextImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : prev >= filteredImages.length - 1 ? 0 : prev + 1
    );
  }, [lightboxIndex, filteredImages.length]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-violet-500/10 dark:from-rose-500/20 dark:via-pink-500/10 dark:to-violet-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-400/10 via-transparent to-transparent dark:from-rose-400/20" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(244,63,94,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,0.8) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 md:pt-40 md:pb-28 relative">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
            >
              Our{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-violet-500">
                Gallery
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground text-base md:text-lg max-w-xl"
            >
              Explore our collection of memorable moments — from workshops and hackathons to community gatherings.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 border border-border backdrop-blur-sm"
            >
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">
                <strong className="text-foreground">{images.length}</strong> photos in collection
              </span>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full text-background">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,30 1440,30 L1440,60 L0,60 Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Category Filters + Gallery Grid */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.key
                  ? "bg-gradient-to-r from-rose-500 to-violet-500 text-white shadow-lg shadow-rose-500/20"
                  : "bg-white dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-black/[0.15] dark:hover:border-white/[0.15]"
              }`}
            >
              {cat.label}
              {cat.key !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({images.filter((i) => i.category === cat.key).length})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-5 space-y-4 lg:space-y-5">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="break-inside-avoid group relative cursor-pointer rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0a0a0f]"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={index % 3 === 0 ? 450 : index % 3 === 1 ? 350 : 400}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-between p-4 sm:p-5">
                  <div>
                    <p className="text-white text-sm font-medium">{image.alt}</p>
                    <p className="text-white/60 text-xs mt-0.5 capitalize">{image.category}</p>
                  </div>
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                    <ZoomIn className="h-4 w-4 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg font-semibold text-foreground dark:text-white mb-2">No photos found</p>
            <p className="text-sm text-muted-foreground">Try selecting a different category.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={filteredImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default Gallery;
