"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { X, RotateCcw, Copy, ExternalLink, Sparkles, MapPin, Trophy, Music } from "lucide-react";
import gsap from "gsap";
import salmanData from "./data";
import PokemonGuesser from "./PokemonGuesser";
import SpotifyEmbed from "@/app/components/SpotifyEmbed";

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

// Mini Pokeball Icon Component
const PokeballIcon = ({ size = 20 }: { size?: number }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full border-2 border-nb-black bg-white overflow-hidden flex flex-col justify-between relative shadow-[1px_1px_0px_var(--nb-black)] shrink-0"
  >
    <div className="w-full h-1/2 bg-[#ef4444] border-b border-nb-black" />
    <div className="w-full h-1/2 bg-[#ffffff] border-t border-nb-black" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-2.5 h-2.5 rounded-full bg-white border border-nb-black flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-nb-black" />
      </div>
    </div>
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ isOpen, onClose }: ModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isUnlocked, setIsUnlocked] = useState(false);
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
          setIsUnlocked(false); // Reset Pokemon game for next open
          onClose();
        },
      });
    } else {
      document.body.style.overflow = "";
      setShouldRender(false);
      setIsUnlocked(false);
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

  // Modal open entrance animation
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

  // Reveal profile card animation when unlocked
  useEffect(() => {
    if (isUnlocked && profileCardRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          profileCardRef.current,
          { scale: 0.92, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.5)" }
        );
      });
      return () => ctx.revert();
    }
  }, [isUnlocked]);

  // Escape key handler
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

  const cleanInstagram = salmanData.instagramHandle
    ? salmanData.instagramHandle
        .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
        .replace(/^@/, "")
        .replace(/\/$/, "")
    : "";

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-3 sm:p-5 md:p-8">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleAnimateClose}
        className="absolute inset-0 bg-nb-black/85 backdrop-blur-md cursor-pointer"
        aria-hidden="true"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-1060 bg-nb-yellow border-[3px] border-nb-black rounded-xl px-5 py-2.5 shadow-[4px_4px_0px_var(--nb-black)] font-display font-black text-xs sm:text-sm text-nb-black uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Dialog Container */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto no-scrollbar bg-[#0f172a] border-4 border-nb-black rounded-2xl sm:rounded-3xl shadow-[10px_10px_0px_var(--nb-black)] sm:shadow-[14px_14px_0px_var(--nb-black)] z-10 flex flex-col text-white"
      >
        {/* ============================================================
            1. GATEWAY: POKEMON GUESSING MINI-GAME
            ============================================================ */}
        {!isUnlocked ? (
          <div className="w-full flex flex-col relative">
            {/* Close Button on Guesser */}
            <button
              type="button"
              onClick={handleAnimateClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 bg-nb-red hover:bg-nb-yellow text-white hover:text-nb-black border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] flex items-center justify-center z-50 transition-all cursor-pointer"
              title="Tutup Modal"
              aria-label="Tutup modal"
            >
              <X size={18} strokeWidth={3} />
            </button>

            <PokemonGuesser
              onSuccess={() => setIsUnlocked(true)}
              onSkip={() => setIsUnlocked(true)}
            />
          </div>
        ) : (
          /* ============================================================
              2. REVEALED POKÉMON TRADING CARD (SALMAN)
              ============================================================ */
          <div
            ref={profileCardRef}
            className="flex flex-col bg-linear-to-b from-[#1e293b] via-[#0f172a] to-[#090d16] text-white relative"
          >
            {/* Top Pokemon Trading Card Header Banner */}
            <div className="bg-nb-yellow border-b-4 border-nb-black px-4 sm:px-6 py-3.5 flex justify-between items-center relative z-20 text-nb-black select-none">
              {/* Left Pokeball & Trainer Title */}
              <div className="flex items-center gap-2">
                <PokeballIcon size={24} />
                <div className="flex items-center gap-1.5 font-display font-black text-xs sm:text-sm uppercase tracking-wider">
                  <span>POKÉDEX // TRAINER PROFILE</span>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Play Again Button */}
                <button
                  type="button"
                  onClick={() => setIsUnlocked(false)}
                  className="px-2.5 sm:px-3 py-1 bg-nb-lime hover:bg-nb-white text-nb-black border-2 border-nb-black rounded-lg font-display font-black text-xs uppercase shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer flex items-center gap-1"
                  title="Mainkan ulang tebak pokemon"
                >
                  <RotateCcw size={13} />
                  <span>Main Lagi</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleAnimateClose}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-nb-red hover:bg-nb-yellow text-white hover:text-nb-black border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center justify-center transition-all cursor-pointer"
                  title="Tutup Modal"
                  aria-label="Tutup modal"
                >
                  <X size={18} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Trading Card Body Content */}
            <div className="p-5 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 relative z-10">
              {/* Holographic Card Frame Accent */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-nb-yellow pointer-events-none opacity-80" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-nb-yellow pointer-events-none opacity-80" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-nb-yellow pointer-events-none opacity-80" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-nb-yellow pointer-events-none opacity-80" />

              {/* Pokemon Master Header Banner */}
              <div className="flex items-center justify-between flex-wrap gap-2 p-3 sm:p-4 bg-linear-to-r from-nb-red/30 via-nb-yellow/20 to-nb-blue/30 border-2 border-nb-yellow rounded-2xl shadow-[4px_4px_0px_var(--nb-black)]">
                <div className="flex items-center gap-2 font-display font-black text-xs sm:text-sm uppercase tracking-wide text-nb-yellow">
                  <Sparkles size={18} className="text-nb-yellow animate-spin" />
                  <span>★ POKÉMON MASTER UNLOCKED ★</span>
                </div>
                <div className="flex items-center gap-1 bg-nb-black/60 px-2.5 py-0.5 rounded-lg border border-nb-yellow/40 font-mono text-[11px] text-white">
                  <span>HP 350 / 350</span>
                </div>
              </div>

              {/* Profile Card Header (Photo + Name + NIM + Badges) */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
                {/* Photo Frame (Pokemon Card Foil Style) */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl overflow-hidden border-4 border-nb-black shadow-[6px_6px_0px_#facc15] bg-linear-to-tr from-nb-red via-nb-yellow to-nb-blue p-1 group">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                    <Image
                      src={salmanData.photo}
                      alt={salmanData.name}
                      fill
                      sizes="(max-width: 640px) 144px, 176px"
                      className="object-cover group-hover:scale-105 transition-all duration-500"
                      priority
                    />

                    {/* Holographic Sheen Overlay */}
                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Pokeball Stamp in Corner */}
                    <div className="absolute bottom-2 right-2">
                      <PokeballIcon size={22} />
                    </div>
                  </div>
                </div>

                {/* Info & Identity */}
                <div className="text-center sm:text-left flex-1">
                  {/* Role Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-nb-red border-2 border-nb-black rounded-lg font-mono text-xs font-black text-white mb-2.5 shadow-[2px_2px_0px_var(--nb-black)] -rotate-1">
                    <span>⚡</span>
                    <span>{salmanData.role} // Pokémon Trainer</span>
                  </div>

                  {/* Member Name */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-3 tracking-tight leading-tight drop-shadow-[2px_2px_0px_var(--nb-black)] flex items-center justify-center sm:justify-start gap-2">
                    <span>{salmanData.name}</span>
                    <span className="text-nb-yellow text-xl sm:text-2xl">⚡</span>
                  </h2>

                  {/* Pills: NIM & Hometown */}
                  <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                    {salmanData.nim && (
                      <button
                        type="button"
                        onClick={() => handleCopy(salmanData.nim!, `NIM ${salmanData.nim}`)}
                        className="px-3.5 py-1.5 bg-[#16202c] hover:bg-nb-yellow hover:text-nb-black border-2 border-nb-yellow rounded-xl shadow-[3px_3px_0px_var(--nb-black)] font-mono font-bold text-xs sm:text-sm text-nb-yellow hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center gap-2"
                        title="Klik untuk menyalin NIM"
                      >
                        <span>NIM: {salmanData.nim}</span>
                        <Copy size={13} />
                      </button>
                    )}

                    {salmanData.hometown && (
                      <span className="px-3.5 py-1.5 bg-[#16202c] border-2 border-nb-blue rounded-xl shadow-[3px_3px_0px_var(--nb-black)] font-mono font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                        <MapPin size={14} className="text-nb-blue" />
                        <span>{salmanData.hometown}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Quote Card (If provided) */}
              {salmanData.quote && (
                <div
                  onClick={() => handleCopy(`"${salmanData.quote}"`, "Quote")}
                  className="bg-[#16202c] border-[3px] border-nb-yellow rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0px_var(--nb-black)] relative cursor-pointer hover:bg-[#1f2937] transition-colors group"
                  title="Klik untuk menyalin Quote"
                >
                  <div className="absolute -top-3.5 -left-2 bg-nb-yellow border-2 border-nb-black rounded-lg px-3 py-0.5 font-display font-black text-xs text-nb-black transform -rotate-2 flex items-center gap-1 shadow-[2px_2px_0px_var(--nb-black)]">
                    <span>💬 TRAINER MEMO</span>
                  </div>
                  <p className="italic text-base sm:text-lg font-bold text-nb-yellow text-center mt-1">
                    &ldquo;{salmanData.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Hobbies & Instagram Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Hobbies / Pokemon Movesets */}
                {salmanData.hobbies && salmanData.hobbies.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <h4 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wide flex items-center gap-2">
                      <span className="text-nb-yellow">⚔️</span>
                      <span>Hobbies // Special Moves</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {salmanData.hobbies.map((hobby, i) => {
                        const colors = [
                          "bg-[#103a27] border-[#4ade80] text-[#4ade80]",
                          "bg-[#451205] border-[#f97316] text-[#f97316]",
                          "bg-[#3f3103] border-[#facc15] text-[#facc15]",
                          "bg-[#1e1b4b] border-[#818cf8] text-[#818cf8]",
                        ];
                        const chosenColor = colors[i % colors.length];

                        return (
                          <span
                            key={i}
                            className={`px-3.5 py-1.5 border-2 font-mono font-bold text-xs sm:text-sm rounded-xl shadow-[3px_3px_0px_var(--nb-black)] flex items-center gap-1.5 ${chosenColor}`}
                          >
                            <span>✦</span>
                            <span>{hobby}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Instagram Profile */}
                {cleanInstagram && (
                  <div className="flex flex-col gap-2.5">
                    <h4 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wide flex items-center gap-2">
                      <InstagramIcon size={16} className="text-nb-pink" />
                      <span>Instagram Feed</span>
                    </h4>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://instagram.com/${cleanInstagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#16202c] border-2 border-nb-pink hover:bg-nb-pink hover:text-nb-black rounded-xl shadow-[3px_3px_0px_var(--nb-black)] font-mono font-bold text-xs sm:text-sm text-white transition-all"
                      >
                        <InstagramIcon size={14} className="text-nb-pink" />
                        <span>@{cleanInstagram}</span>
                        <ExternalLink size={12} className="opacity-70" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(`@${cleanInstagram}`, `@${cleanInstagram}`)}
                        className="p-2.5 bg-nb-yellow hover:bg-nb-lime border-2 border-nb-black text-nb-black rounded-xl shadow-[2.5px_2.5px_0px_var(--nb-black)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)] transition-all cursor-pointer font-bold text-xs"
                        title="Salin username Instagram"
                      >
                        COPY
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Spotify Player (If provided) */}
              {salmanData.spotifyTrackUri && (
                <div className="mt-2 pt-5 border-t-2 border-nb-yellow/30 border-dashed">
                  <h4 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Music size={16} className="text-nb-lime" />
                    <span>Battle Theme // Favorite Track</span>
                  </h4>
                  <div className="bg-black rounded-2xl overflow-hidden border-[3px] border-nb-yellow shadow-[6px_6px_0px_var(--nb-black)]">
                    <SpotifyEmbed
                      trackUri={salmanData.spotifyTrackUri}
                      isOpen={isOpen && isUnlocked}
                    />
                  </div>
                </div>
              )}

              {/* Bottom Status Card Footer */}
              <div className="mt-2 text-center font-mono text-xs text-white/50 flex items-center justify-center gap-2">
                <PokeballIcon size={14} />
                <span>POKÉDEX ENTRY COMPLETE // TRAINER SALMAN</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
