"use client";

import React, { useState } from "react";
import { Sparkles, KeyRound, Volume2, VolumeX, ArrowRight } from "lucide-react";
import { soundEngine } from "./soundEngine";

interface SecretGardenDoorProps {
  onDoorOpened: () => void;
  onSkip: () => void;
}

export default function SecretGardenDoor({
  onDoorOpened,
  onSkip,
}: SecretGardenDoorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);

  const handleOpenDoor = () => {
    if (isOpen) return;
    setIsOpen(true);
    soundEngine.playDoorOpen();
    soundEngine.startAmbientMusic();

    // Smooth transition into Phase 2
    setTimeout(() => {
      onDoorOpened();
    }, 1400);
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Generate deterministic fireflies
  const fireflies = [
    { top: "16%", left: "12%", delay: "0s", duration: "4s", size: "w-2.5 h-2.5" },
    { top: "25%", left: "84%", delay: "1.2s", duration: "5s", size: "w-3 h-3" },
    { top: "62%", left: "10%", delay: "0.5s", duration: "4.5s", size: "w-2 h-2" },
    { top: "70%", left: "86%", delay: "2.1s", duration: "6s", size: "w-3.5 h-3.5" },
    { top: "38%", left: "20%", delay: "1.8s", duration: "5.2s", size: "w-2 h-2" },
    { top: "52%", left: "76%", delay: "0.8s", duration: "4.8s", size: "w-2.5 h-2.5" },
    { top: "14%", left: "52%", delay: "2.5s", duration: "5.5s", size: "w-2 h-2" },
  ];

  return (
    <div className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[700px] flex flex-col items-center justify-center overflow-hidden rounded-3xl p-4 sm:p-8 bg-gradient-to-b from-[#081810] via-[#0d2619] to-[#06140d] text-white select-none border-2 border-[#234e34]/70 shadow-[0_12px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl">
      {/* Background enchanted mist & subtle glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#1f5739]/25 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-[#ffe082]/10 rounded-full blur-3xl" />

        {/* Ambient Fireflies */}
        {fireflies.map((f, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-[#ffe082] shadow-[0_0_14px_#ffe082] animate-pulse pointer-events-none ${f.size}`}
            style={{
              top: f.top,
              left: f.left,
              animationDelay: f.delay,
              animationDuration: f.duration,
            }}
          />
        ))}
      </div>

      {/* Top Floating Controls: Sound Toggle & Skip */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-auto">
        <button
          type="button"
          onClick={handleToggleSound}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0e271a]/90 hover:bg-[#173e29] text-[#a8e6cf] hover:text-[#ffe082] border border-[#2b6443] hover:border-[#ffe082] rounded-xl shadow-md text-xs font-mono font-bold transition-all cursor-pointer"
          title={isMuted ? "Unmute sound" : "Mute sound"}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span className="hidden sm:inline">{isMuted ? "Sound Off" : "Melody On"}</span>
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0e271a]/90 hover:bg-[#173e29] text-[#cbf5dc] hover:text-[#ffe082] border border-[#2b6443] hover:border-[#ffe082] rounded-xl shadow-md text-xs font-mono font-bold transition-all cursor-pointer"
          title="Skip straight to introduction"
        >
          <span>Skip Opening</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Secret Garden Story Header */}
      <div className="relative z-20 text-center mb-6 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#122e20] border border-[#a8e6cf]/40 rounded-full text-[11px] sm:text-xs font-mono font-bold text-[#a8e6cf] mb-2.5 shadow-sm">
          <Sparkles size={12} className="animate-spin text-[#ffe082]" />
          <span>AN ENCHANTED THRESHOLD</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#fffdf7] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          The Secret Garden Door
        </h2>
        <p className="text-xs sm:text-sm text-[#b2dbc2] mt-2 font-medium px-4 leading-relaxed">
          Tucked beneath ancient willow vines lies the sanctuary of Fae Luminelle.
        </p>
      </div>

      {/* Interactive Ornate 3D Garden Door */}
      <div
        className="relative z-30 cursor-pointer group flex flex-col items-center"
        onClick={handleOpenDoor}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ perspective: "1000px" }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleOpenDoor();
        }}
        aria-label="Open the Secret Garden Door"
      >
        {/* Ornate Stone / Vine Arch Frame */}
        <div className="relative w-64 sm:w-72 md:w-80 h-80 sm:h-92 md:h-96 p-2 rounded-t-[140px] border-4 border-[#1b432e] bg-gradient-to-b from-[#163a27] via-[#10271b] to-[#0a1911] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(35,85,55,0.3)] flex justify-center items-end">
          {/* Floral Vine Overlays */}
          <div className="absolute -top-3.5 inset-x-0 flex justify-center pointer-events-none select-none">
            <span className="text-2xl sm:text-3xl filter drop-shadow">🌿🌸🌿</span>
          </div>

          {/* Light Burst Behind Door when Opening */}
          <div
            className={`absolute inset-0 rounded-t-[136px] bg-gradient-to-t from-[#ffe082] via-[#e2f8eb] to-[#80e5b8] transition-all duration-1000 pointer-events-none ${
              isOpen
                ? "opacity-100 scale-105 blur-sm"
                : "opacity-0"
            }`}
          />

          {/* Door Panels Container */}
          <div className="relative w-full h-full rounded-t-[132px] overflow-hidden flex bg-[#0d2117] border-2 border-[#2b5943]">
            {/* Left Door Leaf */}
            <div
              className={`relative w-1/2 h-full bg-gradient-to-r from-[#1c3e2e] via-[#285741] to-[#1c3e2e] border-r border-[#0f261c] flex flex-col items-end justify-center pr-3 transition-transform duration-1000 ease-out origin-left ${
                isOpen ? "-rotate-y-85 opacity-35" : ""
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Door Wood Grain Panels */}
              <div className="w-4/5 h-3/4 border-2 border-[#163627] rounded-t-full rounded-b-lg bg-[#142f23]/60 p-2 flex flex-col justify-around">
                <div className="w-full h-1/3 border border-[#3b7858]/35 rounded-t-full flex items-center justify-center">
                  <span className="text-[10px] text-[#ffe082]/60 select-none">✦</span>
                </div>
                <div className="w-full h-1/2 border border-[#3b7858]/35 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] text-[#a8e6cf]/50 select-none">❦</span>
                </div>
              </div>
              {/* Left Brass Knob */}
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#ffe082] to-[#c79c33] border border-[#8a6818] shadow-md flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5a4310]" />
              </div>
            </div>

            {/* Right Door Leaf */}
            <div
              className={`relative w-1/2 h-full bg-gradient-to-l from-[#1c3e2e] via-[#285741] to-[#1c3e2e] border-l border-[#0f261c] flex flex-col items-start justify-center pl-3 transition-transform duration-1000 ease-out origin-right ${
                isOpen ? "rotate-y-85 opacity-35" : ""
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Door Wood Grain Panels */}
              <div className="w-4/5 h-3/4 border-2 border-[#163627] rounded-t-full rounded-b-lg bg-[#142f23]/60 p-2 flex flex-col justify-around">
                <div className="w-full h-1/3 border border-[#3b7858]/35 rounded-t-full flex items-center justify-center">
                  <span className="text-[10px] text-[#ffe082]/60 select-none">✦</span>
                </div>
                <div className="w-full h-1/2 border border-[#3b7858]/35 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] text-[#a8e6cf]/50 select-none">❦</span>
                </div>
              </div>
              {/* Right Brass Lock with Keyhole */}
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5 h-7 rounded-md bg-gradient-to-b from-[#ffe082] to-[#c79c33] border border-[#8a6818] shadow-md flex flex-col items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#12281d]" />
                <div className="w-1 h-2 bg-[#12281d] -mt-0.5 rounded-b-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Glow indicator below door */}
        <div
          className={`w-48 h-3 rounded-full bg-[#ffe082]/30 blur-md mt-3 transition-all duration-500 ${
            isHovered || isOpen ? "w-64 bg-[#ffe082]/70" : ""
          }`}
        />
      </div>

      {/* Action Button */}
      <div className="relative z-30 mt-6 sm:mt-8 flex flex-col items-center gap-2.5">
        <button
          type="button"
          onClick={handleOpenDoor}
          disabled={isOpen}
          className={`group flex items-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 bg-gradient-to-r from-[#205739] via-[#327a51] to-[#225b3c] hover:from-[#2a7049] hover:to-[#38885b] text-[#fffdf7] border-2 border-[#ffe082] rounded-2xl font-serif font-bold text-sm sm:text-base uppercase tracking-wider shadow-[0_0_25px_rgba(50,122,81,0.5)] hover:shadow-[0_0_35px_rgba(255,224,130,0.4)] hover:-translate-y-0.5 active:translate-y-1 transition-all cursor-pointer ${
            isOpen ? "opacity-75 cursor-wait" : "animate-pulse"
          }`}
        >
          <KeyRound size={18} className="group-hover:rotate-45 transition-transform text-[#ffe082]" />
          <span>{isOpen ? "Opening Sanctuary..." : "Step Inside the Garden ✨"}</span>
        </button>

        <p className="text-[11px] sm:text-xs font-mono text-[#a8e6cf]/80 tracking-wide">
          Click the door or button to awaken the magical garden
        </p>
      </div>
    </div>
  );
}
