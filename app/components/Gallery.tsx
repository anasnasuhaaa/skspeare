"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const ctx = gsap.context(() => {
      tweenRef.current = gsap.fromTo(
        trackRef.current,
        { xPercent: 0 },
        {
          xPercent: -50,
          ease: "none",
          duration: 28,
          repeat: -1,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, {
        timeScale: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, {
        timeScale: 1,
        duration: 0.5,
        ease: "power2.in",
      });
    }
  };

  const photos = ["/gallery/1.jpeg", "/gallery/2.jpeg", "/gallery/3.jpeg"];
  // Repeat photos 4 times per block (12 items per block)
  const oneBlock = [...photos, ...photos, ...photos, ...photos];

  const PhotoBlock = ({ prefix }: { prefix: string }) => (
    <div className="flex gap-4 sm:gap-6 shrink-0 pr-4 sm:pr-6">
      {oneBlock.map((photo, i) => (
        <div
          key={`${prefix}-${i}`}
          className="shrink-0 w-[240px] h-[180px] sm:w-[300px] sm:h-[220px] md:w-[360px] md:h-[260px] bg-nb-white border-[3px] sm:border-[4px] border-nb-black rounded-2xl shadow-[4px_4px_0px_var(--nb-black)] sm:shadow-[6px_6px_0px_var(--nb-black)] overflow-hidden relative group hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--nb-black)] transition-all duration-200"
        >
          <Image
            src={photo}
            alt={`Dokumentasi kegiatan ${(i % 3) + 1}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 360px"
          />
        </div>
      ))}
    </div>
  );

  return (
    <section id="gallery" className="py-14 sm:py-20 bg-nb-cream overflow-hidden border-t-[3px] border-nb-black">
      <div className="container mx-auto px-4 mb-8 sm:mb-10 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-nb-black uppercase tracking-tight">
          Gallery
        </h2>
      </div>

      <div
        className="w-full py-4 sm:py-6 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={trackRef}
          className="flex w-fit whitespace-nowrap will-change-transform cursor-grab active:cursor-grabbing"
        >
          <PhotoBlock prefix="a" />
          <PhotoBlock prefix="b" />
        </div>
      </div>
    </section>
  );
}
