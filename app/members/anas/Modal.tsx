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
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md scanlines">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleAnimateClose}
        className="absolute inset-0 cursor-pointer"
      />

      {/* Modal Dialog Content */}
      <div
        ref={contentRef}
        className="w-full max-w-3xl max-h-[75vh] overflow-y-auto no-scrollbar bg-[#0d1117] border-2 border-[#4ade80] rounded-xl shadow-[0_0_25px_rgba(74,222,128,0.25)] p-5 sm:p-6 md:p-8 relative z-10 text-[#4ade80]"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage:
            "radial-gradient(rgba(74, 222, 128, 0.15) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Corner brackets decoration */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#4ade80] pointer-events-none"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#4ade80] pointer-events-none"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#4ade80] pointer-events-none"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#4ade80] pointer-events-none"></div>

        {/* Top Bar: Badge & macOS style controls */}
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#4ade80]/30">
          <div className="inline-block bg-[#4ade80]/15 border border-[#4ade80] text-[#4ade80] px-3 py-1 font-mono text-xs md:text-sm font-bold tracking-widest shadow-[0_0_10px_rgba(74,222,128,0.3)] animate-pulse">
            ACCESS GRANTED
          </div>
          <div className="flex items-center gap-2 border border-[#4ade80]/30 rounded px-2 py-1 bg-[#0a0f0d]">
            <button
              onClick={handleAnimateClose}
              className="p-1 text-[#4ade80] hover:bg-[#4ade80]/20 rounded transition-colors cursor-pointer"
              title="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={handleAnimateClose}
              className="p-1 text-[#4ade80] hover:bg-[#4ade80]/20 rounded transition-colors cursor-pointer"
              title="Maximize"
            >
              <Square size={12} />
            </button>
            <button
              onClick={handleAnimateClose}
              className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Header section with photo & name */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 items-center md:items-start">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 group">
            <div className="absolute inset-0 rounded-full border-2 border-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.5)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(74,222,128,0.8)]"></div>
            <div className="absolute inset-1.5 rounded-full overflow-hidden border border-[#4ade80]/50 bg-black">
              <Image
                src={anasData.photo}
                alt={anasData.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          <div className="pt-2 text-center md:text-left flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono mb-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]">
              {anasData.name}
            </h2>
            <div className="inline-block bg-[#4ade80] text-[#0d1117] px-3 py-1 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider">
              {anasData.role === "Ketua" ? "LEADER" : anasData.role}
            </div>
          </div>
        </div>

        {/* Terminal Data Section */}
        <div className="font-mono space-y-3 mb-6 bg-black/50 p-4 sm:p-5 border border-[#4ade80]/30 rounded backdrop-blur-sm text-xs sm:text-sm md:text-base">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="text-[#4ade80]/70 w-32 shrink-0">{">"} NIM:</span>
            <span className="text-[#4ade80] font-bold">
              {anasData.nim || "[NO DATA]"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="text-[#4ade80]/70 w-32 shrink-0">
              {">"} HOMETOWN:
            </span>
            <span className="text-[#4ade80] font-bold">
              {anasData.hometown || "[NO DATA]"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="text-[#4ade80]/70 w-32 shrink-0">{">"} HOBBIES:</span>
            <div className="flex flex-wrap gap-2">
              {anasData.hobbies && anasData.hobbies.length > 0 ? (
                anasData.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className="bg-[#4ade80]/10 border border-[#4ade80]/50 text-[#4ade80] px-2.5 py-0.5 text-xs rounded"
                  >
                    {hobby}
                  </span>
                ))
              ) : (
                <span className="text-[#4ade80]/50">[NO DATA]</span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <span className="text-[#4ade80]/70 w-32 shrink-0">
              {">"} INSTAGRAM:
            </span>
            {anasData.instagramHandle ? (
              <a
                href={`https://instagram.com/${anasData.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4ade80] font-bold hover:underline hover:text-white transition-colors"
              >
                @{anasData.instagramHandle}
              </a>
            ) : (
              <span className="text-[#4ade80]/50">[NO DATA]</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 pt-2">
            <span className="text-[#4ade80]/70 w-32 shrink-0">
              {">"} QUOTE:
            </span>
            <div className="text-[#4ade80] italic border-l-2 border-[#4ade80]/50 pl-3 py-0.5">
              {anasData.quote ? `"${anasData.quote}"` : '""'}
            </div>
          </div>
        </div>

        {/* Spotify Section */}
        {anasData.spotifyTrackUri && (
          <div className="mt-6 border border-[#4ade80]/30 p-4 bg-black/50 rounded">
            <div className="text-[#4ade80]/80 font-mono mb-3 text-xs sm:text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
              {">"} INITIALIZING AUDIO STREAM...
            </div>
            <SpotifyEmbed
              trackUri={anasData.spotifyTrackUri}
              isOpen={isOpen}
            />
          </div>
        )}

        <div className="mt-4 text-[#4ade80]/50 font-mono text-xs flex items-center justify-center">
          <span className="cursor-blink mr-2 font-bold text-[#4ade80]">_</span>{" "}
          END OF FILE
        </div>
      </div>
    </div>
  );
}
