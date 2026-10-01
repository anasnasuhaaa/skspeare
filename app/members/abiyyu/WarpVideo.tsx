"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

interface WarpVideoProps {
  src: string;
  muted: boolean;
  label: string;
  testId: string;
  onComplete: () => void;
}

export default function WarpVideo({ src, muted, label, testId, onComplete }: WarpVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playback, setPlayback] = useState<"playing" | "blocked" | "failed">("playing");

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setPlayback("playing");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setPlayback("blocked");
      } else {
        console.error(`Cannot play ${src}`, error);
        setPlayback("failed");
      }
    }
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let active = true;
    const handleError = () => {
      if (!active) return;
      console.error(`Cannot load ${src}`, video.error);
      setPlayback("failed");
    };
    const handleReady = () => { if (active) void play(); };
    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleReady, { once: true });
    if (video.error) queueMicrotask(handleError);
    else if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) queueMicrotask(handleReady);
    return () => {
      active = false;
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleReady);
      video.pause();
    };
  }, [play, src]);

  return (
    <div className="warp-cinema">
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        playsInline
        preload="auto"
        onEnded={onComplete}
        aria-label={label}
        data-testid={testId}
        className="warp-video"
      />
      {playback === "blocked" && (
        <div className="warp-playback-prompt">
          <p>Ketuk untuk memulai animasi dengan suara.</p>
          <button type="button" className="warp-primary" onClick={() => void play()}>
            <Play size={18} aria-hidden="true" /> Putar animasi
          </button>
        </div>
      )}
      {playback === "failed" && (
        <div className="warp-playback-prompt" role="alert">
          <p>Video tidak dapat diputar. Kamu tetap bisa melanjutkan.</p>
          <button type="button" className="warp-primary" onClick={onComplete}>Lanjutkan tanpa video</button>
        </div>
      )}
    </div>
  );
}
