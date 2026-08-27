"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Main card entrance
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Continuous floating motion for stickers and particles
      const geoParticles = el.querySelectorAll(".geo-particle, .floating-sticker");
      geoParticles.forEach((particle, i) => {
        gsap.to(particle, {
          y: i % 2 === 0 ? -10 : 10,
          x: i % 3 === 0 ? 5 : -5,
          rotation: i % 2 === 0 ? "+=15" : "-=15",
          duration: 2.2 + (i % 4) * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Twinkling animation for sparkles
      const sparkles = el.querySelectorAll(".sparkle-particle");
      sparkles.forEach((sparkle, i) => {
        gsap.to(sparkle, {
          scale: 1.45,
          opacity: 1,
          rotation: i % 2 === 0 ? "+=90" : "-=90",
          duration: 1.2 + (i % 3) * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: (i * 0.15) % 1.2,
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="pt-22 sm:pt-26 pb-14 sm:pb-20 relative overflow-hidden">
      {/* Local Decorative Particles & Sparkles (Safe Zone) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      >
        {/* Top Left Sparkle & Starburst */}
        <div className="geo-particle absolute top-12 left-[3%] sm:left-[5%] flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 bg-nb-yellow border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] text-nb-black font-black text-sm sm:text-xl select-none rotate-12">
          ✦
        </div>
        <div className="sparkle-particle absolute top-28 left-[12%] text-nb-pink text-base sm:text-xl font-black select-none opacity-40">
          ✧
        </div>

        {/* Top Right Sparkle & Diamond */}
        <div className="geo-particle absolute top-14 right-[3%] sm:right-[5%] flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 bg-nb-pink border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] text-nb-black font-black text-xs sm:text-base select-none rotate-45">
          ◆
        </div>
        <div className="sparkle-particle absolute top-32 right-[14%] text-nb-yellow text-lg sm:text-2xl font-black select-none opacity-40">
          ✦
        </div>

        {/* Bottom Left Code Tag (Desktop) & Sparkle */}
        <div className="geo-particle absolute bottom-8 left-[4%] hidden lg:flex items-center gap-1 px-3 py-1 bg-nb-blue border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-mono font-black text-xs text-nb-black select-none -rotate-6">
          {"</>"} DEV
        </div>
        <div className="sparkle-particle absolute bottom-12 left-[18%] hidden sm:block text-nb-lime text-base sm:text-xl font-black select-none opacity-35">
          ✶
        </div>

        {/* Bottom Right Sparkle */}
        <div className="sparkle-particle absolute bottom-10 right-[6%] text-nb-orange text-base sm:text-xl font-black select-none opacity-40">
          ✦
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={cardRef}
          className="w-full bg-nb-blue border-4 border-nb-black rounded-2xl shadow-[8px_8px_0px_var(--nb-black)] p-6 sm:p-10 md:p-14 relative overflow-hidden"
        >
          {/* Floating stickers for desktop */}
          <div className="floating-sticker hidden sm:block absolute top-6 right-8 px-4 py-1.5 bg-nb-yellow border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-sm uppercase transform rotate-6 z-10">
            Computer Science
          </div>
          <div className="floating-sticker hidden sm:block absolute bottom-8 right-10 px-4 py-1.5 bg-nb-pink border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-sm uppercase transform -rotate-3 z-10">
            IPB University
          </div>
          <div className="floating-sticker hidden md:block absolute top-1/2 right-6 -translate-y-1/2 px-4 py-1.5 bg-nb-lime border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-sm uppercase transform rotate-2 z-10">
            Pekan Ilkomerz 62
          </div>

          {/* Heading - Pure bold solid black */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-nb-black mb-6 sm:mb-8 leading-none uppercase relative z-10 tracking-tight">
            PROXY<br className="sm:hidden" /> SHAKESPEARE
          </h1>

          <div className="bg-nb-white p-5 sm:p-7 md:p-8 border-[3px] border-nb-black rounded-xl shadow-[4px_4px_0px_var(--nb-black)] max-w-2xl relative z-10">
            <p className="text-base sm:text-lg md:text-xl text-nb-black font-medium leading-relaxed">
              Welcome to the profile website of <strong>Proxy Shakespeare</strong>. This project was created as part of the group assignment for{" "}
              <strong>Pekan Ilkomerz 62</strong>,{" "}
              <strong>Department of Computer Science, IPB University</strong>.
            </p>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-nb-black font-medium leading-relaxed">
              We unite code, creativity, and the spirit of collaboration in everything we build. ✨
            </p>
          </div>

          {/* CTA Action Buttons (Symmetrical 2-column on mobile, auto-flex on desktop) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8 relative z-10 w-full sm:w-auto">
            <button
              onClick={() => {
                document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-4 sm:px-7 py-2.5 sm:py-3 bg-nb-yellow border-[3px] border-nb-black rounded-xl shadow-[3px_3px_0px_var(--nb-black)] sm:shadow-[4px_4px_0px_var(--nb-black)] font-display font-black text-xs sm:text-base text-nb-black uppercase tracking-wide hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_var(--nb-black)] active:translate-y-[3px] active:translate-x-[3px] active:shadow-[0px_0px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 text-center"
            >
              <span>Explore Team</span>
              <span className="text-sm sm:text-lg">↓</span>
            </button>
            <button
              onClick={() => {
                document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-4 sm:px-7 py-2.5 sm:py-3 bg-nb-white border-[3px] border-nb-black rounded-xl shadow-[3px_3px_0px_var(--nb-black)] sm:shadow-[4px_4px_0px_var(--nb-black)] font-display font-black text-xs sm:text-base text-nb-black uppercase tracking-wide hover:bg-nb-pink hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_var(--nb-black)] active:translate-y-[3px] active:translate-x-[3px] active:shadow-[0px_0px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 text-center"
            >
              <span>Gallery</span>
              <span className="text-xs sm:text-base">📸</span>
            </button>
          </div>

          {/* Mobile badges */}
          <div className="flex flex-wrap gap-2 mt-6 sm:hidden relative z-10">
            <span className="px-3 py-1 bg-nb-yellow border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] font-bold text-xs">
              Computer Science
            </span>
            <span className="px-3 py-1 bg-nb-pink border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] font-bold text-xs">
              IPB University
            </span>
            <span className="px-3 py-1 bg-nb-lime border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] font-bold text-xs">
              Pekan Ilkomerz 62
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}


