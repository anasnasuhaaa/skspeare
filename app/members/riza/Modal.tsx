"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  X,
  RotateCcw,
  Copy,
  Crosshair,
  Target,
  MapPin,
  Camera,
  Music,
  ShieldCheck,
  Check,
} from "lucide-react";
import gsap from "gsap";
import rizaData from "./data";
import SpotifyEmbed from "@/app/components/SpotifyEmbed";
import ShootingRange from "./ShootingRange";

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
      setToastMessage(`Tersalin: ${label}`);
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
      {/* Google Font Embed for Valorant Typography */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Teko:wght@600;700&family=Share+Tech+Mono&display=swap');
            .font-valorant-title { font-family: 'Teko', 'Rajdhani', sans-serif; }
            .font-valorant-sub { font-family: 'Rajdhani', sans-serif; }
            .font-valorant-mono { font-family: 'Share Tech Mono', monospace; }
          `,
        }}
      />

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleAnimateClose}
        className="absolute inset-0 bg-[#0F1923]/85 backdrop-blur-md cursor-pointer"
        aria-hidden="true"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1060] bg-[#161F28] border border-[#FF4655] px-5 py-2.5 shadow-[0_0_20px_rgba(255,70,85,0.4)] font-valorant-mono text-xs sm:text-sm text-[#ECE8E1] uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          <Check size={16} className="text-[#FF4655]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Dialog Container */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto no-scrollbar bg-[#0F1923] border border-[#303946] shadow-[0_0_40px_rgba(0,0,0,0.8)] z-10 flex flex-col text-[#ECE8E1]"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))",
        }}
      >
        {/* Tactical Corner Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#FF4655] pointer-events-none z-40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#FF4655] pointer-events-none z-40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#FF4655] pointer-events-none z-40" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleAnimateClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 bg-[#FF4655] hover:bg-[#E03645] text-white flex items-center justify-center z-50 transition-all duration-200 cursor-pointer shadow-[0_0_12px_rgba(255,70,85,0.4)]"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          }}
          aria-label="Tutup modal"
          title="Tutup Modal"
        >
          <X size={18} strokeWidth={2.5} />
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
            className="p-5 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 bg-[#0F1923] text-[#ECE8E1]"
          >
            {/* Top Gateway Success Banner */}
            <div
              className="flex items-center justify-between flex-wrap gap-2 p-3 sm:p-4 bg-gradient-to-r from-[#FF4655]/25 via-[#161F28] to-[#161F28] border-l-4 border-l-[#FF4655] border-y border-r border-[#303946] shadow-[0_0_15px_rgba(255,70,85,0.15)]"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
              }}
            >
              <div className="flex items-center gap-2.5 font-valorant-title font-bold text-sm sm:text-base uppercase tracking-wider text-[#ECE8E1]">
                <ShieldCheck size={20} className="text-[#FF4655]" />
                <span>SHARPSHOOTER ACCESS GRANTED!</span>
              </div>
              <button
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="px-3.5 py-1.5 bg-[#1F2326] hover:bg-[#FF4655] text-[#ECE8E1] hover:text-white border border-[#303946] hover:border-[#FF4655] font-valorant-mono text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                }}
                title="Mainkan ulang shooting range"
              >
                <RotateCcw size={13} />
                <span>Main Lagi</span>
              </button>
            </div>

            {/* Profile Header (Photo + Name + Role + Details) */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start pt-2 sm:pt-0">
              {/* Photo Frame */}
              <div
                className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 overflow-hidden border border-[#303946] bg-[#161F28] group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                }}
              >
                <Image
                  src={rizaData.photo}
                  alt={rizaData.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 128px, 160px"
                  priority
                />

                {/* Tactical Corner Marks */}
                <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-[#FF4655]/80 pointer-events-none" />
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-[#FF4655]/80 pointer-events-none" />

                {/* Crosshair Overlay Stamp */}
                <div
                  className="absolute top-2 right-2 bg-[#FF4655] text-white p-1 shadow-[0_0_8px_rgba(255,70,85,0.6)]"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                  }}
                >
                  <Crosshair size={13} strokeWidth={2.5} />
                </div>
              </div>

              {/* Title & Info */}
              <div className="text-center sm:text-left flex-1">
                {/* Role Badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#161F28] border border-[#FF4655]/60 font-valorant-mono text-xs font-semibold text-[#ECE8E1] mb-2 tracking-wider"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                  }}
                >
                  <Target size={13} className="text-[#FF4655]" />
                  <span>Anggota Tim // Sharpshooter</span>
                </div>

                {/* Agent Name */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-valorant-title font-bold text-[#ECE8E1] mb-3 tracking-wide leading-none uppercase">
                  {rizaData.name}
                </h2>

                {/* Info Pills: NIM & Location */}
                <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                  {rizaData.nim && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(rizaData.nim!, `NIM ${rizaData.nim}`)
                      }
                      className="px-3.5 py-1.5 bg-[#161F28] hover:bg-[#1F2933] text-[#ECE8E1] border border-[#303946] hover:border-[#FF4655] font-valorant-mono text-xs sm:text-sm tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                      }}
                      title="Klik untuk menyalin NIM"
                    >
                      <span>NIM: {rizaData.nim}</span>
                      <Copy size={13} className="text-[#FF4655]" />
                    </button>
                  )}

                  {rizaData.hometown && (
                    <span
                      className="px-3.5 py-1.5 bg-[#161F28] border border-[#303946] font-valorant-sub font-semibold text-xs sm:text-sm text-[#ECE8E1] flex items-center gap-1.5"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                      }}
                    >
                      <MapPin size={13} className="text-[#FF4655]" />
                      <span>{rizaData.hometown}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Quote */}
            {rizaData.quote && (
              <div className="relative pt-2.5">
                {/* Floating Quote Badge (Unclipped) */}
                <div
                  onClick={() => handleCopy(`"${rizaData.quote}"`, "Quote")}
                  className="absolute top-0 left-4 bg-[#FF4655] px-3 py-0.5 font-valorant-mono font-bold text-[11px] text-white uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,70,85,0.6)] cursor-pointer z-10 hover:bg-[#E03645] transition-colors"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                  }}
                  title="Klik untuk menyalin Quote"
                >
                  <span>Quote</span>
                  <Copy size={11} />
                </div>

                {/* Quote Box Container */}
                <div
                  onClick={() => handleCopy(`"${rizaData.quote}"`, "Quote")}
                  className="bg-[#161F28] border border-[#303946] border-l-4 border-l-[#FF4655] p-5 sm:p-6 relative cursor-pointer hover:bg-[#1A2530] transition-colors group"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                  }}
                  title="Klik untuk menyalin Quote"
                >
                  <p className="italic text-base sm:text-lg font-bold text-[#ECE8E1] group-hover:text-white text-center mt-1 font-valorant-sub">
                    &ldquo;{rizaData.quote}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* Hobbies & Instagram Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Hobbies */}
              {rizaData.hobbies && rizaData.hobbies.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <h4 className="font-valorant-sub font-bold text-base sm:text-lg text-[#ECE8E1] uppercase tracking-wider flex items-center gap-2">
                    <Camera size={16} className="text-[#FF4655]" />
                    <span>Hobbies //</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rizaData.hobbies.map((hobby, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 bg-[#161F28] border border-[#303946] font-valorant-sub font-semibold text-xs sm:text-sm text-[#ECE8E1] flex items-center gap-1.5"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                        }}
                      >
                        <span className="w-1.5 h-1.5 bg-[#FF4655] rotate-45" />
                        <span>{hobby}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Instagram */}
              {cleanInstagram && (
                <div className="flex flex-col gap-2.5">
                  <h4 className="font-valorant-sub font-bold text-base sm:text-lg text-[#ECE8E1] uppercase tracking-wider flex items-center gap-2">
                    <InstagramIcon size={16} className="text-[#FF4655]" />
                    <span>Instagram //</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://instagram.com/${cleanInstagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#161F28] hover:bg-[#1F2933] border border-[#303946] hover:border-[#FF4655] font-valorant-mono text-xs sm:text-sm text-[#ECE8E1] transition-all"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                      }}
                    >
                      <InstagramIcon size={14} className="text-[#FF4655]" />
                      <span>@{cleanInstagram}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(`@${cleanInstagram}`, `@${cleanInstagram}`)
                      }
                      className="p-2.5 bg-[#161F28] hover:bg-[#FF4655] border border-[#303946] hover:border-[#FF4655] text-[#ECE8E1] hover:text-white transition-all cursor-pointer"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                      }}
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
              <div className="mt-2 pt-5 border-t border-[#303946] border-dashed">
                <h4 className="font-valorant-sub font-bold text-base sm:text-lg text-[#ECE8E1] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Music size={16} className="text-[#FF4655]" />
                  <span>Now Playing // Favorite Track</span>
                </h4>
                <div
                  className="bg-[#0B0E14] overflow-hidden border border-[#303946] shadow-[0_0_20px_rgba(0,0,0,0.6)]"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  }}
                >
                  <SpotifyEmbed
                    trackUri={rizaData.spotifyTrackUri}
                    isOpen={isOpen && isUnlocked}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
