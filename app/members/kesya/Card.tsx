"use client";

import React from "react";
import Image from "next/image";
import { FileText, Sparkles, Swords, Gem } from "lucide-react";
import kesyaData from "./data";

// ============================================================
// 🔒 LOCKED: Core component structure (DO NOT DELETE)
// Architectural pattern harmonized with Anas, Riza, and Salman:
// - Custom themed Neobrutalism & Luxury Horror-Glam Card
// - Passes onClick to trigger interactive opening modal
// - Displays member info (photo, name, NIM, role, social links)
// ============================================================
export default function Card({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#0a050f] border-[3px] sm:border-4 border-nb-black hover:border-[#B76E79] rounded-xl sm:rounded-2xl shadow-[4px_4px_0px_var(--nb-black)] sm:shadow-[6px_6px_0px_var(--nb-black)] hover:shadow-[8px_8px_0px_#FF2E9E] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_var(--nb-black)] p-3.5 sm:p-4 md:p-5 cursor-pointer flex flex-col w-full h-full transition-all duration-200 overflow-hidden text-white"
    >
      {/* Luxury Gothic Serif & Modern Display Typography */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;600;800;900&display=swap');
            .font-luxury-title { font-family: 'Cinzel', serif; }
            .font-luxury-sans { font-family: 'Montserrat', sans-serif; }
          `,
        }}
      />

      {/* Decorative Background Decal */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-[#FF2E9E]/15 via-transparent to-transparent pointer-events-none" />

      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-1.5 bg-[#180820] border-2 border-nb-black text-[#F7E7CE] rounded-md px-2 py-0.5 font-luxury-sans font-bold text-[10px] sm:text-[11px] shadow-[2px_2px_0px_var(--nb-black)] transform -rotate-1 group-hover:rotate-0 transition-transform">
          <Gem size={11} className="text-[#FF2E9E] animate-pulse" />
          <span>{"KATANA // BLADE"}</span>
        </div>

        <div className="flex items-center gap-1 bg-[#1a0c24] border border-[#B76E79]/60 text-[#F7E7CE] rounded-md px-2 py-0.5 font-luxury-sans text-[9px] sm:text-[10px] font-bold shadow-[1px_1px_0px_var(--nb-black)]">
          <span>⚔️ GATEWAY</span>
        </div>
      </div>

      {/* Photo Frame with Rose Gold & Crystal Foil */}
      <div className="relative w-full aspect-square mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden border-[2.5px] sm:border-[3px] border-nb-black bg-linear-to-tr from-[#250b2e] via-[#B76E79]/40 to-[#FF2E9E]/30 p-0.5 shadow-[3px_3px_0px_var(--nb-black)] group-hover:shadow-[4px_4px_0px_#FF2E9E] transition-all">
        <div className="relative w-full h-full rounded-md sm:rounded-lg overflow-hidden bg-black">
          <Image
            src={kesyaData.photo}
            alt={kesyaData.name}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          />

          {/* Crystal Foil Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Katana Glint Corner Decal */}
          <div className="absolute bottom-1.5 right-1.5 bg-[#0e0413]/90 p-1 rounded border border-[#B76E79]/80 shadow-[0_0_8px_rgba(255,46,158,0.5)]">
            <Swords size={13} className="text-[#FF2E9E]" />
          </div>
        </div>
      </div>

      {/* Member Info */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#FF2E9E] border border-nb-black animate-pulse" />
          <span className="font-luxury-sans text-[10px] sm:text-xs font-bold text-[#F7E7CE] uppercase tracking-wider">
            {kesyaData.role} {"//"} BLADE MISTRESS
          </span>
        </div>

        <h3 className="text-sm sm:text-base md:text-lg font-luxury-title font-bold text-white group-hover:text-[#F7E7CE] leading-tight line-clamp-1 mb-1 transition-colors flex items-center gap-1">
          <span>{kesyaData.name}</span>
          <Sparkles size={13} className="text-[#FF2E9E]" />
        </h3>

        <p className="font-luxury-sans text-[11px] sm:text-xs text-white/70 font-semibold mb-3">
          {kesyaData.nim || "G6401231088"}
        </p>

        {/* Action Row */}
        <div className="mt-auto w-full flex items-center gap-1.5 sm:gap-2 pt-1">
          {/* Main Action Trigger */}
          <div className="flex-1 py-2 px-2.5 sm:px-3 bg-[#180922] group-hover:bg-linear-to-r group-hover:from-[#FF2E9E] group-hover:to-[#B76E79] border-2 border-nb-black rounded-lg sm:rounded-xl shadow-[2.5px_2.5px_0px_var(--nb-black)] group-hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] group-hover:translate-x-px group-hover:translate-y-px transition-all flex items-center justify-between text-xs font-luxury-sans font-bold text-[#F7E7CE] group-hover:text-white">
            <span className="truncate">[⚔️ TEBAS KATANA]</span>
            <Sparkles size={13} className="shrink-0 group-hover:rotate-12 transition-transform text-[#FF2E9E] group-hover:text-white" />
          </div>

          {/* LinkedIn Link */}
          {kesyaData.linkedinUrl && (
            <a
              href={
                kesyaData.linkedinUrl.startsWith("http")
                  ? kesyaData.linkedinUrl
                  : `https://${kesyaData.linkedinUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-nb-blue hover:bg-[#FF2E9E] border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-px hover:translate-y-px hover:shadow-none flex items-center justify-center text-nb-black hover:text-white transition-all shrink-0"
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
          {kesyaData.cvUrl && (
            <a
              href={
                kesyaData.cvUrl.startsWith("http")
                  ? kesyaData.cvUrl
                  : `https://${kesyaData.cvUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-nb-pink hover:bg-[#B76E79] border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-px hover:translate-y-px hover:shadow-none flex items-center justify-center text-nb-black hover:text-white transition-all shrink-0"
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
