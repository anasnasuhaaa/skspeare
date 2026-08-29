"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Volume2, VolumeX, Sparkles, FastForward, X } from "lucide-react";
import gsap from "gsap";

interface PokemonGuesserProps {
  onSuccess: () => void;
  onSkip: () => void;
  onClose?: () => void;
}

interface PokemonInfo {
  name: string;
  type: string;
  typeBadge: string;
  image: string;
  hint: string;
  colorTheme: {
    bg: string;
    border: string;
    shadow: string;
    badgeBg: string;
    badgeText: string;
    accentBg: string;
    particle: string;
  };
}

const POKEMON_LIST: PokemonInfo[] = [
  {
    name: "BULBASAUR",
    type: "Grass / Poison",
    typeBadge: "🌱 GRASS / POISON 🧪",
    image: "/asset/salman/bulbasaur.png",
    hint: "Pokemon katak dengan kuncup tanaman di punggungnya!",
    colorTheme: {
      bg: "from-[#103a27] via-[#0d281e] to-[#081a14]",
      border: "border-[#4ade80]",
      shadow: "shadow-[6px_6px_0px_#22c55e]",
      badgeBg: "bg-[#22c55e]",
      badgeText: "text-[#052e16]",
      accentBg: "bg-[#a855f7]",
      particle: "🍃",
    },
  },
  {
    name: "CHARMANDER",
    type: "Fire",
    typeBadge: "🔥 FIRE TYPE 🔥",
    image: "/asset/salman/charmander.png",
    hint: "Kadal oranye dengan api abadi di ujung ekornya!",
    colorTheme: {
      bg: "from-[#451205] via-[#2a0b03] to-[#170501]",
      border: "border-[#f97316]",
      shadow: "shadow-[6px_6px_0px_#ea580c]",
      badgeBg: "bg-[#f97316]",
      badgeText: "text-[#431407]",
      accentBg: "bg-[#ef4444]",
      particle: "🔥",
    },
  },
  {
    name: "PIKACHU",
    type: "Electric",
    typeBadge: "⚡ ELECTRIC TYPE ⚡",
    image: "/asset/salman/pikachu.png",
    hint: "Maskot Pokemon ikonik berwarna kuning dengan serangan petir!",
    colorTheme: {
      bg: "from-[#3f3103] via-[#261d02] to-[#140e01]",
      border: "border-[#facc15]",
      shadow: "shadow-[6px_6px_0px_#eab308]",
      badgeBg: "bg-[#facc15]",
      badgeText: "text-[#422006]",
      accentBg: "bg-[#3b82f6]",
      particle: "⚡",
    },
  },
];

// ============================================================
// 🔊 PROCEDURAL WEB AUDIO API SOUND ENGINE
// ============================================================
class PokemonSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // 1. Sound: Pokeball Shakes & Pop Open
  // TODO: Replace with custom audio file if desired (e.g., new Audio('/audio/pokeball-open.mp3'))
  playPokeballWobble() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch { }
  }

  // TODO: Replace with custom audio file if desired
  playPokeballOpen() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Laser/beam chirp
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);

      // Energy burst sparkle chime
      [880, 1174, 1480, 1760].forEach((freq, idx) => {
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = "triangle";
        chime.frequency.setValueAtTime(freq, now + 0.1 + idx * 0.04);
        chimeGain.gain.setValueAtTime(0.2, now + 0.1 + idx * 0.04);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        chime.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chime.start(now + 0.1 + idx * 0.04);
        chime.stop(now + 0.42);
      });
    } catch { }
  }

  // 2. Sound: Correct Answer Chime
  // TODO: Replace with custom audio file if desired
  playCorrect() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Cheerful rising 4-note major arpeggio (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.07;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch { }
  }

  // 3. Sound: Wrong Answer Buzz
  // TODO: Replace with custom audio file if desired
  playWrong() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "sawtooth";

      osc1.frequency.setValueAtTime(150, now);
      osc1.frequency.linearRampToValueAtTime(110, now + 0.25);

      osc2.frequency.setValueAtTime(156, now);
      osc2.frequency.linearRampToValueAtTime(116, now + 0.25);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch { }
  }

  // 4. Sound: 3-Stage Cleared / Level Up Fanfare
  // TODO: Replace with custom audio file if desired
  playVictoryFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Classic Pokemon fanfare sequence: G4, G4, G4, C5, E5, G5, E5, G5, C6
      const fanfare = [
        { f: 392.0, d: 0.1, t: 0 },
        { f: 392.0, d: 0.1, t: 0.11 },
        { f: 392.0, d: 0.1, t: 0.22 },
        { f: 523.25, d: 0.25, t: 0.34 },
        { f: 659.25, d: 0.2, t: 0.6 },
        { f: 783.99, d: 0.2, t: 0.8 },
        { f: 659.25, d: 0.15, t: 1.0 },
        { f: 783.99, d: 0.2, t: 1.15 },
        { f: 1046.5, d: 0.65, t: 1.35 },
      ];

      fanfare.forEach(({ f, d, t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(0.35, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } catch { }
  }
}

export default function PokemonGuesser({
  onSuccess,
  onSkip,
  onClose,
}: PokemonGuesserProps) {
  // Phase states: 'pokeball' | 'guessing' | 'success'
  const [phase, setPhase] = useState<"pokeball" | "guessing" | "success">("pokeball");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [pokeballOpened, setPokeballOpened] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const soundEngineRef = useRef<PokemonSoundEngine>(new PokemonSoundEngine());
  const inputRef = useRef<HTMLInputElement>(null);
  const pokeballRef = useRef<HTMLDivElement>(null);
  const pokemonImgRef = useRef<HTMLDivElement>(null);
  const letterBoxesRef = useRef<HTMLDivElement>(null);

  const currentPokemon = POKEMON_LIST[currentIdx];

  // Sync mute
  useEffect(() => {
    soundEngineRef.current.enabled = !soundMuted;
  }, [soundMuted]);

  // Focus input automatically whenever guessing
  useEffect(() => {
    if (phase === "guessing") {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [phase, currentIdx]);

  // Ensure image transform resets when changing question
  useEffect(() => {
    if (pokemonImgRef.current) {
      gsap.set(pokemonImgRef.current, { y: 0, scale: 1, clearProps: "transform" });
    }
  }, [currentIdx, phase]);

  // Pokeball Animation Sequence
  useEffect(() => {
    if (phase !== "pokeball" || !pokeballRef.current) return;

    const el = pokeballRef.current;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial bounce in
      tl.fromTo(
        el,
        { scale: 0.4, opacity: 0, y: -40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.8)" }
      );

      // 3 Wobbles (Shake left & right) with SFX
      [1, 2, 3].forEach(() => {
        tl.to(el, {
          rotation: -18,
          duration: 0.12,
          ease: "power1.inOut",
          onStart: () => soundEngineRef.current.playPokeballWobble(),
        })
          .to(el, { rotation: 18, duration: 0.12, ease: "power1.inOut" })
          .to(el, { rotation: 0, duration: 0.12, ease: "power1.inOut" })
          .to({}, { duration: 0.25 }); // brief pause
      });

      // Pokeball Open / Explode Burst
      tl.add(() => {
        setPokeballOpened(true);
        soundEngineRef.current.playPokeballOpen();
      })
        .to(el, {
          scale: 1.2,
          duration: 0.3,
          ease: "power2.out",
        })
        .to({}, { duration: 0.8 })
        .add(() => {
          setPhase("guessing");
        });
    });

    return () => ctx.revert();
  }, [phase]);

  // Handle Guess Submission
  const handleCheckAnswer = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (phase !== "guessing" || isCorrect || isWrong) return;

      const trimmed = inputVal.trim().toUpperCase();

      if (trimmed === currentPokemon.name) {
        // Correct Answer
        setIsCorrect(true);
        soundEngineRef.current.playCorrect();

        // Animate pokemon jump (3 repeats = 4 cycles so it lands back at y: 0, scale: 1)
        if (pokemonImgRef.current) {
          gsap.fromTo(
            pokemonImgRef.current,
            { y: 0, scale: 1 },
            {
              y: -14,
              scale: 1.06,
              duration: 0.18,
              yoyo: true,
              repeat: 3,
              ease: "power1.out",
              onComplete: () => {
                if (pokemonImgRef.current) {
                  gsap.set(pokemonImgRef.current, { y: 0, scale: 1, clearProps: "transform" });
                }
              },
            }
          );
        }

        setTimeout(() => {
          setIsCorrect(false);
          setInputVal("");
          setShowHint(false);

          if (pokemonImgRef.current) {
            gsap.set(pokemonImgRef.current, { y: 0, scale: 1, clearProps: "transform" });
          }

          if (currentIdx + 1 < POKEMON_LIST.length) {
            // Next Pokemon
            setCurrentIdx((prev) => prev + 1);
          } else {
            // All 3 Pokemon Correct!
            setPhase("success");
            soundEngineRef.current.playVictoryFanfare();
            setTimeout(() => {
              onSuccess();
            }, 1600);
          }
        }, 1100);
      } else {
        // Wrong Answer
        setIsWrong(true);
        soundEngineRef.current.playWrong();

        // Shake letter boxes
        if (letterBoxesRef.current) {
          gsap.fromTo(
            letterBoxesRef.current,
            { x: -12 },
            {
              x: 12,
              duration: 0.07,
              repeat: 5,
              yoyo: true,
              ease: "power1.inOut",
              onComplete: () => {
                gsap.set(letterBoxesRef.current, { x: 0 });
                setIsWrong(false);
                setInputVal("");
                inputRef.current?.focus();
              },
            }
          );
        } else {
          setTimeout(() => {
            setIsWrong(false);
            setInputVal("");
            inputRef.current?.focus();
          }, 450);
        }
      }
    },
    [phase, isCorrect, isWrong, inputVal, currentPokemon, currentIdx, onSuccess]
  );

  // Keyboard navigation & direct typing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCheckAnswer();
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="relative w-full flex flex-col items-center justify-between text-white select-none bg-[#090e17] overflow-hidden"
    >
      {/* Top Pokemon Arcade Header */}
      <div className="w-full flex items-center justify-between gap-2 p-3 sm:p-4 bg-[#0c121e] border-b-4 border-nb-black z-20">
        {/* Left: Progress Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-nb-red border-2 border-nb-black px-2.5 sm:px-3 py-1 rounded-lg font-mono font-black text-xs sm:text-sm text-white shadow-[2px_2px_0px_var(--nb-black)]">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>POKÉ-GATEWAY</span>
          </div>

          {/* 3 Poke Indicator Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {POKEMON_LIST.map((poke, idx) => (
              <div
                key={poke.name}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-nb-black flex items-center justify-center font-mono font-black text-[10px] sm:text-xs transition-all duration-300 ${idx < currentIdx || (idx === currentIdx && isCorrect)
                  ? "bg-nb-lime text-nb-black scale-110 shadow-[2px_2px_0px_var(--nb-black)]"
                  : idx === currentIdx
                    ? "bg-nb-yellow text-nb-black animate-bounce shadow-[2px_2px_0px_var(--nb-black)]"
                    : "bg-[#1e293b] text-white/40 opacity-60"
                  }`}
                title={poke.name}
              >
                {idx < currentIdx || (idx === currentIdx && isCorrect) ? "✓" : idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Audio Toggle & Skip Button */}
        <div className="flex items-center gap-2">
          {/* Mute SFX */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSoundMuted(!soundMuted);
            }}
            className="p-1.5 sm:px-2.5 sm:py-1 bg-nb-white hover:bg-nb-yellow text-nb-black border-2 border-nb-black rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-[2px_2px_0px_var(--nb-black)]"
            title={soundMuted ? "Unmute sound" : "Mute sound"}
          >
            {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span className="hidden sm:inline">{soundMuted ? "MUTED" : "SFX"}</span>
          </button>

          {/* Accessible Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSkip();
            }}
            className="px-2.5 sm:px-3.5 py-1 bg-nb-pink hover:bg-nb-lime text-nb-black font-display font-black text-xs uppercase border-2 border-nb-black rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-0.5 hover:translate-y-0.5"
            title="Lewati tebak-tebakan dan langsung buka profil Salman"
          >
            <FastForward size={13} strokeWidth={2.5} />
            <span>Lewati</span>
          </button>

          {/* Close Button */}
          {onClose && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 bg-nb-red hover:bg-nb-yellow text-white hover:text-nb-black border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center justify-center transition-all cursor-pointer"
              title="Tutup Modal"
              aria-label="Tutup modal"
            >
              <X size={16} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* ============================================================
          STAGE 1: POKEBALL OPENING SEQUENCE
          ============================================================ */}
      {phase === "pokeball" && (
        <div className="w-full min-h-95 sm:min-h-115 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-radial from-[#1e293b] via-[#0f172a] to-[#020617]">
          {/* Background Radial Light Rays */}
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${pokeballOpened ? "opacity-100 scale-125" : "opacity-0 scale-75"
              }`}
          >
            <div className="w-96 h-96 rounded-full bg-linear-to-r from-nb-yellow/30 via-nb-lime/20 to-transparent blur-3xl animate-spin duration-3000" />
          </div>

          <div ref={pokeballRef} className="relative z-10 flex flex-col items-center">
            {/* SVG Neobrutalist Pokeball */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-nb-black shadow-[8px_8px_0px_var(--nb-black)] overflow-hidden bg-white flex flex-col justify-between">
              {/* Top Red Half */}
              <div
                className={`w-full h-1/2 bg-[#ef4444] border-b-4 border-nb-black transition-transform duration-500 ${pokeballOpened ? "-translate-y-6 opacity-80" : ""
                  }`}
              />

              {/* Bottom White Half */}
              <div
                className={`w-full h-1/2 bg-[#ffffff] border-t-4 border-nb-black transition-transform duration-500 ${pokeballOpened ? "translate-y-6 opacity-80" : ""
                  }`}
              />

              {/* Center Center Button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white border-4 border-nb-black shadow-[2px_2px_0px_var(--nb-black)] flex items-center justify-center transition-all ${pokeballOpened ? "scale-125 bg-nb-yellow shadow-[0_0_20px_#facc15]" : ""
                    }`}
                >
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-nb-black transition-colors ${pokeballOpened ? "bg-white animate-ping" : "bg-[#f1f5f9]"
                      }`}
                  />
                </div>
              </div>
            </div>

            {/* Pokeball Label */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 bg-nb-yellow text-nb-black border-2 border-nb-black rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_var(--nb-black)]">
              <Sparkles size={14} className="animate-spin" />
              <span>
                {pokeballOpened ? "💥 POKÉMON MUNCUL! 💥" : "MEMBUKA POKÉBALL..."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          STAGE 2: GUESSING POKEMON (Bulbasaur → Charmander → Pikachu)
          ============================================================ */}
      {phase === "guessing" && (
        <div
          className={`w-full min-h-95 sm:min-h-115 flex-1 flex flex-col items-center justify-between p-3.5 sm:p-5 md:p-6 bg-linear-to-b ${currentPokemon.colorTheme.bg} relative transition-all duration-500`}
        >
          {/* Subtle Elemental Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
            <span className="absolute top-4 left-6 text-2xl animate-bounce">
              {currentPokemon.colorTheme.particle}
            </span>
            <span className="absolute top-12 right-8 text-xl animate-pulse">
              {currentPokemon.colorTheme.particle}
            </span>
            <span className="absolute bottom-8 left-10 text-xl animate-bounce">
              {currentPokemon.colorTheme.particle}
            </span>
            <span className="absolute bottom-12 right-6 text-2xl animate-pulse">
              {currentPokemon.colorTheme.particle}
            </span>
          </div>

          {/* Pokemon Header & Elemental Badge */}
          <div className="relative z-10 flex flex-col items-center gap-1 text-center shrink-0 mb-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-0.5 rounded-full border-2 border-nb-black font-display font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_var(--nb-black)] ${currentPokemon.colorTheme.badgeBg} ${currentPokemon.colorTheme.badgeText}`}
              >
                {currentPokemon.typeBadge}
              </span>
              <span className="bg-nb-black border border-white/30 text-white font-mono text-[9px] sm:text-xs font-bold px-2 py-0.5 rounded-md">
                NO. 0{currentIdx + 1} / 03
              </span>
            </div>

          </div>
          <h3 className="text-base sm:text-xl md:text-2xl font-display font-black uppercase text-white tracking-wide drop-shadow-[2px_2px_0px_var(--nb-black)] mt-0.5">
            Siapakah Nama Pokémon Ini?
          </h3>
          {/* Pokemon Image Display Frame */}
          <div
            ref={pokemonImgRef}
            className={`relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 my-1 sm:my-2 rounded-2xl border-4 border-nb-black p-2 bg-black/40 backdrop-blur-xs flex items-center justify-center shrink-0 ${currentPokemon.colorTheme.shadow} transition-all duration-300`}
          >
            {/* Elemental Corner Accents */}
            <div className="absolute -top-2 -left-2 w-4 h-4 sm:w-5 sm:h-5 bg-nb-yellow border-2 border-nb-black rounded-md flex items-center justify-center text-[9px] sm:text-[10px] text-nb-black font-black">
              ★
            </div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-nb-yellow border-2 border-nb-black rounded-md flex items-center justify-center text-[9px] sm:text-[10px] text-nb-black font-black">
              ★
            </div>

            <div className="relative w-full h-full">
              <Image
                src={currentPokemon.image}
                alt={`Pokemon Guess #${currentIdx + 1}`}
                fill
                sizes="(max-width: 640px) 112px, 160px"
                className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] filter transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Wordle-Style Letter Boxes */}
          <div className="w-full flex flex-col items-center gap-3 relative z-10">
            {/* Hidden auto-focus input */}
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
                if (val.length <= currentPokemon.name.length) {
                  setInputVal(val);
                }
              }}
              onKeyDown={handleKeyDown}
              maxLength={currentPokemon.name.length}
              className="sr-only"
              aria-label="Ketik jawaban nama pokemon"
            />

            {/* Letter Boxes Container */}
            <div
              ref={letterBoxesRef}
              onClick={() => inputRef.current?.focus()}
              className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 max-w-full flex-wrap cursor-text"
            >
              {Array.from({ length: currentPokemon.name.length }).map((_, i) => {
                const char = inputVal[i] || "";
                const isCurrent = i === inputVal.length;

                return (
                  <div
                    key={i}
                    className={`w-7 h-9 sm:w-9 sm:h-11 md:w-10 md:h-13 rounded-lg sm:rounded-xl border-[2.5px] sm:border-[3px] border-nb-black flex items-center justify-center font-display font-black text-base sm:text-xl md:text-2xl transition-all duration-150 ${isCorrect
                      ? "bg-nb-lime text-nb-black scale-105 shadow-[2px_2px_0px_var(--nb-black)]"
                      : isWrong
                        ? "bg-nb-red text-white shadow-[2px_2px_0px_var(--nb-black)]"
                        : char
                          ? "bg-nb-white text-nb-black shadow-[3px_3px_0px_var(--nb-black)] scale-102"
                          : isCurrent
                            ? "bg-black/60 border-nb-yellow text-nb-yellow shadow-[0_0_8px_#facc15] animate-pulse"
                            : "bg-black/30 border-white/20 text-white/30"
                      }`}
                  >
                    {char || (isCurrent ? "_" : "")}
                  </div>
                );
              })}
            </div>

            {/* Control & Submit Buttons */}
            <div className="flex items-center gap-2 mt-1">
              {/* Submit Button */}
              <button
                type="button"
                onClick={() => handleCheckAnswer()}
                disabled={inputVal.length === 0 || isCorrect || isWrong}
                className="px-5 py-2 sm:px-6 sm:py-2.5 bg-nb-lime hover:bg-nb-yellow disabled:opacity-40 disabled:hover:bg-nb-lime text-nb-black font-display font-black text-xs sm:text-sm uppercase border-[2.5px] border-nb-black rounded-xl shadow-[3px_3px_0px_var(--nb-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Submit (Enter)</span>
                <span>⚡</span>
              </button>

              {/* Hint Toggle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(!showHint);
                }}
                className="px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-white/90 font-mono font-bold text-xs border-2 border-nb-black rounded-xl shadow-[2px_2px_0px_var(--nb-black)] cursor-pointer transition-all"
                title="Buka petunjuk"
              >
                💡 Hint
              </button>
            </div>

            {/* Hint Display */}
            {showHint && (
              <div className="mt-1 px-3 py-1.5 bg-nb-yellow text-nb-black border-2 border-nb-black rounded-xl font-mono text-xs font-bold text-center max-w-sm animate-in fade-in zoom-in-95 duration-150 shadow-[2px_2px_0px_var(--nb-black)]">
                {currentPokemon.hint}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          STAGE 3: SUCCESS / GATEWAY UNLOCKED
          ============================================================ */}
      {phase === "success" && (
        <div className="w-full min-h-95 sm:min-h-115 flex flex-col items-center justify-center p-6 text-center bg-radial from-[#14532d] via-[#052e16] to-[#020617] animate-in zoom-in-90 duration-300">
          <div className="px-6 sm:px-10 py-6 bg-nb-yellow border-4 border-nb-black rounded-2xl sm:rounded-3xl shadow-[8px_8px_0px_var(--nb-black)] text-nb-black transform -rotate-1 max-w-md">
            <div className="text-4xl sm:text-5xl font-display font-black mb-1">
              🎉 GOTCHA! 🎉
            </div>
            <p className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-nb-black mb-3">
              3 Pokémon Berhasil Ditebak!
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-nb-lime border-2 border-nb-black rounded-lg font-mono text-xs font-black">
              <span>🔓 Membuka Kartu Salman Al Farizi...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

