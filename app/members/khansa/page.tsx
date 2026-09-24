"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FlappySharkGame from "./FlappySharkGame";
import KhansaProfile from "./KhansaProfile";

type ExperienceStage = "game" | "profile";

export default function KhansaStandalonePage() {
  const [stage, setStage] = useState<ExperienceStage>("game");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f7fa] via-[#d5f3f8] to-[#bce8f5] text-[#1a1a2e] flex flex-col justify-between relative overflow-x-hidden selection:bg-[#ffaebc] selection:text-[#1a1a2e]">
      {/* Ambient Ocean Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#4ecdc4]/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#ffaebc]/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#ffe156]/15 rounded-full blur-[120px]" />
      </div>

      {/* Top Navigation Bar */}
      <nav className="bg-[#ffffff]/85 backdrop-blur-md border-b-[2.5px] border-[#1a1a2e] px-4 sm:px-8 py-3 flex items-center justify-between shadow-[0_4px_15px_rgba(26,26,46,0.06)] z-40 sticky top-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#ffffff] hover:bg-[#ffe156] text-[#1a1a2e] border-2 border-[#1a1a2e] rounded-xl shadow-[2.5px_2.5px_0px_#1a1a2e] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1a1a2e] transition-all text-xs font-mono font-black tracking-wide cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Beranda Tim</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono font-black text-[#1a1a2e]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4ecdc4] border border-[#1a1a2e] animate-ping" />
          <span className="hidden sm:inline tracking-wider">
            KHANSA · KAWAII OCEAN PROFILE
          </span>
        </div>
      </nav>

      {/* Main Experience Chassis */}
      <main className="relative z-10 flex-1 flex flex-col justify-center w-full py-8 sm:py-12">
        {stage === "game" ? (
          <div className="w-full px-3 flex flex-col items-center my-auto animate-in fade-in duration-300">
            {/* Stage 1: Flappy Shark Mini Game */}
            <FlappySharkGame
              onComplete={() => setStage("profile")}
              onSkip={() => setStage("profile")}
            />
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 my-auto animate-in fade-in zoom-in-95 duration-400">
            {/* Stage 2: Main Khansa Profile */}
            <KhansaProfile
              onReplayGame={() => setStage("game")}
              isStandalone={true}
            />
          </div>
        )}
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 bg-[#ffffff]/90 text-[#1a1a2e] py-4 border-t-[2.5px] border-[#1a1a2e] text-center text-xs font-mono font-bold tracking-wide">
        Proxy Shakespeare · Pekan Ilkomerz 62 · IPB University
      </footer>
    </div>
  );
}
