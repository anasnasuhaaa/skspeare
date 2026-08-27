"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { X, RotateCcw, Copy, Sparkles, Crosshair } from "lucide-react";
import gsap from "gsap";
import rizaData from "./data";
import SpotifyEmbed from "@/app/components/SpotifyEmbed";
import ShootingRange from "./ShootingRange";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================
// 🔒 LOCKED: Core component structure
// Must accept isOpen and onClose props and render Riza's data
// ============================================================
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
          setIsUnlocked(false); // Reset game gateway for next open
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
      setToastMessage(`Tersalin ke clipboard: ${label}! ✨`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  if (!shouldRender) return null;

  const cleanInstagram = rizaData.instagramHandle
    ? rizaData.instagramHandle
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
        className="absolute inset-0 bg-nb-black/75 backdrop-blur-sm cursor-pointer"
        aria-hidden="true"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1060] bg-nb-yellow border-[3px] border-nb-black rounded-xl px-5 py-2.5 shadow-[4px_4px_0px_var(--nb-black)] font-display font-black text-xs sm:text-sm text-nb-black uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <span>🎯</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Dialog Container */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto no-scrollbar bg-nb-white border-4 border-nb-black rounded-2xl sm:rounded-3xl shadow-[8px_8px_0px_var(--nb-black)] sm:shadow-[10px_10px_0px_var(--nb-black)] z-10 flex flex-col"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleAnimateClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-9 h-9 sm:w-11 sm:h-11 bg-nb-red hover:bg-nb-yellow text-nb-white hover:text-nb-black border-[3px] border-nb-black rounded-xl shadow-[3px_3px_0px_var(--nb-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] flex items-center justify-center z-50 transition-all cursor-pointer"
          aria-label="Tutup modal"
          title="Tutup Modal"
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* ============================================================
            1. GATEWAY: SHOOTING RANGE MINI-GAME
            ============================================================ */}
        {!isUnlocked ? (
          <div className="w-full flex flex-col">
            <ShootingRange
              onSuccess={() => setIsUnlocked(true)}
              onSkip={() => setIsUnlocked(true)}
            />
          </div>
        ) : (
          /* ============================================================
             2. REVEALED PROFILE CARD
             ============================================================ */
          <div
            ref={profileCardRef}
            className="p-5 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 bg-nb-white text-nb-black"
          >
            {/* Top Gateway Success Banner */}
            <div className="flex items-center justify-between flex-wrap gap-2 p-3 bg-nb-lime border-[3px] border-nb-black rounded-xl shadow-[3px_3px_0px_var(--nb-black)]">
              <div className="flex items-center gap-2 font-display font-black text-xs sm:text-sm uppercase text-nb-black">
                <Sparkles size={18} className="text-nb-black" />
                <span>SHARPSHOOTER ACCESS GRANTED!</span>
              </div>
              <button
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="px-3 py-1 bg-nb-yellow hover:bg-nb-white border-2 border-nb-black rounded-lg font-mono text-xs font-bold text-nb-black shadow-[2px_2px_0px_var(--nb-black)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                title="Mainkan ulang shooting range"
              >
                <RotateCcw size={13} />
                <span>Main Lagi</span>
              </button>
            </div>

            {/* Profile Header (Photo + Name + Role + Details) */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start pt-2 sm:pt-0">
              {/* Photo Frame */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-2xl overflow-hidden border-4 border-nb-black shadow-[5px_5px_0px_var(--nb-black)] bg-nb-cream group">
                <Image
                  src={rizaData.photo}
                  alt={rizaData.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 128px, 160px"
                  priority
                />
                {/* Crosshair Overlay Stamp */}
                <div className="absolute top-2 right-2 bg-nb-yellow border-2 border-nb-black rounded-full p-1 shadow-[1px_1px_0px_var(--nb-black)]">
                  <Crosshair size={14} strokeWidth={3} />
                </div>
              </div>

              {/* Title & Info */}
              <div className="text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-nb-pink border-2 border-nb-black rounded-md font-mono text-xs font-bold text-nb-black mb-2 shadow-[2px_2px_0px_var(--nb-black)] -rotate-1">
                  <span>🎯</span>
                  <span>Anggota Tim // Sharpshooter</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-nb-black mb-3 tracking-tight leading-tight">
                  {rizaData.name}
                </h2>

                <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                  {rizaData.nim && (
                    <button
                      type="button"
                      onClick={() => handleCopy(rizaData.nim!, `NIM ${rizaData.nim}`)}
                      className="px-3.5 py-1.5 bg-nb-cream hover:bg-nb-yellow border-[2.5px] border-nb-black rounded-lg shadow-[2.5px_2.5px_0px_var(--nb-black)] font-mono font-bold text-xs sm:text-sm hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center gap-1.5"
                      title="Klik untuk menyalin NIM"
                    >
                      <span>NIM: {rizaData.nim}</span>
                      <Copy size={13} className="opacity-70" />
                    </button>
                  )}

                  {rizaData.hometown && (
                    <span className="px-3.5 py-1.5 bg-nb-blue border-[2.5px] border-nb-black rounded-lg shadow-[2.5px_2.5px_0px_var(--nb-black)] font-bold text-xs sm:text-sm">
                      📍 {rizaData.hometown}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Quote */}
            {rizaData.quote && (
              <div
                onClick={() => handleCopy(`"${rizaData.quote}"`, "Quote")}
                className="bg-nb-cream border-[3px] border-nb-black rounded-xl p-5 sm:p-6 shadow-[4px_4px_0px_var(--nb-black)] relative cursor-pointer hover:bg-nb-yellow/20 transition-colors"
                title="Klik untuk menyalin Quote"
              >
                <div className="absolute -top-3 -left-2 bg-nb-yellow border-2 border-nb-black rounded-lg px-3 py-0.5 font-display font-black text-xs transform -rotate-2 flex items-center gap-1 shadow-[2px_2px_0px_var(--nb-black)]">
                  <span>Quote</span>
                  <Copy size={11} className="opacity-70" />
                </div>
                <p className="italic text-base sm:text-lg font-bold text-nb-black text-center mt-1">
                  &ldquo;{rizaData.quote}&rdquo;
                </p>
              </div>
            )}

            {/* Hobbies & Instagram Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Hobbies */}
              {rizaData.hobbies && rizaData.hobbies.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <h4 className="font-display font-black text-lg sm:text-xl text-nb-black uppercase tracking-wide flex items-center gap-1.5">
                    <span>📷</span>
                    <span>Hobbies</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rizaData.hobbies.map((hobby, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 bg-nb-pink border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-bold text-xs sm:text-sm"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Instagram */}
              {cleanInstagram && (
                <div className="flex flex-col gap-2.5">
                  <h4 className="font-display font-black text-lg sm:text-xl text-nb-black uppercase tracking-wide flex items-center gap-1.5">
                    <span>📱</span>
                    <span>Instagram</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://instagram.com/${cleanInstagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-nb-white border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] hover:bg-nb-pink hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] font-bold text-xs sm:text-sm text-nb-black transition-all"
                    >
                      📸 @{cleanInstagram}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(`@${cleanInstagram}`, `@${cleanInstagram}`)}
                      className="p-2.5 bg-nb-yellow border-[2.5px] border-nb-black rounded-lg shadow-[2.5px_2.5px_0px_var(--nb-black)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)] transition-all cursor-pointer font-bold text-xs"
                      title="Salin username Instagram"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Spotify Embed Player */}
            {rizaData.spotifyTrackUri && (
              <div className="mt-2 pt-5 border-t-4 border-nb-black border-dashed">
                <h4 className="font-display font-black text-lg sm:text-xl text-nb-black uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span>🎵</span>
                  <span>Now Playing // Favorite Track</span>
                </h4>
                <div className="bg-nb-black rounded-2xl overflow-hidden border-4 border-nb-black shadow-[6px_6px_0px_var(--nb-black)]">
                  <SpotifyEmbed trackUri={rizaData.spotifyTrackUri} isOpen={isOpen && isUnlocked} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
