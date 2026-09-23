"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Copy,
  Check,
  Terminal,
  FileText,
  ExternalLink,
  Music,
  Code2,
  Sparkles,
  Gamepad2,
  Volume2,
  VolumeX,
} from "lucide-react";
import khansaData from "./data";
import SpotifyEmbed from "@/app/components/SpotifyEmbed";
import Instagram from "@/app/components/InstagramIcon";
import { oceanSound } from "./oceanSound";

interface KhansaProfileProps {
  onClose?: () => void;
  onReplayGame?: () => void;
  isOpen?: boolean;
}

export default function KhansaProfile({
  onClose,
  onReplayGame,
  isOpen = true,
}: KhansaProfileProps) {
  const [toastText, setToastText] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [poppedBubbles, setPoppedBubbles] = useState<number[]>([]);

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setToastText(`[COPIED] ${label} -> CLIPBOARD 🫧`);
      oceanSound.playPoint();
      setTimeout(() => {
        setToastText(null);
        setCopiedField(null);
      }, 2500);
    }
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = oceanSound.toggleMute();
    setIsMuted(muted);
  };

  const handleBubbleClick = (index: number) => {
    oceanSound.playBubblePop();
    setPoppedBubbles((prev) => [...prev, index]);
    setTimeout(() => {
      setPoppedBubbles((prev) => prev.filter((i) => i !== index));
    }, 4000);
  };

  const cleanInstagram = khansaData.instagramHandle
    ? khansaData.instagramHandle
        .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
        .replace(/^@/, "")
        .replace(/\/$/, "")
    : "khnsaffh";

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col font-mono text-slate-100 select-none">
      {/* Kawaii Ocean Floating Toast Notification */}
      {toastText && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-1050 bg-[#ffe156] border-[3px] border-[#1a1a2e] rounded-2xl px-5 py-2.5 shadow-[4px_4px_0px_#1a1a2e] font-mono font-black text-xs sm:text-sm text-[#1a1a2e] uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1a1a2e] animate-ping" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Floating Interactive Bubbles across background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[
          { id: 1, top: "12%", left: "6%", size: 36 },
          { id: 2, top: "28%", right: "8%", size: 42 },
          { id: 3, top: "58%", left: "4%", size: 28 },
          { id: 4, top: "75%", right: "6%", size: 44 },
          { id: 5, top: "88%", left: "10%", size: 32 },
        ].map((b) => {
          if (poppedBubbles.includes(b.id)) return null;
          return (
            <div
              key={b.id}
              onClick={() => handleBubbleClick(b.id)}
              style={{
                top: b.top,
                left: b.left,
                right: b.right,
                width: `${b.size}px`,
                height: `${b.size}px`,
              }}
              className="absolute pointer-events-auto cursor-pointer rounded-full bg-gradient-to-tr from-white/30 to-[#4ecdc4]/60 border-2 border-white/70 shadow-[0_0_12px_rgba(78,205,196,0.3)] hover:scale-125 transition-transform duration-200 flex items-center justify-center opacity-70 animate-pulse"
              title="Klik untuk memecahkan gelembung!"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1 left-1.5" />
            </div>
          );
        })}
      </div>

      {/* Modal Dialog Content Chassis - Full Kawaii Ocean Terminal Window */}
      <div
        className="w-full max-h-[88vh] overflow-hidden bg-[#071622]/95 border-3 sm:border-4 border-[#4ecdc4] rounded-2xl sm:rounded-3xl shadow-[0_0_35px_rgba(78,205,196,0.25),8px_8px_0px_#040d14] relative z-10 text-white flex flex-col font-mono backdrop-blur-md"
        style={{
          backgroundImage:
            "radial-gradient(rgba(78, 205, 196, 0.15) 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Kawaii Ocean Terminal Header (Sticky / Fixed when scrolling biodata) */}
        <div className="sticky top-0 z-30 shrink-0 bg-[#0c2333] border-b-3 border-[#4ecdc4] px-4 sm:px-6 py-3 sm:py-3.5 flex justify-between items-center select-none text-[#7ee0f5] shadow-[0_4px_15px_rgba(0,0,0,0.7)]">
          {/* Terminal Window Pearl Dots & Command */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ffaebc] border border-black inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-[#ffe156] border border-black inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-[#b4f8c8] border border-black inline-block shadow-xs" />
            </div>
            <div className="flex items-center gap-1.5 font-mono font-bold text-xs sm:text-sm tracking-wider text-[#4ecdc4]">
              <Terminal size={15} className="text-[#4ecdc4]" />
              <span className="hidden xs:inline">khansa@kawaii-ocean:</span>
              <span>~/profile 🦈</span>
            </div>
          </div>

          {/* Right Controls: Depth Status, Audio, Replay, Close Button */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] bg-[#071622] px-2.5 py-1 border border-[#4ecdc4]/60 rounded-lg text-[#7ee0f5]">
              <span className="w-2 h-2 rounded-full bg-[#4ecdc4] animate-ping" />
              <span>DEPTH 62m · OK 🫧</span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="w-8 h-8 rounded-lg bg-[#0e2a3d] hover:bg-[#133b54] border border-[#4ecdc4] text-[#7ee0f5] flex items-center justify-center transition-all cursor-pointer"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            {/* Replay Flappy Shark Game Button */}
            {onReplayGame && (
              <button
                type="button"
                onClick={onReplayGame}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-[#b4f8c8] hover:bg-[#86efac] text-[#071622] border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
                title="Mainkan Game Flappy Shark Lagi"
              >
                <Gamepad2 size={13} />
                <span>Mini Game</span>
              </button>
            )}

            {/* Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-[#ffaebc] hover:bg-[#ffe156] text-[#071622] border-2 border-black rounded-lg shadow-[2px_2px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center justify-center transition-all cursor-pointer"
                title="Tutup Profile"
                aria-label="Tutup modal"
              >
                <X size={18} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>

        {/* Modal Inner Body (Scrollable terminal content) */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-7 md:p-8 flex flex-col gap-5 sm:gap-6 relative z-10 text-slate-200">
          {/* Terminal Marine Prompt Banner */}
          <div className="flex items-center justify-between flex-wrap gap-2 p-3 sm:p-3.5 bg-[#091b29] border-2 border-[#4ecdc4]/80 rounded-xl shadow-[4px_4px_0px_#000000]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7ee0f5]">
              <span className="text-[#ffe156] font-black">$</span>
              <span>kawaii ocean</span>
            </div>
            <span className="text-[10px] sm:text-xs bg-[#4ecdc4]/20 text-[#7ee0f5] border border-[#4ecdc4] px-2 py-0.5 rounded font-black flex items-center gap-1">
              <span>STATUS_MUTIARA: SUKSES (200)</span>
              <span>🫧</span>
            </span>
          </div>

          {/* Profile Header (Photo + Identity Terminal Card) */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-7 items-center sm:items-start bg-[#091b29] p-4 sm:p-6 border-2 border-[#4ecdc4]/70 rounded-2xl shadow-[6px_6px_0px_#000000] relative">
            {/* Corner Marine Crosshairs */}
            <div className="absolute top-2 left-2 text-[#4ecdc4]/60 text-xs select-none">✦</div>
            <div className="absolute top-2 right-2 text-[#4ecdc4]/60 text-xs select-none">🫧</div>
            <div className="absolute bottom-2 left-2 text-[#4ecdc4]/60 text-xs select-none">🐚</div>
            <div className="absolute bottom-2 right-2 text-[#4ecdc4]/60 text-xs select-none">⭐</div>

            {/* Photo Frame - Kawaii Phosphor Ocean Frame */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-2xl overflow-hidden border-3 border-[#4ecdc4] shadow-[0_0_20px_rgba(78,205,196,0.35)] bg-[#0c2333] p-1 group">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#071622]">
                <Image
                  src={khansaData.photo}
                  alt={khansaData.name}
                  fill
                  sizes="(max-width: 640px) 128px, 160px"
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                  priority
                />
                {/* Watery Ripple CRT Scanline Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(78, 205, 196, 0.4) 3px, rgba(78, 205, 196, 0.4) 5px)",
                  }}
                />
              </div>

              {/* HUD Badge on Avatar */}
              <div className="absolute bottom-2 right-2 bg-[#071622]/90 border border-[#ffaebc] text-[#ffaebc] px-1.5 py-0.5 rounded text-[9px] font-black shadow-[1px_1px_0px_#000000] flex items-center gap-0.5">
                <span>sasa</span>
                <span>🦈</span>
              </div>
            </div>

            {/* Title & Identity Info */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4ecdc4] text-[#071622] border-2 border-black rounded-lg text-xs font-black mb-2.5 shadow-[2px_2px_0px_#000000] -rotate-1">
                <span>⚓</span>
                <span>Anggota Tim 🫧</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-mono font-black text-white mb-3 tracking-tight leading-tight flex items-center justify-center sm:justify-start gap-1">
                <span>{khansaData.name}</span>
                <span className="cursor-blink text-[#4ecdc4] font-mono">_</span>
              </h2>

              <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                {khansaData.nim && (
                  <button
                    type="button"
                    onClick={() => handleCopy(khansaData.nim, `NIM ${khansaData.nim}`)}
                    className="px-3.5 py-1.5 bg-[#0e2a3d] hover:bg-[#4ecdc4] hover:text-[#071622] border-2 border-[#4ecdc4] rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs sm:text-sm text-[#7ee0f5] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all cursor-pointer flex items-center gap-2"
                    title="Klik untuk menyalin NIM"
                  >
                    <span>NIM: {khansaData.nim}</span>
                    {copiedField === `NIM ${khansaData.nim}` ? (
                      <Check size={13} className="text-[#ffe156]" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                )}

                {khansaData.hometown && (
                  <span className="px-3.5 py-1.5 bg-[#0e2a3d] border-2 border-[#4ecdc4]/70 rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs sm:text-sm text-slate-200 flex items-center gap-1.5">
                    📍 {khansaData.hometown}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Decrypted Personal Quote Card */}
          {khansaData.quote && (
            <div
              onClick={() => handleCopy(`"${khansaData.quote}"`, "Quote")}
              className="bg-[#091b29] border-2 border-[#4ecdc4] rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0px_#000000] relative cursor-pointer hover:bg-[#0e2a3d] transition-colors group"
              title="Klik untuk menyalin Quote"
            >
              <div className="absolute -top-3.5 left-4 bg-[#ffe156] border-2 border-black rounded-lg px-3 py-0.5 font-mono font-black text-xs text-[#071622] transform -rotate-1 flex items-center gap-1.5 shadow-[2px_2px_0px_#000000]">
                <span>💬</span>
                <span> Motto </span>
              </div>

              <p className="italic text-base sm:text-lg font-bold text-[#7ee0f5] text-center mt-1">
                &ldquo;{khansaData.quote}&rdquo;
              </p>
              <span className="text-[11px] font-mono text-[#4ecdc4]/70 text-center block mt-1 font-bold">
                
              </span>
            </div>
          )}

          {/* Skills / Hobbies Terminal Matrix */}
          {khansaData.hobbies && khansaData.hobbies.length > 0 && (
            <div className="flex flex-col gap-3 bg-[#091b29] p-4 sm:p-5 border-2 border-[#4ecdc4]/70 rounded-2xl shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center justify-between border-b border-[#4ecdc4]/30 pb-2">
                <h4 className="font-mono font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <Code2 size={16} className="text-[#4ecdc4]" />
                  <span>Hobbies</span>
                </h4>
                <span className="text-[11px] text-[#7ee0f5]/80 font-bold">
                  {khansaData.hobbies.length} items 🫧
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {khansaData.hobbies.map((hobby, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 bg-[#0e2a3d] border border-[#4ecdc4] text-[#b4f8c8] font-mono font-bold text-xs sm:text-sm rounded-xl shadow-[2px_2px_0px_#000000] flex items-center gap-1.5 hover:bg-[#4ecdc4] hover:text-[#071622] transition-colors"
                  >
                    <span className="text-[#ffaebc]">❯</span>
                    <span>{hobby}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Socials, LinkedIn & CV Network Links */}
          <div className="flex flex-col gap-3 bg-[#091b29] p-4 sm:p-5 border-2 border-[#4ecdc4]/70 rounded-2xl shadow-[4px_4px_0px_#000000]">
            <div className="flex items-center justify-between border-b border-[#4ecdc4]/30 pb-2">
              <h4 className="font-mono font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <Terminal size={16} className="text-[#4ecdc4]" />
                <span>Connect with Me!</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Instagram */}
              {cleanInstagram && (
                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://instagram.com/${cleanInstagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#0e2a3d] border-2 border-[#ffaebc] hover:bg-[#ffaebc] hover:text-[#071622] rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs text-white transition-all truncate"
                    title="Buka profil Instagram"
                  >
                    <Instagram size={15} className="text-[#ffaebc] group-hover:text-[#071622] shrink-0" />
                    <span className="truncate">@{cleanInstagram}</span>
                    <ExternalLink size={12} className="opacity-60 shrink-0" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(`@${cleanInstagram}`, `@${cleanInstagram}`)}
                    className="p-2 bg-[#ffe156] hover:bg-[#4ecdc4] hover:text-[#071622] border-2 border-black text-[#071622] rounded-xl shadow-[2px_2px_0px_#000000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all cursor-pointer font-bold text-xs shrink-0"
                    title="Salin username Instagram"
                  >
                    COPY
                  </button>
                </div>
              )}

              {/* LinkedIn */}
              {khansaData.linkedinUrl && (
                <a
                  href={
                    khansaData.linkedinUrl.startsWith("http")
                      ? khansaData.linkedinUrl
                      : `https://${khansaData.linkedinUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#0e2a3d] border-2 border-[#4ecdc4] hover:bg-[#4ecdc4] hover:text-[#071622] rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs text-white transition-all"
                  title="Buka profil LinkedIn"
                >
                  <Image
                    src="/linkedin2.svg"
                    alt="LinkedIn"
                    width={16}
                    height={16}
                    className="w-4 h-4 object-contain shrink-0"
                  />
                  <span>LinkedIn Profile</span>
                  <ExternalLink size={12} className="opacity-60 shrink-0" />
                </a>
              )}

              {/* CV Document */}
              {khansaData.cvUrl && (
                <a
                  href={
                    khansaData.cvUrl.startsWith("http")
                      ? khansaData.cvUrl
                      : `https://${khansaData.cvUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#0e2a3d] border-2 border-[#b4f8c8] hover:bg-[#b4f8c8] hover:text-[#071622] rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs text-[#b4f8c8] hover:text-[#071622] transition-all"
                  title="Buka Curriculum Vitae"
                >
                  <FileText size={15} className="shrink-0" />
                  <span>Curriculum Vitae</span>
                  <ExternalLink size={12} className="opacity-60 shrink-0" />
                </a>
              )}
            </div>
          </div>

          {/* Spotify Cyber Audio Player */}
          {khansaData.spotifyTrackUri && (
            <div className="pt-1">
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-white mb-2.5">
                <Music size={16} className="text-[#4ecdc4]" />
                <span>play-stream 🫧</span>
              </div>
              <div className="bg-black rounded-2xl overflow-hidden border-2 border-[#4ecdc4] shadow-[4px_4px_0px_#000000]">
                <SpotifyEmbed
                  trackUri={khansaData.spotifyTrackUri}
                  isOpen={isOpen}
                />
              </div>
            </div>
          )}

          {/* Terminal Bottom Status */}
          <div className="mt-2 text-center font-mono text-xs text-[#7ee0f5]/70 flex items-center justify-center gap-2">
            <span className="cursor-blink text-[#4ecdc4] font-bold">_</span>
            <span>khansa-proxy-shakespeare 🌊</span>
          </div>
        </div>
      </div>
    </div>
  );
}
