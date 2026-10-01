"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Volume2, VolumeX, X } from "lucide-react";
import { abiyyuNickname } from "./data";
import WarpVideo from "./WarpVideo";
import WarpResult from "./WarpResult";
import WarpProfile from "./WarpProfile";
import { warpResults } from "./warpResults";
import "./warp.css";

export default function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return isOpen ? <WarpSession onClose={onClose} /> : null;
}

function WarpSession({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"journey" | "results" | "character">("journey");
  const [resultIndex, setResultIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const siblings = Array.from(document.body.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== overlayRef.current,
    );
    const previousInert = siblings.map((element) => element.inert);
    siblings.forEach((element) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "Tab") {
        const controls = Array.from(overlayRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], iframe, [tabindex="0"]',
        ) ?? []).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      siblings.forEach((element, index) => { element.inert = previousInert[index]; });
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => { closeRef.current?.focus({ preventScroll: true }); }, [phase]);

  const revealNext = () => {
    const nextIndex = Math.min(resultIndex + 1, 9);
    setResultIndex(nextIndex);
    if (nextIndex === 9) setPhase("character");
  };

  const replay = () => {
    setResultIndex(0);
    setPhase("journey");
  };

  return createPortal(
    <div ref={overlayRef} className="abiyyu-warp" role="dialog" aria-modal="true" aria-label="Abiyyu Special Warp">
      <header className="warp-topbar">
        <div className="warp-brand"><span className="warp-eyebrow">SHAKESPEARE / SPECIAL WARP</span><span>{abiyyuNickname}</span></div>
        <div className="warp-controls">
          <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Aktifkan suara" : "Matikan suara"} aria-pressed={!muted} className="warp-icon-button">
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button type="button" ref={closeRef} onClick={onClose} aria-label="Tutup Warp" className="warp-icon-button"><X size={22} /></button>
        </div>
      </header>
      {phase === "journey" && <WarpVideo key="express" src="/member/abiyyu/express-warp.mp4" muted={muted} label="Perjalanan Astral Express" testId="express-video" onComplete={() => setPhase("results")} />}
      {phase === "results" && <WarpResult index={resultIndex} muted={muted} onNext={revealNext} />}
      {phase === "character" && <WarpProfile muted={muted} onReplay={replay} />}
      {phase !== "character" && <footer className="warp-cinema-footer">
        {phase === "journey" ? <><span className="warp-eyebrow">ASTRAL EXPRESS / WARP 10X</span><button type="button" className="warp-secondary" onClick={() => setPhase("results")}>Lewati perjalanan</button></> : <>
          <span className="warp-result-count" data-testid="warp-result-count">{String(resultIndex + 1).padStart(2, "0")} / 10</span>
          <div className="warp-progress" aria-label="Progres Warp 10x">{warpResults.map((result, index) => <span key={result.name} className={`warp-progress-tick warp-rarity-${result.rarity} ${index <= resultIndex ? "is-revealed" : ""} ${index === resultIndex ? "is-current" : ""}`} />)}</div>
        </>}
      </footer>}
    </div>,
    document.body,
  );
}
