"use client";

import MemberCard from "@/app/components/MemberCard";
import data from "./data";

// ============================================================
// LOCKED — do not change
// This component must accept onClick and pass member data to MemberCard.
// The structural props and data binding below must stay intact.
// ============================================================

export default function Card({ onClick }: { onClick: () => void }) {
  // ============================================================
  // FREE TO CUSTOMIZE
  // You can wrap MemberCard in your own styled container,
  // add decorations, change the background color, add badges,
  // stickers, animations, or completely replace with your own
  // card design — as long as you keep the onClick handler and
  // display the required info (photo, name, NIM, linkedin, cv).
  // ============================================================
  return (
    <div className="relative h-full">
      <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-nb-blue via-nb-yellow to-nb-pink opacity-80 blur-sm" />
      <div className="relative overflow-hidden rounded-[1.6rem] border-[3px] border-nb-black bg-nb-cream/80 p-1.5 shadow-[6px_6px_0px_var(--nb-black)]">
        <div className="mb-2 flex items-center justify-between rounded-xl border-[2px] border-nb-black bg-nb-black px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-nb-yellow">
          <span>Kevin // Profile</span>
          <span className="rounded-full border-[2px] border-nb-yellow bg-nb-yellow px-1.5 py-0.5 text-[9px] text-nb-black">LIVE</span>
        </div>
        <MemberCard member={data} onClick={onClick} />
      </div>
    </div>
  );
}
