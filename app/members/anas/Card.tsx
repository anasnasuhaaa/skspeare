"use client";

import { motion } from "framer-motion";
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
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer group relative bg-[#0a0f0d] border-[3px] border-[#00ff41] rounded-2xl p-6 overflow-hidden scanlines shadow-[4px_4px_0px_0px_#00ff41] transition-all hover:shadow-[8px_8px_0px_0px_#00ff41]"
    >
      {/* 
        ==========================================
        🔓 FREE TO CUSTOMIZE: Design & Animations 
        ==========================================
      */}
      {/* Hacker decorative elements */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-70">
        <Terminal size={16} className="text-[#00ff41]" />
        <span className="text-[#00ff41] font-mono text-xs">{"</>"}</span>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Photo Container */}
        <div className="relative w-32 h-32 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.5)] group-hover:shadow-[0_0_25px_rgba(0,255,65,0.8)] transition-shadow duration-300"></div>
          <Image
            src={anasData.photo}
            alt={anasData.name}
            fill
            className="rounded-full object-cover p-1 grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>

        {/* Info */}
        <h3 className="text-xl font-bold text-[#00ff41] font-mono mb-1 text-center flex items-center">
          {anasData.name} <span className="cursor-blink ml-1">_</span>
        </h3>

        <div className="bg-[#00ff41] text-[#0a0f0d] text-xs font-bold px-3 py-1 mb-2 font-mono uppercase">
          {anasData.role}
        </div>

        <p className="text-[#00ff41]/70 font-mono text-sm mb-4">
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
              className="p-2 rounded border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0a0f0d] transition-colors"
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
              className="p-2 rounded border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0a0f0d] transition-colors"
            >
              <FileText size={18} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
