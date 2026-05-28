"use client";

import React, { useEffect, useState } from "react";

export default function AdminPage() {
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [unsoldPlayers, setUnsoldPlayers] = useState([]);

  const fetchData = async () => {
    try {
      const resSold = await fetch('/api/players/sold');
      const sold = await resSold.json();
      setSoldPlayers(sold);

      const resUnsold = await fetch('/api/players/unsold');
      const unsold = await resUnsold.json();
      setUnsoldPlayers(unsold);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert("Database uploaded successfully! The board will refresh automatically.");
        fetchData();
      } else {
        alert("Failed to upload database.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading database.");
    }
  };

  useEffect(() => {
    fetchData();

    // Use secure websocket for the Hugging Face deployed backend
    const ws = new WebSocket('wss://avi-dev-machine-hpl-auction.hf.space/ws/admin');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update') {
        fetchData();
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-[family-name:var(--font-rajdhani)] flex flex-col items-center p-8">
      
      {/* Upload Section */}
      <div className="w-full max-w-[1400px] mb-6 flex justify-end z-20">
        <label className="bg-[#ff3300] hover:bg-[#ff5500] cursor-pointer text-white font-[family-name:var(--font-teko)] text-3xl px-8 py-2 border-2 border-white rounded uppercase shadow-[0_0_15px_rgba(255,51,0,0.8)] transition-all">
          UPLOAD NEW DATABASE (CSV)
          <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      <div className="flex w-full max-w-[1400px] gap-10 z-20">
        
        {/* Sold Table */}
        <div className="flex-1 bg-[rgba(10,10,10,0.9)] border-2 border-[#555] border-t-[5px] border-t-[#ff3300] rounded-lg p-8">
          <h2 className="font-[family-name:var(--font-teko)] text-5xl text-[#ffcc00] mt-0 border-b-2 border-[#333] pb-2 mb-6">
            SOLD PLAYERS
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[#ff3300] uppercase font-[family-name:var(--font-teko)] text-3xl p-3 border-b border-[#333]">Player Name</th>
                <th className="text-left text-[#ff3300] uppercase font-[family-name:var(--font-teko)] text-3xl p-3 border-b border-[#333]">Sold At</th>
                <th className="text-left text-[#ff3300] uppercase font-[family-name:var(--font-teko)] text-3xl p-3 border-b border-[#333]">Team</th>
              </tr>
            </thead>
            <tbody>
              {soldPlayers.map((p: any) => (
                <tr key={p.id}>
                  <td className="p-4 border-b border-[#333] text-xl">{p.full_name}</td>
                  <td className="p-4 border-b border-[#333] text-xl text-[#00ff00] font-bold">₹{p.sold_price}</td>
                  <td className="p-4 border-b border-[#333] text-xl text-[#ffcc00]">{p.sold_to_team}</td>
                </tr>
              ))}
              {soldPlayers.length === 0 && (
                <tr><td colSpan={3} className="p-4 text-center text-gray-500">No players sold yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Unsold Table */}
        <div className="flex-1 bg-[rgba(10,10,10,0.9)] border-2 border-[#555] border-t-[5px] border-t-[#ff3300] rounded-lg p-8">
          <h2 className="font-[family-name:var(--font-teko)] text-5xl text-[#ffcc00] mt-0 border-b-2 border-[#333] pb-2 mb-6">
            UNSOLD PLAYERS
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[#ff3300] uppercase font-[family-name:var(--font-teko)] text-3xl p-3 border-b border-[#333]">Player Name</th>
                <th className="text-left text-[#ff3300] uppercase font-[family-name:var(--font-teko)] text-3xl p-3 border-b border-[#333]">Department</th>
              </tr>
            </thead>
            <tbody>
              {unsoldPlayers.map((p: any) => (
                <tr key={p.id}>
                  <td className="p-4 border-b border-[#333] text-xl">{p.full_name}</td>
                  <td className="p-4 border-b border-[#333] text-xl">{p.department || "-"}</td>
                </tr>
              ))}
              {unsoldPlayers.length === 0 && (
                <tr><td colSpan={2} className="p-4 text-center text-gray-500">No unsold players yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
