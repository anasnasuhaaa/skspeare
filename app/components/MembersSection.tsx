"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { MemberData, ROLE_ORDER, ROLE_LABELS } from "../types/member";
import members from "../data/members";
import MemberCard from "./MemberCard";
import MemberModal from "./MemberModal";

// ============================================================
// Dynamic imports for per-member MODAL components only.
// All front cards are uniform — only modals can be customized.
// ============================================================
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

  // Group members by role
  const pjk = members.filter((m) => m.role === "PJK");
  const ketua = members.filter((m) => m.role === "Ketua Kelompok");
  const anggota = members.filter((m) => m.role === "Anggota");

  return (
    <section id="team" className="py-16 sm:py-20 px-4 bg-nb-cream">
      <div className="container mx-auto max-w-6xl">
        {/* Section Title */}
        <h2 className="text-4xl sm:text-5xl md:text-7xl nb-heading text-center mb-12 sm:mb-16 text-nb-black uppercase">
          Meet The Team
        </h2>

        {/* PJK (left) + Ketua Kelompok (right) — side by side */}
        <div className="mb-12 sm:mb-16">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto">
            {/* PJK — left */}
            <div className="flex flex-col items-center">
              <span className="nb-badge bg-nb-orange px-4 py-1.5 text-xs sm:text-sm text-nb-black mb-4">
                {ROLE_LABELS["PJK"]}
              </span>
              {pjk.map((member) => (
                <div key={member.slug} className="w-full max-w-[200px]">
                  <MemberCard
                    member={member}
                    onClick={() => handleCardClick(member)}
                  />
                </div>
              ))}
            </div>

            {/* Ketua Kelompok — right */}
            <div className="flex flex-col items-center">
              <span className="nb-badge bg-nb-yellow px-4 py-1.5 text-xs sm:text-sm text-nb-black mb-4">
                {ROLE_LABELS["Ketua Kelompok"]}
              </span>
              {ketua.map((member) => (
                <div key={member.slug} className="w-full max-w-[200px]">
                  <MemberCard
                    member={member}
                    onClick={() => handleCardClick(member)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Anggota — grid */}
        <div>
          <div className="flex justify-center mb-6 sm:mb-8">
            <span className="nb-badge bg-nb-purple px-6 py-2 text-base sm:text-xl text-nb-black">
              {ROLE_LABELS["Anggota"]}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {anggota.map((member) => (
              <MemberCard
                key={member.slug}
                member={member}
                onClick={() => handleCardClick(member)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Anas's Hack Terminal */}
      <HackTerminal
        isOpen={showHackTerminal}
        onClose={handleClose}
        onHackSuccess={handleHackSuccess}
        onCredentialSubmit={() => {}}
      />

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
