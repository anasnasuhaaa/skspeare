"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    
    const track = trackRef.current;
    
    gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 10,
      repeat: -1
    });
  }, []);

  const texts = Array(10).fill("PROXY SHAKESPEARE | PEKAN ILKOMERZ 62");

  return (
    <div className="w-full bg-nb-yellow marquee-wrapper py-3">
      <div className="marquee-track flex whitespace-nowrap" ref={trackRef}>
        {texts.map((text, i) => (
          <React.Fragment key={i}>
            <span className="text-2xl font-display font-black text-nb-black uppercase">
              {text}
            </span>
            <span className="text-2xl text-nb-black">★</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
