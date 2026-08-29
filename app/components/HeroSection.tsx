"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Sparkles, ArrowDown, Users } from "lucide-react";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const photoCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. Initial Slam Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: "back.out(1.8)" } });

      // Headline items slam in
      tl.fromTo(
        ".hero-motion-word",
        { opacity: 0, y: 40, scale: 0.88, rotation: (i) => (i % 2 === 0 ? -4 : 4) },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: (i) => (i % 2 === 0 ? -2 : 1),
          duration: 0.65,
          stagger: 0.12,
        }
      );

      // Photo Showcase Card slams down with spring bounce
      if (photoCardRef.current) {
        tl.fromTo(
          photoCardRef.current,
          { opacity: 0, y: 50, scale: 0.92, rotation: 2 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.75,
            ease: "back.out(1.8)",
          },
          "-=0.35"
        );
      }

      // Action buttons pop in
      tl.fromTo(
        ".hero-cta-btn",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" },
        "-=0.2"
      );

      // Ambient decorative floaters
      const floaters = el.querySelectorAll(".hero-float-item");
      floaters.forEach((item, i) => {
        gsap.to(item, {
          y: i % 2 === 0 ? -6 : 6,
          x: i % 3 === 0 ? 3 : -3,
          rotation: i % 2 === 0 ? "+=5" : "-=5",
          duration: 2.3 + (i % 3) * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Twinkling sparkles
      const sparkles = el.querySelectorAll(".hero-sparkle");
      sparkles.forEach((sparkle, i) => {
        gsap.to(sparkle, {
          scale: 1.4,
          opacity: 1,
          rotation: i % 2 === 0 ? "+=90" : "-=90",
          duration: 1.3 + (i % 3) * 0.3,
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
    <section
      id="home"
      ref={sectionRef}
      className="min-h-dvh pt-20 pb-12 sm:pt-24 sm:pb-16 relative overflow-hidden flex flex-col justify-center items-center bg-nb-cream"
    >
      {/* Background Decorative Ambient Particles (Fully Responsive for Mobile & Desktop) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
      >
        {/* Top Left Starburst */}
        <div className="hero-float-item absolute top-16 sm:top-20 left-2.5 sm:left-[4%] flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 bg-nb-yellow border-2 sm:border-[2.5px] border-nb-black rounded-lg sm:rounded-xl shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[2.5px_2.5px_0px_var(--nb-black)] text-nb-black font-black text-xs sm:text-base rotate-12">
          ✦
        </div>
        <div className="hero-sparkle absolute top-28 sm:top-32 left-5 sm:left-[10%] text-nb-pink text-xs sm:text-lg font-black opacity-50">
          ✧
        </div>

        {/* Top Right Geometric Diamond */}
        <div className="hero-float-item absolute top-16 sm:top-20 right-2.5 sm:right-[5%] flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-nb-pink border-2 sm:border-[2.5px] border-nb-black rounded-md sm:rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[2.5px_2.5px_0px_var(--nb-black)] text-nb-black font-black text-[10px] sm:text-xs rotate-45">
          ◆
        </div>
        <div className="hero-sparkle absolute top-28 sm:top-34 right-5 sm:right-[12%] text-nb-yellow text-xs sm:text-xl font-black opacity-50">
          ✦
        </div>

        {/* Mid/Bottom Left Sparkle Tag */}
        <div className="hero-float-item absolute bottom-10 sm:bottom-12 left-2 sm:left-[5%] flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-nb-lime border-2 border-nb-black rounded-md sm:rounded-lg shadow-[1.5px_1.5px_0px_var(--nb-black)] sm:shadow-[2px_2px_0px_var(--nb-black)] font-mono font-black text-[9px] sm:text-xs text-nb-black -rotate-6">
          <Sparkles size={11} className="hidden sm:inline" />
          <span>ILKOMP 62</span>
        </div>
        <div className="hero-sparkle absolute bottom-20 sm:bottom-24 left-4 sm:left-[8%] text-nb-lime text-xs sm:text-base font-black opacity-45">
          ✶
        </div>

        {/* Mid/Bottom Right Tag */}
        <div className="hero-float-item absolute bottom-10 sm:bottom-12 right-2 sm:right-[6%] flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-nb-blue border-2 border-nb-black rounded-md sm:rounded-lg shadow-[1.5px_1.5px_0px_var(--nb-black)] sm:shadow-[2px_2px_0px_var(--nb-black)] font-mono font-black text-[9px] sm:text-xs text-nb-black rotate-3">
          <span>PI 62</span>
        </div>
        <div className="hero-sparkle absolute bottom-20 sm:bottom-24 right-4 sm:right-[9%] text-nb-orange text-xs sm:text-base font-black opacity-45">
          ✧
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center justify-center py-2 sm:py-4">
        {/* 1. Kinetic Motion Typography Headline (Stacked on mobile, side-by-side on desktop) */}
        <div ref={headlineRef} className="mb-5 sm:mb-8 flex flex-col items-center shrink-0">
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-nb-black leading-tight sm:leading-none uppercase tracking-tight flex flex-col sm:flex-row items-center justify-center gap-y-3 sm:gap-x-4 select-none">
            {/* PROXY Word Plate (Top on mobile) */}
            <span className="hero-motion-word inline-block bg-nb-yellow border-[3px] sm:border-4 border-nb-black rounded-xl sm:rounded-2xl px-5 sm:px-7 py-1 sm:py-1.5 shadow-[4px_4px_0px_var(--nb-black)] sm:shadow-[5px_5px_0px_var(--nb-black)] hover:scale-105 hover:rotate-0 transition-transform duration-200 text-nb-black cursor-default transform -rotate-1 sm:-rotate-2">
              PROXY
            </span>

            {/* SHAKESPEARE Word Plate (Below on mobile) */}
            <span className="hero-motion-word inline-block relative text-nb-black hover:scale-105 hover:rotate-0 transition-transform duration-200 cursor-default transform rotate-1">
              SHAKESPEARE
              {/* Underline Ribbon Highlight */}
              <span
                aria-hidden="true"
                className="absolute -bottom-1 sm:-bottom-1.5 left-0 w-full h-2.5 sm:h-3.5 bg-nb-pink border-2 border-nb-black -z-10 rounded-sm -rotate-1 pointer-events-none opacity-95 shadow-[1.5px_1.5px_0px_var(--nb-black)]"
              />
            </span>
          </h1>
        </div>

        {/* 2. Hero Centerpiece: Team Photo Showcase Card (Aligned with Navbar max-w-6xl) */}
        <div
          ref={photoCardRef}
          className="w-full bg-nb-white border-[3px] sm:border-4 border-nb-black rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 pb-3 sm:pb-4 shadow-[6px_6px_0px_var(--nb-black)] sm:shadow-[8px_8px_0px_var(--nb-black)] relative overflow-visible group my-3 sm:my-5 shrink-0"
        >
          {/* Washi Tape / Scotch Tape Accents on Top */}
          <div
            aria-hidden="true"
            className="absolute -top-3 left-10 sm:left-16 w-20 sm:w-28 h-4 sm:h-5 bg-nb-cream/80 border-2 border-nb-black/30 backdrop-blur-xs -rotate-6 z-30 pointer-events-none shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.15)]"
          />
          <div
            aria-hidden="true"
            className="absolute -top-3 right-10 sm:right-16 w-20 sm:w-28 h-4 sm:h-5 bg-nb-cream/80 border-2 border-nb-black/30 backdrop-blur-xs rotate-4 z-30 pointer-events-none shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.15)]"
          />

          {/* Photo Container Frame */}
          <div className="relative w-full aspect-16/10 sm:aspect-video max-h-[42dvh] sm:max-h-[46dvh] rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-[2.5px] border-nb-black bg-nb-cream shadow-[inset_0_0_10px_rgba(0,0,0,0.15)]">
            <Image
              src="/gallery/1.jpeg"
              alt="Proxy Shakespeare Team"
              fill
              priority
              loading="eager"
              sizes="(max-width: 768px) 100vw, 750px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Pinned Bottom Left Stamp inside Photo */}
            {/* <div className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 bg-nb-lime border-2 border-nb-black rounded-lg px-2.5 py-0.5 font-mono font-black text-[10px] sm:text-xs text-nb-black shadow-[2px_2px_0px_var(--nb-black)] flex items-center gap-1.5">
              <Users size={12} strokeWidth={2.5} />
              <span>PJK Kak Wafi</span>
            </div> */}
          </div>

          {/* Bottom Caption Bar */}
          <div className="mt-3 sm:mt-3.5 flex items-center justify-between px-1 font-mono font-black text-[11px] sm:text-xs text-nb-black">
            <div className="flex items-center gap-1.5">
              <span>PEKAN ILKOMERZ 62 · CS IPB 62</span>
            </div>
          </div>
        </div>

        {/* 3. Action Buttons & Navigation Triggers */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 relative z-10 w-full shrink-0">
          <button
            onClick={() => {
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="hero-cta-btn px-6 sm:px-8 py-2.5 sm:py-3 bg-nb-yellow hover:bg-nb-lime border-[2.5px] sm:border-[3px] border-nb-black rounded-xl shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-xs sm:text-sm uppercase text-nb-black tracking-wide hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] active:translate-y-0.75 active:shadow-none transition-all cursor-pointer flex items-center gap-2"
          >
            <span>EXPLORE About Us</span>
            <ArrowDown size={14} strokeWidth={3} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
