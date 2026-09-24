"use client";

import React, { useState } from "react";
import { Sparkles, X, ChevronUp, ChevronDown } from "lucide-react";
import { FaeOutfit } from "./fairyTypes";
import FaeCharacter from "./FaeCharacter";
import { soundEngine } from "./soundEngine";

interface FaeCompanionProps {
  outfit: FaeOutfit;
  onChangeOutfit?: () => void;
}

const FAIRY_DIALOGUES = [
  "Welcome to the secret glade! Rena designed every leaf and flower here. 🌿",
  "Did you know? Rena suka banget sama Park Sunghoon! 📖✨",
  "Listen closely to the enchanted stream — Rena's favorite song is playing! 🎵",
  "You styled me so wonderfully! I love fluttering beside you through the garden. 🧚‍♀️💖",
];

export default function FaeCompanion({
  outfit,
  onChangeOutfit,
}: FaeCompanionProps) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);

  const handleFaeClick = () => {
    soundEngine.playSparkle();
    setDialogueIndex((prev) => (prev + 1) % FAIRY_DIALOGUES.length);
    setIsBubbleOpen(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-100 flex flex-col items-end pointer-events-auto">
      {/* Fairy Speech Bubble */}
      {isBubbleOpen && !isMinimized && (
        <div className="relative mb-2.5 max-w-[240px] sm:max-w-[280px] bg-[#091b12]/95 backdrop-blur-md border border-[#2b5e40] rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)] text-xs text-[#e8f7ee] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => setIsBubbleOpen(false)}
            className="absolute top-1.5 right-1.5 text-[#a8e6cf]/70 hover:text-[#ffe082] cursor-pointer transition-colors"
            title="Dismiss bubble"
          >
            <X size={13} />
          </button>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#ffe082] uppercase mb-1">
            <Sparkles size={11} className="animate-spin text-[#ffe082]" />
            <span>Fae whispers:</span>
          </div>
          <p className="font-sans font-medium text-[#cbf5dc] leading-relaxed">
            {FAIRY_DIALOGUES[dialogueIndex]}
          </p>
          {/* Bubble beak */}
          <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-[#091b12] border-r border-b border-[#2b5e40] rotate-45" />
        </div>
      )}

      {/* Main Companion Capsule */}
      <div className="flex items-end gap-2">
        {/* Change outfit button */}
        {onChangeOutfit && !isMinimized && (
          <button
            type="button"
            onClick={onChangeOutfit}
            className="px-3 py-1.5 bg-[#0f2c1d]/90 hover:bg-[#18462f] text-[#ffe082] border border-[#2b6443] hover:border-[#ffe082] rounded-xl shadow-md text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
            title="Restyle Fae"
          >
            <span>👗 Restyle</span>
          </button>
        )}

        {/* Fae Character Avatar Circle / Capsule */}
        <div
          onClick={handleFaeClick}
          className="relative bg-gradient-to-b from-[#102a1c] to-[#18402b] border-2 border-[#387a55] hover:border-[#ffe082] rounded-2xl sm:rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(61,140,95,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer p-1.5 group flex flex-col items-center"
          title="Click Fae to chat!"
        >
          {/* Minimize / expand toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="absolute -top-2 -left-2 w-5 h-5 bg-[#143825] border border-[#3b7e57] text-[#ffe082] hover:bg-[#1f5236] rounded-full flex items-center justify-center text-[10px] shadow-md z-20 cursor-pointer transition-colors"
            title={isMinimized ? "Expand Companion" : "Minimize Companion"}
          >
            {isMinimized ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>

          <div
            className={`transition-all duration-300 ${
              isMinimized
                ? "w-10 h-10"
                : "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
            }`}
          >
            <FaeCharacter
              outfit={outfit}
              animate={true}
              altText="Fae Luminelle interactive guide"
            />
          </div>

          {!isMinimized && (
            <div className="bg-[#07150e]/90 text-[#a8e6cf] font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-[#2e6443] -mt-1 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffe082] animate-ping" />
              <span>FAE GUIDE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
