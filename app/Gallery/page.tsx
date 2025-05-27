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

const IMAGE_WIDTH = 600 + 48; // width + 2*mx-6 (24px each side)

const Gallery = () => {
  const controls = useAnimation();
  const [isPaused, setIsPaused] = useState(false);
  const [offset, setOffset] = useState(0); // offset in px

  // Start animation
  useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: [offset, offset - (images.length * IMAGE_WIDTH)],
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
  }, [isPaused, offset, controls]);

  // When hover, set offset so hovered image is first
  const handleMouseEnter = (idx: number) => {
    setIsPaused(true);
    setOffset(-idx * IMAGE_WIDTH);
    controls.set({ x: -idx * IMAGE_WIDTH });
  };

  // On leave, resume animation from current offset
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <NavBar />

      <div className="container mx-auto pt-32 pb-20 px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Explore our collection of memorable moments and achievements
          </p>
        </motion.div>

        <div className="flex justify-center">
          <div className="overflow-hidden w-full max-w-6xl mx-auto rounded-xl border border-white/10 shadow-lg">
            <motion.div
              className="flex"
              style={{ width: "max-content" }}
              animate={controls}
            >
              {[...images, ...images].map((src, idx) => (
                <motion.div
                  key={idx}
                  className="relative flex-shrink-0 mx-6"
                  style={{
                    width: "600px",
                    height: "340px",
                  }}
                  whileHover={{
                    scale: 1.08,
                    zIndex: 2,
                    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.45)",
                  }}
                  onMouseEnter={() => handleMouseEnter(idx % images.length)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Image
                    src={src}
                    alt={`Gallery Image ${idx + 1}`}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 600px"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6 rounded-xl">
                    <p className="text-white text-base md:text-xl font-medium text-center">
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
