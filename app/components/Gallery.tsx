"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !trackRef.current) return;

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

      // Floating particles
      const geoParticles = el.querySelectorAll(".geo-particle");
      geoParticles.forEach((particle, i) => {
        gsap.to(particle, {
          y: i % 2 === 0 ? -10 : 10,
          x: i % 3 === 0 ? 5 : -5,
          rotation: i % 2 === 0 ? "+=15" : "-=15",
          duration: 2.3 + (i % 3) * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Twinkling sparkles
      const sparkles = el.querySelectorAll(".sparkle-particle");
      sparkles.forEach((sparkle, i) => {
        gsap.to(sparkle, {
          scale: 1.45,
          opacity: 1,
          rotation: i % 2 === 0 ? "+=90" : "-=90",
          duration: 1.3 + (i % 3) * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: (i * 0.15) % 1.2,
        });
      });

      // Floating motion for Gallery title badge
      const galleryTitleBadge = el.querySelector(".floating-gallery-badge");
      if (galleryTitleBadge) {
        gsap.to(galleryTitleBadge, {
          y: -7,
          rotation: "-=2.5",
          duration: 2.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Pulse wiggle for highlighted GALLERY chip
      const galleryWordChip = el.querySelector(".gallery-word-chip");
      if (galleryWordChip) {
        gsap.to(galleryWordChip, {
          scale: 1.06,
          rotation: "+=3",
          duration: 1.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Rotation for corner sparkle
      const gallerySparkle = el.querySelector(".gallery-sparkle-accent");
      if (gallerySparkle) {
        gsap.to(gallerySparkle, {
          rotation: "-=360",
          scale: 1.25,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, el);

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

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const photos = ["/gallery/1.jpeg", "/gallery/2.jpeg", "/gallery/3.jpeg", "/gallery/4.jpeg", "/gallery/5.jpeg"];
  // Repeat photos 4 times per block (12 items per block)
  const oneBlock = [...photos, ...photos, ...photos, ...photos];

  // Keyboard Escape, Left, Right navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === "Escape") {
        setSelectedPhotoIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev: number | null) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
      } else if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev: number | null) => (prev !== null ? (prev + 1) % photos.length : null));
      }
    };

    if (selectedPhotoIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhotoIndex, photos.length]);

  const rotations = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];

  const PhotoBlock = ({ prefix }: { prefix: string }) => (
    <div className="flex gap-5 sm:gap-8 shrink-0 pr-5 sm:pr-8 py-4 items-center">
      {oneBlock.map((photo, i) => {
        const tilt = rotations[i % rotations.length];
        return (
          <div
            key={`${prefix}-${i}`}
            onClick={() => setSelectedPhotoIndex(i % photos.length)}
            className={`shrink-0 w-64 sm:w-78 md:w-88 bg-nb-white border-[3px] sm:border-4 border-nb-black rounded-xl shadow-[5px_5px_0px_var(--nb-black)] sm:shadow-[7px_7px_0px_var(--nb-black)] p-2.5 sm:p-3.5 pb-6 sm:pb-8 relative group cursor-pointer ${tilt} hover:rotate-0 hover:scale-105 hover:-translate-y-2 hover:shadow-[10px_10px_0px_var(--nb-black)] transition-all duration-300 ease-out`}
          >
            {/* Top Washi Tape / Pin Effect */}
            <div
              aria-hidden="true"
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-4 sm:h-5 bg-nb-yellow/80 border border-nb-black/40 -rotate-2 z-20 shadow-[1px_1px_0px_rgba(0,0,0,0.15)] pointer-events-none select-none"
            ></div>

            {/* Photo Viewport */}
            <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden border-2 border-nb-black bg-nb-black/5">
              <Image
                src={photo}
                alt={`Dokumentasi kegiatan ${(i % 3) + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 360px"
              />
              {/* Hover Badge */}
              <div className="absolute inset-0 bg-nb-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="px-3 py-1 bg-nb-yellow border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] font-display font-black text-xs text-nb-black uppercase tracking-wider">
                  View Full 🔍
                </span>
              </div>
            </div>

            {/* Polaroid Bottom Label */}
            <div className="mt-2.5 sm:mt-3 flex items-center justify-between px-1 font-mono text-[10px] sm:text-xs text-nb-black font-bold">
              <span>★ MEMORY #0{(i % 3) + 1}</span>
              <span className="opacity-60 text-[9px] sm:text-[10px]">ILKOMERZ 62</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="gallery" ref={sectionRef} className="py-14 sm:py-20 overflow-hidden relative">
      {/* Local Decorative Particles & Sparkles (Safe Zone) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      >
        {/* Top Left Triangle & Sparkle */}
        <div className="geo-particle absolute top-8 left-[3%] sm:left-[6%] flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 bg-nb-lime border-2 sm:border-[2.5px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] text-nb-black font-black text-sm sm:text-lg select-none rotate-12">
          ▲
        </div>
        <div className="sparkle-particle absolute top-14 left-[14%] text-nb-pink text-base sm:text-xl font-black select-none opacity-40">
          ✧
        </div>

        {/* Top Right Donut & Sparkle */}
        <div className="geo-particle absolute top-8 right-[3%] sm:right-[6%] flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 bg-nb-yellow border-2 sm:border-[2.5px] border-nb-black rounded-full shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] text-nb-black font-black text-xs select-none">
          ✦
        </div>
        <div className="sparkle-particle absolute top-16 right-[14%] text-nb-blue text-base sm:text-xl font-black select-none opacity-35">
          ✶
        </div>

        {/* Bottom Left ILKOM Badge (Desktop) */}
        <div className="geo-particle absolute bottom-4 left-[3%] hidden lg:flex items-center gap-1 px-3 py-1 bg-nb-orange border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] font-display font-black text-xs text-nb-black select-none -rotate-6">
          <span>★</span> ILKOM 62
        </div>

        {/* Bottom Right Sparkle */}
        <div className="sparkle-particle absolute bottom-4 right-[4%] text-nb-yellow text-base sm:text-xl font-black select-none opacity-40">
          ✦
        </div>
      </div>

      {/* Floating Neobrutalism Title Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 text-center relative z-10 flex flex-col items-center">
        {/* Main Floating Badge */}
        <div className="relative inline-block">
          <div className="floating-gallery-badge inline-flex items-center gap-2 sm:gap-3 bg-nb-white border-[3.5px] sm:border-4 border-nb-black rounded-2xl shadow-[6px_6px_0px_var(--nb-black)] sm:shadow-[8px_8px_0px_var(--nb-black)] px-6 sm:px-10 py-3 sm:py-4 rotate-1 hover:rotate-0 transition-transform duration-300">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-nb-black uppercase tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <span>PHOTO</span>
              <span className="gallery-word-chip bg-nb-blue text-nb-black px-3 sm:px-4 py-0.5 sm:py-1 border-[2.5px] border-nb-black rounded-xl shadow-[3px_3px_0px_var(--nb-black)] -rotate-2 inline-block">
                GALLERY
              </span>
            </h2>
          </div>
          {/* Corner Sparkle */}
          <div className="gallery-sparkle-accent absolute -top-3 -left-3 sm:-left-4 w-7 h-7 sm:w-8 sm:h-8 bg-nb-yellow border-2 border-nb-black rounded-full shadow-[2px_2px_0px_var(--nb-black)] flex items-center justify-center font-black text-xs select-none -rotate-12">
            ✦
          </div>
        </div>
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

      {/* Lightbox Preview Modal */}
      {selectedPhotoIndex !== null && (
        <div
          onClick={() => setSelectedPhotoIndex(null)}
          className="fixed inset-0 z-1000 bg-nb-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-nb-white border-4 border-nb-black rounded-2xl shadow-[10px_10px_0px_var(--nb-black)] p-4 sm:p-6 max-w-4xl w-full relative flex flex-col items-center"
          >
            {/* Header bar */}
            <div className="w-full flex items-center justify-between mb-4 border-b-2 border-nb-black pb-3">
              <span className="px-3 py-1 bg-nb-yellow border-2 border-nb-black rounded-lg font-display font-black text-xs sm:text-sm uppercase">
                Photo {selectedPhotoIndex + 1} of {photos.length}
              </span>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-nb-pink border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0px_var(--nb-black)] flex items-center justify-center font-bold text-base cursor-pointer"
                aria-label="Close Preview"
              >
                ✕
              </button>
            </div>

            {/* Photo Viewport */}
            <div className="relative w-full aspect-4/3 sm:aspect-16/10 rounded-xl overflow-hidden border-3 border-nb-black bg-nb-black/10">
              <Image
                src={photos[selectedPhotoIndex]}
                alt={`Photo preview ${selectedPhotoIndex + 1}`}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 90vw, 900px"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between w-full mt-4 pt-2">
              <button
                onClick={() =>
                  setSelectedPhotoIndex(
                    (selectedPhotoIndex - 1 + photos.length) % photos.length
                  )
                }
                className="px-4 sm:px-6 py-2 bg-nb-blue border-2 border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-bold text-xs sm:text-sm hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>←</span> Previous
              </button>
              <span className="font-mono text-xs text-nb-black/60 hidden sm:inline">
                Use ← / → arrow keys
              </span>
              <button
                onClick={() =>
                  setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length)
                }
                className="px-4 sm:px-6 py-2 bg-nb-blue border-2 border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-bold text-xs sm:text-sm hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center gap-1.5"
              >
                Next <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
