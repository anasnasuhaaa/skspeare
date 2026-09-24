"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Sparkles, Theater } from "lucide-react";

const loadingScenes = [
  { at: 0, label: "Menyalakan lampu panggung" },
  { at: 28, label: "Mengumpulkan para pemain" },
  { at: 58, label: "Menyusun cerita" },
  { at: 82, label: "Mengguncang yang biasa" },
  { at: 98, label: "Curtain up!" },
] as const;

function getLoadingScene(progress: number) {
  return [...loadingScenes].reverse().find((scene) => progress >= scene.at)?.label;
}

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isExited, setIsExited] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isFinishingRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const announceReady = useCallback(() => {
    document.documentElement.dataset.proxyReady = "true";
    window.dispatchEvent(new CustomEvent("proxy:ready"));
  }, []);

  const triggerExit = useCallback(() => {
    if (isFinishingRef.current) return;
    isFinishingRef.current = true;
    progressTweenRef.current?.kill();
    setProgress(100);

    if (reducedMotionRef.current) {
      announceReady();
      document.body.style.overflow = "";
      setIsExited(true);
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setIsExited(true);
      },
    });

    exitTimelineRef.current = timeline;

    if (contentRef.current) {
      timeline
        .to(contentRef.current, {
          keyframes: [
            { x: -7, rotation: -0.6, duration: 0.05 },
            { x: 7, rotation: 0.6, duration: 0.05 },
            { x: -4, rotation: -0.3, duration: 0.05 },
            { x: 0, rotation: 0, duration: 0.05 },
          ],
          ease: "none",
        })
        .to(contentRef.current, {
          opacity: 0,
          y: -18,
          scale: 0.96,
          duration: 0.24,
          ease: "power2.in",
        });
    }

    timeline
      .add(announceReady, "-=0.05")
      .to(
        ".loading-curtain-left",
        { xPercent: -102, duration: 0.72, ease: "power4.inOut" },
        "curtain"
      )
      .to(
        ".loading-curtain-right",
        { xPercent: 102, duration: 0.72, ease: "power4.inOut" },
        "curtain"
      )
      .to(
        containerRef.current,
        { opacity: 0, duration: 0.35, ease: "power2.out" },
        "curtain+=0.3"
      );
  }, [announceReady]);

  const handleSkip = useCallback(() => {
    triggerExit();
  }, [triggerExit]);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    document.body.style.overflow = "hidden";

    const entrance = gsap.timeline();
    if (reducedMotionRef.current) {
      entrance.set(contentRef.current, { opacity: 1 });
    } else {
      entrance
        .fromTo(
          ".loading-curtain-left",
          { xPercent: -100 },
          { xPercent: 0, duration: 0.52, ease: "power3.out" }
        )
        .fromTo(
          ".loading-curtain-right",
          { xPercent: 100 },
          { xPercent: 0, duration: 0.52, ease: "power3.out" },
          "<"
        )
        .fromTo(
          contentRef.current,
          { opacity: 0, y: 24, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: "back.out(1.6)" },
          "-=0.12"
        )
        .fromTo(
          ".loader-reveal",
          { opacity: 0, y: 9 },
          { opacity: 1, y: 0, duration: 0.24, stagger: 0.05, ease: "power2.out" },
          "-=0.2"
        );
    }

    const progressState = { value: 0 };
    progressTweenRef.current = gsap.to(progressState, {
      value: 100,
      duration: reducedMotionRef.current ? 0.15 : 1.65,
      delay: reducedMotionRef.current ? 0 : 0.22,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(progressState.value)),
      onComplete: () => {
        window.setTimeout(triggerExit, reducedMotionRef.current ? 0 : 180);
      },
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      entrance.kill();
      progressTweenRef.current?.kill();
      exitTimelineRef.current?.kill();
    };
  }, [handleSkip, triggerExit]);

  if (isExited) return null;

  const scene = getLoadingScene(progress);

  return (
    <div
      ref={containerRef}
      className="loading-stage fixed inset-0 z-9999 isolate flex select-none items-center justify-center overflow-hidden bg-nb-cream p-4 sm:p-6"
      aria-label="Memuat Proxy Shakespeare"
      aria-live="polite"
      role="status"
    >
      <div aria-hidden="true" className="loading-curtain loading-curtain-left" />
      <div aria-hidden="true" className="loading-curtain loading-curtain-right" />
      <div aria-hidden="true" className="loading-stage-lights" />

      <div
        ref={contentRef}
        className="relative z-20 w-full max-w-xl text-center opacity-0"
      >

        <div className="loader-card relative border-[3px] border-nb-black bg-nb-white px-4 py-6 shadow-[7px_7px_0px_var(--nb-black)] sm:border-4 sm:px-10 sm:py-8 sm:shadow-[10px_10px_0px_var(--nb-black)]">
          <span
            aria-hidden="true"
            className="absolute -left-3 -top-3 flex h-9 w-9 -rotate-12 items-center justify-center border-2 border-nb-black bg-nb-yellow shadow-[2px_2px_0px_var(--nb-black)] sm:h-11 sm:w-11"
          >
            <Theater size={22} strokeWidth={2.6} />
          </span>
          <span
            aria-hidden="true"
            className="absolute -right-3 -top-3 flex h-8 w-8 rotate-12 items-center justify-center border-2 border-nb-black bg-nb-blue shadow-[2px_2px_0px_var(--nb-black)] sm:h-10 sm:w-10"
          >
            <Sparkles size={19} strokeWidth={2.8} />
          </span>

          <p className="loader-reveal mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-nb-black/55 sm:text-xs">
            Proxy presents
          </p>
          <h2 className="loader-reveal font-display text-[clamp(2.15rem,10vw,4.5rem)] font-black uppercase leading-[0.84] tracking-[-0.075em] text-nb-black">
            <span className="loading-shake-word relative z-10 inline-block bg-nb-yellow px-2 py-1 shadow-[3px_3px_0px_var(--nb-black)]">
              Shake
            </span>
            <span className="inline-block pl-1.5 sm:pl-2">speare</span>
          </h2>

          <div className="loader-reveal my-5 flex items-center gap-3 sm:my-6">
            <span className="h-0.75 flex-1 bg-nb-black" />
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-nb-black sm:text-xs">
              Shake the ordinary
            </p>
            <span className="h-0.75 flex-1 bg-nb-black" />
          </div>

          <div className="loader-reveal">
            <div
              className="h-5 w-full overflow-hidden border-2 border-nb-black bg-nb-cream p-0.5 sm:h-6"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label={`${scene}, ${progress}%`}
            >
              <div
                className="loading-progress-fill h-full w-full origin-left"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-3 font-mono text-[10px] font-bold uppercase sm:text-xs">
              <span className="min-w-0 truncate text-left text-nb-black/65">{scene}</span>
              <span className="shrink-0 border-2 border-nb-black bg-nb-pink px-2 py-0.5 text-nb-black shadow-[2px_2px_0px_var(--nb-black)]">
                {progress.toString().padStart(3, "0")}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
