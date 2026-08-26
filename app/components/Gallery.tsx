"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    // Duplicate content for seamless loop
    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2;

    tweenRef.current = gsap.to(track, {
      x: -totalWidth,
      ease: "none",
      duration: 25,
      repeat: -1,
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0, duration: 0.6, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6, ease: "power2.in" });
    }
  };

  const colors = [
    "bg-nb-pink",
    "bg-nb-blue",
    "bg-nb-green",
    "bg-nb-red",
    "bg-nb-orange",
    "bg-nb-purple",
    "bg-nb-lime",
    "bg-nb-yellow",
  ];

  const placeholders = [...colors, ...colors]; // Duplicate for seamless loop

  return (
    <section id="gallery" className="py-12 sm:py-16 bg-nb-cream overflow-hidden">
      <div className="container mx-auto px-4 mb-6 sm:mb-8">
        <h2 className="text-4xl sm:text-5xl nb-heading text-nb-black uppercase">
          Gallery
        </h2>
        <p className="text-nb-black/60 font-medium mt-2 text-sm sm:text-base">
          Dokumentasi kegiatan kami — hover to pause
        </p>
      </div>

      <div
        className="w-full border-y-[3px] border-nb-black py-4 sm:py-6"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="gallery-track" ref={trackRef}>
          {placeholders.map((color, i) => (
            <div
              key={i}
              className={`shrink-0 w-[240px] h-[180px] sm:w-[300px] sm:h-[220px] md:w-[360px] md:h-[260px] nb-card ${color} flex items-center justify-center`}
            >
              <span className="font-bold text-nb-black font-display text-base sm:text-lg md:text-xl">
                Gallery Photo {(i % 8) + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
