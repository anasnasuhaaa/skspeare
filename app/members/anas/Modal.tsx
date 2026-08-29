"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Copy, Terminal, FileText, ExternalLink, Music, Code2 } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import anasData from "./data";
import SpotifyEmbed from "@/app/components/SpotifyEmbed";
import Instagram from "@/app/components/InstagramIcon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ==========================================
// 🔒 LOCKED: Core component structure (DO NOT DELETE)
// ==========================================
export default function AnasModal({ isOpen, onClose }: ModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [toastText, setToastText] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setToastText(`[COPIED] ${label} -> CLIPBOARD`);
      setTimeout(() => setToastText(null), 2400);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
    } else if (shouldRender) {
      handleAnimateClose();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (shouldRender && backdropRef.current && contentRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.out" }
        );
        gsap.fromTo(
          contentRef.current,
          { scale: 0.95, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.4)" }
        );
      });
      return () => ctx.revert();
    }
  }, [shouldRender]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleAnimateClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleAnimateClose = () => {
    if (backdropRef.current && contentRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(contentRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          document.body.style.overflow = "";
          setShouldRender(false);
          onClose();
        },
      });
    } else {
      document.body.style.overflow = "";
      setShouldRender(false);
      onClose();
    }
  };

  if (!shouldRender) return null;

  const cleanInstagram = anasData.instagramHandle
    ? anasData.instagramHandle
      .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
      .replace(/^@/, "")
      .replace(/\/$/, "")
    : "";

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md">
      {/* Neobrutalist Cyber Floating Toast */}
      {toastText && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-1050 bg-nb-yellow border-[3px] border-nb-black rounded-xl px-5 py-2.5 shadow-[4px_4px_0px_var(--nb-black)] font-display font-black text-xs sm:text-sm text-nb-black uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-nb-black animate-ping" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleAnimateClose}
        className="absolute inset-0 cursor-pointer"
        aria-hidden="true"
      />

      {/* Modal Dialog Content Chassis - Full Terminal Cyber Window */}
      <div
        ref={contentRef}
        className="w-full max-w-3xl max-h-[88vh] overflow-hidden bg-[#070b10] border-4 border-[#15803d] rounded-2xl sm:rounded-3xl shadow-[0_0_30px_rgba(21,128,61,0.22),10px_10px_0px_var(--nb-black)] relative z-10 text-white flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage:
            "radial-gradient(rgba(21, 128, 61, 0.12) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Top Linux Hacker Terminal Header (Sticky / Fixed when scrolling biodata) */}
        <div className="sticky top-0 z-30 shrink-0 bg-[#0d1520] border-b-3 border-[#15803d] px-4 sm:px-6 py-3 sm:py-3.5 flex justify-between items-center select-none text-[#4ade80] shadow-[0_4px_15px_rgba(0,0,0,0.8)]">
          {/* Terminal Window Dots & Command */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ef4444] border border-black inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#eab308] border border-black inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#16a34a] border border-black inline-block" />
            </div>
            <div className="flex items-center gap-1.5 font-mono font-bold text-xs sm:text-sm tracking-wider text-[#4ade80]">
              <Terminal size={15} className="text-[#4ade80]" />
              <span className="hidden xs:inline">root@anas-workstation:</span>
              <span>~/profile.sh</span>
            </div>
          </div>

          {/* Right Controls: Close Button */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-[11px] bg-[#121c27] px-2.5 py-1 border border-[#15803d]/70 rounded text-[#4ade80]">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
              <span>KERNEL v6.12 OK</span>
            </div>
            <button
              type="button"
              onClick={handleAnimateClose}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-[#ef4444] hover:bg-[#eab308] text-white hover:text-black border-2 border-black rounded-lg shadow-[2px_2px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center justify-center transition-all cursor-pointer"
              title="Tutup Terminal"
              aria-label="Tutup modal"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Modal Inner Body (Scrollable terminal content) */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-7 relative z-10 text-slate-200">
          {/* Terminal Matrix Prompt Banner */}
          <div className="flex items-center justify-between flex-wrap gap-2 p-3 sm:p-3.5 bg-[#0a121c] border-2 border-[#15803d]/80 rounded-xl shadow-[4px_4px_0px_#000000]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4ade80]">
              <span className="text-[#eab308] font-black">$</span>
              <span>./fetch_profile.sh --target=anas_nasuha --access=0xROOT</span>
            </div>
            <span className="text-[10px] sm:text-xs bg-[#15803d]/25 text-[#4ade80] border border-[#15803d] px-2 py-0.5 rounded font-black">
              EXEC_STATUS: SUCCESS (200)
            </span>
          </div>

          {/* Profile Header (Photo + Identity Terminal Card) */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start bg-[#091018] p-4 sm:p-6 border-2 border-[#15803d]/70 rounded-2xl shadow-[6px_6px_0px_#000000] relative">
            {/* Corner HUD Crosshairs */}
            <div className="absolute top-2 left-2 text-[#15803d]/60 text-xs select-none">+</div>
            <div className="absolute top-2 right-2 text-[#15803d]/60 text-xs select-none">+</div>
            <div className="absolute bottom-2 left-2 text-[#15803d]/60 text-xs select-none">+</div>
            <div className="absolute bottom-2 right-2 text-[#15803d]/60 text-xs select-none">+</div>

            {/* Photo Frame - CRT Phosphor Monitor */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-xl overflow-hidden border-3 border-[#16a34a] shadow-[0_0_18px_rgba(21,128,61,0.3)] bg-[#05090e] p-1 group">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
                <Image
                  src={anasData.photo}
                  alt={anasData.name}
                  fill
                  sizes="(max-width: 640px) 128px, 160px"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  priority
                />
                {/* CRT Scanline Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.8) 2px, rgba(0, 0, 0, 0.8) 4px)",
                  }}
                />
              </div>

              {/* HUD Badge on Avatar */}
              <div className="absolute bottom-2 right-2 bg-[#0d1520] border border-[#15803d] text-[#4ade80] px-1.5 py-0.5 rounded text-[9px] font-black shadow-[1px_1px_0px_#000000]">
                0xADMIN_LEAD
              </div>
            </div>

            {/* Title & Identity Info */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#16a34a] text-white border-2 border-black rounded-lg text-xs font-black mb-2.5 shadow-[2px_2px_0px_#000000] -rotate-1">
                <span>👑</span>
                <span>Ketua Tim // Lead Developer</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-3 tracking-tight leading-tight flex items-center justify-center sm:justify-start gap-1">
                <span>{anasData.name}</span>
                <span className="cursor-blink text-[#4ade80] font-mono">_</span>
              </h2>

              <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                {anasData.nim && (
                  <button
                    type="button"
                    onClick={() => handleCopy(anasData.nim, `NIM ${anasData.nim}`)}
                    className="px-3.5 py-1.5 bg-[#101923] hover:bg-[#16a34a] hover:text-white border-2 border-[#15803d] rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs sm:text-sm text-[#4ade80] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all cursor-pointer flex items-center gap-2"
                    title="Klik untuk menyalin NIM"
                  >
                    <span>NIM: {anasData.nim}</span>
                    <Copy size={13} />
                  </button>
                )}

                {anasData.hometown && (
                  <span className="px-3.5 py-1.5 bg-[#101923] border-2 border-[#15803d]/70 rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs sm:text-sm text-slate-200 flex items-center gap-1.5">
                    📍 {anasData.hometown}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Decrypted Personal Quote Card */}
          {anasData.quote && (
            <div
              onClick={() => handleCopy(`"${anasData.quote}"`, "Quote")}
              className="bg-[#091018] border-2 border-[#15803d] rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0px_#000000] relative cursor-pointer hover:bg-[#101b28] transition-colors group"
              title="Klik untuk menyalin Quote"
            >
              <div className="absolute -top-3.5 left-4 bg-[#eab308] border-2 border-black rounded-lg px-3 py-0.5 font-display font-black text-xs text-black transform -rotate-1 flex items-center gap-1.5 shadow-[2px_2px_0px_#000000]">
                <span>💬</span>
                <span>$ cat /etc/motd.txt</span>
              </div>

              <p className="italic text-base sm:text-lg font-bold text-[#4ade80] text-center mt-1">
                &ldquo;{anasData.quote}&rdquo;
              </p>
            </div>
          )}

          {/* Skills / Hobbies Terminal Matrix */}
          {anasData.hobbies && anasData.hobbies.length > 0 && (
            <div className="flex flex-col gap-3 bg-[#091018] p-4 sm:p-5 border-2 border-[#15803d]/70 rounded-2xl shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center justify-between border-b border-[#15803d]/30 pb-2">
                <h4 className="font-mono font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <Code2 size={16} className="text-[#4ade80]" />
                  <span>$ ls -la ./hobbies/</span>
                </h4>
                <span className="text-[11px] text-[#4ade80]/70">4 items</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {anasData.hobbies.map((hobby, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 bg-[#101b28] border border-[#15803d] text-[#86efac] font-mono font-bold text-xs sm:text-sm rounded-xl shadow-[2px_2px_0px_#000000] flex items-center gap-1.5 hover:bg-[#16a34a] hover:text-white transition-colors"
                  >
                    <span className="text-[#eab308]">❯</span>
                    <span>{hobby}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Socials, LinkedIn & CV Network Links */}
          <div className="flex flex-col gap-3 bg-[#091018] p-4 sm:p-5 border-2 border-[#15803d]/70 rounded-2xl shadow-[4px_4px_0px_#000000]">
            <div className="flex items-center justify-between border-b border-[#15803d]/30 pb-2">
              <h4 className="font-mono font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <Terminal size={16} className="text-[#4ade80]" />
                <span>$ ./connect_network.sh --profile=all</span>
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
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#101b28] border-2 border-[#ec4899] hover:bg-[#ec4899] hover:text-white rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs text-white transition-all truncate"
                    title="Buka profil Instagram"
                  >
                    <Instagram size={15} className="text-[#ec4899] group-hover:text-white shrink-0" />
                    <span className="truncate">@{cleanInstagram}</span>
                    <ExternalLink size={12} className="opacity-60 shrink-0" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(`@${cleanInstagram}`, `@${cleanInstagram}`)}
                    className="p-2 bg-[#eab308] hover:bg-[#16a34a] hover:text-white border-2 border-black text-black rounded-xl shadow-[2px_2px_0px_#000000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all cursor-pointer font-bold text-xs shrink-0"
                    title="Salin username Instagram"
                  >
                    COPY
                  </button>
                </div>
              )}

              {/* LinkedIn */}
              {anasData.linkedinUrl && (
                <a
                  href={
                    anasData.linkedinUrl.startsWith("http")
                      ? anasData.linkedinUrl
                      : `https://${anasData.linkedinUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#101b28] border-2 border-[#0284c7] hover:bg-[#0284c7] hover:text-white rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs text-white transition-all"
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
              {anasData.cvUrl && (
                <a
                  href={
                    anasData.cvUrl.startsWith("http")
                      ? anasData.cvUrl
                      : `https://${anasData.cvUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#101b28] border-2 border-[#15803d] hover:bg-[#16a34a] hover:text-white rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs text-[#4ade80] transition-all"
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
          {anasData.spotifyTrackUri && (
            <div className="pt-2">
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-white mb-2.5">
                <Music size={16} className="text-[#4ade80]" />
                <span>$ play-stream --track=spotify_favorite.ogg</span>
              </div>
              <div className="bg-black rounded-2xl overflow-hidden border-2 border-[#15803d] shadow-[4px_4px_0px_#000000]">
                <SpotifyEmbed
                  trackUri={anasData.spotifyTrackUri}
                  isOpen={isOpen}
                />
              </div>
            </div>
          )}

          {/* Terminal Bottom Status */}
          <div className="mt-2 text-center font-mono text-xs text-[#4ade80]/70 flex items-center justify-center gap-2">
            <span className="cursor-blink text-[#4ade80] font-bold">_</span>
            <span>anas@proxy-shakespeare:~$ 0xSESSION_ACTIVE (200 OK)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
