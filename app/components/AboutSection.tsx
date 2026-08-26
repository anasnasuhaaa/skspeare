"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="pt-28 sm:pt-32 pb-14 sm:pb-20 px-4">
      <div className="container mx-auto max-w-5xl relative">
        <div
          ref={cardRef}
          className="bg-nb-blue border-4 border-nb-black rounded-2xl shadow-[8px_8px_0px_var(--nb-black)] p-6 sm:p-10 md:p-14 relative overflow-hidden"
        >
          {/* Floating stickers for desktop */}
          <div className="hidden sm:block absolute top-6 right-8 px-4 py-1.5 bg-nb-yellow border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-sm uppercase transform rotate-6 z-10">
            Est. 2025
          </div>
          <div className="hidden sm:block absolute bottom-8 right-10 px-4 py-1.5 bg-nb-pink border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-sm uppercase transform -rotate-3 z-10">
            Ilkom IPB
          </div>
          <div className="hidden md:block absolute top-1/2 right-6 -translate-y-1/2 px-4 py-1.5 bg-nb-lime border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-sm uppercase transform rotate-2 z-10">
            Pekan Ilkomerz 62
          </div>

          {/* Heading - Pure bold solid black */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-nb-black mb-6 sm:mb-8 leading-none uppercase relative z-10 tracking-tight">
            PROXY<br className="sm:hidden" /> SHAKESPEARE
          </h1>

          <div className="bg-nb-white p-5 sm:p-7 md:p-8 border-[3px] border-nb-black rounded-xl shadow-[4px_4px_0px_var(--nb-black)] max-w-2xl relative z-10">
            <p className="text-base sm:text-lg md:text-xl text-nb-black font-medium leading-relaxed">
              Selamat datang di website profil <strong>Proxy Shakespeare</strong>. Website ini dibuat sebagai bagian dari penugasan kelompok pada{" "}
              <strong>Pekan Ilkomerz 62</strong>,{" "}
              <strong>Program Studi Ilmu Komputer, IPB University</strong>.
            </p>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-nb-black font-medium leading-relaxed">
              Kami menyatukan kode, kreativitas, dan semangat kolaborasi dalam setiap karya yang kami bangun. ✨
            </p>
          </div>

          {/* Mobile badges */}
          <div className="flex flex-wrap gap-2 mt-6 sm:hidden relative z-10">
            <span className="px-3 py-1 bg-nb-yellow border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] font-bold text-xs">
              Est. 2025
            </span>
            <span className="px-3 py-1 bg-nb-pink border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] font-bold text-xs">
              Ilkom IPB
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
