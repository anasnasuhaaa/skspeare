"use client";

import React from "react";
import Image from "next/image";
import { Press_Start_2P } from "next/font/google";
import { FileText, Sparkles, Wand2 } from "lucide-react";
import kekeData from "./data";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// ============================================================
// 🔒 LOCKED: Core component structure (DO NOT DELETE)
// This component accepts onClick and renders member data
// ============================================================
export default function Card({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#1c122c] border-[3px] sm:border-4 border-black rounded-none shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] hover:shadow-[7px_7px_0px_#ec4899] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_#000000] p-3 sm:p-4 md:p-5 cursor-pointer flex flex-col w-full h-full transition-all duration-200 overflow-hidden text-white font-mono"
    >
      {/* Top Pixel Art Badges */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 mb-2 sm:mb-3 relative z-10">
        <div className="flex items-center gap-1 sm:gap-1.5 bg-[#ec4899] border-2 border-black text-black px-1.5 sm:px-2 py-0.5 font-mono font-black text-[9px] sm:text-[11px] shadow-[1.5px_1.5px_0px_#000000] sm:shadow-[2px_2px_0px_#000000] transform -rotate-1 group-hover:rotate-0 transition-transform truncate">
          <Wand2 size={11} className="text-black shrink-0" />
          <span className="truncate">MAGIC // PIXEL</span>
        </div>

        <div className="flex items-center gap-1 bg-yellow-400 border border-black text-black px-1.5 sm:px-2 py-0.5 font-mono text-[8px] sm:text-[10px] font-black shadow-[1px_1px_0px_#000000] shrink-0">
          <span>🕹️ ARCADE</span>
        </div>
      </div>

      {/* Photo Frame with Pixel Art Frame Accent */}
      <div className="relative w-full aspect-square mb-2.5 sm:mb-4 border-2 sm:border-[3px] border-black bg-gradient-to-tr from-[#ec4899] via-yellow-300 to-[#38bdf8] p-1 shadow-[2.5px_2.5px_0px_#000000] sm:shadow-[3px_3px_0px_#000000] group-hover:shadow-[4px_4px_0px_#ec4899] transition-all">
        <div className="relative w-full h-full border border-black sm:border-2 overflow-hidden bg-[#100a1c]">
          <Image
            src={kekeData.photo}
            alt={kekeData.name}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          />

          {/* Pixel Corner Brackets */}
          <div className="absolute top-1 left-1 w-2 sm:w-2.5 h-2 sm:h-2.5 border-t-2 border-l-2 border-yellow-300 pointer-events-none" />
          <div className="absolute top-1 right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 border-t-2 border-r-2 border-yellow-300 pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-2 sm:w-2.5 h-2 sm:h-2.5 border-b-2 border-l-2 border-yellow-300 pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-2 sm:w-2.5 h-2 sm:h-2.5 border-b-2 border-r-2 border-yellow-300 pointer-events-none" />

          {/* Pixel Star Badge */}
          <div className="absolute bottom-1 right-1 bg-yellow-400 border border-black px-1 py-0.2 text-[7px] sm:text-[8px] font-black text-black shadow-[1px_1px_0px_#000000]">
            ★ PIXEL
          </div>
        </div>
      </div>

      {/* Member Info */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="flex items-center gap-1 mb-1">
          <span className="w-1.5 h-1.5 rounded-none bg-pink-400 border border-black animate-pulse shrink-0" />
          <span className="font-mono text-[9px] sm:text-xs font-bold text-pink-400 uppercase tracking-wider truncate">
            {kekeData.role} // MAGICIAN
          </span>
        </div>

        <h3 className={`${pixelFont.className} text-[10px] sm:text-xs md:text-sm font-black text-white group-hover:text-pink-300 leading-tight line-clamp-1 mb-1 transition-colors flex items-center gap-1`}>
          <span className="truncate">{kekeData.name}</span>
          <span className="text-yellow-400 text-[10px] shrink-0">✦</span>
        </h3>

        <p className="font-mono text-[10px] sm:text-xs text-white/70 font-bold mb-2.5 sm:mb-3 truncate">
          {kekeData.nim || "M0403251111"}
        </p>

        {/* Action Row */}
        <div className="mt-auto w-full flex items-center gap-1.5 sm:gap-2 pt-1">
          {/* Main Action CTA */}
          <div className="flex-1 min-w-0 py-1.5 sm:py-2 px-1.5 sm:px-2.5 bg-[#ec4899] group-hover:bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_#000000] sm:shadow-[2.5px_2.5px_0px_#000000] group-hover:shadow-[1.5px_1.5px_0px_#000000] transition-all flex items-center justify-between text-[9px] sm:text-xs font-mono font-black text-black">
            <span className="truncate">[🕹️ CLAW GAME]</span>
            <Sparkles size={11} className="shrink-0 group-hover:rotate-12 transition-transform hidden sm:inline" />
          </div>

          {/* LinkedIn Link */}
          {kekeData.linkedinUrl && (
            <a
              href={
                kekeData.linkedinUrl.startsWith("http")
                  ? kekeData.linkedinUrl
                  : `https://${kekeData.linkedinUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 sm:w-8 sm:h-8 bg-[#38bdf8] hover:bg-yellow-400 border-2 border-black shadow-[1.5px_1.5px_0px_#000000] sm:shadow-[2px_2px_0px_#000000] hover:translate-x-px hover:translate-y-px hover:shadow-none flex items-center justify-center text-black transition-all shrink-0"
              title="LinkedIn Profile"
            >
              <Image
                src="/linkedin.svg"
                alt="LinkedIn"
                width={14}
                height={14}
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain"
              />
            </a>
          )}

          {/* CV Link */}
          {kekeData.cvUrl && (
            <a
              href={
                kekeData.cvUrl.startsWith("http")
                  ? kekeData.cvUrl
                  : `https://${kekeData.cvUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 sm:w-8 sm:h-8 bg-[#f43f5e] hover:bg-yellow-400 border-2 border-black shadow-[1.5px_1.5px_0px_#000000] sm:shadow-[2px_2px_0px_#000000] hover:translate-x-px hover:translate-y-px hover:shadow-none flex items-center justify-center text-black transition-all shrink-0"
              title="Curriculum Vitae"
            >
              <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2.5} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

