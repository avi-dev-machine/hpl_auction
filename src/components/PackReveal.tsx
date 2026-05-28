"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function PackReveal({ targetPlayer, avatars, onComplete }: any) {
  const controls = useAnimation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // We need at least some avatars to flash through
  const flashImages = avatars && avatars.length > 0 ? avatars : ["https://via.placeholder.com/250"];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Rapid image flashing interval
    if (!isRevealed) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % flashImages.length);
      }, 80); // very fast flash
    }

    return () => clearInterval(interval);
  }, [isRevealed, flashImages.length]);

  useEffect(() => {
    async function sequence() {
      // 1. Initial crazy shake/flip animation
      await controls.start({
        rotateY: [0, 360, 720, 1080, 1440, 1800, 2160, 2520, 2880, 3240, 3600],
        scale: [0.8, 0.9, 1.0, 1.1, 1.2, 1.1, 1.0, 1.1, 1.2, 1.3, 1.4],
        transition: {
          duration: 4,
          ease: "easeInOut",
        },
      });

      // 2. Stop flashing and show final target player
      setIsRevealed(true);

      // 3. Boom effect (golden explosion scaling)
      await controls.start({
        scale: [1.4, 1.8, 1.2],
        rotateY: [3600, 3600], // stay facing front
        boxShadow: [
          "0 0 20px rgba(255, 204, 0, 0)", 
          "0 0 100px rgba(255, 255, 255, 1)", 
          "0 0 60px rgba(255, 204, 0, 0.8)"
        ],
        transition: {
          duration: 0.8,
          ease: "easeOut",
        },
      });

      // Wait a moment for dramatic effect
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
    
    sequence();
  }, [controls, onComplete]);

  const displayImage = isRevealed 
    ? (targetPlayer?.avatar_url || "https://via.placeholder.com/250") 
    : flashImages[currentImageIndex];

  return (
    <div className="relative w-[300px] h-[400px] mt-10 z-50 mx-auto flex items-center justify-center [perspective:1500px]">
      <motion.div
        animate={controls}
        initial={{ scale: 0.8, rotateY: 0 }}
        className="w-[280px] h-[380px] border-[4px] border-[#ffcc00] rounded-xl overflow-hidden bg-black"
        style={{
          boxShadow: "0 0 20px rgba(255,204,0,0.5)",
          transformStyle: "preserve-3d"
        }}
      >
        <img 
          src={displayImage} 
          alt="Player Reveal" 
          className="w-full h-full object-cover object-top"
        />
        
        {/* Flash overlay for the boom effect */}
        {isRevealed && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-white z-10"
          />
        )}
      </motion.div>
    </div>
  );
}
