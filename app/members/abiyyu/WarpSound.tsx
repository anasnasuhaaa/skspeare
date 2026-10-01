"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function WarpSound({ rarity, muted, testId = "reveal-audio" }: { rarity: 3 | 4 | 5; muted: boolean; testId?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [issue, setIssue] = useState<"blocked" | "failed" | null>(null);
  const src = `/member/abiyyu/reveal-${rarity}star.m4a`;

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.55;
    try {
      await audio.play();
      setIssue(null);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (error instanceof DOMException && error.name === "NotAllowedError") setIssue("blocked");
      else {
        console.error(`Cannot play ${src}`, error);
        setIssue("failed");
      }
    }
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let active = true;
    let started = false;
    const handleReady = () => {
      if (!active || started) return;
      started = true;
      void play();
    };
    const handleError = () => {
      if (!active) return;
      console.error(`Cannot load ${src}`, audio.error);
      setIssue("failed");
    };
    audio.addEventListener("canplay", handleReady, { once: true });
    audio.addEventListener("error", handleError);
    if (audio.error) queueMicrotask(handleError);
    else if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) queueMicrotask(handleReady);
    return () => {
      active = false;
      audio.removeEventListener("canplay", handleReady);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, [play, src]);

  return <>
    <audio ref={audioRef} src={src} muted={muted} preload="auto" data-testid={testId} />
    {issue && <div className="warp-sound-notice" role="status">{issue === "blocked" ? <button type="button" className="warp-secondary" onClick={() => void play()}>Putar efek suara</button> : "Efek suara tidak tersedia. Kamu tetap bisa melanjutkan."}</div>}
  </>;
}
