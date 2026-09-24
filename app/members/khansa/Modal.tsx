"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";
import gsap from "gsap";
import FlappySharkGame from "./FlappySharkGame";
import KhansaProfile from "./KhansaProfile";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStage = "game" | "profile";

export default function Modal({ isOpen, onClose }: ModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [stage, setStage] = useState<ModalStage>("game");

  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  // Handle animate close
  const handleAnimateClose = useCallback(() => {
    if (backdropRef.current && contentRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
      });
      gsap.to(contentRef.current, {
        scale: 0.94,
        opacity: 0,
        y: 20,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          document.body.style.overflow = "";
          setShouldRender(false);
          setStage("game"); // Reset to game on next open
          onClose();
        },
      });
    } else {
      document.body.style.overflow = "";
      setShouldRender(false);
      setStage("game");
      onClose();
    }
  }, [onClose]);

  // Sync open state & lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else if (shouldRender) {
      handleAnimateClose();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, shouldRender, handleAnimateClose]);

  // Entrance animation
  useEffect(() => {
    if (shouldRender && backdropRef.current && contentRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        gsap.fromTo(
          contentRef.current,
          { scale: 0.94, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.4)" }
        );
      });
      return () => ctx.revert();
    }
  }, [shouldRender]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleAnimateClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleAnimateClose]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-1000 w-full h-full overflow-y-auto bg-[#071927]/85 backdrop-blur-md flex flex-col justify-start">
      {/* Background Animated Ocean Gradients */}
      <div
        ref={backdropRef}
        onClick={handleAnimateClose}
        className="fixed inset-0 cursor-pointer pointer-events-auto"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#4ecdc4]/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-[#ffaebc]/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#c2f0fc]/15 rounded-full blur-[160px]" />
      </div>

      {/* Floating Kawaii Close Button */}
      <div className="fixed top-3 right-3 sm:top-5 sm:right-6 z-[1100] pointer-events-auto">
        <button
          type="button"
          onClick={handleAnimateClose}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#ffffff] hover:bg-[#ffaebc] border-[2.5px] border-[#1a1a2e] text-[#1a1a2e] shadow-[4px_4px_0px_#1a1a2e] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1a1a2e] transition-all cursor-pointer"
          title="Tutup Modal"
          aria-label="Tutup Modal"
        >
          <span className="hidden sm:inline font-mono text-xs font-black uppercase tracking-wider">
            Tutup
          </span>
          <div className="w-5 h-5 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <X size={12} strokeWidth={3} />
          </div>
        </button>
      </div>

      {/* Main Experience Dialog */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full min-h-screen py-8 sm:py-12 flex flex-col items-center justify-center"
      >
        {stage === "game" ? (
          <div className="w-full px-3 flex flex-col items-center my-auto animate-in fade-in duration-300">
            {/* Stage 1: Flappy Shark Game */}
            <FlappySharkGame
              onComplete={() => setStage("profile")}
              onSkip={() => setStage("profile")}
            />
          </div>
        ) : (
          <div className="w-full max-w-4xl px-3 sm:px-6 my-auto animate-in fade-in zoom-in-95 duration-400">
            {/* Stage 2: Main Kawaii Ocean Profile */}
            <KhansaProfile
              onClose={handleAnimateClose}
              onReplayGame={() => setStage("game")}
              isStandalone={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
