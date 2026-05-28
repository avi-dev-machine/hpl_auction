"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function Carousel({ targetPlayer, avatars, onComplete }: any) {
  const controls = useAnimation();
  const NUM_FACES = 12;
  const angle = 360 / NUM_FACES;
  const radius = Math.round((250 / 2) / Math.tan(Math.PI / NUM_FACES));

  // Determine images for faces. Target player is always at face 0.
  const faces = Array.from({ length: NUM_FACES }).map((_, i) => {
    if (i === 0) return targetPlayer?.avatar_url || "https://via.placeholder.com/250";
    return avatars[i % avatars.length] || "https://via.placeholder.com/250";
  });

  useEffect(() => {
    async function sequence() {
      // Fast spin: -5400 degrees (15 full rotations backwards, landing on 0)
      await controls.start({
        rotateY: -5400,
        transition: {
          duration: 5,
          ease: [0.1, 0.9, 0.2, 1], // Custom bezier for fast start, slow stop
        },
      });
      onComplete();
    }
    sequence();
  }, [controls, onComplete]);

  return (
    <div className="relative w-[250px] h-[350px] mt-10 z-20 mx-auto [perspective:1500px]">
      <motion.div
        animate={controls}
        initial={{ rotateY: 0 }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full h-full relative"
      >
        {faces.map((src, i) => (
          <div
            key={i}
            className="absolute w-full h-full left-0 top-0 border-[4px] border-[#ffcc00] rounded-lg overflow-hidden shadow-[0_0_20px_rgba(255,204,0,0.5)] bg-[radial-gradient(circle_at_center,#cc3300,#000)]"
            style={{
              transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
              backfaceVisibility: "hidden",
            }}
          >
            <img src={src} alt="Face" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
