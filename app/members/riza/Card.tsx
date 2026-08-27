"use client";

import React from "react";
import Image from "next/image";
import { Crosshair, ExternalLink, FileText, Target } from "lucide-react";
import data from "./data";

// ============================================================
// 🔒 LOCKED: Core component structure (DO NOT DELETE)
// Must accept onClick and render member data correctly
// ============================================================
export default function Card({ onClick }: { onClick: () => void }) {
  // ============================================================
  // 🔓 FREE TO CUSTOMIZE: Sharpshooter Shooting Range Neobrutalism
  // ============================================================
  return (
    <div
      onClick={onClick}
      className="group relative bg-nb-white border-[3px] sm:border-4 border-nb-black rounded-xl sm:rounded-2xl shadow-[4px_4px_0px_var(--nb-black)] sm:shadow-[6px_6px_0px_var(--nb-black)] hover:shadow-[8px_8px_0px_var(--nb-black)] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_var(--nb-black)] p-3.5 sm:p-4 md:p-5 cursor-pointer flex flex-col w-full h-full transition-all duration-200 overflow-hidden"
    >
      {/* Decorative Target Badge */}
      <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 flex items-center gap-1 bg-nb-yellow border-2 border-nb-black rounded-full px-2 py-0.5 shadow-[1.5px_1.5px_0px_var(--nb-black)] group-hover:rotate-6 transition-transform">
        <Target size={12} strokeWidth={3} className="text-nb-black" />
        <span className="font-mono font-black text-[9px] sm:text-[10px] text-nb-black uppercase">
          SHOOTER
        </span>
      </div>

      {/* Photo Frame with Crosshair reticle hover effect */}
      <div className="relative w-full aspect-square mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden border-[2.5px] sm:border-[3px] border-nb-black bg-nb-cream">
        <Image
          src={data.photo}
          alt={data.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
        />

        {/* Reticle Overlay on Hover */}
        <div className="absolute inset-0 bg-nb-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-nb-yellow flex items-center justify-center animate-spin" style={{ animationDuration: "8s" }}>
            <Crosshair size={20} className="text-nb-yellow" />
          </div>
        </div>
      </div>

      {/* Member Info */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-nb-lime border border-nb-black" />
          <span className="font-mono text-[10px] sm:text-xs font-bold text-nb-black/70 uppercase">
            {data.role}
          </span>
        </div>

        <h3 className="text-sm sm:text-base md:text-lg font-display font-black text-nb-black leading-tight line-clamp-2 mb-1.5">
          {data.name}
        </h3>

        <p className="font-mono text-[11px] sm:text-xs text-nb-black/80 font-bold mb-3">
          {data.nim || "NIM not available"}
        </p>

        {/* Social Links if provided */}
        {(data.linkedinUrl || data.cvUrl) && (
          <div className="mt-auto flex items-center gap-2 pt-1">
            {data.linkedinUrl && (
              <a
                href={data.linkedinUrl.startsWith("http") ? data.linkedinUrl : `https://${data.linkedinUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-nb-blue border-2 border-nb-black rounded-lg shadow-[1.5px_1.5px_0px_var(--nb-black)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center text-nb-black transition-all"
                title="LinkedIn"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
              </a>
            )}
            {data.cvUrl && (
              <a
                href={data.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-nb-pink border-2 border-nb-black rounded-lg shadow-[1.5px_1.5px_0px_var(--nb-black)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center text-nb-black transition-all"
                title="CV"
              >
                <FileText className="w-3.5 h-3.5" strokeWidth={2.5} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
