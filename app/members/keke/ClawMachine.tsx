"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Press_Start_2P } from "next/font/google";
import { Volume2, VolumeX, FastForward, Sparkles, Coins } from "lucide-react";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface ClawMachineProps {
  onSuccess: () => void;
  onSkip: () => void;
}

// ============================================================
// 🔊 8-BIT PROCEDURAL CHIPTUNE SOUND ENGINE (Web Audio API)
// Self-contained, instant, retro NES/Arcade synthesizer
// ============================================================
class PixelSoundEngine {
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

  // 1. Button Press / Insert Coin (Crisp 8-bit 2-tone chime)
  playStart() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "square";
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.36);
    } catch { }
  }

  // 2. Crane Motor Moving (Stepped 8-bit pulse)
  playMove() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.12;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(180 + (i % 2) * 40, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
      }
    } catch { }
  }

  // 3. Claw Dropping Down (Descending pitch glide)
  playClawDown() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.7);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.76);
    } catch { }
  }

  // 4. Claw Grab / Mechanical Click
  playGrab() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.setValueAtTime(780, now + 0.04);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch { }
  }

  // 5. Doll Slip / Wobble (Bouncy descending slip)
  playSlip() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.1);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch { }
  }

  // 6. Fail SFX (Classic retro sad 8-bit game over wah-wah-wah)
  playFail() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [311.13, 293.66, 277.18, 246.94]; // Eb4, D4, Db4, B3
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.14;
        const duration = idx === notes.length - 1 ? 0.45 : 0.13;
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
      });
    } catch { }
  }

  // 7. Victory Fanfare SFX (Triumphant 8-bit chiptune victory arpeggio)
  playVictory() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const fanfare = [
        { f: 523.25, d: 0.1 }, // C5
        { f: 659.25, d: 0.1 }, // E5
        { f: 783.99, d: 0.1 }, // G5
        { f: 1046.5, d: 0.15 }, // C6
        { f: 880.0, d: 0.1 }, // A5
        { f: 1046.5, d: 0.1 }, // C6
        { f: 1318.51, d: 0.5 }, // E6
      ];

      let offset = 0;
      fanfare.forEach((n, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + offset;
        osc.type = idx % 2 === 0 ? "square" : "triangle";
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.26, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + n.d + 0.03);
        offset += n.d * 0.85;
      });
    } catch { }
  }

  // 8. Prize Drop / Dispense Sound
  playPrizeDrop() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch { }
  }
}

// Pre-defined Doll Pile Layout for the Claw Machine Prize Pit
const DOLL_PILE = [
  { id: 2, src: "/asset/keke/2.png", x: 18, y: 74, rot: -8, scale: 0.95 },
  { id: 3, src: "/asset/keke/3.png", x: 30, y: 78, rot: 12, scale: 1.0 },
  { id: 4, src: "/asset/keke/4.png", x: 42, y: 72, rot: -5, scale: 0.95 },
  { id: 5, src: "/asset/keke/5.png", x: 55, y: 76, rot: 15, scale: 1.05 },
  { id: 6, src: "/asset/keke/6.png", x: 68, y: 73, rot: -12, scale: 0.9 },
  { id: 7, src: "/asset/keke/7.png", x: 80, y: 77, rot: 8, scale: 1.0 },
  { id: 8, src: "/asset/keke/8.png", x: 24, y: 82, rot: 6, scale: 1.0 },
  { id: 9, src: "/asset/keke/9.png", x: 62, y: 81, rot: -10, scale: 0.95 },
  { id: 10, src: "/asset/keke/10.png", x: 74, y: 84, rot: 14, scale: 0.9 },
  // Target Winner Prize (Doll #1) placed prominently in center
  { id: 1, src: "/asset/keke/1.png", x: 48, y: 70, rot: 0, scale: 1.15, isTarget: true },
];

export default function ClawMachine({ onSuccess, onSkip }: ClawMachineProps) {
  // Game States: attempt 1 | 2 | 3
  const [attempt, setAttempt] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("MASUKKAN KOIN & TEKAN TOMBOL START!");
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Claw Physics & Coordinates (% based)
  const [clawX, setClawX] = useState<number>(20); // 12% (chute) to 75%
  const [clawY, setClawY] = useState<number>(10); // 10% (top) to 60% (grab depth)
  const [clawOpen, setClawOpen] = useState<boolean>(true); // true = open, false = closed clamp
  const [heldDoll, setHeldDoll] = useState<{ id: number; src: string } | null>(null);
  const [fallingDoll, setFallingDoll] = useState<{ x: number; y: number; src: string } | null>(null);
  const [prizeWon, setPrizeWon] = useState<boolean>(false);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);

  // Dynamic particle sparks for arcade juice
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; char: string; color: string }[]
  >([]);

  const soundEngineRef = useRef<PixelSoundEngine>(new PixelSoundEngine());

  // Sync Mute state
  useEffect(() => {
    soundEngineRef.current.enabled = !soundMuted;
  }, [soundMuted]);

  // Particle emission helper
  const triggerParticles = useCallback((x: number, y: number, count = 6) => {
    const newItems = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: Math.max(5, Math.min(95, x + (Math.random() * 14 - 7))),
      y: Math.max(5, Math.min(90, y + (Math.random() * 12 - 6))),
      char: ["✦", "★", "◆", "▲", "●"][i % 5],
      color: ["#facc15", "#f43f5e", "#38bdf8", "#4ade80", "#c084fc"][i % 5],
    }));
    setParticles((prev) => [...prev, ...newItems]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newItems.some((n) => n.id === p.id)));
    }, 650);
  }, []);

  // Execute Scripted Attempt Logic
  const handleStart = useCallback(() => {
    if (isPlaying || prizeWon) return;

    setIsPlaying(true);
    soundEngineRef.current.playStart();
    triggerParticles(50, 85, 8);

    if (attempt === 1) {
      // ============================================================
      // 🎮 SCRIPTED ATTEMPT 1: DELIBERATE MISS / FAIL
      // ============================================================
      setStatusMessage("PERCOBAAN 1: CAPIT BERGERAK...");
      soundEngineRef.current.playMove();

      // Step 1: Move claw across to target X (e.g., 38%)
      setClawOpen(true);
      setClawX(38);
      triggerParticles(38, 15, 4);

      setTimeout(() => {
        // Step 2: Drop claw down
        setStatusMessage("MENURUNKAN CAPIT...");
        soundEngineRef.current.playClawDown();
        setClawY(58);
        triggerParticles(38, 40, 5);

        setTimeout(() => {
          // Step 3: Claw closes on empty space / misses
          setStatusMessage("MENCOBA MENCAPIT...");
          soundEngineRef.current.playGrab();
          setClawOpen(false);
          triggerParticles(38, 60, 8);

          setTimeout(() => {
            // Step 4: Retract empty claw up
            soundEngineRef.current.playClawDown();
            setClawY(10);

            setTimeout(() => {
              // Step 5: Return claw to home & play Fail SFX
              setClawX(20);
              setClawOpen(true);
              soundEngineRef.current.playFail();
              setStatusMessage("YAH MELESET! JANGAN MENYERAH, COBA LAGI! (1/3 GAGAL)");
              setAttempt(2);
              setIsPlaying(false);
            }, 800);
          }, 600);
        }, 800);
      }, 700);
    } else if (attempt === 2) {
      // ============================================================
      // 🎮 SCRIPTED ATTEMPT 2: GRABS DOLL BUT SLIPS MIDWAY
      // ============================================================
      setStatusMessage("PERCOBAAN 2: CAPIT BERGERAK KE BONEKA...");
      soundEngineRef.current.playMove();

      // Step 1: Move claw to Doll #9 position (65%)
      setClawOpen(true);
      setClawX(65);
      triggerParticles(65, 15, 4);

      setTimeout(() => {
        // Step 2: Drop claw down
        setStatusMessage("MENURUNKAN CAPIT...");
        soundEngineRef.current.playClawDown();
        setClawY(62);
        triggerParticles(65, 45, 6);

        setTimeout(() => {
          // Step 3: Claw grabs doll #9
          setStatusMessage("BONEKA TERCAPIT!");
          soundEngineRef.current.playGrab();
          setClawOpen(false);
          setHeldDoll({ id: 9, src: "/asset/keke/9.png" });
          triggerParticles(65, 65, 10);

          setTimeout(() => {
            // Step 4: Lifts doll upward partly (to Y=38)
            setStatusMessage("MENGANGKAT BONEKA...");
            soundEngineRef.current.playClawDown();
            setClawY(38);
            triggerParticles(65, 38, 5);

            setTimeout(() => {
              // Step 5: Doll slips & falls back down!
              soundEngineRef.current.playSlip();
              setHeldDoll(null);
              setFallingDoll({ x: 65, y: 40, src: "/asset/keke/9.png" });
              triggerParticles(65, 42, 8);

              // Fall animation cleanup
              setTimeout(() => {
                setFallingDoll(null);
              }, 450);

              // Claw ascends to top empty
              setClawY(10);

              setTimeout(() => {
                // Step 6: Return claw to home & play Fail SFX
                setClawX(20);
                setClawOpen(true);
                soundEngineRef.current.playFail();
                setStatusMessage("ADUH LEPAS DI JALAN! SATU KESEMPATAN LAGI! (2/3 GAGAL)");
                setAttempt(3);
                setIsPlaying(false);
              }, 800);
            }, 600);
          }, 600);
        }, 800);
      }, 700);
    } else if (attempt === 3) {
      // ============================================================
      // 🎮 SCRIPTED ATTEMPT 3: PERFECT CATCH -> CHUTE -> WIN!
      // ============================================================
      setStatusMessage("PERCOBAAN 3 (FINAL): MEMBIDIK BONEKA EMAS...");
      soundEngineRef.current.playMove();

      // Step 1: Move claw directly above winner Doll #1 (50%)
      setClawOpen(true);
      setClawX(50);
      triggerParticles(50, 15, 6);

      setTimeout(() => {
        // Step 2: Drop claw down accurately onto doll #1
        setStatusMessage("MENURUNKAN CAPIT...");
        soundEngineRef.current.playClawDown();
        setClawY(58);
        triggerParticles(50, 45, 8);

        setTimeout(() => {
          // Step 3: Firmly clamp onto doll #1
          setStatusMessage("MENCAPIT KUAT BONEKA PIXEL!");
          soundEngineRef.current.playGrab();
          setClawOpen(false);
          setHeldDoll({ id: 1, src: "/asset/keke/1.png" });
          triggerParticles(50, 60, 12);

          setTimeout(() => {
            // Step 4: Ascend all the way to top holding doll securely
            setStatusMessage("MENGANGKAT BONEKA KE ATAS...");
            soundEngineRef.current.playClawDown();
            setClawY(10);
            triggerParticles(50, 15, 6);

            setTimeout(() => {
              // Step 5: Travel horizontally to Prize Chute (X = 14%)
              setStatusMessage("MEMBAWA BONEKA KE LUBANG HADIAH...");
              soundEngineRef.current.playMove();
              setClawX(14);
              triggerParticles(14, 15, 6);

              setTimeout(() => {
                // Step 6: Claw opens and drops doll!
                setStatusMessage("MENJATUHKAN HADIAH...");
                setClawOpen(true);
                setHeldDoll(null);
                setFallingDoll({ x: 14, y: 15, src: "/asset/keke/1.png" });
                soundEngineRef.current.playPrizeDrop();
                triggerParticles(14, 25, 12);

                setTimeout(() => {
                  setFallingDoll(null);
                  setPrizeWon(true);
                  setConfettiActive(true);
                  soundEngineRef.current.playVictory();
                  setStatusMessage("🏆 JACKPOT! BERHASIL MENDAPATKAN BONEKA!");

                  // Step 7: Transition to Pixel Profile Modal after victory celebration
                  setTimeout(() => {
                    onSuccess();
                  }, 1800);
                }, 500);
              }, 900);
            }, 800);
          }, 700);
        }, 800);
      }, 700);
    }
  }, [attempt, isPlaying, prizeWon, onSuccess, triggerParticles]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between text-white select-none bg-[#110920] font-mono p-2 sm:p-3 relative overflow-hidden">
      {/* Confetti Celebration Layer */}
      {confettiActive && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 animate-bounce"
              style={{
                left: `${(i * 3.1) % 100}%`,
                top: `${(i * 6.5) % 85}%`,
                backgroundColor: ["#facc15", "#f43f5e", "#38bdf8", "#4ade80", "#c084fc"][i % 5],
                boxShadow: "2px 2px 0px #000000",
                transform: `rotate(${i * 24}deg)`,
                animationDuration: `${0.55 + (i % 5) * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ============================================================
          TOP CABINET CROWN / MARQUEE (STEPPED PIXEL ROOF & STAGE TITLE)
          ============================================================ */}
      <div className="w-full flex flex-col items-center z-20 mb-1.5 sm:mb-2">
        {/* Stepped Pixel Arcade Crown */}
        <div className="w-3/4 max-w-sm h-2 bg-[#ff4081] border-t-4 border-x-4 border-black" />
        <div className="w-[92%] max-w-xl h-2 bg-[#ec4899] border-t-4 border-x-4 border-black" />

        {/* Main Marquee Board */}
        <div className="w-full bg-[#24133d] border-4 border-black shadow-[4px_4px_0px_#000000] p-2 sm:p-2.5 flex flex-col gap-1.5 relative overflow-hidden">
          {/* Subtle Top Marquee Bezel Highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 pointer-events-none" />

          {/* Top Bar with Stage Badge & Sound Controls */}
          <div className="w-full flex items-center justify-between gap-2">
            {/* Stage / Badge */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-yellow-400 border border-black animate-ping" />
              <div className="bg-[#ff4081] border-2 border-black px-2 sm:px-2.5 py-0.5 shadow-[2px_2px_0px_#000000] text-black font-black text-[10px] sm:text-xs tracking-wider uppercase flex items-center gap-1">
                <span>🕹️</span>
                <span>ARCADE STAGE 01</span>
              </div>
            </div>

            {/* Price Tag Decal */}
            <div className="hidden md:flex items-center gap-1 bg-[#150a26] border-2 border-yellow-400 px-2 py-0.5 text-yellow-300 font-mono text-[10px] font-black shadow-[2px_2px_0px_#000000]">
              <Coins size={12} className="text-yellow-400" />
              <span>🪙 1 KOIN / MAIN</span>
            </div>

            {/* Controls: Sound + Skip */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSoundMuted(!soundMuted)}
                className="p-1 sm:px-2 sm:py-0.5 bg-[#4ade80] hover:bg-[#86efac] text-black border-2 border-black font-bold text-[10px] sm:text-xs shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1"
                title={soundMuted ? "Unmute SFX" : "Mute SFX"}
              >
                {soundMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                <span className="hidden sm:inline">{soundMuted ? "MUTED" : "8-BIT SFX"}</span>
              </button>

              <button
                type="button"
                onClick={onSkip}
                className="px-2 sm:px-2.5 py-0.5 bg-[#facc15] hover:bg-[#fde047] text-black border-2 border-black font-black text-[10px] sm:text-xs uppercase shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1"
                title="Lewati mini-game langsung ke kartu profil"
              >
                <FastForward size={12} strokeWidth={2.5} />
                <span>Lewati</span>
              </button>
            </div>
          </div>

          {/* Prominent Arcade Stage Title Banner */}
          <div className="w-full flex items-center justify-center py-0.5">
            <div className="w-full bg-[#ff4081] border-2 border-black py-1.5 px-2 shadow-[3px_3px_0px_#000000] flex items-center justify-between gap-1 sm:gap-2">
              <span className="text-yellow-300 animate-pulse text-xs sm:text-sm">★</span>
              <h2
                className={`${pixelFont.className} text-[10px] sm:text-xs md:text-sm font-black text-white text-center tracking-wider uppercase drop-shadow-[2px_2px_0px_#000000] truncate`}
              >
                CLAW CRANE CHALLENGE: TANGKAP BONEKA PIXEL!
              </h2>
              <span className="text-yellow-300 animate-pulse text-xs sm:text-sm">★</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN CABINET SECTION (SIDE PILLARS + GLASS CHAMBER)
          ============================================================ */}
      <div className="w-full flex-1 flex gap-1 sm:gap-2 min-h-[260px] sm:min-h-[340px] md:min-h-[400px] relative">
        {/* Left Arcade Pillar / Bezel (Desktop/Tablet only) */}
        <div className="hidden sm:flex w-6 md:w-8 bg-[#1f1035] border-4 border-black shadow-[3px_3px_0px_#000000] flex-col justify-between items-center py-2 shrink-0 z-20">
          <div className="w-2.5 h-2.5 bg-[#ec4899] border border-black" />
          <div className="flex flex-col gap-1.5 items-center opacity-80">
            <span className="w-1.5 h-3 bg-yellow-400 border border-black" />
            <span className="w-1.5 h-3 bg-pink-500 border border-black" />
            <span className="w-1.5 h-3 bg-cyan-400 border border-black" />
            <span className="w-1.5 h-3 bg-yellow-400 border border-black" />
          </div>
          <div className="text-[7px] text-pink-400 font-bold rotate-90 tracking-tighter whitespace-nowrap">
            ★ CRANE ★
          </div>
          <div className="w-2.5 h-2.5 bg-[#38bdf8] border border-black" />
        </div>

        {/* Center Glass Chamber */}
        <div className="relative flex-1 bg-[#180e2e] border-3 sm:border-4 border-black shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] overflow-hidden flex flex-col justify-between p-2">
          {/* 1. CRT Scanlines Overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-20 opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.45) 2px, rgba(0, 0, 0, 0.45) 4px)",
            }}
          />

          {/* 2. Pixel Grid Glass Backdrop */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ec4899 1px, transparent 1px), linear-gradient(to bottom, #ec4899 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          {/* 3. Dynamic Particle Sparks (Arcade Juice) */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute z-40 pointer-events-none font-mono font-black text-xs sm:text-sm animate-ping"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                color: p.color,
                textShadow: "1px 1px 0px #000000",
              }}
            >
              {p.char}
            </div>
          ))}

          {/* Top Decorative Arcade Lights */}
          <div className="w-full flex justify-around items-center px-2 sm:px-4 py-0.5 sm:py-1 z-10">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((bulb) => (
              <div
                key={bulb}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 border border-black shadow-[1px_1px_0px_#000000] ${
                  bulb % 3 === 0
                    ? "bg-yellow-400 animate-pulse"
                    : bulb % 3 === 1
                    ? "bg-pink-500 animate-ping"
                    : "bg-cyan-400 animate-bounce"
                }`}
              />
            ))}
          </div>

          {/* Top Metal Gantry Rail */}
          <div className="relative w-full h-3.5 sm:h-4 bg-[#4a3b69] border-y-2 border-black flex items-center z-10">
            <div className="w-full h-1 bg-[#2b1f42]" />

            {/* Horizontal Motor Trolley */}
            <div
              className="absolute top-0 w-10 sm:w-12 h-3.5 sm:h-4 bg-[#facc15] border-2 border-black shadow-[2px_2px_0px_#000000] -translate-x-1/2 transition-all duration-300 flex items-center justify-center"
              style={{ left: `${clawX}%` }}
            >
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-red-500 border border-black" />
            </div>
          </div>

          {/* ============================================================
              MECHANICAL SUSPENSION CABLE & ARTICULATED CLAW
              ============================================================ */}
          <div
            className="absolute z-30 transition-all duration-500 pointer-events-none flex flex-col items-center"
            style={{
              left: `${clawX}%`,
              top: "32px",
              transform: "translateX(-50%)",
            }}
          >
            {/* Metal Wire / Cable */}
            <div
              className="w-1 bg-[#cbd5e1] border-x border-black transition-all duration-500"
              style={{
                height: `${(clawY / 100) * 280}px`,
              }}
            />

            {/* Claw Motor Housing (Pixel Box) */}
            <div className="w-7 sm:w-8 h-5 sm:h-6 bg-[#ec4899] border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center relative">
              <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-[#facc15] border border-black animate-spin" />

              {/* Left Articulated Claw Arm */}
              <div
                className="absolute -bottom-3.5 sm:-bottom-4 -left-1 w-2.5 sm:w-3 h-5 sm:h-6 bg-[#94a3b8] border-2 border-black origin-top transition-transform duration-200"
                style={{
                  transform: clawOpen ? "rotate(-30deg)" : "rotate(0deg)",
                }}
              >
                {/* Left Claw Hook Tip */}
                <div className="absolute -bottom-1.5 right-0 w-2 sm:w-2.5 h-1.5 sm:h-2 bg-[#facc15] border border-black" />
              </div>

              {/* Right Articulated Claw Arm */}
              <div
                className="absolute -bottom-3.5 sm:-bottom-4 -right-1 w-2.5 sm:w-3 h-5 sm:h-6 bg-[#94a3b8] border-2 border-black origin-top transition-transform duration-200"
                style={{
                  transform: clawOpen ? "rotate(30deg)" : "rotate(0deg)",
                }}
              >
                {/* Right Claw Hook Tip */}
                <div className="absolute -bottom-1.5 left-0 w-2 sm:w-2.5 h-1.5 sm:h-2 bg-[#facc15] border border-black" />
              </div>

              {/* HELD DOLL (When grabbed by claw) */}
              {heldDoll && (
                <div className="absolute -bottom-12 sm:-bottom-14 left-1/2 -translate-x-1/2 w-12 sm:w-14 h-12 sm:h-14 z-20 animate-wiggle">
                  <Image
                    src={heldDoll.src}
                    alt="Captured Doll"
                    width={56}
                    height={56}
                    className="w-full h-full object-contain drop-shadow-[2px_2px_0px_#000000]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* FALLING DOLL */}
          {fallingDoll && (
            <div
              className="absolute z-25 w-12 sm:w-14 h-12 sm:h-14 transition-all duration-300 animate-in fade-in"
              style={{
                left: `${fallingDoll.x}%`,
                top: `${fallingDoll.y}%`,
                transform: "translate(-50%, 0)",
              }}
            >
              <Image
                src={fallingDoll.src}
                alt="Falling Doll"
                width={56}
                height={56}
                className="w-full h-full object-contain drop-shadow-[2px_2px_0px_#000000]"
              />
            </div>
          )}

          {/* ============================================================
              DOLL PRIZE PIT (Stacked Plushies with Solid Pixel Shadows)
              ============================================================ */}
          <div className="relative w-full h-28 sm:h-34 md:h-36 z-15 flex items-end justify-center pointer-events-none">
            {DOLL_PILE.map((item) => {
              if (heldDoll && heldDoll.id === item.id) return null;

              return (
                <div
                  key={item.id}
                  className="absolute w-10 sm:w-12 md:w-14 h-10 sm:h-12 md:h-14 transition-transform flex flex-col items-center"
                  style={{
                    left: `${item.x}%`,
                    bottom: `${100 - item.y}%`,
                    transform: `translateX(-50%) rotate(${item.rot}deg) scale(${item.scale})`,
                  }}
                >
                  {/* Crown badge for target doll */}
                  {item.isTarget && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 border border-black px-1 py-0.2 text-[7px] sm:text-[8px] font-black text-black z-30 shadow-[1px_1px_0px_#000000] whitespace-nowrap">
                      ★ TARGET
                    </div>
                  )}

                  {/* Doll Image */}
                  <Image
                    src={item.src}
                    alt={`Pixel Doll ${item.id}`}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain relative z-10"
                  />

                  {/* Solid Pixel Shadow beneath doll */}
                  <div className="w-8 sm:w-10 h-1.5 sm:h-2 bg-black/80 border border-black -mt-1 rounded-none shadow-[1px_1px_0px_#000000]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Arcade Pillar / Bezel (Desktop/Tablet only) */}
        <div className="hidden sm:flex w-6 md:w-8 bg-[#1f1035] border-4 border-black shadow-[3px_3px_0px_#000000] flex-col justify-between items-center py-2 shrink-0 z-20">
          <div className="w-2.5 h-2.5 bg-[#38bdf8] border border-black" />
          <div className="flex flex-col gap-1.5 items-center opacity-80">
            <span className="w-1.5 h-3 bg-cyan-400 border border-black" />
            <span className="w-1.5 h-3 bg-pink-500 border border-black" />
            <span className="w-1.5 h-3 bg-yellow-400 border border-black" />
            <span className="w-1.5 h-3 bg-cyan-400 border border-black" />
          </div>
          <div className="text-[7px] text-cyan-400 font-bold -rotate-90 tracking-tighter whitespace-nowrap">
            ★ PIXEL ★
          </div>
          <div className="w-2.5 h-2.5 bg-[#ec4899] border border-black" />
        </div>
      </div>

      {/* ============================================================
          CONTROL DECK & RETRO LCD DASHBOARD (MOBILE OPTIMIZED)
          ============================================================ */}
      <div className="w-full bg-[#24133d] border-3 sm:border-4 border-black shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] p-2 sm:p-3 mt-1.5 sm:mt-2 z-20 flex flex-col gap-2">
        {/* Top Info Row: Attempt Heart Tokens & Retro CRT LCD Screen */}
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          {/* Heart / Coin Attempt Tracker */}
          <div className="bg-[#120a1f] border-2 border-black px-2.5 py-1.5 shadow-[2px_2px_0px_#000000] flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-[10px] sm:text-[11px] font-black text-yellow-400 flex items-center gap-1">
              <span>TOKEN:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-5 h-5 border-2 border-black flex items-center justify-center font-black text-[10px] ${
                    attempt >= num
                      ? "bg-[#ff4081] text-white shadow-[1px_1px_0px_#000000]"
                      : "bg-[#332247] text-gray-500"
                  }`}
                  title={`Percobaan ${num}`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Retro Pixel LCD Screen (HIDDEN ON MOBILE as requested) */}
          <div className="hidden sm:flex flex-1 w-full bg-[#05030a] border-2 border-[#4ade80] rounded-none px-3 py-1.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] items-center gap-2 overflow-hidden relative">
            <span className="w-2 h-2 bg-[#4ade80] animate-ping shrink-0" />
            <p className="text-[11px] sm:text-xs font-bold text-[#4ade80] truncate uppercase tracking-wider font-mono">
              {statusMessage}
            </p>
          </div>
        </div>

        {/* Bottom Control Row */}
        <div className="w-full flex items-center justify-between gap-2.5 sm:gap-4 pt-1 sm:border-t-2 sm:border-black/60">
          {/* Left Decorative Controls: Joystick + Coin Slot (HIDDEN ON MOBILE as requested) */}
          <div className="hidden sm:flex items-center gap-3 sm:gap-4 shrink-0">
            {/* 3D Pixel Joystick */}
            <div className="flex flex-col items-center" title="Joystick Crane">
              <div className="relative w-8 h-10 flex flex-col items-center justify-end">
                <div className="w-5 h-5 rounded-none bg-[#ef4444] border-2 border-black shadow-[2px_2px_0px_#000000] -mb-1 relative z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white/80" />
                </div>
                <div className="w-1.5 h-4 bg-[#cbd5e1] border-x border-black" />
                <div className="w-7 h-2 bg-[#1f1035] border-2 border-black shadow-[1px_1px_0px_#000000]" />
              </div>
              <span className="text-[8px] font-black text-pink-400 mt-0.5">STICK</span>
            </div>

            {/* Decorative Pixel Coin Slot */}
            <div className="bg-[#120a1f] border-2 border-black p-1.5 flex flex-col items-center shadow-[2px_2px_0px_#000000]">
              <div className="w-8 h-1 bg-yellow-400 border border-black animate-pulse mb-1" />
              <span className="text-[8px] font-black text-yellow-300 uppercase tracking-tighter">
                INSERT COIN ▾
              </span>
              <span className="text-[7px] text-white/60 font-mono">100¥ / 1 PLAY</span>
            </div>
          </div>

          {/* Center Main START Action Button */}
          <div className="flex-1 w-full flex items-center justify-center">
            <button
              type="button"
              onClick={handleStart}
              disabled={isPlaying || prizeWon}
              className={`w-full py-2.5 sm:py-3.5 px-3 sm:px-6 border-[3px] sm:border-4 border-black font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPlaying || prizeWon
                  ? "bg-gray-600 text-gray-400 opacity-60 cursor-not-allowed shadow-none"
                  : "bg-[#f43f5e] hover:bg-[#fb7185] text-white shadow-[3px_3px_0px_#000000] sm:shadow-[5px_5px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none hover:-translate-y-0.5"
              }`}
            >
              <span>🕹️</span>
              <span className="truncate">
                {isPlaying
                  ? "CAPIT SEDANG BERJALAN..."
                  : prizeWon
                  ? "🏆 MENANGKAN BONEKA!"
                  : attempt === 1
                  ? "[ PRESS START ] PERCOBAAN 1"
                  : attempt === 2
                  ? "[ PRESS START ] PERCOBAAN 2"
                  : "[ PRESS START ] PERCOBAAN TERAKHIR (3/3)"}
              </span>
            </button>
          </div>

          {/* Right Decorative Buttons (HIDDEN ON MOBILE) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-[#38bdf8] border-2 border-black shadow-[2px_2px_0px_#000000]" />
              <span className="text-[7px] text-white/70 font-bold mt-0.5">ACTION</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 bg-[#facc15] border-2 border-black shadow-[2px_2px_0px_#000000]" />
              <span className="text-[7px] text-white/70 font-bold mt-0.5">PUSH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cabinet Base Stand / Pedestal Legs (Hidden on mobile) */}
      <div className="hidden sm:flex w-full items-center justify-between px-6 pt-1 z-10">
        <div className="w-8 sm:w-12 h-2 sm:h-3 bg-[#0d071a] border-2 border-black shadow-[2px_2px_0px_#000000]" />
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-pink-500/60" />
          <span className="text-[8px] font-mono text-white/40 uppercase">ARCADE MODEL CRANE-88</span>
          <span className="w-1.5 h-1.5 bg-pink-500/60" />
        </div>
        <div className="w-8 sm:w-12 h-2 sm:h-3 bg-[#0d071a] border-2 border-black shadow-[2px_2px_0px_#000000]" />
      </div>
    </div>
  );
}

