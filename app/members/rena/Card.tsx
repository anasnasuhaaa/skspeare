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
  return <MemberCard member={data} onClick={onClick} />;
}
