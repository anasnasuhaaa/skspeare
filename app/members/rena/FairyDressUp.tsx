"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Shuffle,
  RotateCcw,
  Check,
  ArrowRight,
  Volume2,
  VolumeX,
  Heart,
  HelpCircle,
} from "lucide-react";
import {
  FaeOutfit,
  FairyCategoryKey,
  FairyCategory,
  HAIR_OPTIONS,
  DRESS_OPTIONS,
  ACCESSORY_OPTIONS,
  WINGS_OPTIONS,
  PET_OPTIONS,
  DEFAULT_OUTFIT,
  SKIPPED_OUTFIT,
} from "./fairyTypes";
import FaeCharacter from "./FaeCharacter";
import { soundEngine } from "./soundEngine";

interface FairyDressUpProps {
  initialOutfit?: FaeOutfit;
  onFinish: (outfit: FaeOutfit) => void;
  onSkip: () => void;
}

export default function FairyDressUp({
  initialOutfit = DEFAULT_OUTFIT,
  onFinish,
  onSkip,
}: FairyDressUpProps) {
  const [outfit, setOutfit] = useState<FaeOutfit>({
    ...initialOutfit,
    isCustom: true,
  });
  const [activeCategory, setActiveCategory] = useState<FairyCategoryKey>("hair");
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);
  const [hoveredDescription, setHoveredDescription] = useState<string | null>(null);

  const categories: FairyCategory[] = [
    {
      key: "hair",
      label: "Hairstyle",
      icon: "💇‍♀️",
      items: HAIR_OPTIONS,
      allowNone: false,
    },
    {
      key: "dress",
      label: "Fairy Dress",
      icon: "👗",
      items: DRESS_OPTIONS,
      allowNone: false,
    },
    {
      key: "accessories",
      label: "Accessories",
      icon: "👑",
      items: ACCESSORY_OPTIONS,
      allowNone: true,
    },
    {
      key: "wings",
      label: "Wings",
      icon: "🪽",
      items: WINGS_OPTIONS,
      allowNone: false,
    },
    {
      key: "pets",
      label: "Garden Pet",
      icon: "🐇",
      items: PET_OPTIONS,
      allowNone: true,
    },
  ];

  const currentCategoryObj =
    categories.find((c) => c.key === activeCategory) || categories[0];

  const handleSelectItem = (catKey: FairyCategoryKey, itemId: string | null) => {
    soundEngine.playSparkle();
    setOutfit((prev) => {
      switch (catKey) {
        case "hair":
          return { ...prev, hairId: itemId || HAIR_OPTIONS[0].id };
        case "dress":
          return { ...prev, dressId: itemId || DRESS_OPTIONS[0].id };
        case "accessories":
          return { ...prev, accessoryId: itemId };
        case "wings":
          return { ...prev, wingsId: itemId || WINGS_OPTIONS[0].id };
        case "pets":
          return { ...prev, petId: itemId };
        default:
          return prev;
      }
    });
  };

  const handleRandomize = () => {
    soundEngine.playFlutter();
    const randomHair =
      HAIR_OPTIONS[Math.floor(Math.random() * HAIR_OPTIONS.length)].id;
    const randomDress =
      DRESS_OPTIONS[Math.floor(Math.random() * DRESS_OPTIONS.length)].id;
    const randomAcc =
      ACCESSORY_OPTIONS[Math.floor(Math.random() * ACCESSORY_OPTIONS.length)].id;
    const randomWings =
      WINGS_OPTIONS[Math.floor(Math.random() * WINGS_OPTIONS.length)].id;
    const randomPet =
      PET_OPTIONS[Math.floor(Math.random() * PET_OPTIONS.length)].id;

    setOutfit({
      hairId: randomHair,
      dressId: randomDress,
      accessoryId: randomAcc,
      wingsId: randomWings,
      petId: randomPet,
      isCustom: true,
    });
  };

  const handleReset = () => {
    soundEngine.playFlutter();
    setOutfit({ ...DEFAULT_OUTFIT, isCustom: true });
  };

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleFinishDressUp = () => {
    soundEngine.playDoorOpen();
    onFinish({ ...outfit, isCustom: true });
  };

  const handleSkipDressUp = () => {
    soundEngine.playFlutter();
    onSkip();
  };

  // Helper to check if item is currently selected
  const isItemSelected = (catKey: FairyCategoryKey, itemId: string | null) => {
    switch (catKey) {
      case "hair":
        return outfit.hairId === itemId;
      case "dress":
        return outfit.dressId === itemId;
      case "accessories":
        return outfit.accessoryId === itemId;
      case "wings":
        return outfit.wingsId === itemId;
      case "pets":
        return outfit.petId === itemId;
      default:
        return false;
    }
  };

  return (
    <div className="relative w-full flex flex-col bg-gradient-to-b from-[#081810] via-[#0d2619] to-[#06140d] rounded-3xl border-2 border-[#234e34]/70 shadow-[0_12px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden text-[#e8f7ee]">
      {/* Top Header Bar */}
      <div className="bg-[#0c2317]/90 border-b border-[#234e34] px-4 sm:px-6 py-3.5 flex items-center justify-between relative z-20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="text-xl sm:text-2xl animate-spin text-[#ffe082]">✨</span>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-serif font-black uppercase tracking-wider text-[#fffdf7]">
              Fae&apos;s Dressing Alcove
            </h2>
            <p className="text-[10px] sm:text-xs font-mono font-medium text-[#a8e6cf]/80">
              Style Fae Luminelle before exploring her enchanted realm
            </p>
          </div>
        </div>

        {/* Sound Toggle & Fast Skip Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 bg-[#122e20]/90 hover:bg-[#1c4430] text-[#a8e6cf] hover:text-[#ffe082] border border-[#2e6443] hover:border-[#ffe082] rounded-xl shadow-md transition-all cursor-pointer"
            title={isMuted ? "Unmute melody" : "Mute melody"}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            type="button"
            onClick={handleSkipDressUp}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#122e20]/90 hover:bg-[#1c4430] text-[#cbf5dc] hover:text-[#ffe082] border border-[#2e6443] hover:border-[#ffe082] rounded-xl shadow-md text-xs font-mono font-bold transition-all cursor-pointer"
            title="Skip dress-up and use default appearance"
          >
            <span>Skip & Meet Fae</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Studio Area: Split on desktop, stacked on mobile */}
      <div className="p-3 sm:p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left / Center: Fae Character Stage (Sticky on desktop) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] aspect-square rounded-3xl border-2 border-[#2b6040] bg-gradient-to-b from-[#10271b] via-[#143524] to-[#0b1c13] shadow-[inset_0_0_40px_rgba(0,0,0,0.6),0_10px_30px_rgba(0,0,0,0.5)] p-4 sm:p-6 flex items-center justify-center overflow-hidden">
            {/* Soft garden backdrop circles */}
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-[#3d8c5f]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-[#ffe082]/10 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#a8e6cf_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

            {/* Fae Layered Character */}
            <div className="relative w-full h-full">
              <FaeCharacter outfit={outfit} priority={true} animate={true} />
            </div>

            {/* Fairy Name Badge overlay */}
            <div className="absolute top-3 left-3 bg-[#081810]/85 border border-[#387a55] rounded-full px-3.5 py-1 shadow-md flex items-center gap-1.5 text-xs font-mono font-bold text-[#cbf5dc]">
              <span className="text-[#ffe082]">🌸</span>
              <span>Fae Luminelle</span>
            </div>

            {/* Quick Action Badges: Randomize & Reset */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRandomize}
                className="p-2.5 bg-[#122e20]/90 hover:bg-[#1a442e] text-[#a8e6cf] hover:text-[#ffe082] border border-[#2f6645] hover:border-[#ffe082] rounded-xl shadow-md transition-all cursor-pointer"
                title="Randomize Outfit"
                aria-label="Randomize Outfit"
              >
                <Shuffle size={16} />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 bg-[#122e20]/90 hover:bg-[#1a442e] text-[#a8e6cf] hover:text-[#ffe082] border border-[#2f6645] hover:border-[#ffe082] rounded-xl shadow-md transition-all cursor-pointer"
                title="Reset to Default"
                aria-label="Reset Outfit"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Description / Lore bubble for active item */}
          <div className="w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] mt-3 px-4 py-2.5 bg-[#0a1e13]/85 border border-[#245237] rounded-xl shadow-md flex items-center gap-2 text-xs font-mono text-[#a8e6cf]">
            <span className="text-sm">🧚‍♀️</span>
            <span className="text-[#cbf5dc] font-medium truncate">
              {hoveredDescription ||
                "Choose hair, dresses, wings, accessories, and pet companions!"}
            </span>
          </div>
        </div>

        {/* Right: Customization Controls (Tabs + Asset Grid + Actions) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Category Tabs (Horizontally scrollable for mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    soundEngine.playFlutter();
                    setActiveCategory(cat.key);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl font-serif font-bold text-xs sm:text-sm uppercase whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-[#1b432e] to-[#286344] text-[#fffdf7] border-2 border-[#ffe082] shadow-[0_0_15px_rgba(40,99,68,0.4)]"
                      : "bg-[#0c2217]/80 text-[#a8e6cf] border border-[#224e34] hover:bg-[#143625] hover:border-[#387a55]"
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Asset Selection Grid */}
          <div className="bg-[#0a1e13]/85 backdrop-blur-md border border-[#224e34] rounded-2xl p-3.5 sm:p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wide text-[#e8f7ee] flex items-center gap-1.5">
                <span>{currentCategoryObj.icon}</span>
                <span>Select {currentCategoryObj.label}</span>
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-[#a8e6cf]/70 font-medium">
                {currentCategoryObj.items.length} choices available
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {/* Optional 'None' choice for Accessories / Pet */}
              {currentCategoryObj.allowNone && (
                <button
                  type="button"
                  onClick={() => handleSelectItem(activeCategory, null)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer aspect-square ${
                    isItemSelected(activeCategory, null)
                      ? "bg-gradient-to-b from-[#183e2a] to-[#0f281b] border-2 border-[#ffe082] shadow-[0_0_15px_rgba(255,224,130,0.35)] ring-1 ring-[#ffe082]/60 text-[#ffe082]"
                      : "bg-[#10291c]/80 border border-[#245437] text-[#a8e6cf] hover:border-[#387a55] hover:bg-[#163a27]"
                  }`}
                >
                  <span className="text-2xl mb-1">🚫</span>
                  <span className="font-mono font-bold text-[11px] text-center">
                    None
                  </span>
                </button>
              )}

              {/* Items in Active Category */}
              {currentCategoryObj.items.map((item) => {
                const selected = isItemSelected(activeCategory, item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(activeCategory, item.id)}
                    onMouseEnter={() => setHoveredDescription(item.description || null)}
                    onMouseLeave={() => setHoveredDescription(null)}
                    className={`relative flex flex-col items-center justify-between p-2 rounded-xl transition-all cursor-pointer aspect-square group ${
                      selected
                        ? "bg-gradient-to-b from-[#183e2a] to-[#0f281b] border-2 border-[#ffe082] shadow-[0_0_15px_rgba(255,224,130,0.35)] ring-1 ring-[#ffe082]/60 text-[#ffe082]"
                        : "bg-[#10291c]/80 border border-[#245437] text-[#cbf5dc] hover:border-[#ffe082] hover:bg-[#163a27] shadow-sm hover:scale-[1.02]"
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    {selected && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#ffe082] text-[#07130c] flex items-center justify-center shadow-md z-10">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}

                    {/* Preview Thumbnail Container */}
                    <div className="relative w-full flex-1 aspect-square rounded-lg overflow-hidden bg-[#07150e]/60 border border-[#2b5e3f]/40">
                      <Image
                        src={item.preview}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 25vw, 120px"
                        className="object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Asset Name */}
                    <span className="font-mono font-medium text-[10px] sm:text-[11px] truncate w-full text-center mt-1">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Skip & Enter Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkipDressUp}
              className="w-full sm:w-auto px-5 py-3 bg-[#0d2618]/90 hover:bg-[#163d27] text-[#cbf5dc] hover:text-[#ffe082] border border-[#2a6442] hover:border-[#ffe082] rounded-xl shadow-md font-mono font-bold text-xs uppercase transition-all cursor-pointer text-center"
            >
              Skip & Meet Fae 🍃
            </button>

            <button
              type="button"
              onClick={handleFinishDressUp}
              className="w-full sm:flex-1 py-3 px-6 bg-gradient-to-r from-[#205739] via-[#327a51] to-[#225b3c] hover:from-[#2a7049] hover:to-[#38885b] text-[#fffdf7] border-2 border-[#ffe082] rounded-xl font-serif font-bold text-sm sm:text-base uppercase tracking-wider shadow-[0_0_25px_rgba(50,122,81,0.5)] hover:shadow-[0_0_35px_rgba(255,224,130,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles size={16} className="animate-spin text-[#ffe082]" />
              <span>Enter Garden with Fae ✨</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
