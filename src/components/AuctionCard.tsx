"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AuctionCard({ player, onSold, onUnsold }: any) {
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);

  if (!player) return null;

  return (
    <>
      <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative z-10 flex flex-col items-center mt-10"
    >
      {/* Silver border wrapper */}
      <div className="p-2 rounded-2xl bg-gradient-to-br from-gray-200 via-gray-500 to-gray-200 shadow-[0_0_80px_rgba(255,60,0,0.8)]">
        {/* Inner Card */}
        <div className="w-[360px] h-[520px] rounded-xl flex flex-col items-center relative overflow-hidden bg-black/90">
          
          <div className="w-full h-[380px] mt-2 flex justify-center items-end">
            <img 
              src={player.avatar_url || "https://via.placeholder.com/250"} 
              alt={player.full_name} 
              className="w-[90%] h-full object-cover object-top rounded-t-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setIsPhotoExpanded(true)}
            />
          </div>

          <div className="text-white text-5xl uppercase font-[family-name:var(--font-teko)] tracking-wider mt-4 leading-none text-center w-[90%] truncate" style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #888, 0 0 15px rgba(255,255,255,0.5)" }}>
            {player.full_name}
          </div>

          <div className="text-[#ffcc00] text-3xl font-extrabold font-[family-name:var(--font-teko)] tracking-widest uppercase mt-2">
            {player.pref_position_1 || "PLAYER"}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 z-20 bg-[#111] border-[3px] border-[#ffcc00] p-4 rounded-lg shadow-[0_0_20px_rgba(255,204,0,0.6),inset_0_0_10px_rgba(255,204,0,0.2)]">
        <button 
          onClick={onSold}
          className="font-[family-name:var(--font-teko)] text-3xl font-bold px-8 py-1 uppercase tracking-widest text-[#00ff00] border-2 border-transparent hover:border-[#00ff00] hover:bg-[#00ff00] hover:text-black hover:shadow-[0_0_15px_#00ff00] rounded bg-black transition-all"
        >
          SOLD
        </button>
        <button 
          onClick={onUnsold}
          className="font-[family-name:var(--font-teko)] text-3xl font-bold px-8 py-1 uppercase tracking-widest text-[#ff003c] border-2 border-transparent hover:border-[#ff003c] hover:bg-[#ff003c] hover:text-black hover:shadow-[0_0_15px_#ff003c] rounded bg-black transition-all"
        >
          UNSOLD
        </button>
      </div>
    </motion.div>

      {/* Lightbox Overlay */}
      {isPhotoExpanded && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 cursor-pointer backdrop-blur-sm"
          onClick={() => setIsPhotoExpanded(false)}
        >
          <img 
            src={player.avatar_url || "https://via.placeholder.com/250"} 
            alt={player.full_name} 
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(255,100,0,0.5)]"
          />
        </div>
      )}
    </>
  );
}
