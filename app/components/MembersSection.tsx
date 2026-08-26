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

      const cards = el.querySelectorAll(".gsap-member-card");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
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
      className="py-16 sm:py-24 px-4 bg-nb-cream"
    >
      <div className="container mx-auto max-w-6xl">
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
            {anggota.map((member) => (
              <div key={member.slug} className="gsap-member-card flex">
                <MemberCard
                  member={member}
                  onClick={() => handleCardClick(member)}
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
