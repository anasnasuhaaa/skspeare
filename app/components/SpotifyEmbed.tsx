"use client";

import React, { useEffect, useRef, useState } from "react";

interface SpotifyEmbedProps {
  trackUri: string;
  isOpen: boolean;
}

export default function SpotifyEmbed({ trackUri, isOpen }: SpotifyEmbedProps) {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && trackUri) {
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
    }
  }, [isOpen, trackUri]);

  if (!iframeSrc) return null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-[3px] border-nb-black shadow-[3px_3px_0px_var(--nb-black)]">
      <iframe
        src={iframeSrc}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="block"
        style={{ borderRadius: "12px" }}
      />
    </div>
  );
}
