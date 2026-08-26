"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GeometricParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. Floating & rotating animation for geometric shapes
      const geoParticles = el.querySelectorAll(".geo-particle");
      geoParticles.forEach((particle, i) => {
        const speed = 2.2 + (i % 5) * 0.5;
        const yOffset = 8 + (i % 4) * 5;
        const xOffset = (i % 2 === 0 ? 1 : -1) * (4 + (i % 3) * 3);
        const rotOffset = (i % 2 === 0 ? 1 : -1) * (12 + (i % 4) * 8);

        gsap.to(particle, {
          y: `-=${yOffset}`,
          x: `+=${xOffset}`,
          rotation: `+=${rotOffset}`,
          duration: speed,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: (i * 0.15) % 1.5,
        });
      });

      // 2. Twinkling & pulsing animation for sparkling star particles
      const sparkleParticles = el.querySelectorAll(".sparkle-particle");
      sparkleParticles.forEach((sparkle, i) => {
        const duration = 1.4 + (i % 4) * 0.4;
        gsap.to(sparkle, {
          scale: 1.35,
          opacity: 0.95,
          rotation: i % 2 === 0 ? "+=45" : "-=45",
          duration: duration,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: (i * 0.2) % 1.8,
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* =========================================================
          SPARKLING TWINKLING PARTICLES (Lightweight, vibrant sparkles)
          ========================================================= */}

      {/* Hero Sparkles */}
      <div className="sparkle-particle absolute top-20 left-[12%] text-nb-yellow text-xl sm:text-2xl font-black select-none opacity-40">
        ✦
      </div>
      <div className="sparkle-particle absolute top-36 right-[15%] text-nb-pink text-base sm:text-xl font-black select-none opacity-30">
        ✧
      </div>
      <div className="sparkle-particle absolute top-48 left-[28%] hidden sm:block text-nb-blue text-sm sm:text-base font-black select-none opacity-40">
        ✶
      </div>

      {/* Middle Section Sparkles (Near Marquee / Team) */}
      <div className="sparkle-particle absolute top-[28%] right-[8%] text-nb-lime text-lg sm:text-2xl font-black select-none opacity-40">
        ✦
      </div>
      <div className="sparkle-particle absolute top-[36%] left-[6%] text-nb-orange text-sm sm:text-lg font-black select-none opacity-30">
        ✧
      </div>
      <div className="sparkle-particle absolute top-[48%] right-[14%] hidden md:block text-nb-purple text-base sm:text-xl font-black select-none opacity-35">
        ✶
      </div>
      <div className="sparkle-particle absolute top-[54%] left-[10%] text-nb-pink text-sm sm:text-lg font-black select-none opacity-40">
        ✧
      </div>

      {/* Lower Section Sparkles (Near Gallery / Footer) */}
      <div className="sparkle-particle absolute top-[68%] right-[6%] text-nb-yellow text-lg sm:text-2xl font-black select-none opacity-40">
        ✦
      </div>
      <div className="sparkle-particle absolute top-[78%] left-[7%] hidden sm:block text-nb-blue text-base sm:text-xl font-black select-none opacity-35">
        ✶
      </div>
      <div className="sparkle-particle absolute top-[88%] left-[14%] text-nb-lime text-sm sm:text-lg font-black select-none opacity-40">
        ✧
      </div>
      <div className="sparkle-particle absolute top-[94%] right-[12%] text-nb-orange text-base sm:text-xl font-black select-none opacity-40">
        ✦
      </div>

      {/* =========================================================
          GEOMETRIC SHAPES & NEOBRUTALISM ACCENTS (Floating)
          ========================================================= */}

      {/* 1. Yellow Starburst (Top Left - Hero) */}
      <div className="geo-particle absolute top-24 left-[2%] sm:left-[3.5%] flex items-center justify-center w-7 h-7 sm:w-11 sm:h-11 bg-nb-yellow border-[2px] sm:border-[3px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[4px_4px_0px_var(--nb-black)] text-nb-black font-black text-base sm:text-2xl select-none rotate-12 opacity-85 sm:opacity-100">
        ✦
      </div>

      {/* 2. Pink Diamond (Top Right - Hero) */}
      <div className="geo-particle absolute top-28 right-[3%] sm:right-[4.5%] flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 bg-nb-pink border-[2px] sm:border-[3px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] text-nb-black font-black text-xs sm:text-base select-none rotate-45 opacity-85 sm:opacity-100">
        ◆
      </div>

      {/* 3. Lime Cross (Middle Upper Left - Near About/Marquee) */}
      <div className="geo-particle absolute top-[27%] left-[2%] sm:left-[3%] flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 bg-nb-lime border-[2px] sm:border-[3px] border-nb-black rounded-md shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] font-black text-base sm:text-2xl text-nb-black select-none rotate-12 opacity-85 sm:opacity-100">
        +
      </div>

      {/* 4. Orange Asterisk (Middle Right - Near Team) */}
      <div className="geo-particle absolute top-[43%] right-[2%] sm:right-[3%] flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 bg-nb-orange border-[2px] sm:border-[3px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[4px_4px_0px_var(--nb-black)] text-nb-black font-black text-base sm:text-2xl select-none -rotate-12 opacity-85 sm:opacity-100">
        ✶
      </div>

      {/* 5. Blue Sparkle Badge (Lower Left - Near Gallery) */}
      <div className="geo-particle absolute top-[69%] left-[2%] sm:left-[3.5%] flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 bg-nb-blue border-[2px] sm:border-[3px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] text-nb-black font-black text-sm sm:text-xl select-none rotate-6 opacity-85 sm:opacity-100">
        ✸
      </div>

      {/* 6. Purple Star (Bottom Right - Near Footer) */}
      <div className="geo-particle absolute top-[89%] right-[2%] sm:right-[3.5%] flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 bg-nb-purple border-[2px] sm:border-[3px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[4px_4px_0px_var(--nb-black)] text-nb-black font-black text-sm sm:text-xl select-none rotate-12 opacity-85 sm:opacity-100">
        ★
      </div>

      {/* --- TABLET & DESKTOP FLOATING BADGES --- */}

      {/* 7. Pink Donut Ring (Top Right) */}
      <div className="geo-particle absolute top-48 right-[10%] hidden md:flex items-center justify-center w-10 h-10 bg-nb-pink border-[3px] border-nb-black rounded-full shadow-[3px_3px_0px_var(--nb-black)] text-nb-black font-black text-lg select-none -rotate-6">
        <div className="w-3 h-3 bg-nb-cream rounded-full border-[2px] border-nb-black"></div>
      </div>

      {/* 8. Lime Tag Badge (Upper Left) */}
      <div className="geo-particle absolute top-[20%] left-[6%] hidden lg:flex items-center gap-1.5 px-3 py-1 bg-nb-lime border-[2.5px] border-nb-black rounded-full shadow-[3px_3px_0px_var(--nb-black)] font-mono font-bold text-xs text-nb-black select-none rotate-6">
        <span>⚡</span> PROXY
      </div>

      {/* 9. Cyan Code Bracket Badge (Upper Right) */}
      <div className="geo-particle absolute top-[23%] right-[6%] hidden md:flex items-center gap-1 px-3 py-1 bg-nb-blue border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-mono font-black text-xs text-nb-black select-none -rotate-6">
        {"</>"} DEV
      </div>

      {/* 10. Drama Tag Badge (Middle Right) */}
      <div className="geo-particle absolute top-[57%] right-[6%] hidden lg:flex items-center gap-1.5 px-3 py-1 bg-nb-pink border-[2.5px] border-nb-black rounded-full shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-xs text-nb-black select-none -rotate-3">
        <span>🎭</span> DRAMA
      </div>

      {/* 11. Lime Triangle (Gallery Section Left) */}
      <div className="geo-particle absolute top-[75%] left-[6%] hidden md:flex items-center justify-center w-9 h-9 bg-nb-lime border-[3px] border-nb-black rounded-xl shadow-[3px_3px_0px_var(--nb-black)] text-nb-black font-black text-lg select-none rotate-12">
        ▲
      </div>

      {/* 12. Orange Star Tag (Bottom Left) */}
      <div className="geo-particle absolute top-[91%] left-[6%] hidden lg:flex items-center gap-1 px-3 py-1 bg-nb-orange border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-xs text-nb-black select-none -rotate-6">
        <span>★</span> ILKOM 62
      </div>
    </div>
  );
}

