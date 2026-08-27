"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Volume2,
  VolumeX,
  Crosshair,
  FastForward,
  Target,
  Info,
  Trophy,
  CheckCircle2,
} from "lucide-react";

interface ShootingRangeProps {
  onSuccess: () => void;
  onSkip: () => void;
}

interface TargetPosition {
  id: number;
  x: number; // percentage (15% to 85%)
  y: number; // percentage (25% to 75%)
  size: number; // px size on desktop
  label: string;
  points: number;
}

interface BulletHole {
  id: number;
  x: number;
  y: number;
  isHit: boolean;
}

interface HitEffect {
  id: number;
  x: number;
  y: number;
  text: string;
}

// ============================================================
// 🔊 WEB AUDIO API SOUND SYNTHESIZER
// Self-contained procedural sound engine for shooting range
// ============================================================
class ShootingRangeSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
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

  // 1. Realistic Punchy Gunshot (Synthesized Noise Burst + Sub Thump)
  playGunshot() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Layer 1: Gunshot Noise Burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.12);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.1);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.12);

      // Layer 2: Mechanical Sub Kick Thump
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(180, now);
      subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.09);

      subGain.gain.setValueAtTime(0.5, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.1);
    } catch { }
  }

  // 2. Metallic Target Hit (High-resonance steel chime + gong resonance)
  playTargetHit() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Dual tuned metallic sine bells
      const freqs = [1840, 2460, 3120];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.96, now + 0.3);

        const initialVol = idx === 0 ? 0.35 : 0.2;
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });

      // Quick metallic clink impact
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = "square";
      click.frequency.setValueAtTime(3800, now);
      click.frequency.exponentialRampToValueAtTime(800, now + 0.04);
      clickGain.gain.setValueAtTime(0.25, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(now);
      click.stop(now + 0.05);
    } catch { }
  }

  // 3. Miss Sound (Classic Ricochet Whistle + Wooden Barrier Thud)
  playMiss() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Ricochet Pitch Glide ("pew-ww")
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.linearRampToValueAtTime(1450, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.22);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);

      // Low wooden thud
      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = "sine";
      thud.frequency.setValueAtTime(110, now);
      thud.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      thudGain.gain.setValueAtTime(0.25, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      thud.connect(thudGain);
      thudGain.connect(ctx.destination);
      thud.start(now);
      thud.stop(now + 0.14);
    } catch { }
  }

  // 4. Triumphant 5/5 Target Cleared Fanfare
  playVictoryFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Sub Bass Celebration Impact
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(160, now);
      sub.frequency.exponentialRampToValueAtTime(38, now + 0.6);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.7);

      // Major Triad Arpeggio: C5, E5, G5, C6, E6, G6
      const fanfareNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      fanfareNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.08;
        const duration = idx === fanfareNotes.length - 1 ? 0.65 : 0.25;

        osc.type = idx % 2 === 0 ? "triangle" : "square";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(idx === fanfareNotes.length - 1 ? 0.32 : 0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      });
    } catch { }
  }
}

// 5 Curated Target Positions with distinct firing booth coordinates
const TARGET_POSITIONS: TargetPosition[] = [
  { id: 1, x: 22, y: 35, size: 84, label: "T-1", points: 100 },
  { id: 2, x: 74, y: 48, size: 78, label: "T-2", points: 120 },
  { id: 3, x: 38, y: 62, size: 90, label: "T-3", points: 100 },
  { id: 4, x: 62, y: 28, size: 76, label: "T-4", points: 150 },
  { id: 5, x: 50, y: 45, size: 94, label: "BULLSEYE", points: 200 },
];

export default function ShootingRange({ onSuccess, onSkip }: ShootingRangeProps) {
  // Game states: 'briefing' | 'playing' | 'cleared'
  const [gameState, setGameState] = useState<"briefing" | "playing" | "cleared">("briefing");
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [hitsCount, setHitsCount] = useState(0);
  const [totalShots, setTotalShots] = useState(0);
  const [score, setScore] = useState(0);
  const [isTargetHitAnimating, setIsTargetHitAnimating] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Visual Effects & Gun state
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 45 });
  const [isInsideRange, setIsInsideRange] = useState(false);
  const [muzzleFlash, setMuzzleFlash] = useState(false);
  const [isGunRecoiling, setIsGunRecoiling] = useState(false);
  const [bulletHoles, setBulletHoles] = useState<BulletHole[]>([]);
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const soundEngineRef = useRef<ShootingRangeSoundEngine>(new ShootingRangeSoundEngine());

  // Mute sync
  useEffect(() => {
    soundEngineRef.current.enabled = !soundMuted;
  }, [soundMuted]);

  // Trigger Muzzle Flash & Gun Recoil Kick
  const triggerGunRecoil = useCallback(() => {
    setMuzzleFlash(true);
    setIsGunRecoiling(true);
    setTimeout(() => setMuzzleFlash(false), 75);
    setTimeout(() => setIsGunRecoiling(false), 140);
  }, []);

  // Start the game on user interaction
  const handleStartGame = useCallback(() => {
    soundEngineRef.current.playGunshot();
    setGameState("playing");
    setCurrentTargetIndex(0);
    setHitsCount(0);
    setTotalShots(0);
    setScore(0);
    setBulletHoles([]);
    setHitEffects([]);
    triggerGunRecoil();
  }, [triggerGunRecoil]);

  // Track mouse coordinates inside range container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
    setIsInsideRange(true);
  };

  const handleMouseEnter = () => setIsInsideRange(true);
  const handleMouseLeave = () => setIsInsideRange(false);

  // Add floating hit indicator (+100 PTS)
  const addHitEffect = (x: number, y: number, text: string) => {
    const newId = Date.now() + Math.random();
    setHitEffects((prev) => [...prev, { id: newId, x, y, text }]);
    setTimeout(() => {
      setHitEffects((prev) => prev.filter((item) => item.id !== newId));
    }, 800);
  };

  // Handle Shot Hit on Target
  const handleHitTarget = (e: React.MouseEvent | React.TouchEvent, target: TargetPosition) => {
    e.stopPropagation();
    if (gameState !== "playing" || isTargetHitAnimating) return;

    triggerGunRecoil();
    soundEngineRef.current.playGunshot();
    soundEngineRef.current.playTargetHit();

    setTotalShots((prev) => prev + 1);
    const newHits = hitsCount + 1;
    setHitsCount(newHits);
    setScore((prev) => prev + target.points);

    // Record hit location & update gun angle for mobile tap
    let clientX = 0;
    let clientY = 0;
    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
      addHitEffect(x, y, `+${target.points} PTS`);
      setBulletHoles((prev) => [...prev.slice(-15), { id: Date.now(), x, y, isHit: true }]);
    }

    // Animation transition to next target
    setIsTargetHitAnimating(true);

    if (newHits >= 5) {
      // 5/5 Targets Hit! Win condition!
      setTimeout(() => {
        setGameState("cleared");
        soundEngineRef.current.playVictoryFanfare();
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }, 350);
    } else {
      setTimeout(() => {
        setCurrentTargetIndex((prev) => prev + 1);
        setIsTargetHitAnimating(false);
      }, 400);
    }
  };

  // Handle Shot Miss (clicked outside target)
  const handleMiss = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== "playing" || isTargetHitAnimating) return;

    triggerGunRecoil();
    soundEngineRef.current.playGunshot();
    soundEngineRef.current.playMiss();

    setTotalShots((prev) => prev + 1);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
      addHitEffect(x, y, "MISS");
      setBulletHoles((prev) => [...prev.slice(-15), { id: Date.now(), x, y, isHit: false }]);
    }
  };

  // Keyboard accessibility: Escape/Tab/Space/Enter
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        if (gameState === "briefing") {
          handleStartGame();
        }
      }
    },
    [gameState, handleStartGame]
  );

  const activeTarget = TARGET_POSITIONS[currentTargetIndex];
  const accuracy = totalShots > 0 ? Math.round((hitsCount / totalShots) * 100) : 100;

  // Calculate FPS aiming rotation & parallax displacement
  // Pistol pivots towards mouse aim point (clamped for realistic wrist aiming range)
  const gunAimAngle = Math.max(-22, Math.min(22, (mousePos.x - 50) * 0.55));
  const gunOffsetX = (mousePos.x - 50) * 0.45;
  const gunOffsetY = (mousePos.y - 50) * 0.15;

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full h-full flex flex-col items-center justify-between text-[#ECE8E1] select-none focus:outline-none bg-[#0F1923]"
    >
      {/* Top Arcade Status Bar */}
      <div className="w-full flex items-center justify-between gap-2 p-3 sm:p-4 bg-[#0F1923] border-b border-[#303946] text-[#ECE8E1] z-20">
        {/* Left: Mission & Hit Counters */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div
            className="flex items-center gap-1.5 bg-[#161F28] border border-[#FF4655]/60 text-[#ECE8E1] px-2.5 sm:px-3 py-1 font-valorant-mono text-xs sm:text-sm tracking-wider"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
            }}
          >
            <Target size={14} className="text-[#FF4655]" />
            <span>
              TARGETS:{" "}
              <strong className="font-valorant-mono text-[#FF4655] text-sm sm:text-base">
                {hitsCount}/5
              </strong>
            </span>
          </div>

          {/* Hit Indicators Segment Bars */}
          <div className="hidden sm:flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-5 h-2 -skew-x-12 border transition-all duration-300 ${
                  i < hitsCount
                    ? "bg-[#FF4655] border-[#FF4655] shadow-[0_0_8px_rgba(255,70,85,0.8)]"
                    : "bg-[#1F2326] border-[#303946]"
                }`}
                title={`Target ${i + 1} status`}
              />
            ))}
          </div>
        </div>

        {/* Center: Live Score / Accuracy */}
        {gameState === "playing" && (
          <div className="hidden md:flex items-center gap-4 text-xs font-valorant-mono">
            <span className="text-[#ECE8E1] font-bold">
              SCORE: <strong className="text-[#FF4655]">{score} PTS</strong>
            </span>
            <span className="text-[#8B978F] font-bold">
              ACCURACY: {accuracy}%
            </span>
          </div>
        )}

        {/* Right: Audio Toggle & Skip Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-1.5 sm:px-2.5 sm:py-1 bg-[#161F28] hover:bg-[#1F2933] text-[#ECE8E1] border border-[#303946] text-xs font-valorant-mono flex items-center gap-1 transition-colors cursor-pointer"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
            }}
            title={soundMuted ? "Unmute sound effects" : "Mute sound effects"}
            aria-label={soundMuted ? "Unmute sound effects" : "Mute sound effects"}
          >
            {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span className="hidden sm:inline">
              {soundMuted ? "MUTED" : "SFX"}
            </span>
          </button>

          {/* Accessible Skip Button */}
          <button
            type="button"
            onClick={onSkip}
            className="px-2.5 sm:px-3.5 py-1 bg-[#FF4655] hover:bg-[#E03645] text-white font-valorant-mono font-bold text-xs uppercase transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_10px_rgba(255,70,85,0.3)]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
            }}
            title="Lewati mini-game dan langsung buka profil Riza"
            aria-label="Lewati game dan tampilkan kartu profil langsung"
          >
            <FastForward size={13} strokeWidth={2.5} />
            <span>Lewati</span>
          </button>
        </div>
      </div>

      {/* Main Shooting Range Booth Arena */}
      <div
        ref={containerRef}
        onClick={handleMiss}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full flex-1 min-h-95 sm:min-h-110 md:min-h-122.5 bg-linear-to-b from-[#0B0E14] via-[#111822] to-[#0F1923] overflow-hidden cursor-crosshair border-x border-b border-[#303946] flex items-center justify-center ${
          muzzleFlash ? "brightness-150" : ""
        }`}
      >
        {/* ============================================================
            🎨 HANDCRAFTED SVG SHOOTING RANGE BOOTH SCENE (Valorant Style)
            ============================================================ */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Perspective Firing Lanes in Valorant Red & Cyan */}
          <line
            x1="10%"
            y1="100%"
            x2="35%"
            y2="0%"
            stroke="#FF4655"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          <line
            x1="90%"
            y1="100%"
            x2="65%"
            y2="0%"
            stroke="#FF4655"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          <line
            x1="50%"
            y1="100%"
            x2="50%"
            y2="0%"
            stroke="#00F5D4"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />

          {/* Distance Markers */}
          <line
            x1="25%"
            y1="70%"
            x2="75%"
            y2="70%"
            stroke="#ECE8E1"
            strokeWidth="1"
            strokeOpacity="0.2"
          />
          <text
            x="50%"
            y="68%"
            fill="#ECE8E1"
            fillOpacity="0.35"
            fontSize="12"
            fontFamily="monospace"
            textAnchor="middle"
          >
            - 15 METERS -
          </text>

          <line
            x1="32%"
            y1="45%"
            x2="68%"
            y2="45%"
            stroke="#ECE8E1"
            strokeWidth="1"
            strokeOpacity="0.2"
          />
          <text
            x="50%"
            y="43%"
            fill="#ECE8E1"
            fillOpacity="0.35"
            fontSize="11"
            fontFamily="monospace"
            textAnchor="middle"
          >
            - 25 METERS -
          </text>

          <line
            x1="38%"
            y1="20%"
            x2="62%"
            y2="20%"
            stroke="#ECE8E1"
            strokeWidth="1"
            strokeOpacity="0.2"
          />
          <text
            x="50%"
            y="18%"
            fill="#ECE8E1"
            fillOpacity="0.3"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
          >
            - 50 METERS -
          </text>
        </svg>

        {/* Overhead Range Spotlight Accents */}
        <div className="absolute top-0 inset-x-0 h-16 bg-linear-to-b from-[#FF4655]/15 to-transparent pointer-events-none z-1" />
        <div className="absolute top-2 left-6 px-3 py-1 bg-[#161F28] border border-[#FF4655]/40 text-[10px] font-valorant-mono text-[#FF4655] pointer-events-none hidden sm:block">
          ● RANGE LIVE // SECTOR_07
        </div>

        {/* Bullet Impact Decals */}
        {bulletHoles.map((hole) => (
          <div
            key={hole.id}
            style={{ left: `${hole.x}%`, top: `${hole.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 transition-opacity duration-500 ${
              hole.isHit ? "w-4 h-4" : "w-3 h-3"
            }`}
          >
            <div
              className={`w-full h-full rounded-full border ${
                hole.isHit
                  ? "bg-[#FF4655] border-[#ECE8E1] shadow-[0_0_8px_#FF4655]"
                  : "bg-black/90 border-gray-600 shadow-[inset_0_1px_2px_black]"
              }`}
            />
          </div>
        ))}

        {/* Floating Hit Indicators */}
        {hitEffects.map((effect) => (
          <div
            key={effect.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 font-valorant-mono font-bold text-xs sm:text-sm text-[#ECE8E1] bg-[#161F28] px-2.5 py-1 border border-[#FF4655] shadow-[0_0_12px_rgba(255,70,85,0.6)] animate-bounce"
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              clipPath:
                "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
            }}
          >
            {effect.text}
          </div>
        ))}

        {/* ============================================================
            1. BRIEFING / START SCREEN STATE
            ============================================================ */}
        {gameState === "briefing" && (
          <div
            className="relative z-30 max-w-md w-11/12 bg-[#0F1923] border border-[#303946] shadow-[0_0_30px_rgba(0,0,0,0.8)] p-5 sm:p-7 text-center flex flex-col items-center animate-in zoom-in-95 duration-200 text-[#ECE8E1]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
            }}
          >
            {/* Tactical Corner Accents */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#FF4655] pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#FF4655] pointer-events-none" />

            <div
              className="w-14 h-14 sm:w-16 sm:h-16 bg-[#161F28] border border-[#FF4655] flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(255,70,85,0.4)]"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
            >
              <Crosshair size={28} className="text-[#FF4655]" />
            </div>

            <span className="px-3 py-0.5 bg-[#161F28] border border-[#FF4655]/60 font-valorant-mono text-[11px] font-bold uppercase text-[#ECE8E1] mb-2 tracking-wider">
              // CONTRACT PROTOCOL
            </span>

            <h3 className="text-2xl sm:text-3xl font-valorant-title font-bold text-[#ECE8E1] uppercase tracking-wide mb-2">
              Riza&apos;s Shooting Range
            </h3>

            <p className="text-xs sm:text-sm text-[#8B978F] font-valorant-sub font-medium mb-5 leading-relaxed">
              Uji ketangkasan membidikmu! Tembak{" "}
              <strong className="text-[#ECE8E1]">5 target sasaran</strong> untuk
              membuka dan melihat kartu profil lengkap Riza.
            </p>

            <div className="w-full flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleStartGame}
                className="flex-1 px-4 py-3 bg-[#FF4655] hover:bg-[#E03645] font-valorant-sub font-bold text-sm uppercase text-white shadow-[0_0_15px_rgba(255,70,85,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                }}
                autoFocus
              >
                <Crosshair size={18} strokeWidth={2.5} />
                <span>Mulai Menembak</span>
              </button>

              <button
                type="button"
                onClick={onSkip}
                className="px-4 py-3 bg-[#161F28] hover:bg-[#1F2933] border border-[#303946] hover:border-[#FF4655] font-valorant-sub font-bold text-xs sm:text-sm uppercase text-[#ECE8E1] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                }}
                title="Lewati game langsung ke profil"
              >
                <FastForward size={15} strokeWidth={2} />
                <span>Lewati</span>
              </button>
            </div>

            <div className="mt-4 text-[11px] font-valorant-mono text-[#8B978F] flex items-center gap-1.5">
              <Info size={13} className="text-[#FF4655]" />
              <span>Touch/tap langsung di layar ponsel atau klik mouse di PC</span>
            </div>
          </div>
        )}

        {/* ============================================================
            2. ACTIVE TARGET (PLAYING STATE)
            ============================================================ */}
        {gameState === "playing" && activeTarget && (
          <div
            style={{
              left: `${activeTarget.x}%`,
              top: `${activeTarget.y}%`,
              width: `${activeTarget.size}px`,
              height: `${activeTarget.size}px`,
            }}
            onClick={(e) => handleHitTarget(e, activeTarget)}
            onTouchStart={(e) => handleHitTarget(e, activeTarget)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-15 transition-all duration-300 ${
              isTargetHitAnimating
                ? "scale-125 rotate-45 opacity-0 duration-200"
                : "animate-in zoom-in-75 duration-200 hover:scale-110 active:scale-95"
            }`}
            title={`Tembak Target #${currentTargetIndex + 1}`}
          >
            {/* Hanging Rope Wire */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0.5 h-32 bg-[#303946]/80 pointer-events-none" />

            {/* Target Outer Plate */}
            <div className="w-full h-full rounded-full bg-[#0F1923] border-2 border-[#FF4655] shadow-[0_0_20px_rgba(255,70,85,0.5)] p-1 flex items-center justify-center relative overflow-hidden group">
              {/* Outer Ring */}
              <div className="w-full h-full rounded-full border border-[#FF4655]/60 flex items-center justify-center bg-[#161F28]">
                {/* Middle Ring */}
                <div className="w-3/4 h-3/4 rounded-full border border-[#FF4655]/80 flex items-center justify-center bg-[#0F1923]">
                  {/* Bullseye Center */}
                  <div className="w-1/2 h-1/2 rounded-full bg-[#FF4655] flex items-center justify-center text-white font-bold text-[10px] font-valorant-mono shadow-[0_0_10px_rgba(255,70,85,0.8)]">
                    +
                  </div>
                </div>
              </div>

              {/* Crosshair Wire Overlay on Target */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-full h-px bg-[#FF4655]/50" />
                <div className="h-full w-px bg-[#FF4655]/50 absolute" />
              </div>

              {/* Target Number Badge */}
              <div
                className="absolute -top-1 -right-1 bg-[#FF4655] text-white px-1.5 py-0.2 font-valorant-mono text-[9px] font-bold shadow-[0_0_6px_rgba(255,70,85,0.6)]"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))",
                }}
              >
                #{currentTargetIndex + 1}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            3. CLEARED / VICTORY STATE
            ============================================================ */}
        {gameState === "cleared" && (
          <div
            className="relative z-30 max-w-sm w-11/12 bg-[#0F1923] border border-[#FF4655] shadow-[0_0_30px_rgba(255,70,85,0.5)] p-6 text-center animate-in zoom-in duration-300 text-[#ECE8E1]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
            }}
          >
            <div
              className="w-14 h-14 bg-[#161F28] border border-[#FF4655] flex items-center justify-center text-[#FF4655] mx-auto mb-3 shadow-[0_0_15px_rgba(255,70,85,0.4)] animate-bounce"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              <Trophy size={26} />
            </div>
            <h3 className="text-3xl font-valorant-title font-bold uppercase text-[#ECE8E1] tracking-wider mb-1">
              TARGETS CLEARED!
            </h3>
            <p className="text-xs sm:text-sm font-valorant-mono text-[#8B978F] mb-3">
              Skor Akhir:{" "}
              <strong className="text-[#ECE8E1]">{score} PTS</strong> (
              {accuracy}% Akurasi)
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#161F28] border border-[#FF4655]/60 font-valorant-mono text-xs text-[#ECE8E1] animate-pulse">
              <CheckCircle2 size={13} className="text-[#FF4655]" />
              <span>Membuka Profil Riza...</span>
            </div>
          </div>
        )}

        {/* ============================================================
            FIRST-PERSON SHOOTER POV (Pistol & Hand Aiming)
            Custom asset: public/asset/pistol-riza.png
            ============================================================ */}
        <div
          style={{
            transform: `translateX(calc(-56% + ${gunOffsetX}px)) translateY(${gunOffsetY}px) rotate(${gunAimAngle}deg) ${
              isGunRecoiling
                ? "translateY(16px) rotate(-4deg) scale(0.97)"
                : "translateY(0px) rotate(0deg) scale(1)"
            }`,
            transformOrigin: "56% 100%",
          }}
          className="absolute -bottom-4 sm:-bottom-6 left-1/2 pointer-events-none z-25 transition-transform duration-100 ease-out flex flex-col items-center"
        >
          {/* Muzzle Flash Shockwave & Flame Burst right from barrel tip */}
          {isGunRecoiling && (
            <div className="absolute top-[16%] left-[55.9%] -translate-x-1/2 -translate-y-1/2 z-35 animate-in zoom-in-75 duration-75 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <defs>
                  <radialGradient id="blastGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="35%" stopColor="#FF4655" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#FF4655" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#FF4655" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Outer Blast Flare */}
                <polygon
                  points="60,0 72,40 115,40 80,68 95,115 60,86 25,115 40,68 5,40 48,40"
                  fill="url(#blastGlow)"
                  stroke="#0F1923"
                  strokeWidth="2.5"
                />
                {/* Secondary Sparks */}
                <polygon
                  points="60,18 68,46 98,46 74,65 84,98 60,78 36,98 46,65 22,46 52,46"
                  fill="#FF4655"
                />
                {/* Core White Hot Center */}
                <circle cx="60" cy="60" r="16" fill="#ffffff" />
              </svg>
            </div>
          )}

          {/* First-Person Pistol Image Asset */}
          <div className="relative w-72.5 sm:w-90 md:w-107.5 aspect-3/2 drop-shadow-[0_16px_24px_rgba(0,0,0,0.85)]">
            <Image
              src="/asset/pistol-riza.png"
              alt="Pistol Riza"
              fill
              priority
              className="object-contain pointer-events-none select-none"
              sizes="(max-width: 640px) 290px, (max-width: 768px) 360px, 430px"
            />
          </div>
        </div>

        {/* ============================================================
            CUSTOM CROSSHAIR RETICLE (Desktop Mouse Tracker)
            ============================================================ */}
        {isInsideRange && gameState === "playing" && (
          <div
            style={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`,
            }}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-40 hidden md:block"
          >
            {/* Outer Reticle Ring */}
            <div className="w-10 h-10 border border-[#FF4655]/70 flex items-center justify-center rotate-45">
              {/* Inner Center Dot */}
              <div className="w-1.5 h-1.5 bg-[#FF4655] rounded-full shadow-[0_0_6px_#FF4655]" />
              {/* Crosshair Lines */}
              <div className="absolute w-12 h-px bg-[#FF4655]/40" />
              <div className="absolute h-12 w-px bg-[#FF4655]/40" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Hint Banner */}
      <div className="w-full py-2 px-4 bg-[#0F1923] border-t border-[#303946] flex items-center justify-between text-xs font-valorant-mono text-[#8B978F]">
        <span className="truncate flex items-center gap-1.5">
          <Target size={12} className="text-[#FF4655]" />
          <span>
            {gameState === "playing"
              ? `Target ${currentTargetIndex + 1} of 5 — Bidik dan tembak!`
              : "Selesaikan tantangan menembak untuk membuka kartu profil."}
          </span>
        </span>
        <button
          type="button"
          onClick={onSkip}
          className="text-[#FF4655] hover:underline cursor-pointer font-bold shrink-0 ml-2"
        >
          Langsung Lewati →
        </button>
      </div>
    </div>
  );
}
