"use client";

import Image from "next/image";
import { useRef } from "react";
import { ExternalLink, FileText, MapPin, RotateCcw, Star } from "lucide-react";
import Instagram from "@/app/components/InstagramIcon";
import data, { abiyyuNickname } from "./data";
import { warpResults } from "./warpResults";
import WarpCharacter from "./WarpCharacter";

export default function WarpProfile({ muted, onReplay }: { muted: boolean; onReplay: () => void }) {
  const detailsRef = useRef<HTMLElement>(null);
  const showDetails = () => detailsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  return (
    <main className="warp-character-scroll" data-testid="character-scene">
      <WarpCharacter muted={muted} onDetails={showDetails} />
      <section ref={detailsRef} className="warp-profile-content" data-testid="profile-details" aria-labelledby="abiyyu-profile-title">
      <div className="warp-profile">
        <div className="warp-profile-intro">
          <span className="warp-eyebrow">PERSONAL DOSSIER / {abiyyuNickname}</span>
          <h3 id="abiyyu-profile-title">Detail profil</h3>
          <blockquote>{data.quote}</blockquote>
        </div>
        <section className="warp-profile-details">
          <dl className="warp-facts">
            <div><dt>NIM</dt><dd>{data.nim}</dd></div>
            <div><dt>Peran</dt><dd>{data.role}</dd></div>
            <div><dt>Asal</dt><dd><MapPin size={14} aria-hidden="true" />{data.hometown}</dd></div>
          </dl>
          <div className="warp-hobbies"><span className="warp-eyebrow">INTERESTS</span><ul>{data.hobbies.map((hobby) => <li key={hobby}>{hobby}</li>)}</ul></div>
          <div className="warp-profile-links">
            <a className="warp-primary" href={data.cvUrl} target="_blank" rel="noopener noreferrer"><FileText size={17} aria-hidden="true" /> Lihat CV <ExternalLink size={13} aria-hidden="true" /></a>
            <a className="warp-secondary" href={data.linkedinUrl} target="_blank" rel="noopener noreferrer"><Image src="/linkedin.svg" alt="" width={16} height={16} /> LinkedIn</a>
            <a className="warp-secondary" href={`https://instagram.com/${data.instagramHandle}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={16} aria-hidden="true" /> @{data.instagramHandle}</a>
          </div>
          <div className="warp-spotify">
            <div className="warp-section-heading"><span className="warp-eyebrow">SOUNDTRACK</span><a href={data.spotifyTrackUri} target="_blank" rel="noopener noreferrer">Buka Spotify <ExternalLink size={12} aria-hidden="true" /></a></div>
            <iframe title="Lagu pilihan Abiyyu di Spotify" src={data.spotifyTrackUri.replace("/track/", "/embed/track/")} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="warp-spotify-player" />
          </div>
        </section>
      </div>
      <section className="warp-summary" aria-label="Ringkasan sepuluh hasil Warp">
        <div className="warp-section-heading"><span className="warp-eyebrow">WARP RECORD / 10 RESULTS</span><button type="button" className="warp-replay" onClick={onReplay}><RotateCcw size={14} aria-hidden="true" /> Ulangi Warp 10x</button></div>
        <ol className="warp-summary-grid">{warpResults.map((result, index) => <li key={result.name} className={`warp-summary-item warp-rarity-${result.rarity}`} title={`${result.name} / ${result.rarity} bintang`}>
          <span className="warp-summary-code">{String(index + 1).padStart(2, "0")} / {result.code}</span><Star size={20} strokeWidth={1} fill={result.rarity === 5 ? "currentColor" : "none"} aria-hidden="true" /><span>{result.rarity} STAR</span><span className="warp-summary-name">{result.name}</span>
        </li>)}</ol>
      </section>
      </section>
    </main>
  );
}
