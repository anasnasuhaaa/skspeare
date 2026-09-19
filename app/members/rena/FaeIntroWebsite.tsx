"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  MapPin,
  Copy,
  ExternalLink,
  Volume2,
  VolumeX,
  RotateCcw,
  Flower2,
} from "lucide-react";
import renaData from "./data";
import { FaeOutfit } from "./fairyTypes";
import FaeCharacter from "./FaeCharacter";
import FaeCompanion from "./FaeCompanion";
import SpotifyEmbed from "@/app/components/SpotifyEmbed";
import { soundEngine } from "./soundEngine";

interface FaeIntroWebsiteProps {
  outfit: FaeOutfit;
  onChangeOutfit: () => void;
  onRestart: () => void;
  isOpenModal?: boolean;
}

const WISHING_WELL_FORTUNES = [
  "Bismillah ga jobless ✨",
  "Kamu dapat A di MK KOM2205 - Pemrograman 🌸",
  "ANDA DINYATAKAN TIDAK LULUS SELEKSI SNBP 2025 🚩",
  "Kamu dapat A di MK KOM2201 - Pengantar Teori Komputasi💧",
  "Wake Me Up, When September Ends 🧚‍♀️⭐",
  "Aku ingin punya femboy",
  "Bertemu Benjamin Netanyahu",
  "Menjadi Prabowo Subianto untuk 1 Hari",
];

export default function FaeIntroWebsite({
  outfit,
  onChangeOutfit,
  onRestart,
  isOpenModal = true,
}: FaeIntroWebsiteProps) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted);
  const [wishResult, setWishResult] = useState<string | null>(null);
  const [isWishing, setIsWishing] = useState(false);

  const handleCopy = (text: string, label: string) => {
    soundEngine.playSparkle();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLabel(label);
      setTimeout(() => setCopiedLabel(null), 2000);
    }
  };

  const handleMakeWish = () => {
    soundEngine.playSparkle();
    setIsWishing(true);
    setTimeout(() => {
      const fortune =
        WISHING_WELL_FORTUNES[
          Math.floor(Math.random() * WISHING_WELL_FORTUNES.length)
        ];
      setWishResult(fortune);
      setIsWishing(false);
    }, 600);
  };

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#06140d] via-[#0a1e14] to-[#040d08] text-[#e8f7ee] overflow-x-hidden select-text">
      {/* Fairytale Google Fonts & Glow Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-fairytale {
          font-family: 'Cinzel Decorative', 'Cinzel', Georgia, serif;
        }
        .font-fairytale-sub {
          font-family: 'Cinzel', Georgia, serif;
        }
      `}</style>

      {/* Ambient Secret Garden Floating Fireflies */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[8%] left-[8%] w-2 h-2 rounded-full bg-[#ffe082] shadow-[0_0_15px_#ffe082] animate-pulse" />
        <div className="absolute top-[22%] right-[12%] w-2.5 h-2.5 rounded-full bg-[#a8e6cf] shadow-[0_0_18px_#a8e6cf] animate-pulse delay-700" />
        <div className="absolute top-[45%] left-[5%] w-2 h-2 rounded-full bg-[#ffe082] shadow-[0_0_12px_#ffe082] animate-pulse delay-1000" />
        <div className="absolute top-[65%] right-[8%] w-3 h-3 rounded-full bg-[#ffd54f] shadow-[0_0_16px_#ffd54f] animate-pulse delay-500" />
        <div className="absolute top-[82%] left-[14%] w-2 h-2 rounded-full bg-[#a8e6cf] shadow-[0_0_14px_#a8e6cf] animate-pulse delay-1200" />

        {/* Ambient Mist Gradients */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-[#1b432e]/25 blur-3xl pointer-events-none" />
        <div className="absolute top-2/3 -right-40 w-96 h-96 rounded-full bg-[#275c3f]/20 blur-3xl pointer-events-none" />
      </div>

      {/* Interactive Floating Companion Fae (Fae Guide) */}
      <FaeCompanion outfit={outfit} onChangeOutfit={onChangeOutfit} />

      {/* Floating Copy Feedback Toast */}
      {copiedLabel && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1050] bg-[#0c2418]/95 border-2 border-[#ffe082] rounded-xl px-5 py-2.5 shadow-[0_0_25px_rgba(255,224,130,0.35)] backdrop-blur-md font-mono font-bold text-xs sm:text-sm text-[#ffe082] uppercase tracking-wider animate-in fade-in slide-in-from-top-3 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#ffe082] animate-ping" />
          <span>Copied {copiedLabel} to clipboard! 📋</span>
        </div>
      )}

      {/* Secret Garden Header Navigation */}
      <nav className="sticky top-0 z-40 bg-[#07170f]/85 backdrop-blur-md border-b border-[#1f4731]/70 px-4 sm:px-8 py-3 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2.5">
          <span className="text-xl sm:text-2xl animate-spin text-[#ffe082]">🌸</span>
          <div>
            <h1 className="text-base sm:text-lg font-serif font-black tracking-wide leading-none text-[#fffdf7]">
              The Secret Garden
            </h1>
            <span className="text-[10px] sm:text-xs font-mono font-bold text-[#a8e6cf] bg-[#0d2618] px-2.5 py-0.5 rounded-md inline-block mt-1 border border-[#2b6443]">
              SANCTUARY OF RENA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 sm:px-3 sm:py-1.5 bg-[#0f2a1b]/90 hover:bg-[#18422b] text-[#a8e6cf] hover:text-[#ffe082] border border-[#285e3f] hover:border-[#ffe082] rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span className="hidden sm:inline">
              {isMuted ? "Muted" : "Melody"}
            </span>
          </button>

          <button
            type="button"
            onClick={onChangeOutfit}
            className="px-3.5 py-1.5 bg-[#143d28] hover:bg-[#1d5236] text-[#ffe082] border border-[#2f6846] hover:border-[#ffe082] rounded-xl shadow-md text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Redress Fae"
          >
            <span>👗 Restyle Fae</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="p-2 bg-[#0f2a1b]/90 hover:bg-[#18422b] text-[#a8e6cf] hover:text-[#ffe082] border border-[#285e3f] hover:border-[#ffe082] rounded-xl shadow-md text-xs font-mono font-bold transition-all cursor-pointer"
            title="Return to Secret Garden Door"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </nav>

      {/* Main Secret Garden Content Stream */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10 sm:gap-14">
        {/* ============================================================
            SECTION 1: THE GARDEN GATE — RENA'S PROFILE
            Displays RENA'S REAL MEMBER PHOTO (NOT FAE!) + PROFILE DATA
            ============================================================ */}
        <section className="relative bg-gradient-to-br from-[#0c2217] via-[#102b1e] to-[#081810] border-2 border-[#245237]/70 rounded-3xl p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Ornate Botanical Vines Header Accent */}
          <div className="absolute top-0 right-0 p-4 text-3xl opacity-20 pointer-events-none select-none">
            🌿🌸🌿
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left: REAL MEMBER PHOTO (Framed in Botanical Ivy) */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl border-2 border-[#33734e] bg-gradient-to-b from-[#122e20] to-[#091b12] shadow-[0_12px_35px_rgba(0,0,0,0.7)] p-2 group overflow-hidden">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0a1c12] border border-[#235036]">
                  <Image
                    src={renaData.photo}
                    alt={renaData.name}
                    fill
                    priority={true}
                    sizes="(max-width: 640px) 192px, 256px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle Botanical Corner Details */}
                  <div className="absolute top-2 left-2 text-xs">🍃</div>
                  <div className="absolute bottom-2 right-2 text-xs">🌸</div>
                </div>

                {/* Botanical Badge on Photo */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#07140d]/90 border border-[#2e6443] text-[#cbf5dc] font-mono text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffe082] animate-ping" />
                  <span>KEEPER OF THE GLADE</span>
                </div>
              </div>
            </div>

            {/* Right: RENA'S PROFILE INFORMATION */}
            <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#133222] border border-[#a8e6cf]/40 rounded-xl font-mono text-xs font-bold text-[#a8e6cf] shadow-sm mb-3">
                <Flower2 size={13} className="text-[#ffe082]" />
                <span>SECRET GARDEN GATE // RESIDENT</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#fffdf7] tracking-tight leading-tight mb-2 drop-shadow-md">
                {renaData.name}
              </h2>

              <p className="text-sm sm:text-base font-medium text-[#c0e3cd] mb-5 max-w-lg leading-relaxed">
                Welcome to my enchanted sanctuary within Proxy Shakespeare. Step
                softly through the ivy and let Fae guide your path through the
                garden.
              </p>

              {/* Identity Chips: Role, NIM, Hometown */}
              <div className="flex flex-wrap gap-2.5 justify-center md:justify-start mb-6">
                <span className="px-3.5 py-1.5 bg-[#123121] border border-[#2e6846] rounded-xl shadow-sm font-mono font-bold text-xs uppercase text-[#a8e6cf]">
                  Role: {renaData.role}
                </span>

                {renaData.nim && (
                  <button
                    type="button"
                    onClick={() => handleCopy(renaData.nim, `NIM ${renaData.nim}`)}
                    className="px-3.5 py-1.5 bg-[#123121] hover:bg-[#1b432e] text-[#a8e6cf] hover:text-[#ffe082] border border-[#2e6846] hover:border-[#ffe082] rounded-xl shadow-sm font-mono font-bold text-xs hover:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                    title="Click to copy NIM"
                  >
                    <span>NIM: {renaData.nim}</span>
                    <Copy size={12} />
                  </button>
                )}

                {renaData.hometown && (
                  <span className="px-3.5 py-1.5 bg-[#123121] border border-[#2e6846] rounded-xl shadow-sm font-mono font-bold text-xs text-[#cbf5dc] flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#ffe082]" />
                    <span>{renaData.hometown}</span>
                  </span>
                )}
              </div>

              {/* Personal Life Quote */}
              {renaData.quote && (
                <div
                  onClick={() => handleCopy(`"${renaData.quote}"`, "Quote")}
                  className="w-full max-w-md bg-[#081810]/90 border border-[#2b6040] hover:border-[#ffe082] rounded-2xl p-4 shadow-lg relative cursor-pointer transition-colors group text-center md:text-left"
                  title="Click to copy quote"
                >
                  <div className="absolute -top-3 left-4 bg-[#1a442d] text-[#ffe082] border border-[#387a55] rounded-lg px-2.5 py-0.5 font-mono font-bold text-[10px] uppercase shadow-sm">
                    💬 MOTO HIDUP
                  </div>
                  <p className="italic font-serif text-base sm:text-lg font-bold text-[#ffe082] mt-1 drop-shadow-sm">
                    &ldquo;{renaData.quote}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 2: HOBBY SECTION — STRICTLY FROM DATA.TS
            Only displays array from renaData.hobbies, NO inferred hobbies!
            ============================================================ */}
        <section className="bg-gradient-to-r from-[#0c2217] via-[#10291d] to-[#091b12] border-2 border-[#245237]/70 rounded-3xl p-6 sm:p-8 shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="p-2 bg-[#123121] border border-[#2b6443] rounded-xl text-lg">
              📖
            </span>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-black uppercase tracking-wider text-[#fffdf7]">
                Rena's Hobbies
              </h3>
              <p className="text-xs font-mono text-[#a8e6cf]/80">
                idk, tbh i don't even have any of them
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#c0e3cd] mb-5 font-medium leading-relaxed max-w-xl">
            Quiet moments captured with pen and ink beneath the canopy of ancient
            willows.
          </p>

          {/* Strictly maps renaData.hobbies from data.ts */}
          <div className="flex flex-wrap gap-3">
            {renaData.hobbies && renaData.hobbies.length > 0 ? (
              renaData.hobbies.map((hobby, i) => (
                <div
                  key={i}
                  className="px-5 py-2.5 bg-[#122e20]/90 border border-[#2e6645] hover:border-[#ffe082] rounded-2xl shadow-md font-mono font-bold text-sm sm:text-base text-[#e8f7ee] flex items-center gap-2.5 hover:translate-y-0.5 transition-all"
                >
                  <span className="text-[#ffe082]">✦</span>
                  <span>{hobby}</span>
                </div>
              ))
            ) : (
              <span className="font-mono text-xs text-[#a8e6cf]/60 italic">
                No hobbies recorded yet.
              </span>
            )}
          </div>
        </section>

        {/* ============================================================
            SECTION 3: THE FAIRY NOOK — FAE GUIDE
            This is where the customized FAE character lives!
            ============================================================ */}
        <section className="bg-gradient-to-br from-[#0e271a] via-[#133323] to-[#0a1c13] border-2 border-[#2c6142]/70 rounded-3xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Customized Fae Companion Stage */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-3xl border-2 border-[#387a55] bg-gradient-to-b from-[#0b1c13] to-[#122d20] shadow-[inset_0_0_30px_rgba(0,0,0,0.6),0_10px_25px_rgba(0,0,0,0.5)] p-3 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <FaeCharacter outfit={outfit} priority={true} animate={true} />
                </div>
                {/* Badge */}
                <div className="absolute top-2.5 left-2.5 bg-[#07140d]/90 border border-[#2e6443] text-[#a8e6cf] font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                  ✨ FAE LUMINELLE
                </div>
              </div>
              <span className="mt-2.5 text-xs font-mono text-[#a8e6cf]/80 text-center">
                {outfit.isCustom
                  ? "Dressed in your personal fairy styling"
                  : "Classic Garden Fairy Appearance"}
              </span>
            </div>

            {/* Right: Fairy Guide Dialogue & Actions */}
            <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#133222] border border-[#a8e6cf]/40 rounded-full font-mono text-xs font-bold text-[#a8e6cf] mb-2.5">
                <Sparkles size={12} className="text-[#ffe082] animate-spin" />
                <span>FAIRY GUIDE STATION</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#fffdf7] tracking-tight mb-2">
                Fae Luminelle, Guide of the Glade
              </h3>

              <p className="text-xs sm:text-sm text-[#c0e3cd] mb-4 font-medium leading-relaxed">
                Fae is your enchanted companion through Rena&apos;s secret garden.
                She watches over the blossoming flowers, whispers secrets from
                the canopy, and accompanies your journey.
              </p>

              <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                <button
                  type="button"
                  onClick={onChangeOutfit}
                  className="px-4 py-2 bg-[#1b4630] hover:bg-[#256142] text-[#ffe082] border border-[#3b7e57] hover:border-[#ffe082] rounded-xl font-mono font-bold text-xs uppercase shadow-md hover:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>👗 Change Fae&apos;s Outfit</span>
                </button>

                <button
                  type="button"
                  onClick={() => soundEngine.playSparkle()}
                  className="px-4 py-2 bg-[#0e261a] hover:bg-[#163a28] text-[#a8e6cf] border border-[#285b3d] hover:border-[#ffe082] rounded-xl font-mono font-bold text-xs shadow-sm hover:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>✨ Greet Fae</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 4: ENCHANTED SPRING — SPOTIFY EMBED
            ============================================================ */}
        {renaData.spotifyTrackUri && (
          <section className="bg-gradient-to-r from-[#0b2016] via-[#0f291c] to-[#081810] border-2 border-[#245237]/70 rounded-3xl p-6 sm:p-8 shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-[#123121] border border-[#2b6443] rounded-xl text-lg">
                  🎵
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-black uppercase tracking-wider text-[#fffdf7]">
                    Enchanted Stream // Favorite Track
                  </h3>
                  <p className="text-xs font-mono text-[#a8e6cf]/80">
                    Rena&apos;s melodic sanctuary on Spotify
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 bg-[#0a1e13] border border-[#1db954]/60 rounded-full text-xs font-mono font-bold text-[#1db954] flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#1db954] animate-ping" />
                <span>STREAMING AUDIO</span>
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#2b5d3e] shadow-[0_8px_25px_rgba(0,0,0,0.6)] bg-black">
              <SpotifyEmbed
                trackUri={renaData.spotifyTrackUri}
                isOpen={isOpenModal}
              />
            </div>
          </section>
        )}

        {/* ============================================================
            SECTION 5: FAIRY WISHING WELL
            Interactive secret garden fortune generator
            ============================================================ */}
        <section className="bg-gradient-to-br from-[#0c2318] via-[#102d1e] to-[#081811] border-2 border-[#265539]/70 rounded-3xl p-6 sm:p-8 shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="p-2 bg-[#123121] border border-[#2b6443] rounded-xl text-lg">
              🪙
            </span>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-black uppercase tracking-wider text-[#fffdf7]">
                Fairy Wishing Well
              </h3>
              <p className="text-xs font-mono text-[#a8e6cf]/80">
                Toss a copper coin into the clear garden waters
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#c0e3cd] mb-4 font-medium leading-relaxed max-w-xl">
            Legend tells that a whisper to the waters of the secret garden will
            bring good fortune and inspiration to passing wanderers.
          </p>

          <div className="min-h-[90px] bg-[#06140d]/90 border border-[#265338] rounded-2xl p-4 shadow-inner flex items-center justify-center text-center mb-5">
            {isWishing ? (
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#ffe082] animate-pulse">
                <Sparkles size={16} className="animate-spin" />
                <span>The spring waters are rippling with starlight...</span>
              </div>
            ) : wishResult ? (
              <p className="font-serif font-bold text-sm sm:text-base text-[#ffe082] drop-shadow-sm">
                &ldquo;{wishResult}&rdquo;
              </p>
            ) : (
              <p className="font-mono text-xs text-[#a8e6cf]/70 italic">
                Cast a wish below to hear the whisper of the garden spirits!
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleMakeWish}
              disabled={isWishing}
              className="py-3.5 px-8 bg-gradient-to-r from-[#205739] via-[#327a51] to-[#225b3c] hover:from-[#2a7049] hover:to-[#38885b] text-[#fffdf7] border-2 border-[#ffe082] rounded-2xl font-serif font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(50,122,81,0.5)] hover:shadow-[0_0_35px_rgba(255,224,130,0.4)] hover:translate-y-0.5 active:translate-y-1 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles size={16} className="text-[#ffe082]" />
              <span>Make a Garden Wish ✨</span>
            </button>
          </div>
        </section>

        {/* ============================================================
            SECTION 6: GARDEN MESSENGER // CONNECT WITH RENA
            LinkedIn, CV, and Instagram Links
            ============================================================ */}
        <section className="bg-gradient-to-r from-[#0c2217] via-[#10291d] to-[#091b12] border-2 border-[#245237]/70 rounded-3xl p-6 sm:p-8 shadow-[0_12px_35px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-black uppercase tracking-wider text-[#fffdf7]">
              Connect with Rena
            </h3>
            <p className="text-xs sm:text-sm text-[#c0e3cd] font-medium">
              Explore portfolio documents and network connections
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
            {renaData.instagramHandle && (
              <a
                href={`https://instagram.com/${renaData.instagramHandle.replace(
                  /^@/,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-[#122e20]/90 hover:bg-[#1c4430] text-[#cbf5dc] hover:text-[#ffe082] border border-[#2f6645] hover:border-[#ffe082] rounded-xl shadow-md hover:translate-y-0.5 font-mono font-bold text-xs uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>📸 @{renaData.instagramHandle.replace(/^@/, "")}</span>
                <ExternalLink size={13} />
              </a>
            )}

            {renaData.linkedinUrl && (
              <a
                href={
                  renaData.linkedinUrl.startsWith("http")
                    ? renaData.linkedinUrl
                    : `https://${renaData.linkedinUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-[#122e20]/90 hover:bg-[#1c4430] text-[#cbf5dc] hover:text-[#ffe082] border border-[#2f6645] hover:border-[#ffe082] rounded-xl shadow-md hover:translate-y-0.5 font-mono font-bold text-xs uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>LinkedIn</span>
                <ExternalLink size={13} />
              </a>
            )}

            {renaData.cvUrl && (
              <a
                href={
                  renaData.cvUrl.startsWith("http")
                    ? renaData.cvUrl
                    : `https://${renaData.cvUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-[#122e20]/90 hover:bg-[#1c4430] text-[#cbf5dc] hover:text-[#ffe082] border border-[#2f6645] hover:border-[#ffe082] rounded-xl shadow-md hover:translate-y-0.5 font-mono font-bold text-xs uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Curriculum Vitae</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </section>

        {/* Secret Garden Lore Signoff */}
        <footer className="text-center py-6 text-xs font-mono text-[#a8e6cf]/60 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span>🌿</span>
            <span>Created with starlight by Rena & Fae Luminelle</span>
            <span>🌸</span>
          </div>
          <span>Proxy Shakespeare · Pekan Ilkomerz 62 · IPB University</span>
        </footer>
      </main>
    </div>
  );
}
