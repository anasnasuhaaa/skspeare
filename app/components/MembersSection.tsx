"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MemberData, ROLE_LABELS } from "../types/member";
import members from "../data/members";
import MemberCard from "./MemberCard";
import MemberModal from "./MemberModal";

gsap.registerPlugin(ScrollTrigger);

// Dynamic imports for per-member custom Modal components
const memberModals: Record<
  string,
  React.ComponentType<{ isOpen: boolean; onClose: () => void }>
> = {
  anas: dynamic(() => import("../members/anas/Modal"), { ssr: false }),
  wafi: dynamic(() => import("../members/wafi/Modal"), { ssr: false }),
  adit: dynamic(() => import("../members/adit/Modal"), { ssr: false }),
  salman: dynamic(() => import("../members/salman/Modal"), { ssr: false }),
  riza: dynamic(() => import("../members/riza/Modal"), { ssr: false }),
  kesya: dynamic(() => import("../members/kesya/Modal"), { ssr: false }),
  keke: dynamic(() => import("../members/keke/Modal"), { ssr: false }),
  radly: dynamic(() => import("../members/radly/Modal"), { ssr: false }),
  kevin: dynamic(() => import("../members/kevin/Modal"), { ssr: false }),
  abiyyu: dynamic(() => import("../members/abiyyu/Modal"), { ssr: false }),
  khansa: dynamic(() => import("../members/khansa/Modal"), { ssr: false }),
  farikha: dynamic(() => import("../members/farikha/Modal"), { ssr: false }),
};

// Anas's HackTerminal
const HackTerminal = dynamic(
  () => import("../members/anas/HackTerminal"),
  { ssr: false }
);

export default function MembersSection() {
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showHackTerminal, setShowHackTerminal] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Title entrance
      const titleEl = el.querySelector(".gsap-team-title");
      if (titleEl) {
        gsap.fromTo(
          titleEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: titleEl,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      // Neobrutalism tilt-to-upright entrance for member cards
      const cards = el.querySelectorAll(".gsap-member-card");
      if (cards.length > 0) {
        cards.forEach((card, i) => {
          const initialTilt = (i % 2 === 0 ? -1 : 1) * (5 + (i % 3) * 2); // alternating -5deg, +7deg, -9deg, +5deg
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 40,
              rotation: initialTilt,
              scale: 0.92,
            },
            {
              opacity: 1,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.5)",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true,
              },
            }
          );
        });
      }

      // Floating particles
      const geoParticles = el.querySelectorAll(".geo-particle");
      geoParticles.forEach((particle, i) => {
        gsap.to(particle, {
          y: i % 2 === 0 ? -10 : 10,
          x: i % 3 === 0 ? 6 : -6,
          rotation: i % 2 === 0 ? "+=15" : "-=15",
          duration: 2.4 + (i % 4) * 0.35,
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
    }, el);

    return () => ctx.revert();
  }, []);

  const handleCardClick = useCallback((member: MemberData) => {
    if (member.slug === "anas") {
      setSelectedMember(member);
      setShowHackTerminal(true);
    } else {
      setSelectedMember(member);
      setShowModal(true);
    }
  }, []);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setShowHackTerminal(false);
    setTimeout(() => setSelectedMember(null), 300);
  }, []);

  const handleHackSuccess = useCallback(() => {
    setShowHackTerminal(false);
    setShowModal(true);
  }, []);

  // Filter members by role
  const pjk = members.filter((m) => m.role === "PJK");
  const ketua = members.filter((m) => m.role === "Ketua");
  const anggota = members.filter((m) => m.role === "Anggota");

  return (
    <section
      id="team"
      ref={sectionRef}
      className="py-16 sm:py-24 relative overflow-hidden"
    >
      {/* Local Decorative Particles & Sparkles (Safe Zone) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      >
        {/* Top Left Cross & Sparkle */}
        <div className="geo-particle absolute top-8 left-[2%] sm:left-[4%] flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 bg-nb-lime border-2 sm:border-[2.5px] border-nb-black rounded-md shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] font-black text-base sm:text-2xl text-nb-black select-none rotate-12">
          +
        </div>
        <div className="sparkle-particle absolute top-16 left-[10%] text-nb-yellow text-lg sm:text-2xl font-black select-none opacity-40">
          ✦
        </div>

        {/* Top Right Asterisk & Sparkle */}
        <div className="geo-particle absolute top-10 right-[2%] sm:right-[4%] flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 bg-nb-orange border-2 sm:border-[2.5px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] text-nb-black font-black text-sm sm:text-xl select-none -rotate-12">
          ✶
        </div>
        <div className="sparkle-particle absolute top-20 right-[12%] text-nb-pink text-base sm:text-xl font-black select-none opacity-35">
          ✧
        </div>

        {/* Mid Left Proxy Badge (Desktop) */}
        <div className="geo-particle absolute top-[38%] left-[2%] hidden xl:flex items-center gap-1 px-3 py-1 bg-nb-lime border-2 border-nb-black rounded-full shadow-[2px_2px_0px_var(--nb-black)] font-mono font-bold text-xs text-nb-black select-none rotate-6">
          <span>⚡</span> PROXY
        </div>
        <div className="sparkle-particle absolute top-[45%] left-[8%] hidden md:block text-nb-orange text-sm sm:text-lg font-black select-none opacity-30">
          ✧
        </div>

        {/* Mid Right Drama Badge (Desktop) */}
        <div className="geo-particle absolute top-[38%] right-[2%] hidden xl:flex items-center gap-1 px-3 py-1 bg-nb-pink border-2 border-nb-black rounded-full shadow-[2px_2px_0px_var(--nb-black)] font-display font-black text-xs text-nb-black select-none -rotate-3">
          <span>💻</span>CODE
        </div>
        <div className="sparkle-particle absolute top-[48%] right-[8%] hidden md:block text-nb-purple text-base sm:text-xl font-black select-none opacity-35">
          ✶
        </div>

        {/* Bottom Left Purple Star */}
        <div className="geo-particle absolute bottom-12 left-[2%] sm:left-[3.5%] flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 bg-nb-purple border-2 sm:border-[2.5px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] text-nb-black font-black text-xs sm:text-lg select-none rotate-12">
          ★
        </div>
        <div className="sparkle-particle absolute bottom-16 left-[10%] text-nb-lime text-base sm:text-xl font-black select-none opacity-40">
          ✧
        </div>

        {/* Bottom Right Blue Sparkle */}
        <div className="geo-particle absolute bottom-10 right-[2%] sm:right-[3.5%] flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 bg-nb-blue border-2 sm:border-[2.5px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] text-nb-black font-black text-xs sm:text-lg select-none rotate-6">
          ✸
        </div>
        <div className="sparkle-particle absolute bottom-14 right-[10%] text-nb-yellow text-base sm:text-xl font-black select-none opacity-40">
          ✦
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-10 sm:mb-14 gsap-team-title">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-nb-black uppercase tracking-tight">
            Meet The Team
          </h2>
        </div>

        {/* PJK (left) & Leader (right) — side by side in 2 columns */}
        <div className="mb-10 sm:mb-16">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-2xl mx-auto">
            {/* PJK — left */}
            <div className="flex flex-col items-center">
              <span className="px-3.5 sm:px-5 py-1 sm:py-1.5 bg-nb-orange border-[2.5px] sm:border-[3px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-xs sm:text-sm uppercase text-nb-black mb-3 sm:mb-4">
                {ROLE_LABELS["PJK"]}
              </span>
              {pjk.map((member) => (
                <div
                  key={member.slug}
                  className="w-full max-w-70 gsap-member-card flex"
                >
                  <MemberCard
                    member={member}
                    onClick={() => handleCardClick(member)}
                    priority={true}
                  />
                </div>
              ))}
            </div>

            {/* Leader — right */}
            <div className="flex flex-col items-center">
              <span className="px-3.5 sm:px-5 py-1 sm:py-1.5 bg-nb-yellow border-[2.5px] sm:border-[3px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] font-display font-black text-xs sm:text-sm uppercase text-nb-black mb-3 sm:mb-4">
                {ROLE_LABELS["Ketua"]}
              </span>
              {ketua.map((member) => (
                <div
                  key={member.slug}
                  className="w-full max-w-70 gsap-member-card flex"
                >
                  <MemberCard
                    member={member}
                    onClick={() => handleCardClick(member)}
                    priority={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Members — 2 columns on mobile, scaling up */}
        <div>
          <div className="flex justify-center mb-6 sm:mb-8">
            <span className="px-5 sm:px-6 py-1.5 sm:py-2 bg-nb-purple border-[2.5px] sm:border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] sm:shadow-[4px_4px_0px_var(--nb-black)] font-display font-black text-sm sm:text-lg uppercase text-nb-black">
              {ROLE_LABELS["Anggota"]}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {anggota.map((member, i) => (
              <div key={member.slug} className="gsap-member-card flex">
                <MemberCard
                  member={member}
                  onClick={() => handleCardClick(member)}
                  priority={i < 4}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anas's Hack Terminal Overlay */}
      {showHackTerminal && (
        <HackTerminal
          isOpen={showHackTerminal}
          onClose={handleClose}
          onHackSuccess={handleHackSuccess}
          onCredentialSubmit={() => { }}
        />
      )}

      {/* Member Modal */}
      {selectedMember && showModal && (() => {
        const CustomModal = memberModals[selectedMember.slug];
        if (CustomModal) {
          return <CustomModal isOpen={showModal} onClose={handleClose} />;
        }
        return (
          <MemberModal
            member={selectedMember}
            isOpen={showModal}
            onClose={handleClose}
          />
        );
      })()}
    </section>
  );
}
