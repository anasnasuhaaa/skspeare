"use client";

import React from "react";
import Image from "next/image";
import { FileText, Sparkles } from "lucide-react";
import salmanData from "./data";

// Mini Pokeball Icon
const PokeballIcon = ({ size = 18 }: { size?: number }) => (
  <div
    style={{ width: size, height: size }}
    className="rounded-full border-2 border-nb-black bg-white overflow-hidden flex flex-col justify-between relative shadow-[1px_1px_0px_var(--nb-black)] shrink-0"
  >
    <div className="w-full h-1/2 bg-[#ef4444] border-b border-nb-black" />
    <div className="w-full h-1/2 bg-[#ffffff] border-t border-nb-black" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-white border border-nb-black flex items-center justify-center">
        <div className="w-0.5 h-0.5 rounded-full bg-nb-black" />
      </div>
    </div>
  </div>
);

// ============================================================
// 🔒 LOCKED: Core component structure (DO NOT DELETE)
// This component must accept onClick and render member data correctly
// ============================================================
export default function Card({ onClick }: { onClick: () => void }) {
  // ============================================================
  // FREE TO CUSTOMIZE: Pokemon Trainer Neobrutalist Card
  // ============================================================
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#0f172a] border-[3px] sm:border-4 border-nb-black rounded-xl sm:rounded-2xl shadow-[4px_4px_0px_var(--nb-black)] sm:shadow-[6px_6px_0px_var(--nb-black)] hover:shadow-[8px_8px_0px_#facc15] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_var(--nb-black)] p-3.5 sm:p-4 md:p-5 cursor-pointer flex flex-col w-full h-full transition-all duration-200 overflow-hidden text-white"
    >
      {/* Top Pokemon Trainer Neobrutalist Badges */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-1.5 bg-nb-red border-2 border-nb-black text-white rounded-md px-2 py-0.5 font-mono font-black text-[10px] sm:text-[11px] shadow-[2px_2px_0px_var(--nb-black)] transform -rotate-1 group-hover:rotate-0 transition-transform">
          <PokeballIcon size={14} />
          <span>TRAINER // POKÉMON</span>
        </div>

        <div className="flex items-center gap-1 bg-nb-yellow border border-nb-black text-nb-black rounded-md px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold shadow-[1px_1px_0px_var(--nb-black)]">
          <span>⚡ GATEWAY</span>
        </div>
      </div>

      {/* Photo Frame with Pokemon Card Holographic Accent */}
      <div className="relative w-full aspect-square mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden border-[2.5px] sm:border-[3px] border-nb-black bg-linear-to-tr from-nb-red via-nb-yellow to-nb-blue p-0.5 shadow-[3px_3px_0px_var(--nb-black)] group-hover:shadow-[4px_4px_0px_#facc15] transition-all">
        <div className="relative w-full h-full rounded-md sm:rounded-lg overflow-hidden bg-black">
          <Image
            src={salmanData.photo}
            alt={salmanData.name}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          />

          {/* Holographic foil overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Corner Pokeball Stamp */}
          <div className="absolute bottom-1.5 right-1.5">
            <PokeballIcon size={18} />
          </div>
        </div>
      </div>

      {/* Member Info */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-nb-yellow border border-nb-black animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs font-bold text-nb-yellow uppercase tracking-wider">
            {salmanData.role}
          </span>
        </div>

        <h3 className="text-sm sm:text-base md:text-lg font-display font-black text-white group-hover:text-nb-yellow leading-tight line-clamp-1 mb-1 transition-colors flex items-center gap-1">
          <span>{salmanData.name}</span>
          <span className="text-nb-yellow text-xs">⚡</span>
        </h3>

        <p className="font-mono text-[11px] sm:text-xs text-white/70 font-bold mb-3">
          {salmanData.nim || "M0403251124"}
        </p>

        {/* Action Row */}
        <div className="mt-auto w-full flex items-center gap-1.5 sm:gap-2 pt-1">
          {/* Main Pokemon Action Button */}
          <div className="flex-1 py-2 px-2.5 sm:px-3 bg-nb-yellow group-hover:bg-nb-lime border-2 border-nb-black rounded-lg sm:rounded-xl shadow-[2.5px_2.5px_0px_var(--nb-black)] group-hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] group-hover:translate-x-px group-hover:translate-y-px transition-all flex items-center justify-between text-xs font-mono font-black text-nb-black">
            <span className="truncate">[⚡ BUKA POKEDEX]</span>
            <Sparkles size={13} className="shrink-0 group-hover:rotate-12 transition-transform" />
          </div>

          {/* LinkedIn Link */}
          {salmanData.linkedinUrl && (
            <a
              href={salmanData.linkedinUrl.startsWith("http") ? salmanData.linkedinUrl : `https://${salmanData.linkedinUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-nb-blue hover:bg-nb-yellow border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-px hover:translate-y-px hover:shadow-none flex items-center justify-center text-nb-black transition-all shrink-0"
              title="LinkedIn Profile"
            >
              <Image
                src="/linkedin.svg"
                alt="LinkedIn"
                width={16}
                height={16}
                className="w-3.5 h-3.5 object-contain"
              />
            </a>
          )}

          {/* CV Link */}
          {salmanData.cvUrl && (
            <a
              href={salmanData.cvUrl.startsWith("http") ? salmanData.cvUrl : `https://${salmanData.cvUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-nb-pink hover:bg-nb-yellow border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-px hover:translate-y-px hover:shadow-none flex items-center justify-center text-nb-black transition-all shrink-0"
              title="Curriculum Vitae"
            >
              <FileText className="w-3.5 h-3.5" strokeWidth={2.5} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
