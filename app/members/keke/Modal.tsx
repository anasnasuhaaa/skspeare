"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Press_Start_2P } from "next/font/google";
import {
  X,
  RotateCcw,
  Copy,
  ExternalLink,
  Sparkles,
  MapPin,
  Music,
  Wand2,
  FileText,
} from "lucide-react";
import gsap from "gsap";
import kekeData from "./data";
import ClawMachine from "./ClawMachine";
import Instagram from "@/app/components/InstagramIcon";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Custom SVG Instagram Icon
const InstagramIcon = ({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Reusable Pixel Corner Brackets component
const PixelCornerBrackets = ({ color = "border-yellow-300" }: { color?: string }) => (
  <>
    <div className={`absolute top-1.5 left-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 border-t-2 border-l-2 ${color} pointer-events-none`} />
    <div className={`absolute top-1.5 right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 border-t-2 border-r-2 ${color} pointer-events-none`} />
    <div className={`absolute bottom-1.5 left-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 border-b-2 border-l-2 ${color} pointer-events-none`} />
    <div className={`absolute bottom-1.5 right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 border-b-2 border-r-2 ${color} pointer-events-none`} />
  </>
);

// Helper to construct reliable Spotify Embed URL
const getSpotifyEmbedUrl = (uri: string) => {
  if (!uri) return "";
  const match = uri.match(/track[/:]([a-zA-Z0-9]+)/);
  const trackId = match ? match[1] : uri;
  return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ isOpen, onClose }: ModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isGameCleared, setIsGameCleared] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);

  const handleAnimateClose = useCallback(() => {
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
          setIsGameCleared(false); // Reset Claw Machine for next time
          onClose();
        },
      });
    } else {
      document.body.style.overflow = "";
      setShouldRender(false);
      setIsGameCleared(false);
      onClose();
    }
  }, [onClose]);

  // Sync open state
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, 0);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else if (shouldRender) {
      handleAnimateClose();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, shouldRender, handleAnimateClose]);

  // Entrance animation for modal container
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
          { scale: 0.94, opacity: 0, y: 25 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" }
        );
      });
      return () => ctx.revert();
    }
  }, [shouldRender]);

  // Reveal animation when Claw Machine is cleared and profile appears
  useEffect(() => {
    if (isGameCleared && profileCardRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          profileCardRef.current,
          { scale: 0.92, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.5)" }
        );
      });
      return () => ctx.revert();
    }
  }, [isGameCleared]);

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
  }, [isOpen, handleAnimateClose]);

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setToastMessage(`Tersalin: ${label}`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  if (!shouldRender) return null;

  const cleanInstagram = kekeData.instagramHandle
    ? kekeData.instagramHandle
      .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
      .replace(/^@/, "")
      .replace(/\/$/, "")
    : "";

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-2 sm:p-4 md:p-6 font-mono overflow-y-auto overscroll-contain">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleAnimateClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        aria-hidden="true"
      />

      {/* Floating Pixel Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-1060 bg-yellow-400 border-4 border-black px-4 sm:px-5 py-2 sm:py-2.5 shadow-[4px_4px_0px_#000000] font-mono font-black text-xs sm:text-sm text-black uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2 max-w-[90vw] truncate">
          <span>✦</span>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Modal Dialog Container with Retro Pixel Scrollbar */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl lg:max-w-3xl max-h-[85vh] sm:max-h-[88vh] overflow-hidden bg-[#1c122c] border-[3px] sm:border-4 border-black shadow-[6px_6px_0px_#000000] sm:shadow-[12px_12px_0px_#000000] z-10 flex flex-col text-white my-auto"
      >
        {/* ============================================================
            PHASE 1: CLAW MACHINE MINI-GAME
            ============================================================ */}
        {!isGameCleared ? (
          <div className="w-full flex-1 flex flex-col overflow-hidden">
            <ClawMachine
              onSuccess={() => setIsGameCleared(true)}
              onSkip={() => setIsGameCleared(true)}
              onClose={handleAnimateClose}
            />
          </div>
        ) : (
          /* ============================================================
              PHASE 2: REVEALED PIXEL ART PROFILE CARD (KEISHA / KEKE)
              ============================================================ */
          <div className="w-full h-full flex flex-col overflow-hidden bg-linear-to-b from-[#241734] via-[#1c122c] to-[#0f091c] text-white relative font-mono">
            {/* Background Scanline Overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-0 opacity-15"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.4) 2px, rgba(0, 0, 0, 0.4) 4px)",
              }}
            />

            {/* Top Pixel Art Sticky Header Banner */}
            <div className="sticky top-0 bg-[#ec4899] border-b-[3px] sm:border-b-4 border-black px-3 sm:px-5 py-2.5 sm:py-3 flex justify-between items-center z-30 text-black select-none shrink-0 shadow-[0_2px_0px_#000000]">
              {/* Left Magician Title */}
              <div className="flex items-center gap-1.5 min-w-0">
                <Wand2 size={16} className="text-black shrink-0" />
                <span className={`${pixelFont.className} text-[9px] sm:text-xs truncate font-black tracking-wide`}>
                  KEKE // PIXEL PROFILE
                </span>
              </div>

              {/* Right Controls: Play Again + Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Play Again Button */}
                <button
                  type="button"
                  onClick={() => setIsGameCleared(false)}
                  className="px-2 sm:px-3 py-1 bg-yellow-400 hover:bg-white text-black border-2 border-black font-mono font-black text-[10px] sm:text-xs uppercase shadow-[1.5px_1.5px_0px_#000000] sm:shadow-[2px_2px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer flex items-center gap-1"
                  title="Mainkan ulang capit boneka"
                >
                  <RotateCcw size={12} />
                  <span>Main Lagi</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleAnimateClose}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f43f5e] hover:bg-yellow-400 text-white hover:text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000000] sm:shadow-[2px_2px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center justify-center transition-all cursor-pointer shrink-0"
                  title="Tutup Modal"
                  aria-label="Tutup modal"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Profile Body Content */}
            <div
              ref={profileCardRef}
              className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-5 md:p-7 flex flex-col gap-3.5 sm:gap-5 relative z-10 scrollbar-thin [scrollbar-color:#ff4081_#120a1f] [&::-webkit-scrollbar]:w-2 sm:[&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:bg-[#120a1f] [&::-webkit-scrollbar-track]:border-l-2 [&::-webkit-scrollbar-track]:border-black [&::-webkit-scrollbar-thumb]:bg-[#ff4081] [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-black [&::-webkit-scrollbar-thumb:hover]:bg-yellow-400"
            >
              {/* Outer Frame Corner Accents */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#ec4899] pointer-events-none opacity-80" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#ec4899] pointer-events-none opacity-80" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#ec4899] pointer-events-none opacity-80" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#ec4899] pointer-events-none opacity-80" />

              {/* ============================================================
                  SECTION 1: BIODATA & IDENTITY (RESPONSIVE)
                  ============================================================ */}
              <div className="bg-[#241734] border-[3px] sm:border-4 border-black shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] p-3.5 sm:p-5 md:p-6 relative">
                <PixelCornerBrackets color="border-pink-400" />

                {/* Section Header Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ec4899] border-2 border-black font-mono text-xs font-black text-black mb-3 sm:mb-4 shadow-[2px_2px_0px_#000000] -rotate-1">
                  <span>👤</span>
                  <span className={`${pixelFont.className} text-[8px] sm:text-[10px] tracking-wider`}>
                    BIODATA // IDENTITAS
                  </span>
                </div>

                {/* Photo & Info Row */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
                  {/* Photo Frame */}
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 border-[3px] sm:border-4 border-black shadow-[4px_4px_0px_#ec4899] bg-linear-to-tr from-[#ec4899] via-yellow-300 to-[#38bdf8] p-1 group">
                    <div className="relative w-full h-full border-2 border-black overflow-hidden bg-black">
                      <Image
                        src={kekeData.photo}
                        alt={kekeData.name}
                        fill
                        sizes="(max-width: 640px) 112px, 144px"
                        className="object-cover group-hover:scale-105 transition-all duration-500"
                        priority
                      />

                      {/* Pixel Sheen Overlay */}
                      <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Corner Accents on Photo */}
                      <PixelCornerBrackets color="border-yellow-300" />

                      {/* Pixel Badge in Corner */}
                      <div className="absolute bottom-1 right-1 bg-yellow-400 border border-black px-1 py-0.2 text-[7px] font-black text-black shadow-[1px_1px_0px_#000000]">
                        ★ 8-BIT
                      </div>
                    </div>
                  </div>

                  {/* Info & Identity */}
                  <div className="text-center sm:text-left flex-1 min-w-0 w-full">
                    {/* Role Pill */}
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#ff4081] border-2 border-black font-mono text-[10px] sm:text-[11px] font-black text-black mb-1.5 shadow-[1.5px_1.5px_0px_#000000]">
                      <span>✦</span>
                      <span>{kekeData.role} // Pixel Magician</span>
                    </div>

                    {/* Member Name */}
                    <h2
                      className={`${pixelFont.className} text-sm sm:text-xl md:text-2xl font-black text-white mb-2 tracking-tight leading-snug drop-shadow-[1.5px_1.5px_0px_#000000] flex items-center justify-center sm:justify-start gap-1.5 flex-wrap`}
                    >
                      <span>{kekeData.name}</span>
                      <span className="text-yellow-400 text-xs sm:text-sm">✦</span>
                    </h2>

                    {/* Pills: NIM & Hometown */}
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                      {kekeData.nim && (
                        <button
                          type="button"
                          onClick={() => handleCopy(kekeData.nim!, `NIM ${kekeData.nim}`)}
                          className="px-2.5 py-1 bg-[#170c26] hover:bg-yellow-400 hover:text-black border-2 border-[#ec4899] shadow-[2px_2px_0px_#000000] font-mono font-bold text-[11px] sm:text-xs text-pink-300 hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_#000000] transition-all cursor-pointer flex items-center gap-1.5"
                          title="Klik untuk menyalin NIM"
                        >
                          <span>NIM: {kekeData.nim}</span>
                          <Copy size={11} />
                        </button>
                      )}

                      {kekeData.hometown && (
                        <span className="px-2.5 py-1 bg-[#170c26] border-2 border-[#38bdf8] shadow-[2px_2px_0px_#000000] font-mono font-bold text-[11px] sm:text-xs text-white flex items-center gap-1">
                          <MapPin size={12} className="text-[#38bdf8]" />
                          <span>{kekeData.hometown}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================
                  SECTION 2: QUOTE // PIXEL MEMO
                  ============================================================ */}
              {kekeData.quote && (
                <div
                  onClick={() => handleCopy(`"${kekeData.quote}"`, "Quote")}
                  className="bg-[#2a1b40] border-[3px] sm:border-4 border-yellow-400 p-3.5 sm:p-4 shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] relative cursor-pointer hover:bg-[#34224f] transition-colors group mt-1"
                  title="Klik untuk menyalin Quote"
                >
                  <PixelCornerBrackets color="border-yellow-300" />

                  {/* Section Badge */}
                  <div className="absolute -top-5 left-3 bg-yellow-400 border-2 border-black px-2 py-0.5 font-mono text-black transform -rotate-1 flex items-center gap-1 shadow-[1.5px_1.5px_0px_#000000]">
                    <span>💬</span>
                    <span className={`${pixelFont.className} text-[7px] sm:text-[8px] font-black`}>
                      QUOTE // PIXEL MEMO
                    </span>
                  </div>

                  <p className="italic text-xs sm:text-sm md:text-base font-bold text-yellow-300 text-center mt-1">
                    &ldquo;{kekeData.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* ============================================================
                  SECTION 3 & 4: HOBBIES & CONTACT GRID (RESPONSIVE)
                  ============================================================ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Hobbies Card */}
                {kekeData.hobbies && kekeData.hobbies.length > 0 && (
                  <div className="bg-[#241734] border-[3px] sm:border-4 border-black shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] p-3.5 sm:p-4 relative flex flex-col justify-between">
                    <PixelCornerBrackets color="border-yellow-400" />

                    <div>
                      {/* Section Badge */}
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-yellow-400 border-2 border-black font-mono text-black mb-2.5 shadow-[1.5px_1.5px_0px_#000000] -rotate-1">
                        <span>🎒</span>
                        <span className={`${pixelFont.className} text-[7px] sm:text-[8px] font-black`}>
                          HOBBIES // INVENTORY
                        </span>
                      </div>

                      {/* Items Slot List */}
                      <div className="flex flex-col gap-1.5">
                        {kekeData.hobbies.map((hobby, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-1.5 sm:p-2 bg-[#120a1f] border-2 border-[#ec4899] shadow-[2px_2px_0px_#000000] text-white"
                          >
                            <span className="w-1.5 h-1.5 bg-yellow-400 border border-black animate-pulse shrink-0" />
                            <span className="text-[9px] sm:text-[10px] text-pink-400 font-bold font-mono shrink-0">
                              [SLOT {String(i + 1).padStart(2, "0")}]
                            </span>
                            <span className="font-mono font-bold text-xs sm:text-sm text-yellow-200 truncate">
                              {hobby}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact & Social Card */}
                <div className="bg-[#241734] border-[3px] sm:border-4 border-black shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] p-3.5 sm:p-4 relative flex flex-col justify-between">
                  <PixelCornerBrackets color="border-[#38bdf8]" />

                  <div>
                    {/* Section Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#38bdf8] border-2 border-black font-mono text-black mb-2.5 shadow-[1.5px_1.5px_0px_#000000] -rotate-1">
                      <span>📡</span>
                      <span className={`${pixelFont.className} text-[7px] sm:text-[8px] font-black`}>
                        CONTACT // SOCIAL
                      </span>
                    </div>

                    {/* Instagram & External Links */}
                    <div className="flex flex-col gap-2">
                      {cleanInstagram && (
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`https://instagram.com/${cleanInstagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-0 inline-flex items-center justify-between gap-1.5 px-2.5 py-1.5 bg-[#120a1f] border-2 border-[#ec4899] hover:bg-[#ec4899] hover:text-black shadow-[2px_2px_0px_#000000] font-mono font-bold text-xs text-white transition-all truncate"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <Instagram size={13} className="text-[#ec4899] shrink-0" />
                              <span className="truncate">@{cleanInstagram}</span>
                            </div>
                            <ExternalLink size={11} className="opacity-70 shrink-0" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(`@${cleanInstagram}`, `@${cleanInstagram}`)}
                            className="px-2 py-1.5 bg-yellow-400 hover:bg-[#ec4899] border-2 border-black text-black shadow-[2px_2px_0px_#000000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_#000000] transition-all cursor-pointer font-bold text-xs shrink-0"
                            title="Salin username Instagram"
                          >
                            COPY
                          </button>
                        </div>
                      )}

                      {/* LinkedIn & CV Actions */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {kekeData.linkedinUrl && (
                          <a
                            href={
                              kekeData.linkedinUrl.startsWith("http")
                                ? kekeData.linkedinUrl
                                : `https://${kekeData.linkedinUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 px-2 bg-[#0284c7] hover:bg-yellow-400 hover:text-black border-2 border-black shadow-[2px_2px_0px_#000000] text-xs font-mono font-bold text-white flex items-center justify-center gap-1.5 transition-all truncate"
                          >
                            <Image
                              src="/linkedin2.svg"
                              alt="LinkedIn"
                              width={13}
                              height={13}
                              className="w-3.5 h-3.5 object-contain shrink-0"
                            />
                            <span className="truncate">LinkedIn</span>
                          </a>
                        )}

                        {kekeData.cvUrl && (
                          <a
                            href={
                              kekeData.cvUrl.startsWith("http")
                                ? kekeData.cvUrl
                                : `https://${kekeData.cvUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 bg-[#f43f5e] hover:bg-yellow-400 hover:text-black border-2 border-black shadow-[2px_2px_0px_#000000] text-xs font-mono font-bold text-white flex items-center justify-center gap-1 transition-all shrink-0"
                          >
                            <FileText size={12} />
                            <span>CV</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================
                  SECTION 5: SPOTIFY TRACK (ARCADE OST - DIRECT EMBED)
                  ============================================================ */}
              {kekeData.spotifyTrackUri && (
                <div className="bg-[#241734] border-[3px] sm:border-4 border-black shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] p-3.5 sm:p-5 relative">
                  <PixelCornerBrackets color="border-[#4ade80]" />

                  {/* Section Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#4ade80] border-2 border-black font-mono text-black mb-3 shadow-[2px_2px_0px_#000000] -rotate-1">
                    <Music size={13} className="text-black shrink-0" />
                    <span className={`${pixelFont.className} text-[8px] sm:text-[9px] font-black`}>
                      ARCADE OST // SOUNDTRACK
                    </span>
                  </div>

                  {/* Spotify Player Container */}
                  <div className="w-full bg-[#121212] border-2 sm:border-3 border-black shadow-[3px_3px_0px_#000000] overflow-hidden min-h-38 relative rounded-none">
                    <iframe
                      src={getSpotifyEmbedUrl(kekeData.spotifyTrackUri)}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="w-full block"
                      title="Spotify Track Player"
                    />
                  </div>
                </div>
              )}

              {/* Bottom Status Card Footer */}
              <div className="mt-1 text-center font-mono text-[10px] sm:text-[11px] text-white/50 flex items-center justify-center gap-1.5">
                <span>✦</span>
                <span className="truncate">TRANSMISSION COMPLETE // KEKE&apos;S PIXEL ARCADE</span>
                <span>✦</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


