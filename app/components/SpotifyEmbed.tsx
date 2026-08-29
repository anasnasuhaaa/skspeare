"use client";
import React, { useEffect, useRef, useState } from "react";

interface SpotifyEmbedProps {
  trackUri: string;
  isOpen: boolean;
}

export default function SpotifyEmbed({ trackUri, isOpen }: SpotifyEmbedProps) {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && trackUri) {
      setIsLoading(true);
      // If the trackUri is already a full embed URL, use it directly
      // Otherwise, construct the embed URL from a track URI/URL
      let src = trackUri;
      if (!src.includes("/embed/")) {
        // Convert https://open.spotify.com/track/ID to embed URL
        src = src.replace("open.spotify.com/", "open.spotify.com/embed/");
      }
      // Ensure autoplay param
      if (!src.includes("autoplay")) {
        src += (src.includes("?") ? "&" : "?") + "autoplay=1";
      }
      setIframeSrc(src);
    } else {
      setIframeSrc(null);
      setIsLoading(true);
    }
  }, [isOpen, trackUri]);

  if (!iframeSrc) return null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-[3px] border-nb-black shadow-[3px_3px_0px_var(--nb-black)] bg-[#121212] min-h-38">
      {/* Retro Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#181818] z-10 px-4 text-center">
          <div className="flex items-center gap-2 text-nb-green font-mono text-xs sm:text-sm font-bold animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-nb-green"></span>
            <span>Loading Spotify Player... 🎵</span>
          </div>
        </div>
      )}
      <iframe
        src={iframeSrc}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        className="block"
        style={{ borderRadius: "12px" }}
      />
    </div>
  );
}