"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import NavBar from "../NavBar/page";
import Footer from "../Footer/page";

const Gallery = () => {
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8,
              delay: 0.3,
              ease: "easeOut"
            }}
            className="relative overflow-hidden rounded-xl border border-white/10 shadow-lg w-full max-w-4xl mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative w-full aspect-[16/9] md:aspect-[16/10] lg:aspect-[16/9]">
              <Image
                src="/Assets/Images/gallery_image.jpg"
                alt="Gallery Image"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                <p className="text-white text-base md:text-xl font-medium text-center">Capturing our journey of innovation and collaboration</p>
              </div>
            </div>
          </motion.div>
        </div>      </div>
      
      <Footer />
    </div>
  );
};

export default Gallery;
