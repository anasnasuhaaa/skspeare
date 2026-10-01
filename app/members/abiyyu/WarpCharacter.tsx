"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import data, { abiyyuNickname } from "./data";
import { Rarity } from "./WarpResult";
import WarpSound from "./WarpSound";

export default function WarpCharacter({ muted, onDetails }: { muted: boolean; onDetails: () => void }) {
  const [revealing, setRevealing] = useState(() => typeof window === "undefined" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) => { if (event.matches) setRevealing(false); };
    preference.addEventListener("change", handleChange);
    return () => preference.removeEventListener("change", handleChange);
  }, []);

  return (
    <section className="warp-character" data-testid="five-star-character" data-reveal-state={revealing ? "revealing" : "ready"} aria-label="Reveal karakter bintang lima" onAnimationEnd={(event) => { if (event.animationName === "warp-character-arrive") setRevealing(false); }}>
      <div className="warp-character-effects" aria-hidden="true">
        <div className="warp-character-aura" />
        <div className="warp-character-orbit" />
        <div className="warp-character-sweep" />
        <div className="warp-character-flare" />
        {Array.from({ length: 12 }, (_, index) => <span key={index} className="warp-character-particle" style={{ "--particle-index": index, "--particle-x": `${8 + index * 7}%`, "--particle-y": `${18 + (index % 4) * 16}%` } as CSSProperties} />)}
      </div>
      <div className="warp-character-visual">
        <div className="warp-character-photo-frame">
          <Image src={data.photo} alt={data.name} fill unoptimized priority sizes="(max-width: 640px) 78vw, 42vw" className="warp-character-photo" data-testid="profile-photo" />
          <div className="warp-character-silhouette" aria-hidden="true" />
          <div className="warp-character-photo-shade" aria-hidden="true" />
        </div>
        <span className="warp-character-photo-label">PROXY SHAKESPEARE / PERSONAL WARP</span>
      </div>
      <div className="warp-character-copy" aria-live="polite">
        <div className="warp-profile-kicker"><span className="warp-eyebrow">CHARACTER ACQUIRED</span><span className="warp-new-label">NEW</span></div>
        <h2>{data.name}</h2>
        <Rarity value={5} />
        <p className="warp-character-nickname">{abiyyuNickname}</p>
        <span className="warp-character-role">{data.role} / Proxy Shakespeare</span>
        <div className="warp-character-sound"><WarpSound rarity={5} muted={muted} testId="character-audio" /></div>
      </div>
      <div className="warp-character-footer">
        <span className="warp-result-count" data-testid="warp-result-count">10 / 10</span>
        <button type="button" className="warp-scroll-cue" onClick={onDetails}><span>Gulir untuk melihat profil</span><ArrowDown size={17} aria-hidden="true" /></button>
        {revealing && <button type="button" className="warp-character-skip" onClick={() => setRevealing(false)}>Lewati reveal</button>}
      </div>
    </section>
  );
}
