"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Crown, Award, ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !cardRef.current) return;

    const ctx = gsap.context(() => {
      // Main Entrance Timeline triggered on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          once: true,
        },
      });

      tl.fromTo(
        ".about-title-badge",
        { opacity: 0, y: 25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.8)" }
      );

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "back.out(1.6)",
        },
        "-=0.2"
      );

      if (textBoxRef.current) {
        tl.fromTo(
          textBoxRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
          "-=0.25"
        );
      }

      // Title badge floating motion
      const titleBadge = el.querySelector(".about-title-badge");
      if (titleBadge) {
        gsap.to(titleBadge, {
          y: -5,
          rotation: "+=2",
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Title word chip wiggle
      const wordChip = el.querySelector(".about-word-chip");
      if (wordChip) {
        gsap.to(wordChip, {
          scale: 1.06,
          rotation: "-=3",
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Corner star continuous rotation
      const titleStar = el.querySelector(".about-star-accent");
      if (titleStar) {
        gsap.to(titleStar, {
          rotation: "+=360",
          duration: 9,
          repeat: -1,
          ease: "none",
        });
      }

      // Ambient decorative particles motion
      const geoParticles = el.querySelectorAll(".about-geo-particle");
      geoParticles.forEach((particle, i) => {
        gsap.to(particle, {
          y: i % 2 === 0 ? -6 : 6,
          x: i % 3 === 0 ? 3 : -3,
          rotation: i % 2 === 0 ? "+=10" : "-=10",
          duration: 2.4 + (i % 3) * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-16 sm:py-24 relative overflow-hidden flex flex-col justify-center items-center bg-nb-cream"
    >
      {/* Background Decorative Ambient Particles (Responsive for Mobile & Desktop) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
      >
        {/* Top Left Cross */}
        <div className="about-geo-particle absolute top-12 left-2.5 sm:left-[4%] flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-nb-lime border-2 border-nb-black rounded-md shadow-[1.5px_1.5px_0px_var(--nb-black)] font-black text-xs sm:text-base text-nb-black rotate-12">
          +
        </div>

        {/* Top Right Diamond */}
        <div className="about-geo-particle absolute top-14 right-2.5 sm:right-[5%] flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-nb-pink border-2 border-nb-black rounded-md shadow-[1.5px_1.5px_0px_var(--nb-black)] font-black text-[10px] sm:text-xs text-nb-black rotate-45">
          ◆
        </div>

        {/* Bottom Left Star */}
        <div className="about-geo-particle absolute bottom-12 left-2.5 sm:left-[4%] flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-nb-yellow border-2 border-nb-black rounded-md shadow-[1.5px_1.5px_0px_var(--nb-black)] font-black text-xs text-nb-black -rotate-12">
          ★
        </div>

        {/* Bottom Right Dot */}
        <div className="about-geo-particle absolute bottom-12 right-2.5 sm:right-[5%] flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-nb-blue border-2 border-nb-black rounded-full shadow-[1.5px_1.5px_0px_var(--nb-black)] font-black text-xs text-nb-black rotate-6">
          ✸
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center justify-center">
        {/* Unified Signature Neobrutalism Title Header (Matches "Meet The Team" & "Photo Gallery") */}
        <div className="flex flex-col items-center mb-8 sm:mb-12 text-center shrink-0">
          <div className="relative inline-block">
            <div className="about-title-badge inline-flex items-center gap-2.5 sm:gap-3 bg-nb-white border-[3.5px] sm:border-4 border-nb-black rounded-2xl shadow-[6px_6px_0px_var(--nb-black)] sm:shadow-[8px_8px_0px_var(--nb-black)] px-6 sm:px-10 py-2.5 sm:py-3.5 -rotate-1 hover:rotate-0 transition-transform duration-300">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-nb-black uppercase tracking-tight flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center">
                <span>ABOUT</span>
                <span className="about-word-chip bg-nb-yellow text-nb-black px-2.5 sm:px-3 py-0.5 border-2 sm:border-[2.5px] border-nb-black rounded-lg sm:rounded-xl shadow-[2px_2px_0px_var(--nb-black)] rotate-2 inline-block">
                  US
                </span>
              </h2>
            </div>
            {/* Corner Star Accent */}
            <div className="about-star-accent absolute -top-2.5 -right-2.5 sm:-right-3 w-6 h-6 sm:w-7 sm:h-7 bg-nb-pink border-2 border-nb-black rounded-full shadow-[1.5px_1.5px_0px_var(--nb-black)] flex items-center justify-center font-black text-[10px] sm:text-xs select-none rotate-12">
              ★
            </div>
          </div>
        </div>

        {/* Main About Card Container */}
        <div
          ref={cardRef}
          className="w-full bg-nb-blue border-4 border-nb-black rounded-2xl sm:rounded-3xl shadow-[6px_6px_0px_var(--nb-black)] sm:shadow-[8px_8px_0px_var(--nb-black)] p-4 sm:p-6 md:p-8 relative overflow-hidden shrink min-h-0"
        >
          {/* Neobrutalist Washi Tape Accents */}
          <div
            aria-hidden="true"
            className="absolute -top-3 left-8 sm:left-14 w-18 sm:w-24 h-4 sm:h-5 bg-nb-cream/80 border-2 border-nb-black/30 backdrop-blur-xs -rotate-6 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.15)] z-20 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -top-3 right-8 sm:right-14 w-18 sm:w-24 h-4 sm:h-5 bg-nb-cream/80 border-2 border-nb-black/30 backdrop-blur-xs rotate-3 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.15)] z-20 pointer-events-none"
          />

          {/* Simple Clean English Narrative Box */}
          <div
            ref={textBoxRef}
            className="bg-nb-white p-4 sm:p-5 md:p-6 border-[2.5px] sm:border-[3px] border-nb-black rounded-xl sm:rounded-2xl shadow-[3px_3px_0px_var(--nb-black)] mb-4 sm:mb-6"
          >
            <p className="text-xs sm:text-sm md:text-base text-nb-black font-medium leading-relaxed">
              Welcome to the official profile website of <strong>Proxy Shakespeare</strong>. This project was created as part of the group assignment for{" "}
              <strong>Pekan Ilkomerz 62</strong>,{" "}
              <strong>Department of Computer Science, IPB University</strong>.
            </p>
            <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-nb-black font-medium leading-relaxed">
              Guided by our group mentor <strong>Kak Wafi</strong>, we unite code, creativity, and the spirit of collaboration in everything we build. ✨
            </p>
          </div>

          {/* 3 Static Grounded Neobrutalist Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-nb-yellow border-2 sm:border-[2.5px] border-nb-black rounded-xl p-2.5 sm:p-3.5 shadow-[2px_2px_0px_var(--nb-black)] flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-nb-white border-2 border-nb-black rounded-lg shadow-[1px_1px_0px_var(--nb-black)] flex items-center justify-center shrink-0">
                <Users size={16} className="text-nb-black" />
              </div>
              <div>
                <div className="font-display font-black text-xs sm:text-sm text-nb-black uppercase">11 Members</div>
                <div className="font-mono text-[10px] sm:text-[11px] text-nb-black/75">Computer Science 62</div>
              </div>
            </div>

            <div className="bg-nb-lime border-2 sm:border-[2.5px] border-nb-black rounded-xl p-2.5 sm:p-3.5 shadow-[2px_2px_0px_var(--nb-black)] flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-nb-white border-2 border-nb-black rounded-lg shadow-[1px_1px_0px_var(--nb-black)] flex items-center justify-center shrink-0">
                <Crown size={16} className="text-nb-black" />
              </div>
              <div>
                <div className="font-display font-black text-xs sm:text-sm text-nb-black uppercase">PJK: Kak Wafi</div>
                <div className="font-mono text-[10px] sm:text-[11px] text-nb-black/75">Group Mentor</div>
              </div>
            </div>

            <div className="bg-nb-pink border-2 sm:border-[2.5px] border-nb-black rounded-xl p-2.5 sm:p-3.5 shadow-[2px_2px_0px_var(--nb-black)] flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-nb-white border-2 border-nb-black rounded-lg shadow-[1px_1px_0px_var(--nb-black)] flex items-center justify-center shrink-0">
                <Award size={16} className="text-nb-black" />
              </div>
              <div>
                <div className="font-display font-black text-xs sm:text-sm text-nb-black uppercase">Pekan Ilkomerz</div>
                <div className="font-mono text-[10px] sm:text-[11px] text-nb-black/75">IPB University</div>
              </div>
            </div>
          </div>

          {/* Action Button Centered */}
          <div className="flex items-center justify-center relative z-10 w-full pt-1">
            <button
              onClick={() => {
                document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-nb-yellow hover:bg-nb-lime border-[2.5px] sm:border-[3px] border-nb-black rounded-xl shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-xs sm:text-sm uppercase text-nb-black tracking-wide hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] active:translate-y-0.75 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 w-auto"
            >
              <span>Explore Team</span>
              <ArrowDown size={14} strokeWidth={3} className="animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
