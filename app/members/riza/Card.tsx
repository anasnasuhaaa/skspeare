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
  // FREE TO CUSTOMIZE: Valorant Tactical Agent Card
  // ============================================================
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#0F1923] border border-[#303946] hover:border-[#FF4655] p-3.5 sm:p-4 md:p-5 cursor-pointer flex flex-col w-full h-full transition-all duration-300 overflow-hidden text-[#ECE8E1] hover:shadow-[0_0_20px_rgba(255,70,85,0.25)] hover:-translate-y-1"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
      }}
    >
      {/* Google Font Embed for Valorant Typography */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Teko:wght@600;700&family=Share+Tech+Mono&display=swap');
            .font-valorant-title { font-family: 'Teko', 'Rajdhani', sans-serif; }
            .font-valorant-sub { font-family: 'Rajdhani', sans-serif; }
            .font-valorant-mono { font-family: 'Share Tech Mono', monospace; }
          `,
        }}
      />

      {/* Decorative Tactical Background Decals */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-[#FF4655]/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-2 left-2 flex gap-1 pointer-events-none opacity-40">
        <span className="w-1 h-1 bg-[#FF4655]" />
        <span className="w-1 h-1 bg-[#ECE8E1]" />
        <span className="w-1 h-1 bg-[#ECE8E1]" />
      </div>

      {/* Tactical Top-Right Badge */}
      <div
        className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 flex items-center gap-1.5 bg-[#1F2326] border border-[#FF4655]/60 px-2 py-0.5 group-hover:border-[#FF4655] group-hover:bg-[#FF4655]/20 transition-all duration-200"
        style={{
          clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
        }}
      >
        <Target size={11} className="text-[#FF4655]" />
        <span className="font-valorant-mono font-bold text-[9px] sm:text-[10px] text-[#ECE8E1] tracking-wider uppercase">
          SHOOTER // 07
        </span>
      </div>

      {/* Photo Frame with Valorant Crosshair Reticle on Hover */}
      <div
        className="relative w-full aspect-square mb-3 sm:mb-4 overflow-hidden border border-[#2B3844] group-hover:border-[#FF4655]/80 bg-[#161F28] transition-colors duration-300"
        style={{
          clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
        }}
      >
        <Image
          src={data.photo}
          alt={data.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
        />

        {/* Tactical Corner Brackets on Photo */}
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#FF4655]/70 pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#FF4655]/70 pointer-events-none" />

        {/* Valorant Reticle Overlay on Hover */}
        <div className="absolute inset-0 bg-[#0F1923]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full border border-[#FF4655]/80 flex items-center justify-center animate-spin" style={{ animationDuration: "10s" }}>
            <Crosshair size={22} className="text-[#FF4655]" />
          </div>
        </div>
      </div>

      {/* Member Info */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Role with Valorant Indicator */}
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-1.5 h-1.5 bg-[#FF4655] rotate-45" />
          <span className="font-valorant-mono text-[10px] sm:text-xs font-semibold text-[#8B978F] tracking-widest uppercase">
            // {data.role}
          </span>
        </div>

        {/* Agent Name */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-valorant-title font-bold text-[#ECE8E1] group-hover:text-[#FF4655] transition-colors leading-none tracking-wide line-clamp-2 mb-1.5 uppercase">
          {data.name}
        </h3>

        {/* NIM */}
        <p className="font-valorant-mono text-[11px] sm:text-xs text-[#8B978F] tracking-wider mb-3">
          ID // {data.nim || "NOT_AVAILABLE"}
        </p>

        {/* Social Links if provided */}
        {(data.linkedinUrl || data.cvUrl) && (
          <div className="mt-auto flex items-center gap-2 pt-1 border-t border-[#1F2933]">
            {data.linkedinUrl && (
              <a
                href={data.linkedinUrl.startsWith("http") ? data.linkedinUrl : `https://${data.linkedinUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-[#161F28] hover:bg-[#FF4655] border border-[#303946] hover:border-[#FF4655] flex items-center justify-center text-[#ECE8E1] hover:text-white transition-all duration-200"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                }}
                title="LinkedIn Profile"
              >
                <Image
                  src="/linkedin.svg"
                  alt="LinkedIn"
                  width={16}
                  height={16}
                  className="w-3.5 h-3.5 object-contain invert"
                />
              </a>
            )}
            {data.cvUrl && (
              <a
                href={data.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-[#161F28] hover:bg-[#FF4655] border border-[#303946] hover:border-[#FF4655] flex items-center justify-center text-[#ECE8E1] hover:text-white transition-all duration-200"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                }}
                title="Curriculum Vitae"
              >
                <FileText className="w-3.5 h-3.5" strokeWidth={2} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Bottom Right Tactical Accent */}
      <div className="absolute bottom-1 right-2 text-[8px] font-valorant-mono text-[#303946] select-none pointer-events-none">
        VLT//PROTOCOL
      </div>
    </div>
  );
}
