"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  X,
  RotateCcw,
  Copy,
  ExternalLink,
  Sparkles,
  MapPin,
  Music,
  FileText,
  Zap,
  Shield,
  Flame,
  Droplets,
  Award,
} from "lucide-react";
import gsap from "gsap";
import salmanData from "./data";
import PokemonGuesser from "./PokemonGuesser";
import SpotifyEmbed from "@/app/components/SpotifyEmbed";
import Instagram from "@/app/components/InstagramIcon";

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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-1060 bg-[#ffcb05] border-[3px] border-nb-black rounded-xl px-5 py-2.5 shadow-[4px_4px_0px_var(--nb-black)] font-display font-black text-xs sm:text-sm text-nb-black uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Dialog Container */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[88vh] overflow-hidden bg-[#0c1322] border-4 border-[#ffcb05] rounded-2xl sm:rounded-3xl shadow-[0_0_35px_rgba(255,203,5,0.3),10px_10px_0px_var(--nb-black)] z-10 flex flex-col text-white"
      >
        {/* ============================================================
            1. GATEWAY: POKEMON GUESSING MINI-GAME
            ============================================================ */}
        {!isUnlocked ? (
          <div className="w-full flex-1 flex flex-col overflow-hidden">
            <PokemonGuesser
              onSuccess={() => setIsUnlocked(true)}
              onSkip={() => setIsUnlocked(true)}
              onClose={handleAnimateClose}
            />
          </div>
        ) : (
          /* ============================================================
              2. REVEALED POKÉMON TRADING CARD (SALMAN)
              ============================================================ */
          <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Top Pokemon Trading Card Sticky Header Banner */}
            <div className="sticky top-0 z-30 shrink-0 bg-[#ffcb05] border-b-4 border-nb-black px-4 sm:px-6 py-3 sm:py-3.5 flex justify-between items-center text-nb-black select-none shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
              {/* Left Pokeball & Trainer Title */}
              <div className="flex items-center gap-2">
                <PokeballIcon size={24} />
                <div className="flex items-center gap-1.5 font-display font-black text-xs sm:text-sm uppercase tracking-wider">
                  <span>POKÉDEX ARCHIVE #025 // TRAINER SALMAN</span>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Play Again Button */}
                <button
                  type="button"
                  onClick={() => setIsUnlocked(false)}
                  className="px-2.5 sm:px-3 py-1 bg-white hover:bg-nb-lime text-nb-black border-2 border-nb-black rounded-lg font-display font-black text-xs uppercase shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
                  title="Mainkan ulang tebak pokemon"
                >
                  <RotateCcw size={13} />
                  <span>Main Lagi</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleAnimateClose}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-[#ef4444] hover:bg-white text-white hover:text-black border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center justify-center transition-all cursor-pointer"
                  title="Tutup Modal"
                  aria-label="Tutup modal"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Trading Card Body Content */}
            <div
              ref={profileCardRef}
              className="flex-1 overflow-y-auto no-scrollbar p-5 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-7 bg-linear-to-b from-[#162744] via-[#0e182a] to-[#080d17] text-white relative z-10"
            >
              {/* Pokemon Master Gold Holographic Card Header Bezel */}
              <div className="p-3.5 sm:p-4 bg-linear-to-r from-[#ef4444]/40 via-[#ffcb05]/25 to-[#3b82f6]/40 border-3 border-[#ffcb05] rounded-2xl shadow-[4px_4px_0px_var(--nb-black)] flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ffcb05] border-2 border-black flex items-center justify-center text-black font-black text-xs shadow-[2px_2px_0px_#000]">
                    ⚡
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-mono font-black uppercase text-[#ffcb05] tracking-wider block">
                      STAGE 2 // POKÉMON TRAINER
                    </span>
                    <span className="text-sm sm:text-base font-display font-black text-white uppercase tracking-wide">
                      SALMAN AL FARIZI
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-xl border border-[#ffcb05]/60">
                  <span className="text-xs font-mono text-white/70">HP</span>
                  <span className="font-display font-black text-base text-[#ffcb05]">380</span>
                  <span className="text-sm text-[#ffcb05]">⚡</span>
                </div>
              </div>

              {/* Profile Card Header (Photo in Pokemon Card Illustration Frame) */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start bg-[#0b1320] p-4 sm:p-6 border-3 border-[#ffcb05]/70 rounded-2xl shadow-[6px_6px_0px_#000000] relative">
                {/* Photo Frame (Pokemon Card Foil Art Style) */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl overflow-hidden border-4 border-black shadow-[6px_6px_0px_#ffcb05] bg-linear-to-tr from-[#ef4444] via-[#ffcb05] to-[#3b82f6] p-1.5 group">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                    <Image
                      src={salmanData.photo}
                      alt={salmanData.name}
                      fill
                      sizes="(max-width: 640px) 144px, 176px"
                      className="object-cover group-hover:scale-105 transition-all duration-500"
                      priority
                    />

                    {/* Holographic Foil Shimmer */}
                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Pokeball Stamp in Corner */}
                    <div className="absolute bottom-2 right-2">
                      <PokeballIcon size={22} />
                    </div>
                  </div>
                </div>

                {/* Info & Identity */}
                <div className="text-center sm:text-left flex-1 min-w-0">
                  {/* Card Subtitle */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ef4444] border-2 border-black rounded-lg font-mono text-xs font-black text-white mb-2 shadow-[2px_2px_0px_#000000] -rotate-1">
                    <span>⚡</span>
                    <span>Electric & Coder Type // Anggota</span>
                  </div>

                  {/* Member Name */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-2 tracking-tight leading-tight flex items-center justify-center sm:justify-start gap-2">
                    <span>{salmanData.name}</span>
                    <span className="text-[#ffcb05] text-xl sm:text-2xl">⚡</span>
                  </h2>

                  <p className="text-xs font-mono text-white/60 mb-3 italic">
                    NO. 025 Trainer Pokémon  HT: 5&apos;08&quot;  WT: 138 lbs.
                  </p>

                  {/* Pills: NIM & Hometown */}
                  <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                    {salmanData.nim && (
                      <button
                        type="button"
                        onClick={() => handleCopy(salmanData.nim!, `NIM ${salmanData.nim}`)}
                        className="px-3.5 py-1.5 bg-[#142338] hover:bg-[#ffcb05] hover:text-black border-2 border-[#ffcb05] rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs sm:text-sm text-[#ffcb05] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all cursor-pointer flex items-center gap-2"
                        title="Klik untuk menyalin NIM"
                      >
                        <span>TRAINER ID: {salmanData.nim}</span>
                        <Copy size={13} />
                      </button>
                    )}

                    {salmanData.hometown && (
                      <span className="px-3.5 py-1.5 bg-[#142338] border-2 border-[#3b82f6] rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#3b82f6]" />
                        <span>{salmanData.hometown}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Quote Card (Styled as Pokemon Ability Box) */}
              {salmanData.quote && (
                <div
                  onClick={() => handleCopy(`"${salmanData.quote}"`, "Quote")}
                  className="bg-[#0b1320] border-2 border-[#ffcb05] rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0px_#000000] relative cursor-pointer hover:bg-[#121e33] transition-colors group"
                  title="Klik untuk menyalin Quote"
                >
                  <div className="absolute -top-3.5 left-4 bg-[#ef4444] border-2 border-black rounded-lg px-3 py-0.5 font-display font-black text-xs text-white transform -rotate-1 flex items-center gap-1.5 shadow-[2px_2px_0px_#000000]">
                    <span>⚡</span>
                    <span>POKÉ-ABILITY: SPIDER LEGACY</span>
                  </div>
                  <p className="italic text-base sm:text-lg font-bold text-[#ffcb05] text-center mt-1">
                    &ldquo;{salmanData.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Hobbies / Special Movesets */}
              {salmanData.hobbies && salmanData.hobbies.length > 0 && (
                <div className="flex flex-col gap-3 bg-[#0b1320] p-4 sm:p-5 border-2 border-[#ffcb05]/60 rounded-2xl shadow-[4px_4px_0px_#000000]">
                  <div className="flex items-center justify-between border-b border-[#ffcb05]/30 pb-2">
                    <h4 className="font-display font-black text-sm sm:text-base text-white uppercase tracking-wide flex items-center gap-2">
                      <Zap size={16} className="text-[#ffcb05]" />
                      <span>Special Attacks & Movesets</span>
                    </h4>
                    <span className="text-[11px] font-mono text-[#ffcb05]">PP: 25/25</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {salmanData.hobbies.map((hobby, i) => {
                      const moveDetails = [
                        { energy: "⚡⚡", dmg: "90 DMG", bg: "bg-[#1f2937] border-[#ffcb05] text-[#ffcb05]" },
                        { energy: "🔥⚡", dmg: "75 DMG", bg: "bg-[#271815] border-[#f97316] text-[#f97316]" },
                        { energy: "💧⚡", dmg: "85 DMG", bg: "bg-[#152338] border-[#38bdf8] text-[#38bdf8]" },
                        { energy: "⚡⚡⚡", dmg: "130+ DMG", bg: "bg-[#1c2718] border-[#4ade80] text-[#4ade80]" },
                      ];
                      const detail = moveDetails[i % moveDetails.length];

                      return (
                        <div
                          key={i}
                          className={`p-2.5 border-2 rounded-xl flex items-center justify-between shadow-[2px_2px_0px_#000000] ${detail.bg}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black">{detail.energy}</span>
                            <span className="font-mono font-bold text-xs sm:text-sm text-white">{hobby}</span>
                          </div>
                          <span className="font-display font-black text-xs">{detail.dmg}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PokéGear Network: Instagram, LinkedIn & CV */}
              <div className="flex flex-col gap-3 bg-[#0b1320] p-4 sm:p-5 border-2 border-[#ffcb05]/60 rounded-2xl shadow-[4px_4px_0px_#000000]">
                <div className="flex items-center justify-between border-b border-[#ffcb05]/30 pb-2">
                  <h4 className="font-display font-black text-sm sm:text-base text-white uppercase tracking-wide flex items-center gap-2">
                    <Award size={16} className="text-[#ffcb05]" />
                    <span>PokéGear // Trainer Connect & Items</span>
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
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#142338] border-2 border-[#ec4899] hover:bg-[#ec4899] hover:text-white rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs text-white transition-all truncate"
                        title="Buka profil Instagram"
                      >
                        <Instagram size={15} className="text-[#ec4899] shrink-0" />
                        <span className="truncate">@{cleanInstagram}</span>
                        <ExternalLink size={12} className="opacity-60 shrink-0" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(`@${cleanInstagram}`, `@${cleanInstagram}`)}
                        className="p-2 bg-[#ffcb05] hover:bg-[#22c55e] border-2 border-black text-black rounded-xl shadow-[2px_2px_0px_#000000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all cursor-pointer font-bold text-xs shrink-0"
                        title="Salin username Instagram"
                      >
                        COPY
                      </button>
                    </div>
                  )}

                  {/* LinkedIn */}
                  {salmanData.linkedinUrl && (
                    <a
                      href={
                        salmanData.linkedinUrl.startsWith("http")
                          ? salmanData.linkedinUrl
                          : `https://${salmanData.linkedinUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#142338] border-2 border-[#0284c7] hover:bg-[#0284c7] hover:text-white rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs text-white transition-all"
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
                  {salmanData.cvUrl && (
                    <a
                      href={
                        salmanData.cvUrl.startsWith("http")
                          ? salmanData.cvUrl
                          : `https://${salmanData.cvUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#142338] border-2 border-[#ffcb05] hover:bg-[#ffcb05] hover:text-black rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs text-[#ffcb05] transition-all"
                      title="Buka Curriculum Vitae"
                    >
                      <FileText size={15} className="shrink-0" />
                      <span>Trainer Resume / CV</span>
                      <ExternalLink size={12} className="opacity-60 shrink-0" />
                    </a>
                  )}
                </div>
              </div>

              {/* Spotify Player */}
              {salmanData.spotifyTrackUri && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 font-display font-bold text-sm text-white mb-2.5">
                    <Music size={16} className="text-[#ffcb05]" />
                    <span>Trainer Gym Battle Theme // Favorite Track</span>
                  </div>
                  <div className="bg-black rounded-2xl overflow-hidden border-2 border-[#ffcb05] shadow-[4px_4px_0px_#000000]">
                    <SpotifyEmbed
                      trackUri={salmanData.spotifyTrackUri}
                      isOpen={isOpen && isUnlocked}
                    />
                  </div>
                </div>
              )}

              {/* Bottom TCG Card Rules & Footer */}
              <div className="mt-1 p-3 bg-black/60 border border-[#ffcb05]/40 rounded-xl text-center font-mono text-[10px] sm:text-xs text-white/70 flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-3 text-white/50 text-[10px]">
                  <span>Weakness: ☕ ×2</span>
                  <span>|</span>
                  <span>Resistance: 💻 -30</span>
                  <span>|</span>
                  <span>Retreat: ⚡</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#ffcb05]">
                  <PokeballIcon size={12} />
                  <span>★ 025/151 ★ POKÉMON TRADING CARD // PROXY SHAKESPEARE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
