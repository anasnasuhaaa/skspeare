"use client";

import { Binary, BrainCircuit, ChartNoAxesCombined, CircuitBoard, Code2, Database, Grid2x2, Network, Star, Workflow } from "lucide-react";
import { warpResults } from "./warpResults";
import WarpSound from "./WarpSound";

const symbols = { computation: Binary, digital: CircuitBoard, linear: Grid2x2, discrete: Network, programming: Code2, database: Database, thinking: BrainCircuit, algorithm: Workflow, statistics: ChartNoAxesCombined, profile: Star };

export function Rarity({ value }: { value: number }) {
  return <span className="warp-stars" aria-label={`${value} bintang`}>{Array.from({ length: value }, (_, index) => <Star key={index} size={19} fill="currentColor" aria-hidden="true" />)}</span>;
}

export default function WarpResult({ index, muted, onNext }: { index: number; muted: boolean; onNext: () => void }) {
  const result = warpResults[index];
  const Symbol = symbols[result.symbol];

  return (
    <main className={`warp-result warp-rarity-${result.rarity}`}>
      <div className="warp-result-orbit" aria-hidden="true" />
      <div className="warp-result-art" key={`art-${index}`} aria-hidden="true">
        <div className="warp-cone-frame">
          <span className="warp-cone-corner">{String(index + 1).padStart(2, "0")}</span>
          <div className="warp-cone-rings" />
          <Symbol className="warp-cone-symbol" strokeWidth={1} />
          <span className="warp-cone-caption">{result.code}</span>
          <div className="warp-cone-lines" />
        </div>
      </div>
      <section className="warp-result-info" aria-live="polite" aria-atomic="true">
        <WarpSound key={index} rarity={result.rarity} muted={muted} />
        <span className="warp-eyebrow">WARP RESULT / MATA KULIAH</span>
        <span className="warp-course-code"><Symbol size={17} aria-hidden="true" /> {result.code}</span>
        <h2 key={result.name}>{result.name}</h2>
        <Rarity value={result.rarity} />
        <p className="warp-result-note">Ilmu Komputer / Proxy Shakespeare</p>
        <button type="button" className="warp-primary" onClick={onNext}>Hasil berikutnya <span aria-hidden="true">/</span></button>
      </section>
    </main>
  );
}
