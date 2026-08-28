"use client";

import MemberModal from "@/app/components/MemberModal";
import data from "./data";

// ============================================================
// LOCKED — do not change
// This component must accept isOpen and onClose props.
// The modal must display all required fields from MemberData.
// ============================================================

export default function Modal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // ============================================================
  // FREE TO CUSTOMIZE
  // You can pass children to MemberModal for extra decorations,
  // or completely replace MemberModal with your own modal design.
  // Change colors, backgrounds, fonts, add animations, stickers,
  // custom layouts — as long as the required data fields are shown
  // and isOpen/onClose behavior is preserved.
  // ============================================================
  return <MemberModal member={data} isOpen={isOpen} onClose={onClose} />;
}
