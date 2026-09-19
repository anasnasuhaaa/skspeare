"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Sparkles } from "lucide-react";
import gsap from "gsap";
import { FaeOutfit, DEFAULT_OUTFIT, SKIPPED_OUTFIT } from "./fairyTypes";
import SecretGardenDoor from "./SecretGardenDoor";
import FairyDressUp from "./FairyDressUp";
import FaeIntroWebsite from "./FaeIntroWebsite";
import { soundEngine } from "./soundEngine";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FairyStep = "door" | "dressup" | "intro";

export default function Modal({ isOpen, onClose }: ModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [step, setStep] = useState<FairyStep>("door");
  const [outfit, setOutfit] = useState<FaeOutfit>(DEFAULT_OUTFIT);

  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
    } else if (shouldRender) {
      handleAnimateClose();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (shouldRender && backdropRef.current && contentRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" }
        );
        gsap.fromTo(
          contentRef.current,
          { scale: 0.98, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
        );
      });
      return () => ctx.revert();
    }
  }, [shouldRender]);

  const handleAnimateClose = useCallback(() => {
    soundEngine.stopAmbientMusic();
    if (backdropRef.current && contentRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
      gsap.to(contentRef.current, {
        scale: 0.98,
        opacity: 0,
        y: 15,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          document.body.style.overflow = "";
          setShouldRender(false);
          onClose();
        },
      });
    } else {
      document.body.style.overflow = "";
      setShouldRender(false);
      onClose();
    }
  }, [onClose]);

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

  const handleSkipToFaeContoh = () => {
    setOutfit(SKIPPED_OUTFIT);
    setStep("intro");
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-1000 w-full h-full overflow-y-auto bg-[#07130c] text-[#e8f7ee] flex flex-col">
      {/* Mystical Secret Garden Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#1d4d33]/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[450px] bg-[#163a27]/30 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#ffe082]/5 rounded-full blur-[100px]" />

        {/* Ambient Fireflies */}
        <div className="absolute top-[15%] left-[10%] w-2.5 h-2.5 rounded-full bg-[#ffe082] shadow-[0_0_15px_#ffe082] animate-pulse" />
        <div className="absolute top-[28%] right-[14%] w-3 h-3 rounded-full bg-[#a8e6cf] shadow-[0_0_18px_#a8e6cf] animate-pulse delay-700" />
        <div className="absolute top-[60%] left-[8%] w-2 h-2 rounded-full bg-[#ffd54f] shadow-[0_0_12px_#ffd54f] animate-pulse delay-1000" />
        <div className="absolute top-[75%] right-[10%] w-3 h-3 rounded-full bg-[#a8e6cf] shadow-[0_0_15px_#a8e6cf] animate-pulse delay-500" />
        <div className="absolute top-[88%] left-[18%] w-2.5 h-2.5 rounded-full bg-[#ffe082] shadow-[0_0_14px_#ffe082] animate-pulse delay-1200" />
      </div>

      {/* Floating Botanical Exit Sanctuary Button */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[1100] pointer-events-auto">
        <button
          type="button"
          onClick={handleAnimateClose}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0d2618]/90 hover:bg-[#163d27] border-2 border-[#2f6645]/70 hover:border-[#ffe082] text-[#cbf5dc] hover:text-[#ffe082] shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 cursor-pointer"
          title="Exit Secret Garden"
          aria-label="Close modal"
        >
          <span className="hidden sm:inline font-mono text-xs font-bold tracking-wider uppercase text-[#a8e6cf] group-hover:text-[#ffe082] transition-colors">
            Exit Sanctuary
          </span>
          <div className="w-6 h-6 rounded-full bg-[#1b432e] group-hover:bg-[#ffe082] text-[#a8e6cf] group-hover:text-[#07130c] flex items-center justify-center transition-colors">
            <X size={14} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      {/* Main Experiential Flow */}
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex-1 w-full flex flex-col items-center"
      >
        {step === "door" && (
          <div className="w-full flex-1 flex items-center justify-center p-3 sm:p-6 md:p-10 my-auto">
            <div className="w-full max-w-4xl">
              <SecretGardenDoor
                onDoorOpened={() => setStep("dressup")}
                onSkip={handleSkipToFaeContoh}
              />
            </div>
          </div>
        )}

        {step === "dressup" && (
          <div className="w-full flex-1 flex items-center justify-center p-3 sm:p-6 md:p-10 my-auto">
            <div className="w-full max-w-5xl">
              <FairyDressUp
                initialOutfit={outfit}
                onFinish={(chosenOutfit) => {
                  setOutfit(chosenOutfit);
                  setStep("intro");
                }}
                onSkip={handleSkipToFaeContoh}
              />
            </div>
          </div>
        )}

        {step === "intro" && (
          <div className="w-full flex-1">
            <FaeIntroWebsite
              outfit={outfit}
              onChangeOutfit={() => setStep("dressup")}
              onRestart={() => setStep("door")}
              isOpenModal={isOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
}
