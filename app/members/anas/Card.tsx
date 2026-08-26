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
      className="cursor-pointer group relative bg-[#0a0f0d] border-[3px] border-[#4ade80] rounded-2xl p-5 sm:p-6 overflow-hidden scanlines shadow-[4px_4px_0px_0px_#4ade80] hover:shadow-[8px_8px_0px_0px_#4ade80] hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
    >
      {/* 
        ==========================================
        🔓 FREE TO CUSTOMIZE: Design & Animations 
        ==========================================
      */}
      {/* Hacker decorative elements */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-75">
        <Terminal size={16} className="text-[#4ade80]" />
        <span className="text-[#4ade80] font-mono text-xs">{"</>"}</span>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Photo Container */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.4)] group-hover:shadow-[0_0_25px_rgba(74,222,128,0.7)] transition-shadow duration-300"></div>
          <Image
            src={anasData.photo}
            alt={anasData.name}
            fill
            sizes="(max-width: 640px) 112px, 128px"
            className="rounded-full object-cover p-1 grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>

        {/* Info */}
        <h3 className="text-lg sm:text-xl font-bold text-[#4ade80] font-mono mb-1 text-center flex items-center">
          {anasData.name} <span className="cursor-blink ml-1">_</span>
        </h3>

        <div className="bg-[#4ade80] text-[#0a0f0d] text-xs font-bold px-3 py-1 mb-2 font-mono uppercase rounded">
          {anasData.role}
        </div>

        <p className="text-[#4ade80]/70 font-mono text-xs sm:text-sm mb-4">
          {anasData.nim || "[NIM_NOT_FOUND]"}
        </p>

        {/* Social Links */}
        <div className="flex gap-3 mt-auto">
          {anasData.linkedinUrl && (
            <a
              href={anasData.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded border border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80] hover:text-[#0a0f0d] transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          )}
          {anasData.cvUrl && (
            <a
              href={anasData.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded border border-[#4ade80] text-[#4ade80] hover:bg-[#4ade80] hover:text-[#0a0f0d] transition-colors"
            >
              <FileText size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
