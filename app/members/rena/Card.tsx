"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, FileText } from "lucide-react";
import renaData from "./data";

export default function Card({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-b from-[#0c2317] via-[#102b1d] to-[#081810] border-2 border-[#245237] hover:border-[#ffe082] rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(50,122,81,0.4)] hover:-translate-y-1 active:translate-y-0 p-3.5 sm:p-4 md:p-5 cursor-pointer flex flex-col w-full h-full transition-all duration-300 overflow-hidden text-[#e8f7ee] select-none"
    >
      {/* Top Whimsical Fairy Badges */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-1.5 bg-[#123121] border border-[#2e6846] text-[#a8e6cf] rounded-md px-2.5 py-0.5 font-mono font-bold text-[10px] sm:text-[11px] shadow-sm transform -rotate-1 group-hover:rotate-0 transition-transform">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffe082] animate-ping" />
          <span>🧚‍♀️ FAE // KEEPER</span>
        </div>

        <div className="flex items-center gap-1 bg-[#153825] border border-[#ffe082]/60 rounded-md px-2 py-0.5 font-mono text-[9px] sm:text-[10px] text-[#ffe082] font-bold">
          <Sparkles size={11} className="text-[#ffe082]" />
          <span>GARDEN</span>
        </div>
      </div>

      {/* Photo Frame with Botanical Secret Garden Glow */}
      <div className="relative w-full aspect-square mb-3 sm:mb-4 rounded-xl overflow-hidden border-2 border-[#2b6443] bg-gradient-to-b from-[#133021] to-[#0b1c13] p-0.5 shadow-md group-hover:border-[#ffe082] transition-colors">
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#0a1a11]">
          <Image
            src={renaData.photo}
            alt={renaData.name}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          />

          {/* Whimsical Corner Accents */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <span className="text-xs">🌸</span>
              <span className="text-xs">✨</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs">🌿</span>
              <span className="text-xs">🧚‍♀️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Member Info */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#a8e6cf] shadow-[0_0_6px_#a8e6cf]" />
          <span className="font-mono text-[10px] sm:text-xs font-bold text-[#a8e6cf] uppercase tracking-wider">
            {renaData.role}
          </span>
        </div>

        <h3 className="text-sm sm:text-base md:text-lg font-serif font-black text-[#fffdf7] group-hover:text-[#ffe082] leading-tight line-clamp-1 mb-1 transition-colors">
          {renaData.name}
        </h3>

        <p className="font-mono text-[11px] sm:text-xs text-[#a8e6cf]/80 font-medium mb-3">
          {renaData.nim}
        </p>

        {/* Enter Secret Garden Action Button */}
        <div className="mt-auto w-full flex items-center gap-2 pt-1">
          <div className="flex-1 py-2 px-3 bg-[#133522] group-hover:bg-[#1d4d33] border border-[#2d6644] group-hover:border-[#ffe082] rounded-xl shadow-md transition-all flex items-center justify-between text-xs font-mono font-bold text-[#ffe082]">
            <span>✨ Secret Garden</span>
            <Sparkles size={14} className="shrink-0 group-hover:rotate-45 transition-transform text-[#ffe082]" />
          </div>

          {/* Social Links if present */}
          {renaData.linkedinUrl && (
            <a
              href={renaData.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-[#102c1d] hover:bg-[#1a442e] border border-[#2b6443] hover:border-[#ffe082] rounded-xl shadow-sm flex items-center justify-center text-[#cbf5dc] hover:text-[#ffe082] transition-all cursor-pointer"
              title="LinkedIn"
            >
              <Image
                src="/linkedin.svg"
                alt="LinkedIn"
                width={16}
                height={16}
                className="w-3.5 h-3.5 object-contain brightness-0 invert"
              />
            </a>
          )}
          {renaData.cvUrl && (
            <a
              href={renaData.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-[#102c1d] hover:bg-[#1a442e] border border-[#2b6443] hover:border-[#ffe082] rounded-xl shadow-sm flex items-center justify-center text-[#cbf5dc] hover:text-[#ffe082] transition-all cursor-pointer"
              title="CV"
            >
              <FileText className="w-3.5 h-3.5" strokeWidth={2.2} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
