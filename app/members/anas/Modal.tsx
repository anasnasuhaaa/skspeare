"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Minus, Square } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import anasData from "./data";
import SpotifyEmbed from "@/app/components/SpotifyEmbed";

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

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-nb-black/85 backdrop-blur-md scanlines">
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
      />

      {/* Modal Dialog Content Chassis */}
      <div
        ref={contentRef}
        className="w-full max-w-3xl max-h-[88vh] overflow-y-auto no-scrollbar bg-[#090d14] border-4 border-nb-black rounded-2xl sm:rounded-3xl shadow-[10px_10px_0px_var(--nb-black)] sm:shadow-[14px_14px_0px_var(--nb-black)] relative z-10 text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage:
            "radial-gradient(rgba(74, 222, 128, 0.12) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* Top Neobrutalist Cyber Header */}
        <div className="bg-nb-lime border-b-4 border-nb-black px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center relative z-20 select-none text-nb-black">
          <div className="flex items-center gap-2 font-display font-black text-xs sm:text-sm uppercase tracking-wider">
            <span className="w-3 h-3 rounded-full bg-nb-black animate-pulse" />
            <span>ROOT ACCESS // PROFILE VERIFIED</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAnimateClose}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-nb-red hover:bg-nb-yellow text-white hover:text-nb-black border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center justify-center transition-all cursor-pointer"
              title="Tutup Modal"
              aria-label="Tutup modal"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Modal Inner Body */}
        <div className="p-5 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 relative z-10">
          {/* Cyber Corner HUD Brackets */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-nb-lime pointer-events-none opacity-60" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-nb-lime pointer-events-none opacity-60" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-nb-lime pointer-events-none opacity-60" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-nb-lime pointer-events-none opacity-60" />

          {/* Profile Header (Photo + Title + Badges) */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
            {/* Photo Frame */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-2xl overflow-hidden border-4 border-nb-black shadow-[6px_6px_0px_#4ade80] bg-nb-yellow p-1 group">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                <Image
                  src={anasData.photo}
                  alt={anasData.name}
                  fill
                  sizes="(max-width: 640px) 128px, 160px"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  priority
                />
              </div>

              {/* HUD Badge on Avatar */}
              <div className="absolute bottom-2 right-2 bg-nb-black border-2 border-nb-lime text-nb-lime px-2 py-0.5 rounded-md font-mono text-[9px] font-black shadow-[1px_1px_0px_var(--nb-black)]">
                0xADMIN
              </div>
            </div>

            {/* Title & Identity */}
            <div className="text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-nb-pink border-2 border-nb-black rounded-lg font-mono text-xs font-black text-nb-black mb-2.5 shadow-[2px_2px_0px_var(--nb-black)] -rotate-1">
                <span>👑</span>
                <span>Ketua Tim // Lead Developer</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white mb-3 tracking-tight leading-tight drop-shadow-[2px_2px_0px_var(--nb-black)] flex items-center justify-center sm:justify-start gap-1">
                <span>{anasData.name}</span>
                <span className="cursor-blink text-nb-lime font-mono">_</span>
              </h2>

              <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                {anasData.nim && (
                  <button
                    type="button"
                    onClick={() => handleCopy(anasData.nim, `NIM ${anasData.nim}`)}
                    className="px-3.5 py-1.5 bg-[#131b24] hover:bg-nb-yellow hover:text-nb-black border-2 border-nb-lime rounded-xl shadow-[3px_3px_0px_var(--nb-black)] font-mono font-bold text-xs sm:text-sm text-nb-lime hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center gap-2"
                    title="Klik untuk menyalin NIM"
                  >
                    <span>NIM: {anasData.nim}</span>
                    <span className="text-[10px] bg-nb-lime/20 px-1.5 py-0.2 rounded font-mono text-nb-lime">COPY</span>
                  </button>
                )}

                {anasData.hometown && (
                  <span className="px-3.5 py-1.5 bg-[#131b24] border-2 border-[#4ade80]/60 rounded-xl shadow-[3px_3px_0px_var(--nb-black)] font-mono font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
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
              className="bg-[#121824] border-[3px] border-nb-lime rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0px_var(--nb-black)] relative cursor-pointer hover:bg-[#182030] transition-colors group"
              title="Klik untuk menyalin Quote"
            >
              {/* Sticky Top Badge */}
              <div className="absolute -top-3.5 -left-2 bg-nb-yellow border-2 border-nb-black rounded-lg px-3 py-0.5 font-display font-black text-xs text-nb-black transform -rotate-2 flex items-center gap-1 shadow-[2px_2px_0px_var(--nb-black)]">
                <span>💬 DECRYPTED_MEMO</span>
                <span className="text-[10px] opacity-70">✦</span>
              </div>

              <p className="italic text-base sm:text-lg font-bold text-nb-lime text-center mt-1">
                &ldquo;{anasData.quote}&rdquo;
              </p>
            </div>
          )}

          {/* Hobbies & Instagram Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Hobbies */}
            {anasData.hobbies && anasData.hobbies.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h4 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wide flex items-center gap-2">
                  <span className="text-nb-yellow">⚡</span>
                  <span>Hobbies // Modules</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {anasData.hobbies.map((hobby, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 bg-[#16202c] border-2 border-nb-lime text-nb-lime font-mono font-bold text-xs sm:text-sm rounded-xl shadow-[3px_3px_0px_var(--nb-black)]"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Instagram Link */}
            {anasData.instagramHandle && (
              <div className="flex flex-col gap-2.5">
                <h4 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wide flex items-center gap-2">
                  <span className="text-nb-pink">📱</span>
                  <span>Instagram Feed</span>
                </h4>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://instagram.com/${anasData.instagramHandle
                      .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
                      .replace(/^@/, "")
                      .replace(/\/$/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#16202c] border-2 border-nb-pink hover:bg-nb-pink hover:text-nb-black rounded-xl shadow-[3px_3px_0px_var(--nb-black)] font-mono font-bold text-xs sm:text-sm text-white transition-all"
                  >
                    📸 @{anasData.instagramHandle.replace(/^@/, "")}
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `@${anasData.instagramHandle?.replace(/^@/, "")}`,
                        `@${anasData.instagramHandle}`
                      )
                    }
                    className="p-2.5 bg-nb-yellow hover:bg-nb-lime border-2 border-nb-black text-nb-black rounded-xl shadow-[2.5px_2.5px_0px_var(--nb-black)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)] transition-all cursor-pointer font-bold text-xs"
                    title="Salin username Instagram"
                  >
                    COPY
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Spotify Cyber Audio Player */}
          {anasData.spotifyTrackUri && (
            <div className="mt-2 pt-5 border-t-2 border-[#4ade80]/30 border-dashed">
              <h4 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-nb-lime animate-ping" />
                <span>Audio Stream // Favorite Track</span>
              </h4>
              <div className="bg-black rounded-2xl overflow-hidden border-[3px] border-nb-lime shadow-[6px_6px_0px_var(--nb-black)]">
                <SpotifyEmbed
                  trackUri={anasData.spotifyTrackUri}
                  isOpen={isOpen}
                />
              </div>
            </div>
          )}

          {/* Terminal Bottom Status */}
          <div className="mt-2 text-center font-mono text-xs text-[#4ade80]/60 flex items-center justify-center gap-2">
            <span className="cursor-blink text-nb-lime font-bold">_</span>
            <span>TRANSMISSION COMPLETE // LOGGED AS 0xANAS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
