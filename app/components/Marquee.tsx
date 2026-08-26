"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface MarqueeProps {
  direction?: "left" | "right";
}

export default function Marquee({ direction = "left" }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const ctx = gsap.context(() => {
      if (direction === "right") {
        gsap.fromTo(
          trackRef.current,
          { xPercent: -50 },
          {
            xPercent: 0,
            ease: "none",
            duration: 25,
            repeat: -1,
          }
        );
      } else {
        gsap.fromTo(
          trackRef.current,
          { xPercent: 0 },
          {
            xPercent: -50,
            ease: "none",
            duration: 25,
            repeat: -1,
          }
        );
      }
    });

    return () => ctx.revert();
  }, [direction]);

  const items = Array(8).fill("PROXY SHAKESPEARE ★ PEKAN ILKOMERZ 62");

  const TextBlock = () => (
    <div className="flex shrink-0 items-center whitespace-nowrap">
      {items.map((text, i) => (
        <span
          key={i}
          className="text-base sm:text-xl md:text-2xl font-display font-black text-nb-black uppercase tracking-wider px-4 sm:px-6"
        >
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full overflow-hidden py-4 my-2">
      <div
        className="w-[110%] -ml-[5%] overflow-hidden bg-nb-yellow py-3 sm:py-4 border-y-[3px] border-nb-black shadow-[0_4px_0_var(--nb-black)]"
        style={{
          transform: direction === "right" ? "rotate(2deg)" : "rotate(-2deg)",
        }}
      >
        <div ref={trackRef} className="flex w-fit whitespace-nowrap will-change-transform">
          <TextBlock />
          <TextBlock />
        </div>
      </div>
    </div>
  );
}
