"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, FileText, ArrowRight } from "lucide-react";
import khansaData from "./data";

export default function KhansaCard({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-b from-[#f2fcfe] via-[#e2f7fb] to-[#c7eef7] border-[3px] sm:border-4 border-[#1a1a2e] rounded-xl sm:rounded-2xl shadow-[4px_4px_0px_#1a1a2e] sm:shadow-[6px_6px_0px_#1a1a2e] hover:shadow-[8px_8px_0px_#4ecdc4] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_#1a1a2e] p-3.5 sm:p-4 md:p-5 cursor-pointer flex flex-col w-full h-full transition-all duration-300 overflow-hidden text-[#1a1a2e] select-none"
    >
      {/* Top Kawaii Ocean Badges */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-1.5 bg-[#ffaebc] border-2 border-[#1a1a2e] text-[#1a1a2e] rounded-lg px-2 sm:px-2.5 py-0.5 font-mono font-black text-[10px] sm:text-[11px] shadow-[2px_2px_0px_#1a1a2e] transform -rotate-1 group-hover:rotate-0 transition-transform">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a2e] animate-ping" />
          <span>🦈 SHARKY // ANGGOTA</span>
        </div>

        <div className="flex items-center gap-1 bg-[#ffffff] border border-[#1a1a2e] rounded-lg px-2 py-0.5 font-mono text-[9px] sm:text-[10px] text-[#0d9488] font-black shadow-xs">
          <Sparkles size={11} className="text-[#0d9488]" />
          <span>OCEAN</span>
        </div>
      </div>

      {/* Photo Frame with Kawaii Pastel Scallop Border */}
      <div className="relative w-full aspect-square mb-3 sm:mb-4 rounded-xl overflow-hidden border-[2.5px] sm:border-[3px] border-[#1a1a2e] bg-[#ffe156] p-1 shadow-[3px_3px_0px_#1a1a2e] group-hover:bg-[#b4f8c8] transition-colors">
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#c2f0fc]">
          <Image
            src={khansaData.photo}
            alt={khansaData.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          />

          {/* Cute Corner Marine Stickers */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <span className="text-xs">🫧</span>
              <span className="text-xs">🐚</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs">🪸</span>
              <span className="text-xs">🦈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Member Info */}
      <div className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#0d9488] border border-[#1a1a2e]" />
          <span className="font-mono text-[10px] sm:text-xs font-bold text-[#0d9488] uppercase tracking-wider">
            {khansaData.role}
          </span>
        </div>

        <h3 className="text-sm sm:text-base md:text-lg font-mono font-black text-[#1a1a2e] group-hover:text-[#0d9488] leading-tight line-clamp-1 mb-1 transition-colors">
          {khansaData.name}
        </h3>

        <p className="font-mono text-[11px] sm:text-xs text-[#1a1a2e]/70 font-bold mb-3">
          {khansaData.nim}
        </p>

        {/* Action Button: Play Shark Game & View Profile */}
        <div className="mt-auto w-full flex items-center gap-2 pt-1">
          <div className="flex-1 py-2 px-3 bg-[#ffffff] group-hover:bg-[#ffe156] border-2 border-[#1a1a2e] rounded-xl shadow-[2.5px_2.5px_0px_#1a1a2e] group-hover:shadow-[1.5px_1.5px_0px_#1a1a2e] group-hover:translate-x-px group-hover:translate-y-px transition-all flex items-center justify-between text-xs font-mono font-black text-[#1a1a2e]">
            <span>Berenang 🫧</span>
            <ArrowRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Social Links */}
          {khansaData.linkedinUrl && (
            <a
              href={khansaData.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-[#4ecdc4] hover:bg-[#ffe156] border-2 border-[#1a1a2e] rounded-xl shadow-[2px_2px_0px_#1a1a2e] hover:translate-x-px hover:translate-y-px hover:shadow-none flex items-center justify-center text-[#1a1a2e] transition-all"
              title="LinkedIn"
            >
              <Image
                src="/linkedin.svg"
                alt="LinkedIn"
                width={15}
                height={15}
                className="w-3.5 h-3.5 object-contain"
              />
            </a>
          )}

          {khansaData.cvUrl && (
            <a
              href={khansaData.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-[#ffaebc] hover:bg-[#ffe156] border-2 border-[#1a1a2e] rounded-xl shadow-[2px_2px_0px_#1a1a2e] hover:translate-x-px hover:translate-y-px hover:shadow-none flex items-center justify-center text-[#1a1a2e] transition-all"
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
