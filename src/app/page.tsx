"use client";

import React, { useState, useEffect } from "react";
import FireBackground from "../components/FireBackground";
import AuctionCard from "../components/AuctionCard";
import PackReveal from "../components/PackReveal";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [avatars, setAvatars] = useState<string[]>([]);
  const [showSoldForm, setShowSoldForm] = useState(false);
  const [price, setPrice] = useState("");
  const [team, setTeam] = useState("Dynamic Titans FC");

  useEffect(() => {
    // Pre-fetch avatars for the carousel faces
    fetch("/api/players/unassigned")
      .then((res) => res.json())
      .then((data) => {
        const urls = data.map((p: any) => p.avatar_url).filter(Boolean);
        // Shuffle the URLs
        setAvatars(urls.sort(() => 0.5 - Math.random()));
      })
      .catch(console.error);
  }, []);

  const handleShuffleClick = async () => {
    try {
      const res = await fetch("/api/players/random");
      if (!res.ok) {
        if (res.status === 404) alert("No players left!");
        return;
      }
      const player = await res.json();
      setCurrentPlayer(player);
      setIsShuffling(true);
      setShowSoldForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSoldConfirm = async () => {
    if (!currentPlayer) return;
    await fetch(`/api/players/${currentPlayer.id}/sell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: parseFloat(price), team }),
    });
    setCurrentPlayer(null);
    setShowSoldForm(false);
  };

  const handleUnsold = async () => {
    if (!currentPlayer) return;
    await fetch(`/api/players/${currentPlayer.id}/unsold`, {
      method: "POST",
    });
    setCurrentPlayer(null);
  };

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col justify-center items-center overflow-hidden relative">
      {/* 3D WebGL Fire Background */}
      <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none opacity-80 mix-blend-screen">
        <Canvas>
          <FireBackground />
        </Canvas>
      </div>

      <h1 
        className="text-6xl text-white mt-10 z-20 uppercase font-[family-name:var(--font-teko)] tracking-widest"
        style={{ textShadow: "0 0 10px #ff3300" }}
      >
        HPL Live Auction
      </h1>

      {!isShuffling && !currentPlayer && (
        <button
          onClick={handleShuffleClick}
          className="bg-[#ff3300] text-white font-[family-name:var(--font-teko)] text-4xl px-16 py-4 border-[3px] border-white rounded-lg cursor-pointer mt-10 uppercase shadow-[0_0_20px_rgba(255,51,0,0.8)] hover:scale-105 hover:bg-[#ff5500] transition-transform z-20"
        >
          SHUFFLE PLAYER
        </button>
      )}

      {isShuffling && currentPlayer && (
        <PackReveal 
          targetPlayer={currentPlayer} 
          avatars={avatars} 
          onComplete={() => setIsShuffling(false)} 
        />
      )}

      {!isShuffling && currentPlayer && !showSoldForm && (
        <AuctionCard 
          player={currentPlayer} 
          onSold={() => setShowSoldForm(true)} 
          onUnsold={handleUnsold} 
        />
      )}

      {!isShuffling && currentPlayer && showSoldForm && (
        <div className="z-20 flex flex-col mt-10 bg-[#111] border-[3px] border-[#ffcc00] p-6 rounded-lg shadow-[0_0_20px_rgba(255,204,0,0.6),inset_0_0_10px_rgba(255,204,0,0.2)]">
          <div className="flex gap-4 justify-center mb-6">
            <input 
              type="number" 
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="bg-black border-2 border-[#ffcc00] text-[#ffcc00] font-[family-name:var(--font-teko)] text-2xl px-3 py-1 w-32 outline-none text-center" 
              placeholder="PRICE" 
            />
            <select 
              value={team}
              onChange={e => setTeam(e.target.value)}
              className="bg-black border-2 border-[#ffcc00] text-[#ffcc00] font-[family-name:var(--font-teko)] text-2xl px-3 py-1 w-40 outline-none text-center"
            >
              <option value="Dynamic Titans FC">Dynamic Titans FC</option>
              <option value="Rangers United FC">Rangers United FC</option>
              <option value="TOOFAN FC">TOOFAN FC</option>
              <option value="Outliners FC">Outliners FC</option>
              <option value="Goaldiggers FC">Goaldiggers FC</option>
              <option value="Venom Strikers FC">Venom Strikers FC</option>
              <option value="Atlas Eagles FC">Atlas Eagles FC</option>
              <option value="SPARTAN ATHLETICS">SPARTAN ATHLETICS</option>
            </select>
          </div>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleSoldConfirm}
              className="font-[family-name:var(--font-teko)] text-3xl font-bold px-8 py-1 uppercase tracking-widest text-[#00ff00] border-2 border-transparent hover:border-[#00ff00] hover:bg-[#00ff00] hover:text-black hover:shadow-[0_0_15px_#00ff00] rounded bg-black transition-all"
            >
              CONFIRM
            </button>
            <button 
              onClick={() => setShowSoldForm(false)}
              className="font-[family-name:var(--font-teko)] text-3xl font-bold px-8 py-1 uppercase tracking-widest text-[#ff003c] border-2 border-transparent hover:border-[#ff003c] hover:bg-[#ff003c] hover:text-black hover:shadow-[0_0_15px_#ff003c] rounded bg-black transition-all"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
