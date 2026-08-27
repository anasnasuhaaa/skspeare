"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Crosshair, FastForward, Target } from "lucide-react";

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
    } catch {}
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
    } catch {}
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
    } catch {}
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
    } catch {}
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
      addHitEffect(x, y, `🎯 +${target.points}`);
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
      addHitEffect(x, y, "💥 MISS");
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
      className="w-full h-full flex flex-col items-center justify-between text-nb-black font-sans select-none focus:outline-none"
    >
      {/* Top Arcade Status Bar */}
      <div className="w-full flex items-center justify-between gap-2 p-3 sm:p-4 bg-nb-black border-b-[3px] border-nb-black text-nb-white rounded-t-xl z-20">
        {/* Left: Mission & Hit Counters */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 bg-nb-yellow text-nb-black px-2.5 sm:px-3 py-1 rounded-lg border-2 border-nb-black font-display font-black text-xs sm:text-sm">
            <Target size={16} strokeWidth={3} className="text-nb-black" />
            <span>
              TARGETS: <strong className="font-mono text-sm sm:text-base">{hitsCount}/5</strong>
            </span>
          </div>

          {/* Hit Indicators Dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border-2 border-nb-white transition-all duration-300 ${
                  i < hitsCount
                    ? "bg-nb-lime scale-110 shadow-[0_0_8px_var(--color-nb-lime)]"
                    : "bg-nb-black/60"
                }`}
                title={`Target ${i + 1} status`}
              />
            ))}
          </div>
        </div>

        {/* Center: Live Score / Accuracy */}
        {gameState === "playing" && (
          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            <span className="text-nb-lime font-bold">SCORE: {score} PTS</span>
            <span className="text-nb-orange font-bold">ACCURACY: {accuracy}%</span>
          </div>
        )}

        {/* Right: Audio Toggle & Skip Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-1.5 sm:px-2.5 sm:py-1 bg-nb-white/10 hover:bg-nb-white/20 text-nb-white border border-nb-white/30 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
            title={soundMuted ? "Unmute sound effects" : "Mute sound effects"}
            aria-label={soundMuted ? "Unmute sound effects" : "Mute sound effects"}
          >
            {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span className="hidden sm:inline">{soundMuted ? "MUTED" : "SFX"}</span>
          </button>

          {/* Mandatory Accessible Skip Button */}
          <button
            type="button"
            onClick={onSkip}
            className="px-2.5 sm:px-3.5 py-1 bg-nb-pink hover:bg-nb-yellow text-nb-black border-2 border-nb-black rounded-lg font-display font-black text-xs uppercase shadow-[2px_2px_0px_var(--nb-white)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all cursor-pointer flex items-center gap-1"
            title="Lewati mini-game dan langsung buka profil Riza"
            aria-label="Lewati game dan tampilkan kartu profil langsung"
          >
            <FastForward size={14} strokeWidth={3} />
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
        className={`relative w-full flex-1 min-h-[380px] sm:min-h-[440px] md:min-h-[490px] bg-gradient-to-b from-[#1b1c24] via-[#2c2e3e] to-[#16171f] overflow-hidden cursor-crosshair border-x-[3px] border-b-[3px] border-nb-black rounded-b-xl flex items-center justify-center ${
          muzzleFlash ? "brightness-150" : ""
        }`}
      >
        {/* ============================================================
            🎨 HANDCRAFTED SVG SHOOTING RANGE BOOTH SCENE
            ============================================================ */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Perspective Firing Lanes */}
          <line x1="10%" y1="100%" x2="35%" y2="0%" stroke="#ffe156" strokeWidth="2" strokeDasharray="8 6" />
          <line x1="90%" y1="100%" x2="65%" y2="0%" stroke="#ffe156" strokeWidth="2" strokeDasharray="8 6" />
          <line x1="50%" y1="100%" x2="50%" y2="0%" stroke="#4ecdc4" strokeWidth="1.5" strokeDasharray="4 8" />

          {/* Distance Markers */}
          <line x1="25%" y1="70%" x2="75%" y2="70%" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.2" />
          <text x="50%" y="68%" fill="#ffffff" fillOpacity="0.35" fontSize="12" fontFamily="monospace" textAnchor="middle">
            - 15 METERS -
          </text>

          <line x1="32%" y1="45%" x2="68%" y2="45%" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.2" />
          <text x="50%" y="43%" fill="#ffffff" fillOpacity="0.35" fontSize="11" fontFamily="monospace" textAnchor="middle">
            - 25 METERS -
          </text>

          <line x1="38%" y1="20%" x2="62%" y2="20%" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.2" />
          <text x="50%" y="18%" fill="#ffffff" fillOpacity="0.3" fontSize="10" fontFamily="monospace" textAnchor="middle">
            - 50 METERS -
          </text>
        </svg>

        {/* Overhead Range Spotlight Accents */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-nb-yellow/15 to-transparent pointer-events-none z-1" />
        <div className="absolute top-2 left-6 px-3 py-1 bg-nb-yellow/20 border border-nb-yellow/40 rounded text-[10px] font-mono text-nb-yellow pointer-events-none hidden sm:block">
          ● RANGE LIVE // LANE #07
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
                  ? "bg-nb-lime border-nb-black shadow-[0_0_8px_var(--color-nb-lime)]"
                  : "bg-black/90 border-gray-600 shadow-[inset_0_1px_2px_black]"
              }`}
            />
          </div>
        ))}

        {/* Floating Hit Indicators */}
        {hitEffects.map((effect) => (
          <div
            key={effect.id}
            style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 font-display font-black text-sm sm:text-base text-nb-yellow bg-nb-black px-2.5 py-1 rounded-lg border-2 border-nb-yellow shadow-[2px_2px_0px_var(--nb-black)] animate-bounce"
          >
            {effect.text}
          </div>
        ))}

        {/* ============================================================
            1. BRIEFING / START SCREEN STATE
            ============================================================ */}
        {gameState === "briefing" && (
          <div className="relative z-30 max-w-md w-11/12 bg-nb-white border-4 border-nb-black rounded-2xl shadow-[8px_8px_0px_var(--nb-black)] p-5 sm:p-7 text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-nb-yellow border-[3px] border-nb-black rounded-2xl shadow-[3px_3px_0px_var(--nb-black)] flex items-center justify-center text-3xl mb-3 rotate-3">
              🎯
            </div>

            <span className="px-3 py-0.5 bg-nb-lime border-2 border-nb-black rounded-full font-mono text-[11px] font-black uppercase text-nb-black mb-2">
              Sharpshooter Gateway
            </span>

            <h3 className="text-xl sm:text-2xl font-display font-black text-nb-black uppercase tracking-tight mb-2">
              Riza&apos;s Shooting Range
            </h3>

            <p className="text-xs sm:text-sm text-nb-black/80 font-medium mb-5 leading-relaxed">
              Uji ketangkasan membidikmu! Tembak <strong>5 target sasaran</strong> untuk membuka dan melihat kartu profil lengkap Riza.
            </p>

            <div className="w-full flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleStartGame}
                className="flex-1 px-4 py-3 bg-nb-yellow hover:bg-nb-lime border-[3px] border-nb-black rounded-xl font-display font-black text-sm uppercase text-nb-black shadow-[4px_4px_0px_var(--nb-black)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_var(--nb-black)] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                autoFocus
              >
                <Crosshair size={18} strokeWidth={3} />
                <span>Mulai Menembak</span>
              </button>

              <button
                type="button"
                onClick={onSkip}
                className="px-4 py-3 bg-nb-cream hover:bg-nb-pink border-[3px] border-nb-black rounded-xl font-display font-black text-xs sm:text-sm uppercase text-nb-black shadow-[4px_4px_0px_var(--nb-black)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Lewati game langsung ke profil"
              >
                <FastForward size={16} strokeWidth={2.5} />
                <span>Lewati</span>
              </button>
            </div>

            <div className="mt-4 text-[11px] font-mono text-nb-black/60 flex items-center gap-1.5">
              <span>💡 Touch/tap langsung di layar ponsel atau klik mouse di PC</span>
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
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0.5 h-32 bg-gray-400/60 pointer-events-none" />

            {/* Target Outer Plate (Wood/Steel Frame) */}
            <div className="w-full h-full rounded-full bg-nb-white border-[3.5px] border-nb-black shadow-[0_0_20px_rgba(255,225,86,0.35)] p-1 flex items-center justify-center relative overflow-hidden group">
              {/* Outer Ring */}
              <div className="w-full h-full rounded-full border-[3px] border-nb-red flex items-center justify-center bg-nb-cream">
                {/* Middle Ring */}
                <div className="w-3/4 h-3/4 rounded-full border-[3px] border-nb-black flex items-center justify-center bg-nb-blue/30">
                  {/* Bullseye Gold Center */}
                  <div className="w-1/2 h-1/2 rounded-full bg-nb-red border-2 border-nb-black flex items-center justify-center text-nb-white font-black text-[10px] font-mono shadow-[inset_0_0_6px_rgba(0,0,0,0.5)]">
                    ★
                  </div>
                </div>
              </div>

              {/* Crosshair Wire Overlay on Target */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-full h-0.5 bg-nb-black/40" />
                <div className="h-full w-0.5 bg-nb-black/40 absolute" />
              </div>

              {/* Target Number Badge */}
              <div className="absolute -top-1.5 -right-1.5 bg-nb-yellow border-2 border-nb-black rounded-full px-1.5 py-0.2 font-mono text-[9px] font-black text-nb-black shadow-[1px_1px_0px_var(--nb-black)]">
                #{currentTargetIndex + 1}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            3. CLEARED / VICTORY STATE
            ============================================================ */}
        {gameState === "cleared" && (
          <div className="relative z-30 max-w-sm w-11/12 bg-nb-yellow border-4 border-nb-black rounded-2xl shadow-[8px_8px_0px_var(--nb-black)] p-6 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-nb-lime border-[3px] border-nb-black rounded-2xl shadow-[4px_4px_0px_var(--nb-black)] flex items-center justify-center text-4xl mx-auto mb-3 animate-bounce">
              🏆
            </div>
            <h3 className="text-2xl font-display font-black uppercase text-nb-black mb-1">
              TARGETS CLEARED!
            </h3>
            <p className="text-xs sm:text-sm font-mono text-nb-black/80 mb-3">
              Skor Akhir: <strong>{score} PTS</strong> ({accuracy}% Akurasi)
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-nb-white border-2 border-nb-black rounded-lg font-mono text-xs font-bold animate-pulse">
              <span>🔓 Membuka Profil Riza...</span>
            </div>
          </div>
        )}

        {/* ============================================================
            🔫 REALISTIC FIRST-PERSON SHOOTER POV (Pistol & Hand Aiming)
            True FPS Aim Down Sight Perspective with Shaded 5-Finger Hand
            ============================================================ */}
        <div
          style={{
            transform: `translateX(calc(-40% + ${gunOffsetX}px)) translateY(${gunOffsetY}px) rotate(${gunAimAngle}deg) ${
              isGunRecoiling ? "translateY(18px) rotate(-8deg) scale(0.96)" : "translateY(0px) rotate(0deg) scale(1)"
            }`,
            transformOrigin: "85% 100%",
          }}
          className="absolute bottom-0 right-1/2 pointer-events-none z-25 transition-transform duration-100 ease-out flex flex-col items-center"
        >
          {/* Muzzle Flash Shockwave & Flame Burst right from barrel tip */}
          {isGunRecoiling && (
            <div className="absolute -top-16 left-[46%] -translate-x-1/2 z-35 animate-in zoom-in-75 duration-75">
              <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
                <defs>
                  <radialGradient id="blastGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="35%" stopColor="#ffe156" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#ff6b6b" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Outer Blast Flare */}
                <polygon
                  points="60,0 72,40 115,40 80,68 95,115 60,86 25,115 40,68 5,40 48,40"
                  fill="url(#blastGlow)"
                  stroke="#1a1a2e"
                  strokeWidth="2.5"
                />
                {/* Secondary Sparks */}
                <polygon
                  points="60,18 68,46 98,46 74,65 84,98 60,78 36,98 46,65 22,46 52,46"
                  fill="#ffe156"
                />
                {/* Core White Hot Center */}
                <circle cx="60" cy="60" r="16" fill="#ffffff" />
              </svg>
            </div>
          )}

          {/* High-Fidelity SVG Hand & Handgun in First-Person Aiming Perspective */}
          <svg
            width="260"
            height="260"
            viewBox="0 0 320 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 drop-shadow-[0_16px_24px_rgba(0,0,0,0.85)]"
          >
            <defs>
              {/* Gun Metal Metallic Gradients */}
              <linearGradient id="gunSlideTop" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4b5563" />
                <stop offset="30%" stopColor="#374151" />
                <stop offset="85%" stopColor="#1f2937" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>

              <linearGradient id="gunSlideSide" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="50%" stopColor="#1f2937" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              <linearGradient id="gunFrame" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="metallicHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4b5563" stopOpacity="0.2" />
              </linearGradient>

              {/* Realistic Hand Skin Tone Gradients with Shading & Depth */}
              <linearGradient id="skinBase" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f7c8aa" />
                <stop offset="45%" stopColor="#df9a75" />
                <stop offset="80%" stopColor="#b86b47" />
                <stop offset="100%" stopColor="#874326" />
              </linearGradient>

              <linearGradient id="skinHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffe6d4" />
                <stop offset="60%" stopColor="#f5bd98" />
                <stop offset="100%" stopColor="#cf7f57" />
              </linearGradient>

              <linearGradient id="skinShadow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7a371c" />
                <stop offset="60%" stopColor="#9d4f2a" />
                <stop offset="100%" stopColor="#c7734a" />
              </linearGradient>

              <linearGradient id="nailGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffeedd" />
                <stop offset="100%" stopColor="#e3a78b" />
              </linearGradient>

              {/* Tactical Wrist Sleeve Gradient */}
              <linearGradient id="sleeveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            {/* ============================================================
                1. PLAYER FOREARM & WRIST (Coming from bottom-right)
                ============================================================ */}
            <path
              d="M200 320 L270 320 C290 300 310 270 305 230 C295 210 270 200 240 220 L195 290 Z"
              fill="url(#sleeveGrad)"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            {/* Tactical Sleeve Cuff Fold */}
            <path
              d="M210 280 C235 255 265 245 285 250"
              fill="none"
              stroke="#ffe156"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />

            {/* Back of Hand & Wrist Joint Flesh */}
            <path
              d="M190 285 C215 250 245 220 235 185 C225 155 205 160 185 175 L165 250 Z"
              fill="url(#skinBase)"
              stroke="#1a1a2e"
              strokeWidth="3"
            />

            {/* ============================================================
                2. PISTOL IN FIRST-PERSON AIMING PERSPECTIVE
                (Looking down the top slide directly towards the crosshair)
                ============================================================ */}

            {/* Pistol Grip Base / Magazine Plate (peeking below fingers) */}
            <path
              d="M175 270 L195 295 L180 305 L160 280 Z"
              fill="#0f172a"
              stroke="#1a1a2e"
              strokeWidth="3"
            />

            {/* Frame / Receiver (Polymer lower body behind fingers) */}
            <path
              d="M125 135 L175 125 L185 185 L155 220 L135 185 Z"
              fill="url(#gunFrame)"
              stroke="#1a1a2e"
              strokeWidth="3"
            />

            {/* Trigger Guard Loop (Front of trigger) */}
            <path
              d="M125 155 C110 165 105 185 120 200 C130 208 145 208 152 195"
              fill="none"
              stroke="#1a1a2e"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Tactical Gold Trigger */}
            <path
              d="M135 165 Q130 180 138 188"
              fill="none"
              stroke="#ffe156"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Slide Assembly (Foreshortened 3D Perspective pointing towards target) */}
            {/* Slide Left Cheek / Perspective Taper */}
            <path
              d="M110 95 L145 75 L150 130 L115 145 Z"
              fill="url(#gunSlideSide)"
              stroke="#1a1a2e"
              strokeWidth="3"
            />

            {/* Slide Top Flat Surface (Converging towards front barrel tip) */}
            <path
              d="M145 75 L160 68 L165 120 L150 130 Z"
              fill="url(#gunSlideTop)"
              stroke="#1a1a2e"
              strokeWidth="3"
            />

            {/* Slide Top Metallic Specular Highlight Edge */}
            <line x1="146" y1="76" x2="151" y2="129" stroke="url(#metallicHighlight)" strokeWidth="2" />

            {/* Slide Rear Face (Closest to player's eye) */}
            <path
              d="M115 145 L150 130 L168 135 L135 152 Z"
              fill="#111827"
              stroke="#1a1a2e"
              strokeWidth="3"
            />

            {/* Slide Serrations (Rear Cocking Grips) */}
            <line x1="120" y1="135" x2="128" y2="132" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="125" y1="138" x2="133" y2="135" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="130" y1="141" x2="138" y2="138" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />

            {/* Beavertail & Hammer (resting above hand web) */}
            <path
              d="M152 148 C160 145 168 152 165 160 C160 165 152 162 150 155 Z"
              fill="#374151"
              stroke="#1a1a2e"
              strokeWidth="2.5"
            />

            {/* ============================================================
                3. IRON SIGHTS (3-DOT ILLUMINATED TRITIUM SIGHTS)
                Aimed directly forward towards center crosshair
                ============================================================ */}
            {/* Rear Sight Notch (Left & Right Wings) */}
            <rect x="122" y="130" width="6" height="7" rx="1" fill="#1f2937" stroke="#1a1a2e" strokeWidth="1.5" />
            <circle cx="125" cy="133" r="1.8" fill="#4ade80" /> {/* Glowing Tritium Green Dot Left */}

            <rect x="142" y="123" width="6" height="7" rx="1" fill="#1f2937" stroke="#1a1a2e" strokeWidth="1.5" />
            <circle cx="145" cy="126" r="1.8" fill="#4ade80" /> {/* Glowing Tritium Green Dot Right */}

            {/* Front Sight Post at tip of slide (Aligned in middle of rear notch) */}
            <rect x="149" y="68" width="4" height="6" rx="0.8" fill="#1f2937" stroke="#1a1a2e" strokeWidth="1.2" />
            <circle cx="151" cy="71" r="1.3" fill="#ffe156" /> {/* Glowing Tritium Yellow Dot Front */}

            {/* ============================================================
                4. REALISTIC PLAYER HAND & 5 DISTINCT FINGERS
                Shaded fingers firmly wrapping the grip + trigger finger
                ============================================================ */}

            {/* A. THUMB (Ibu Jari) - Positioned on left flank pointing forward along frame */}
            <g id="thumb">
              {/* Thumb Muscle / Thenar Eminence */}
              <path
                d="M175 195 C190 190 210 205 205 230 C200 245 185 245 170 225 Z"
                fill="url(#skinShadow)"
                stroke="#1a1a2e"
                strokeWidth="2.5"
              />
              {/* Thumb Body */}
              <path
                d="M150 165 C165 155 180 170 178 190 C175 205 160 205 148 185 Z"
                fill="url(#skinBase)"
                stroke="#1a1a2e"
                strokeWidth="3"
              />
              {/* Thumb Knuckle Crease & Highlight */}
              <path d="M162 172 Q168 180 162 188" stroke="#7a371c" strokeWidth="1.8" fill="none" />
              {/* Thumbnail */}
              <path
                d="M150 167 Q154 163 158 168 Q155 174 151 172 Z"
                fill="url(#nailGradient)"
                stroke="#9d4f2a"
                strokeWidth="1"
              />
            </g>

            {/* B. INDEX / TRIGGER FINGER (Jari Telunjuk) - Reaching into trigger guard */}
            <g id="index-finger">
              {/* Knuckle base on hand */}
              <circle cx="178" cy="180" r="10" fill="url(#skinHighlight)" />

              {/* First segment (Proximal phalanx extending along frame) */}
              <path
                d="M175 172 L150 165 C142 165 138 172 142 178 L168 188 Z"
                fill="url(#skinHighlight)"
                stroke="#1a1a2e"
                strokeWidth="3"
              />

              {/* Second & Third segment (Curving around trigger) */}
              <path
                d="M144 167 C130 165 125 175 130 186 C135 194 148 194 152 184 L148 175 Z"
                fill="url(#skinBase)"
                stroke="#1a1a2e"
                strokeWidth="2.8"
              />
              {/* Finger Joint Creases */}
              <line x1="145" y1="168" x2="148" y2="182" stroke="#7a371c" strokeWidth="1.5" />
              {/* Fingernail peeking on trigger pad */}
              <ellipse cx="132" cy="182" rx="3.5" ry="4.5" fill="url(#nailGradient)" stroke="#9d4f2a" strokeWidth="1" />
            </g>

            {/* C. MIDDLE FINGER (Jari Tengah) - Wrapping high on the grip under trigger guard */}
            <g id="middle-finger">
              <path
                d="M158 192 C142 190 135 200 138 212 C142 220 156 220 168 210 L176 198 Z"
                fill="url(#skinBase)"
                stroke="#1a1a2e"
                strokeWidth="3"
              />
              {/* Knuckle shadow & highlight */}
              <path d="M150 196 Q156 204 152 212" stroke="#7a371c" strokeWidth="1.8" fill="none" />
              {/* Fingernail */}
              <ellipse cx="140" cy="204" rx="4" ry="5" fill="url(#nailGradient)" stroke="#9d4f2a" strokeWidth="1" />
            </g>

            {/* D. RING FINGER (Jari Manis) - Wrapping mid grip */}
            <g id="ring-finger">
              <path
                d="M165 212 C148 212 142 222 145 234 C148 242 162 242 174 230 L180 218 Z"
                fill="url(#skinBase)"
                stroke="#1a1a2e"
                strokeWidth="3"
              />
              {/* Knuckle Crease */}
              <path d="M156 218 Q162 226 158 234" stroke="#7a371c" strokeWidth="1.8" fill="none" />
              {/* Fingernail */}
              <ellipse cx="146" cy="226" rx="4" ry="5" fill="url(#nailGradient)" stroke="#9d4f2a" strokeWidth="1" />
            </g>

            {/* E. PINKY FINGER (Jari Kelingking) - Wrapping bottom grip */}
            <g id="pinky-finger">
              <path
                d="M170 232 C155 234 150 244 152 254 C155 262 168 262 178 250 L184 238 Z"
                fill="url(#skinShadow)"
                stroke="#1a1a2e"
                strokeWidth="3"
              />
              {/* Knuckle Crease */}
              <path d="M162 238 Q168 246 164 252" stroke="#7a371c" strokeWidth="1.8" fill="none" />
              {/* Fingernail */}
              <ellipse cx="154" cy="246" rx="3.5" ry="4.5" fill="url(#nailGradient)" stroke="#9d4f2a" strokeWidth="1" />
            </g>

            {/* Palm Creases & Tendon Depth Lines */}
            <path d="M185 220 Q195 240 188 260" stroke="#7a371c" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M205 235 Q215 250 210 270" stroke="#7a371c" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          </svg>
        </div>

        {/* ============================================================
            🎯 CUSTOM CROSSHAIR RETICLE (Desktop Mouse Tracker)
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
            <div className="w-10 h-10 rounded-full border-2 border-nb-yellow/80 flex items-center justify-center">
              {/* Inner Center Dot */}
              <div className="w-1.5 h-1.5 bg-nb-red rounded-full shadow-[0_0_6px_var(--color-nb-red)]" />
              {/* Crosshair Lines */}
              <div className="absolute w-14 h-0.5 bg-nb-yellow/50" />
              <div className="absolute h-14 w-0.5 bg-nb-yellow/50" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Hint Banner */}
      <div className="w-full py-2 px-4 bg-nb-cream border-t-[3px] border-nb-black rounded-b-xl flex items-center justify-between text-xs font-mono text-nb-black/75">
        <span className="truncate">
          {gameState === "playing"
            ? `🎯 Target ${currentTargetIndex + 1} of 5 — Bidik dan tembak!`
            : "🎯 Selesaikan tantangan menembak untuk membuka kartu profil."}
        </span>
        <button
          type="button"
          onClick={onSkip}
          className="underline hover:text-nb-red cursor-pointer font-bold shrink-0 ml-2"
        >
          Langsung Lewati →
        </button>
      </div>
    </div>
  );
}
