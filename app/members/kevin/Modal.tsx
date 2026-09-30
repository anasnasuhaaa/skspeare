"use client";

import { useCallback, useEffect, useState } from "react";
import MemberModal from "@/app/components/MemberModal";
import TetrisGame from "./TetrisGame";
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
  const [phase, setPhase] = useState<"game" | "profile">("game");
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPhase("game");
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setPhase("game");
    onClose();
  }, [onClose]);

  const handleReplay = useCallback(() => {
    setResetKey((value) => value + 1);
    setPhase("game");
  }, []);

  const handleComplete = useCallback(() => {
    setPhase("profile");
  }, []);

  const handleSkip = useCallback(() => {
    setPhase("profile");
  }, []);

  if (!isOpen) return null;

  if (phase === "game") {
    return (
      <TetrisGame
        key={resetKey}
        onClose={handleClose}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    );
  }

  const cleanInstagram = data.instagramHandle
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
    .replace(/^@/, "")
    .replace(/\/$/, "");

  return (
    <MemberModal member={data} isOpen={isOpen} onClose={handleClose}>
      <div className="mt-4 flex flex-col gap-4 rounded-2xl border-[3px] border-nb-black bg-nb-cream p-4 shadow-[4px_4px_0px_var(--nb-black)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.24em] text-nb-black/70">
            Profile unlocked
          </p>
          <p className="mt-1 text-sm font-bold text-nb-black">
            Selamat! Kamu berhasil membuka biodata Kevin.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReplay}
          className="inline-flex items-center justify-center rounded-xl border-[3px] border-nb-black bg-nb-yellow px-4 py-2 font-display text-xs font-black uppercase tracking-[0.14em] text-nb-black shadow-[3px_3px_0px_var(--nb-black)] transition-all hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)]"
        >
          Main Lagi
        </button>
      </div>

      <div className="mt-4 w-full rounded-2xl border-[3px] border-nb-black bg-[#101827] p-4 shadow-[4px_4px_0px_var(--nb-black)]">
        <p className="mb-3 font-display text-xs font-black uppercase tracking-[0.18em] text-nb-lime">
          SOCIALS & LINKS
        </p>
        <div className="flex w-full flex-wrap gap-3">
          {cleanInstagram && (
            <a
              href={`https://instagram.com/${cleanInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-[3px] border-nb-black bg-nb-pink px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.1em] text-nb-black shadow-[3px_3px_0px_var(--nb-black)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span>Instagram</span>
            </a>
          )}

          {data.linkedinUrl && (
            <a
              href={data.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-[3px] border-nb-black bg-nb-blue px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.1em] text-nb-black shadow-[3px_3px_0px_var(--nb-black)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M6.94 8.5A1.5 1.5 0 1 1 6.94 5.5a1.5 1.5 0 0 1 0 3Zm-1.3 1.7h2.6V18h-2.6V10.2Zm4.5 0h2.5v1.04h.04c.35-.66 1.2-1.35 2.46-1.35 2.63 0 3.12 1.73 3.12 3.98V18h-2.6v-16.2c0-1.52-.03-3.47-2.11-3.47-2.11 0-2.43 1.65-2.43 3.35V18h-2.6V10.2Z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          )}

          {data.cvUrl && (
            <a
              href={data.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-[3px] border-nb-black bg-nb-yellow px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.1em] text-nb-black shadow-[3px_3px_0px_var(--nb-black)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M7 3.5h7l5 5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
                <path d="M14 3.5V9h5" />
                <path d="M8 13h8M8 17h8" />
              </svg>
              <span>CV / Resume</span>
            </a>
          )}
        </div>
      </div>
    </MemberModal>
  );
}
