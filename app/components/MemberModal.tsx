"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import gsap from "gsap";
import { MemberData } from "../types/member";
import SpotifyEmbed from "./SpotifyEmbed";

interface MemberModalProps {
  member: MemberData | null;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function MemberModal({
  member,
  isOpen,
  onClose,
  children,
}: MemberModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
    } else if (shouldRender) {
      handleAnimateClose();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (shouldRender && backdropRef.current && contentRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.out" }
        );
        gsap.fromTo(
          contentRef.current,
          { scale: 0.95, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.5)" }
        );
      });
      return () => ctx.revert();
    }
  }, [shouldRender]);

  const handleAnimateClose = () => {
    if (backdropRef.current && contentRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(contentRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          document.body.style.overflow = "";
          setShouldRender(false);
          onClose();
        },
      });
    } else {
      document.body.style.overflow = "";
      setShouldRender(false);
      onClose();
    }
  };

  if (!shouldRender || !member) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleAnimateClose}
        className="absolute inset-0 bg-nb-black/70 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Dialog Content */}
      <div
        ref={contentRef}
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-nb-white border-[4px] border-nb-black rounded-2xl shadow-[8px_8px_0px_var(--nb-black)] p-6 sm:p-8 md:p-10 z-10 flex flex-col gap-6 sm:gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Stacking z-[1020] */}
        <button
          onClick={handleAnimateClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-nb-red border-[3px] border-nb-black rounded-lg shadow-[4px_4px_0px_var(--nb-black)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--nb-black)] text-nb-white flex items-center justify-center text-xl z-[1020] transition-all cursor-pointer"
          aria-label="Tutup modal"
        >
          <X size={24} strokeWidth={3} />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start pt-4 sm:pt-0">
          {/* Photo */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-xl overflow-hidden border-[4px] border-nb-black shadow-[4px_4px_0px_var(--nb-black)] bg-nb-cream">
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 128px, 160px"
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-nb-black mb-4 tracking-tight leading-none">
              {member.name}
            </h2>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <span className="px-4 py-2 bg-nb-yellow border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-bold text-sm sm:text-base">
                {member.role}
              </span>
              {member.hometown && (
                <span className="px-4 py-2 bg-nb-lime border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-bold text-sm sm:text-base">
                  📍 {member.hometown}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quote */}
        {member.quote && (
          <div className="bg-nb-cream border-[3px] border-nb-black rounded-xl p-5 sm:p-6 shadow-[4px_4px_0px_var(--nb-black)] relative">
            <div className="absolute -top-3 -left-3 bg-nb-blue border-[3px] border-nb-black rounded-lg px-3 py-1 font-bold text-xs sm:text-sm transform -rotate-3">
              Kutipan
            </div>
            <p className="italic text-lg sm:text-xl font-bold text-nb-black text-center mt-2">
              &ldquo;{member.quote}&rdquo;
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Hobbies */}
          {member.hobbies && member.hobbies.length > 0 && (
            <div className="flex flex-col gap-3">
              <h4 className="font-display font-black text-xl sm:text-2xl text-nb-black uppercase tracking-wide">
                Hobi
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.hobbies.map((hobby, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-nb-pink border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-bold text-sm sm:text-base"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instagram */}
          {member.instagramHandle && (
            <div className="flex flex-col gap-3">
              <h4 className="font-display font-black text-xl sm:text-2xl text-nb-black uppercase tracking-wide">
                Instagram
              </h4>
              <div>
                <a
                  href={`https://instagram.com/${member.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-nb-white border-[3px] border-nb-black rounded-lg shadow-[4px_4px_0px_var(--nb-black)] hover:bg-nb-pink hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--nb-black)] font-bold text-sm sm:text-base text-nb-black transition-all"
                >
                  📸 @{member.instagramHandle}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Spotify */}
        {member.spotifyTrackUri && (
          <div className="mt-4 pt-6 border-t-[4px] border-nb-black border-dashed">
            <h4 className="font-display font-black text-xl sm:text-2xl text-nb-black uppercase tracking-wide mb-4">
              🎵 Sedang Diputar
            </h4>
            <div className="bg-nb-black rounded-2xl overflow-hidden border-[4px] border-nb-black shadow-[6px_6px_0px_var(--nb-black)]">
              <SpotifyEmbed trackUri={member.spotifyTrackUri} isOpen={isOpen} />
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
