"use client";

import { ExternalLink, FileText, Terminal } from "lucide-react";
import Image from "next/image";
import anasData from "./data";
// Export HackTerminal so it can be imported by MembersSection
export { default as HackTerminal } from "./HackTerminal";

// ==========================================
// 🔒 LOCKED: Core component structure (DO NOT DELETE)
// ==========================================
export default function AnasCard({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#0c1017] border-[3px] sm:border-4 border-nb-black rounded-xl sm:rounded-2xl shadow-[4px_4px_0px_var(--nb-black)] sm:shadow-[6px_6px_0px_var(--nb-black)] hover:shadow-[8px_8px_0px_#4ade80] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_var(--nb-black)] p-3.5 sm:p-4 md:p-5 cursor-pointer flex flex-col w-full h-full transition-all duration-200 overflow-hidden scanlines text-white"
    >
      {/* Top Cyber Neobrutalist Badges */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-1 bg-nb-lime border-2 border-nb-black text-nb-black rounded-md px-2 py-0.5 font-mono font-black text-[10px] sm:text-[11px] shadow-[2px_2px_0px_var(--nb-black)] transform -rotate-2 group-hover:rotate-0 transition-transform">
          <span className="w-1.5 h-1.5 rounded-full bg-nb-black animate-ping" />
          <span>0xROOT // KETUA</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#16202c] border border-[#4ade80]/40 rounded-md px-2 py-0.5 font-mono text-[9px] sm:text-[10px] text-nb-lime">
          <Terminal size={12} className="text-nb-lime" />
          <span>GATEWAY</span>
        </div>
      </div>

      {/* Photo Frame with Cyber Neobrutalism Accent */}
      <div className="relative w-full aspect-square mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden border-[2.5px] sm:border-[3px] border-nb-black bg-nb-yellow p-0.5 shadow-[3px_3px_0px_var(--nb-black)] group-hover:bg-nb-lime transition-colors">
        <div className="relative w-full h-full rounded-md sm:rounded-lg overflow-hidden bg-black">
          <Image
            src={anasData.photo}
            alt={anasData.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          />

          {/* Cyber HUD Grid & Corner Brackets Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 border-t-2 border-l-2 border-nb-lime" />
              <span className="w-2.5 h-2.5 border-t-2 border-r-2 border-nb-lime" />
            </div>
            <div className="flex justify-between">
              <span className="w-2.5 h-2.5 border-b-2 border-l-2 border-nb-lime" />
              <span className="w-2.5 h-2.5 border-b-2 border-r-2 border-nb-lime" />
            </div>
          </div>
        </div>
      </div>

      {/* Member Info */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-nb-lime border border-nb-black" />
          <span className="font-mono text-[10px] sm:text-xs font-bold text-nb-lime uppercase tracking-wider">
            {anasData.role === "Ketua" ? "LEADER & DEV" : anasData.role}
          </span>
        </div>

        <h3 className="text-sm sm:text-base md:text-lg font-display font-black text-white group-hover:text-nb-lime leading-tight line-clamp-1 mb-1 transition-colors flex items-center">
          <span>{anasData.name}</span>
          <span className="cursor-blink text-nb-lime ml-1">_</span>
        </h3>

        <p className="font-mono text-[11px] sm:text-xs text-white/70 font-bold mb-3">
          {anasData.nim || "M0403251114"}
        </p>

        {/* Launch Terminal Neobrutalist Action Trigger */}
        <div className="mt-auto w-full flex items-center gap-2 pt-1">
          <div className="flex-1 py-2 px-3 bg-[#16202c] group-hover:bg-nb-lime border-2 border-nb-black rounded-lg sm:rounded-xl shadow-[2.5px_2.5px_0px_var(--nb-black)] group-hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all flex items-center justify-between text-xs font-mono font-black text-nb-lime group-hover:text-nb-black">
            <span>{">"} [OPEN TERMINAL]</span>
            <Terminal size={14} className="shrink-0" />
          </div>

          {/* Social Links if present */}
          {anasData.linkedinUrl && (
            <a
              href={anasData.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-nb-blue hover:bg-nb-yellow border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center text-nb-black transition-all"
              title="LinkedIn"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
            </a>
          )}
          {anasData.cvUrl && (
            <a
              href={anasData.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-nb-pink hover:bg-nb-yellow border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center text-nb-black transition-all"
              title="CV"
            >
              <FileText className="w-3.5 h-3.5" strokeWidth={2.5} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
