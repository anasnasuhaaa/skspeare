"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FaeOutfit, DEFAULT_OUTFIT, SKIPPED_OUTFIT } from "./fairyTypes";
import SecretGardenDoor from "./SecretGardenDoor";
import FairyDressUp from "./FairyDressUp";
import FaeIntroWebsite from "./FaeIntroWebsite";

type FairyStep = "door" | "dressup" | "intro";

export default function RenaPage() {
  const [step, setStep] = useState<FairyStep>("door");
  const [outfit, setOutfit] = useState<FaeOutfit>(DEFAULT_OUTFIT);

  const handleSkipToFaeContoh = () => {
    setOutfit(SKIPPED_OUTFIT);
    setStep("intro");
  };

  return (
    <div className="min-h-screen bg-[#07130c] text-[#e8f7ee] flex flex-col justify-between relative overflow-x-hidden selection:bg-[#256140] selection:text-[#ffe082]">
      {/* Fairytale Google Fonts & Magical Keyframe Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-fairytale {
          font-family: 'Cinzel Decorative', 'Cinzel', Georgia, serif;
        }
        .font-fairytale-sub {
          font-family: 'Cinzel', Georgia, serif;
        }
      `}</style>

      {/* Global Ambient Secret Garden Fireflies & Mists */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#1d4d33]/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-[650px] h-[400px] bg-[#163a27]/25 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#ffe082]/5 rounded-full blur-[110px]" />

        {/* Ambient Fireflies */}
        <div className="absolute top-[12%] left-[12%] w-2.5 h-2.5 rounded-full bg-[#ffe082] shadow-[0_0_15px_#ffe082] animate-pulse" />
        <div className="absolute top-[30%] right-[10%] w-3 h-3 rounded-full bg-[#a8e6cf] shadow-[0_0_18px_#a8e6cf] animate-pulse delay-700" />
        <div className="absolute top-[65%] left-[6%] w-2 h-2 rounded-full bg-[#ffd54f] shadow-[0_0_12px_#ffd54f] animate-pulse delay-1000" />
        <div className="absolute top-[80%] right-[15%] w-3 h-3 rounded-full bg-[#a8e6cf] shadow-[0_0_15px_#a8e6cf] animate-pulse delay-500" />
      </div>

      {/* Top Banner with Return to Team Link */}
      <nav className="bg-[#091c12]/85 backdrop-blur-md border-b border-[#234d35]/70 px-4 sm:px-8 py-3 flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.5)] z-40 sticky top-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#0f2a1b]/90 hover:bg-[#18422b] text-[#cbf5dc] hover:text-[#ffe082] border border-[#2b6443] hover:border-[#ffe082] rounded-xl shadow-md transition-all text-xs font-mono font-bold tracking-wide cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Proxy Shakespeare</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#a8e6cf]">
          <span className="w-2 h-2 rounded-full bg-[#ffe082] shadow-[0_0_8px_#ffe082] animate-ping" />
          <span className="hidden sm:inline tracking-wider font-fairytale-sub text-[13px] text-[#e2f8eb]">
            RENA · FAE LUMINELLE
          </span>
        </div>
      </nav>

      {/* Main Experience Chassis */}
      <main className="relative z-10 flex-1 flex flex-col justify-center w-full">
        {step === "door" && (
          <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-center my-auto">
            <SecretGardenDoor
              onDoorOpened={() => setStep("dressup")}
              onSkip={handleSkipToFaeContoh}
            />
          </div>
        )}

        {step === "dressup" && (
          <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-center my-auto">
            <FairyDressUp
              initialOutfit={outfit}
              onFinish={(chosenOutfit) => {
                setOutfit(chosenOutfit);
                setStep("intro");
              }}
              onSkip={handleSkipToFaeContoh}
            />
          </div>
        )}

        {step === "intro" && (
          <div className="w-full flex-1">
            <FaeIntroWebsite
              outfit={outfit}
              onChangeOutfit={() => setStep("dressup")}
              onRestart={() => setStep("door")}
              isOpenModal={true}
            />
          </div>
        )}
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 bg-[#050f09] text-[#73a388] py-4 border-t border-[#1a3827] text-center text-xs font-mono tracking-wide">
        Proxy Shakespeare · Pekan Ilkomerz 62 · IPB University
      </footer>
    </div>
  );
}
