"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  X,
  RotateCcw,
  Copy,
  Sparkles,
  MapPin,
  Music,
  ShieldCheck,
  ExternalLink,
  Swords,
  Heart,
  Gem,
} from "lucide-react";
import gsap from "gsap";
import kesyaData from "./data";
import KatanaPurification from "./KatanaPurification";
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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================
// 🔒 LOCKED: Core component structure (DO NOT DELETE)
// Architectural pattern harmonized with Anas, Riza, and Salman:
// - Stateful interactive gateway (`isUnlocked`)
// - GSAP lifecycle transitions & backdrop animation
// - Keyboard Escape listener & Body overflow lock
// - Copy-to-clipboard toast feedback
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
          setIsUnlocked(false); // Reset katana slash state for next open
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
          { scale: 0.93, opacity: 0, y: 30 },
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

  const cleanInstagram = kesyaData.instagramHandle
    ? kesyaData.instagramHandle
        .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
        .replace(/^@/, "")
        .replace(/\/$/, "")
    : "";

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center p-3 sm:p-5 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kesya-profile-title"
    >
      {/* Luxury Gothic & Modern Serif Typography */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;600;800;900&display=swap');
            .font-luxury-title { font-family: 'Cinzel', serif; }
            .font-luxury-serif { font-family: 'Cormorant Garamond', serif; }
            .font-luxury-sans { font-family: 'Montserrat', sans-serif; }
          `,
        }}
      />

      {/* Backdrop with Calm Atmospheric Post-Apocalyptic Environment & Vignette */}
      <div
        ref={backdropRef}
        onClick={handleAnimateClose}
        className="absolute inset-0 bg-cover bg-center cursor-pointer transition-colors duration-500 overflow-hidden"
        style={{
          backgroundImage: "url('/asset/kesya/bg.jpeg'), url('/asset/kesya/bg-katana.jpeg'), radial-gradient(ellipse at center, #260e2a 0%, #08030b 75%, #020104 100%)",
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[#08030b]/80 backdrop-blur-md" />
        <div className="absolute inset-0 bg-linear-to-t from-[#08030b] via-transparent to-[#08030b]" />
      </div>

      {/* Floating Copy Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-1060 bg-[#1e0a22] border-2 border-[#FF2E9E] rounded-xl px-5 py-2.5 shadow-[0_0_25px_rgba(255,46,158,0.6)] font-luxury-sans font-extrabold text-xs sm:text-sm text-[#F7E7CE] uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <Sparkles size={16} className="text-[#FF2E9E] animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Dialog Container */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto no-scrollbar bg-[#0a050f] border-2 border-[#B76E79]/70 rounded-2xl sm:rounded-3xl shadow-[0_0_40px_rgba(255,46,158,0.25),0_20px_50px_rgba(0,0,0,0.8)] z-10 flex flex-col text-white"
        style={{
          boxShadow:
            "0 0 35px rgba(255, 46, 158, 0.22), 0 20px 60px rgba(0, 0, 0, 0.9)",
        }}
      >
        {/* ============================================================
            1. GATEWAY: INTERACTIVE KATANA PURIFICATION OVERLAY
            ============================================================ */}
        {!isUnlocked ? (
          <div className="w-full flex flex-col relative">
            {/* Close Button on Katana Gateway */}
            <button
              type="button"
              onClick={handleAnimateClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 bg-[#1a0820] hover:bg-[#FF2E9E] text-[#F7E7CE] hover:text-white border border-[#B76E79]/70 hover:border-[#FF2E9E] rounded-xl shadow-[0_0_12px_rgba(255,46,158,0.3)] flex items-center justify-center z-50 transition-all cursor-pointer"
              title="Tutup Modal"
              aria-label="Tutup modal"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <KatanaPurification
              onSuccess={() => setIsUnlocked(true)}
              onSkip={() => setIsUnlocked(true)}
            />
          </div>
        ) : (
          /* ============================================================
              2. REVEALED PROFILE CARD (GLASSMORPHISM ELEGAN)
              ============================================================ */
          <div
            ref={profileCardRef}
            className="flex flex-col bg-linear-to-b from-[#140818]/95 via-[#0a050f]/95 to-[#050208]/95 backdrop-blur-xl text-white relative"
          >
            {/* Top Sanctuary Unlocked Header Banner */}
            <div className="bg-linear-to-r from-[#FF2E9E]/25 via-[#1a0922] to-[#B76E79]/30 border-b border-[#B76E79]/50 px-4 sm:px-6 py-3.5 flex justify-between items-center relative z-20 text-[#F7E7CE] select-none">
              {/* Left Sanctuary Badge */}
              <div className="flex items-center gap-2 font-luxury-title font-bold text-xs sm:text-sm tracking-wider uppercase">
                <ShieldCheck size={18} className="text-[#00E5FF]" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#F7E7CE] via-white to-[#00E5FF]">
                  {"CRYSTAL SANCTUARY // PURIFIED & SECURE"}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Re-Slash Katana Button */}
                <button
                  type="button"
                  onClick={() => setIsUnlocked(false)}
                  className="px-3 sm:px-3.5 py-1.5 bg-[#1e0c26] hover:bg-[#B76E79] text-[#F7E7CE] hover:text-white border border-[#B76E79]/70 rounded-xl font-luxury-sans font-bold text-xs uppercase shadow-[0_0_12px_rgba(183,110,121,0.3)] hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                  title="Mainkan ulang tebasan katana"
                >
                  <RotateCcw size={13} />
                  <span>Tebas Ulang</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleAnimateClose}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-[#1e0c26] hover:bg-[#FF2E9E] text-[#F7E7CE] hover:text-white border border-[#B76E79]/70 hover:border-[#FF2E9E] rounded-xl shadow-[0_0_12px_rgba(255,46,158,0.3)] flex items-center justify-center transition-all cursor-pointer"
                  title="Tutup Modal"
                  aria-label="Tutup modal"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Main Profile Body Content */}
            <div className="p-5 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 relative z-10">
              {/* Corner Crystal Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#B76E79] pointer-events-none opacity-60" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#B76E79] pointer-events-none opacity-60" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#B76E79] pointer-events-none opacity-60" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#B76E79] pointer-events-none opacity-60" />

              {/* Profile Header (Photo + Name + Role + Details) */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start pt-1 sm:pt-0">
                {/* Photo Frame with Rose Gold & Crystal Foil */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl overflow-hidden border-2 border-[#B76E79] shadow-[0_0_25px_rgba(255,46,158,0.35)] bg-linear-to-tr from-[#1f0a28] via-[#B76E79]/40 to-[#FF2E9E]/30 p-1 group">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                    <Image
                      src={kesyaData.photo}
                      alt={kesyaData.name}
                      fill
                      sizes="(max-width: 640px) 144px, 176px"
                      className="object-cover group-hover:scale-105 transition-all duration-500"
                      priority
                    />

                    {/* Crystal Sheen Overlay */}
                    <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Bottom Corner Diamond Stamp */}
                    <div className="absolute bottom-2 right-2 bg-[#120516]/90 border border-[#B76E79] text-[#F7E7CE] px-2 py-0.5 rounded-md font-luxury-sans text-[9px] font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(183,110,121,0.5)]">
                      <Gem size={10} className="text-[#FF2E9E]" />
                      <span>KATANA</span>
                    </div>
                  </div>
                </div>

                {/* Member Identity & Details */}
                <div className="text-center sm:text-left flex-1">
                  {/* Role Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1a0824] border border-[#FF2E9E]/70 rounded-xl font-luxury-sans text-xs font-bold text-[#F7E7CE] mb-2.5 shadow-[0_0_15px_rgba(255,46,158,0.25)]">
                    <Swords size={13} className="text-[#FF2E9E]" />
                    <span>{kesyaData.role} {"//"} Blade Mistress</span>
                  </div>

                  {/* Member Name */}
                  <h2
                    id="kesya-profile-title"
                    className="text-2xl sm:text-3xl md:text-4xl font-luxury-title font-bold text-transparent bg-clip-text bg-linear-to-r from-[#F7E7CE] via-white to-[#FF2E9E] mb-3 tracking-wide leading-tight drop-shadow-[0_0_20px_rgba(255,46,158,0.4)] flex items-center justify-center sm:justify-start gap-2"
                  >
                    <span>{kesyaData.name}</span>
                    <Sparkles size={20} className="text-[#FF2E9E] animate-pulse" />
                  </h2>

                  {/* Pills: NIM & Hometown */}
                  <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                    {kesyaData.nim && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(kesyaData.nim!, `NIM ${kesyaData.nim}`)
                        }
                        className="px-3.5 py-1.5 bg-[#15071d] hover:bg-[#B76E79] hover:text-white border border-[#B76E79]/80 rounded-xl shadow-[0_0_10px_rgba(183,110,121,0.25)] font-luxury-sans font-bold text-xs sm:text-sm text-[#F7E7CE] hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                        title="Klik untuk menyalin NIM"
                      >
                        <span>NIM: {kesyaData.nim}</span>
                        <Copy size={13} className="text-[#FF2E9E]" />
                      </button>
                    )}

                    {kesyaData.hometown && (
                      <span className="px-3.5 py-1.5 bg-[#15071d] border border-[#B76E79]/60 rounded-xl shadow-[0_0_10px_rgba(183,110,121,0.2)] font-luxury-sans font-semibold text-xs sm:text-sm text-[#F7E7CE] flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#FF2E9E]" />
                        <span>{kesyaData.hometown}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Quote Card */}
              {kesyaData.quote && (
                <div
                  onClick={() => handleCopy(`"${kesyaData.quote}"`, "Quote")}
                  className="bg-[#15071f]/80 border border-[#B76E79]/70 rounded-2xl p-5 sm:p-6 shadow-[0_0_20px_rgba(183,110,121,0.2)] relative cursor-pointer hover:bg-[#1c0a28] hover:border-[#FF2E9E] transition-all group"
                  title="Klik untuk menyalin Quote"
                >
                  <div className="absolute -top-3 left-4 bg-[#1e0b2a] border border-[#FF2E9E]/70 rounded-lg px-3 py-0.5 font-luxury-sans font-bold text-[10px] text-[#F7E7CE] flex items-center gap-1 shadow-[0_0_10px_rgba(255,46,158,0.3)]">
                    <Heart size={11} className="text-[#FF2E9E]" />
                    <span>SANCTUARY MEMO</span>
                  </div>
                  <p className="italic text-base sm:text-lg font-luxury-serif font-bold text-[#F7E7CE] group-hover:text-white text-center mt-1">
                    &ldquo;{kesyaData.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Hobbies & Instagram Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Hobbies */}
                {kesyaData.hobbies && kesyaData.hobbies.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <h4 className="font-luxury-title font-bold text-sm sm:text-base text-[#F7E7CE] uppercase tracking-wider flex items-center gap-2">
                      <Gem size={15} className="text-[#FF2E9E]" />
                      <span>{"Specialties // Hobbies"}</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {kesyaData.hobbies.map((hobby, i) => (
                        <span
                          key={i}
                          className="px-3.5 py-1.5 bg-[#170821] border border-[#B76E79]/60 text-[#F7E7CE] font-luxury-sans font-semibold text-xs sm:text-sm rounded-xl shadow-[0_0_8px_rgba(183,110,121,0.2)] flex items-center gap-1.5 hover:border-[#FF2E9E] transition-colors"
                        >
                          <Sparkles size={11} className="text-[#FF2E9E]" />
                          <span>{hobby}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instagram Profile */}
                {cleanInstagram && (
                  <div className="flex flex-col gap-2.5">
                    <h4 className="font-luxury-title font-bold text-sm sm:text-base text-[#F7E7CE] uppercase tracking-wider flex items-center gap-2">
                      <InstagramIcon size={15} className="text-[#FF2E9E]" />
                      <span>Instagram Sanctuary</span>
                    </h4>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://instagram.com/${cleanInstagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#170821] hover:bg-[#B76E79] hover:text-white border border-[#B76E79]/70 hover:border-[#FF2E9E] rounded-xl font-luxury-sans font-bold text-xs sm:text-sm text-[#F7E7CE] transition-all shadow-[0_0_10px_rgba(183,110,121,0.2)]"
                      >
                        <InstagramIcon size={14} className="text-[#FF2E9E]" />
                        <span>@{cleanInstagram}</span>
                        <ExternalLink size={12} className="opacity-70" />
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(`@${cleanInstagram}`, `@${cleanInstagram}`)
                        }
                        className="p-2.5 bg-[#170821] hover:bg-[#FF2E9E] border border-[#B76E79]/70 text-[#F7E7CE] hover:text-white rounded-xl shadow-[0_0_8px_rgba(183,110,121,0.2)] transition-all cursor-pointer"
                        title="Salin username Instagram"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Spotify Audio Embed Player */}
              {kesyaData.spotifyTrackUri && (
                <div className="mt-2 pt-5 border-t border-[#B76E79]/30 border-dashed">
                  <h4 className="font-luxury-title font-bold text-sm sm:text-base text-[#F7E7CE] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Music size={15} className="text-[#FF2E9E]" />
                    <span>{"Atmospheric Sanctuary // Soundtrack"}</span>
                  </h4>
                  <div className="bg-[#08030c] rounded-2xl overflow-hidden border border-[#B76E79]/60 shadow-[0_0_20px_rgba(255,46,158,0.25)]">
                    <SpotifyEmbed
                      trackUri={kesyaData.spotifyTrackUri}
                      isOpen={isOpen && isUnlocked}
                    />
                  </div>
                </div>
              )}

              {/* Bottom Sanctuary Footer */}
              <div className="mt-2 text-center font-luxury-sans text-[11px] text-[#B76E79]/60 flex items-center justify-center gap-2">
                <Sparkles size={12} className="text-[#FF2E9E]" />
                <span>{"PURIFICATION COMPLETE // SANCTUARY ARCHIVE 09"}</span>
                <Sparkles size={12} className="text-[#FF2E9E]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
