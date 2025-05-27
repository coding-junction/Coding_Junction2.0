"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import NavBar from "../NavBar/page";
import Footer from "../Footer/page";

const images = [
  "/Assets/Images/gallery_image.jpg",
  "/Assets/Images/cj9.jpg",
  "/Assets/Images/08.jpg",
  "/Assets/Images/cj1.jpg",
  "/Assets/Images/cj2.jpg",
  "/Assets/Images/cj3.jpg",
  "/Assets/Images/cj4.jpg",
  "/Assets/Images/cj5.jpg",
  "/Assets/Images/cj6.jpg",
  "/Assets/Images/cj7.jpg",
  "/Assets/Images/cj8.jpg",
];

// Responsive image width and margin
const getImageWidth = () => {
  if (typeof window === "undefined") return 600 + 48;
  if (window.innerWidth < 640) return 320 + 24; // mobile: 320px + 2*mx-3
  if (window.innerWidth < 1024) return 480 + 32; // tablet: 480px + 2*mx-4
  return 600 + 48; // desktop: 600px + 2*mx-6
};

const Gallery = () => {
  const controls = useAnimation();
  const [isPaused, setIsPaused] = useState(false);
<<<<<<< HEAD
  const [offset, setOffset] = useState(0);
  const [imageWidth, setImageWidth] = useState(getImageWidth());

  // Update image width on resize
  useEffect(() => {
    const handleResize = () => setImageWidth(getImageWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
=======
  const [offset, setOffset] = useState(0); // offset in px
>>>>>>> f44a310707bb1d1606c8f6f0471ed10d89ff7476

  // Start animation
  useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: [offset, offset - (images.length * imageWidth)],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 25,
          ease: "linear",
        },
      });
    } else {
      controls.stop();
    }
    // eslint-disable-next-line
  }, [isPaused, offset, controls, imageWidth]);

  // When hover/tap, set offset so hovered image is first
  const handleMouseEnter = (idx: number) => {
    setIsPaused(true);
<<<<<<< HEAD
    setOffset(-idx * imageWidth);
    controls.set({ x: -idx * imageWidth });
=======
    setOffset(-idx * IMAGE_WIDTH);
    controls.set({ x: -idx * IMAGE_WIDTH });
>>>>>>> f44a310707bb1d1606c8f6f0471ed10d89ff7476
  };

  // On leave, resume animation from current offset
  const handleMouseLeave = () => {
    setIsPaused(false);
<<<<<<< HEAD
  };

  // For mobile: handle tap to pause and focus image
  const handleTouch = (idx: number) => {
    handleMouseEnter(idx);
    setTimeout(() => setIsPaused(false), 2000); // Resume after 2s
=======
>>>>>>> f44a310707bb1d1606c8f6f0471ed10d89ff7476
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <NavBar />

      <div className="container mx-auto pt-32 pb-20 px-2 sm:px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg">
            Explore our collection of memorable moments and achievements
          </p>
        </motion.div>

        <div className="flex justify-center">
          <div className="overflow-hidden w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto rounded-xl border border-white/10 shadow-lg">
            <motion.div
              className="flex"
              style={{ width: "max-content" }}
              animate={controls}
            >
              {[...images, ...images].map((src, idx) => (
                <motion.div
                  key={idx}
                  className={`
                    relative flex-shrink-0
                    mx-3 sm:mx-4 lg:mx-6
                  `}
                  style={{
                    width:
                      imageWidth === 320 + 24
                        ? 320
                        : imageWidth === 480 + 32
                        ? 480
                        : 600,
                    height:
                      imageWidth === 320 + 24
                        ? 180
                        : imageWidth === 480 + 32
                        ? 270
                        : 340,
                  }}
                  whileHover={{
                    scale: 1.08,
                    zIndex: 2,
                    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.45)",
                  }}
                  onMouseEnter={() => handleMouseEnter(idx % images.length)}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={() => handleTouch(idx % images.length)}
                >
                  <Image
                    src={src}
                    alt={`Gallery Image ${idx + 1}`}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 600px"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 sm:p-6 rounded-xl">
                    <p className="text-white text-xs sm:text-base md:text-xl font-medium text-center">
                      Capturing our journey of innovation and collaboration
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Gallery;
