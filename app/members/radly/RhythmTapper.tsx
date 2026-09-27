"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Disc3, MicVocal, Music2, Sparkles, Volume2, VolumeX, X, Zap } from "lucide-react";

interface RhythmTapperProps {
  onSuccess: () => void;
  onSkip: () => void;
  onClose: () => void;
}

const lanes = [
  { key: "D", label: "Drum", color: "#FFD700", frequency: 55, melodyFrequency: 523.25, icon: Disc3 },
  { key: "F", label: "Pulse", color: "#00E5FF", frequency: 73.42, melodyFrequency: 587.33, icon: Music2 },
  { key: "J", label: "Vox", color: "#E60067", frequency: 82.41, melodyFrequency: 659.25, icon: MicVocal },
  { key: "K", label: "Spark", color: "#FFD700", frequency: 98, melodyFrequency: 783.99, icon: Zap },
];

const BPM = 110;
const BEAT_INTERVAL = 60_000 / BPM;
const FALL_DURATION = 1_500;
const HIT_WINDOW = 165;
const TARGET_COUNT = 16;
const originalMelody = [0, 2, 3, 2, 1, 2, 0, 1, 3, 2, 1, 0, 2, 3, 1, 0];
const beatChart = Array.from({ length: TARGET_COUNT }, (_, index) => ({
  id: index,
  lane: originalMelody[index],
  time: FALL_DURATION + index * BEAT_INTERVAL,
}));
const ROUND_DURATION = beatChart[beatChart.length - 1].time + HIT_WINDOW + 120;

export default function RhythmTapper({ onSuccess, onSkip, onClose }: RhythmTapperProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(0);
  const intervalTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const winTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const resolvedIds = useRef(new Set<number>());
  const hitCount = useRef(0);
  const gameStateRef = useRef<"ready" | "playing" | "failed">("ready");
  const [gameState, setGameState] = useState<"ready" | "playing" | "failed">("ready");
  const [elapsed, setElapsed] = useState(0);
  const [hitIds, setHitIds] = useState<number[]>([]);
  const [missedIds, setMissedIds] = useState<number[]>([]);
  const [hitFlash, setHitFlash] = useState<{ lane: number; note: number } | null>(null);
  const [feedback, setFeedback] = useState("Tekan D · F · J · K sesuai lane");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [blackout, setBlackout] = useState(false);

  const playHitSound = useCallback((frequency: number) => {
    const context = audioContext.current;
    if (!soundEnabled || !context || context.state !== "running") return;
    const at = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, at);
    gain.gain.setValueAtTime(0.001, at);
    gain.gain.linearRampToValueAtTime(0.13, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, at + 0.24);
    oscillator.connect(gain);
    gain.connect(masterGain.current ?? context.destination);
    oscillator.start(at);
    oscillator.stop(at + 0.25);
  }, [soundEnabled]);

  const playUiSound = useCallback((force = false) => {
    if (!soundEnabled && !force) return;
    if (typeof window === "undefined" || !window.AudioContext) return;

    let context = audioContext.current;
    if (!context || context.state === "closed") {
      context = new AudioContext();
      audioContext.current = context;
    }
    if (!masterGain.current || masterGain.current.context !== context) {
      masterGain.current = context.createGain();
      masterGain.current.gain.value = 0.62;
      masterGain.current.connect(context.destination);
    }

    const play = () => {
      if (context?.state !== "running") return;
      const at = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(880, at);
      oscillator.frequency.exponentialRampToValueAtTime(440, at + 0.045);
      gain.gain.setValueAtTime(0.001, at);
      gain.gain.linearRampToValueAtTime(0.035, at + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, at + 0.065);
      oscillator.connect(gain);
      gain.connect(masterGain.current ?? context.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.07);
    };

    if (context.state === "suspended") void context.resume().then(play);
    else play();
  }, [soundEnabled]);

  const playMissSound = useCallback(() => {
    const context = audioContext.current;
    if (!soundEnabled || !context || context.state !== "running") return;
    const at = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(170, at);
    oscillator.frequency.exponentialRampToValueAtTime(92, at + 0.12);
    gain.gain.setValueAtTime(0.001, at);
    gain.gain.linearRampToValueAtTime(0.055, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, at + 0.16);
    oscillator.connect(gain);
    gain.connect(masterGain.current ?? context.destination);
    oscillator.start(at);
    oscillator.stop(at + 0.17);
  }, [soundEnabled]);

  const tapLane = useCallback((laneIndex: number) => {
    if (gameStateRef.current !== "playing") return;
    const currentTime = performance.now() - startTime.current;
    const nextBeat = beatChart
      .filter((beat) => !resolvedIds.current.has(beat.id))
      .reduce<(typeof beatChart)[number] | null>((closest, beat) => {
        if (!closest || Math.abs(beat.time - currentTime) < Math.abs(closest.time - currentTime)) return beat;
        return closest;
      }, null);

    if (!nextBeat || Math.abs(nextBeat.time - currentTime) > HIT_WINDOW) {
      setFeedback("Belum kena beat · dengarkan pulse");
      playMissSound();
      return;
    }
    if (nextBeat.lane !== laneIndex) {
      setFeedback("Lane keliru · ikuti warna notenya");
      playMissSound();
      return;
    }

    resolvedIds.current.add(nextBeat.id);
    hitCount.current += 1;
    setHitIds((current) => [...current, nextBeat.id]);
    setHitFlash({ lane: laneIndex, note: nextBeat.id });
    setFeedback("PERFECT HIT");
    playHitSound(lanes[laneIndex].melodyFrequency);
  }, [playHitSound, playMissSound]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      stageRef.current?.style.setProperty("--radly-x", `${event.clientX}px`);
      stageRef.current?.style.setProperty("--radly-y", `${event.clientY}px`);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (gameStateRef.current !== "playing") return;
      const laneIndex = lanes.findIndex((lane) => lane.key.toLowerCase() === event.key.toLowerCase());
      if (laneIndex < 0) return;
      event.preventDefault();
      tapLane(laneIndex);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      if (intervalTimer.current) clearInterval(intervalTimer.current);
      if (winTimer.current) clearTimeout(winTimer.current);
      if (audioContext.current && audioContext.current.state !== "closed") {
        void audioContext.current.close();
      }
    };
  }, [onClose, tapLane]);

  const playBeat = (context: AudioContext, at: number, frequency: number) => {
    const kick = context.createOscillator();
    const kickGain = context.createGain();
    kick.type = "sine";
    kick.frequency.setValueAtTime(118, at);
    kick.frequency.exponentialRampToValueAtTime(48, at + 0.14);
    kickGain.gain.setValueAtTime(0.001, at);
    kickGain.gain.linearRampToValueAtTime(0.18, at + 0.008);
    kickGain.gain.exponentialRampToValueAtTime(0.001, at + 0.17);
    kick.connect(kickGain);
    kickGain.connect(masterGain.current ?? context.destination);
    kick.start(at);
    kick.stop(at + 0.18);

    const bass = context.createOscillator();
    const bassGain = context.createGain();
    bass.type = "triangle";
    bass.frequency.setValueAtTime(frequency, at);
    bassGain.gain.setValueAtTime(0.055, at);
    bassGain.gain.exponentialRampToValueAtTime(0.001, at + 0.2);
    bass.connect(bassGain);
    bassGain.connect(masterGain.current ?? context.destination);
    bass.start(at);
    bass.stop(at + 0.21);
  };

  const playBackgroundMusic = (context: AudioContext, at: number, beatIndex: number) => {
    const arpNotes = [220, 261.63, 293.66, 329.63, 392, 329.63, 293.66, 261.63];
    const arp = context.createOscillator();
    const arpGain = context.createGain();
    arp.type = "triangle";
    arp.frequency.setValueAtTime(arpNotes[beatIndex % arpNotes.length], at);
    arpGain.gain.setValueAtTime(0.001, at);
    arpGain.gain.linearRampToValueAtTime(0.025, at + 0.025);
    arpGain.gain.exponentialRampToValueAtTime(0.001, at + 0.48);
    arp.connect(arpGain);
    arpGain.connect(masterGain.current ?? context.destination);
    arp.start(at);
    arp.stop(at + 0.49);

    if (beatIndex % 4 !== 0) return;
    const roots = [130.81, 98, 87.31, 98];
    const root = roots[Math.floor(beatIndex / 4) % roots.length];
    [1, 1.25, 1.5].forEach((ratio, voice) => {
      const pad = context.createOscillator();
      const padGain = context.createGain();
      pad.type = voice === 1 ? "sine" : "triangle";
      pad.frequency.setValueAtTime(root * ratio, at);
      pad.detune.setValueAtTime(voice === 2 ? 4 : -3, at);
      padGain.gain.setValueAtTime(0.001, at);
      padGain.gain.linearRampToValueAtTime(0.012, at + 0.12);
      padGain.gain.setValueAtTime(0.009, at + 1.75);
      padGain.gain.exponentialRampToValueAtTime(0.001, at + 2.35);
      pad.connect(padGain);
      padGain.connect(masterGain.current ?? context.destination);
      pad.start(at);
      pad.stop(at + 2.36);
    });
  };

  const startGame = async () => {
    if (intervalTimer.current) clearInterval(intervalTimer.current);
    if (winTimer.current) clearTimeout(winTimer.current);
    resolvedIds.current = new Set<number>();
    hitCount.current = 0;
    setHitIds([]);
    setMissedIds([]);
    setHitFlash(null);
    setElapsed(0);
    setBlackout(false);
    setFeedback("Dengar bass · tekan saat notenya menyentuh garis");

    if (soundEnabled && typeof window !== "undefined" && window.AudioContext) {
      if (!audioContext.current || audioContext.current.state === "closed") {
        audioContext.current = new AudioContext();
      }
      if (!masterGain.current || masterGain.current.context !== audioContext.current) {
        masterGain.current = audioContext.current.createGain();
        masterGain.current.gain.value = 0.62;
        masterGain.current.connect(audioContext.current.destination);
      }
      await audioContext.current.resume();
    }

    startTime.current = performance.now();
    gameStateRef.current = "playing";
    setGameState("playing");

    if (soundEnabled && audioContext.current?.state === "running") {
      const audioStart = audioContext.current.currentTime;
      beatChart.forEach((beat) => {
        const at = audioStart + beat.time / 1000;
        playBeat(audioContext.current!, at, lanes[beat.lane].frequency);
        playBackgroundMusic(audioContext.current!, at, beat.id);
      });
    }

    intervalTimer.current = setInterval(() => {
      const currentTime = performance.now() - startTime.current;
      setElapsed(currentTime);

      const lateBeats = beatChart.filter(
        (beat) => currentTime > beat.time + HIT_WINDOW && !resolvedIds.current.has(beat.id)
      );
      if (lateBeats.length > 0) {
        lateBeats.forEach((beat) => resolvedIds.current.add(beat.id));
        setMissedIds((current) => [...current, ...lateBeats.map((beat) => beat.id)]);
      }

      if (currentTime >= ROUND_DURATION) {
        if (intervalTimer.current) clearInterval(intervalTimer.current);
        gameStateRef.current = "failed";
        setGameState("failed");
        if (hitCount.current === TARGET_COUNT) {
          setBlackout(true);
          winTimer.current = setTimeout(onSuccess, 850);
        }
      }
    }, 24);
  };

  const restart = () => {
    if (intervalTimer.current) clearInterval(intervalTimer.current);
    if (winTimer.current) clearTimeout(winTimer.current);
    gameStateRef.current = "ready";
    setGameState("ready");
    setHitIds([]);
    setMissedIds([]);
    setHitFlash(null);
    setElapsed(0);
    setBlackout(false);
    setFeedback("Tekan D · F · J · K sesuai lane");
  };

  const toggleSound = () => {
    const nextEnabled = !soundEnabled;
    if (masterGain.current && audioContext.current?.state === "running") {
      masterGain.current.gain.setValueAtTime(nextEnabled ? 0.62 : 0, audioContext.current.currentTime);
    }
    setSoundEnabled(nextEnabled);
    playUiSound(nextEnabled);
  };

  const heroPercent = Math.round((hitIds.length / TARGET_COUNT) * 100);

  return (
    <div
      ref={stageRef}
      className="radly-stage fixed inset-0 z-[1100] flex items-center justify-center overflow-x-hidden overflow-y-auto p-3 text-white sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="radly-game-title"
    >
      <div className="radly-spotlight absolute inset-0" aria-hidden="true" />
      <div className="radly-grain absolute inset-0" aria-hidden="true" />
      <div className="radly-synthwave" aria-hidden="true" />
      <div className="radly-curtain" aria-hidden="true" />

      <section className="radly-console relative z-10 my-auto w-full max-w-xl border border-[#FFD700]/60 bg-[#0B0C10]/90 px-4 py-5 shadow-[0_0_55px_rgba(0,229,255,.15)] sm:px-8 sm:py-7">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#FFD700]/25 pb-3">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#00E5FF] sm:text-xs">
            <Sparkles size={15} /> Rhythm Set / Phase 01
          </div>
          <button
            type="button"
            onClick={() => {
              playUiSound();
              window.setTimeout(onClose, 80);
            }}
            className="grid size-9 shrink-0 place-items-center border border-white/25 text-white/70 transition hover:border-[#E60067] hover:text-white"
            aria-label="Tutup game"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.3em] text-[#E60067]">Just For One Day</p>
            <h1 id="radly-game-title" className="mt-1 font-serif text-3xl font-bold uppercase leading-none text-[#FFD700] sm:text-4xl">
              Rhythm Tapper
            </h1>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-white/45">Original 16-note riff · {BPM} BPM</p>
          </div>
          <button
            type="button"
            onClick={toggleSound}
            disabled={gameState === "playing"}
            aria-label={soundEnabled ? "Matikan suara beat" : "Nyalakan suara beat"}
            className="grid size-9 shrink-0 place-items-center border border-white/20 text-white/70 transition hover:border-[#00E5FF] hover:text-[#00E5FF] disabled:opacity-40"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-white/60 sm:text-[11px]">
          <span>Hero Meter</span>
          <span>{heroPercent}% · {hitIds.length}/{TARGET_COUNT} perfect</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden bg-white/10">
          <div className="h-full bg-gradient-to-r from-[#E60067] via-[#FFD700] to-[#00E5FF] transition-[width] duration-150" style={{ width: `${heroPercent}%` }} />
        </div>

        <div className="radly-track mt-4" aria-label="Empat lane beat">
          <div className="radly-hit-line" aria-hidden="true" />
          <div className="grid h-full grid-cols-4 divide-x divide-white/10">
            {lanes.map((lane, laneIndex) => {
              const Icon = lane.icon;
              const laneNotes = beatChart.filter((beat) => beat.lane === laneIndex);
              return (
                <div key={lane.key} className={`relative h-full overflow-hidden ${hitFlash?.lane === laneIndex ? "radly-lane-hit" : ""}`}>
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/[.025] to-transparent" />
                  {laneNotes.map((beat) => {
                    const noteElapsed = elapsed - (beat.time - FALL_DURATION);
                    const notePosition = Math.min(88, Math.max(0, (noteElapsed / FALL_DURATION) * 88));
                    const isHit = hitIds.includes(beat.id);
                    const isMissed = missedIds.includes(beat.id);
                    const isVisible = gameState === "playing" && !isHit && !isMissed && noteElapsed >= 0 && elapsed <= beat.time + HIT_WINDOW;
                    if (!isVisible) return null;
                    return (
                      <div
                        key={beat.id}
                        className="radly-note absolute left-1/2 z-10 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center border sm:size-9"
                        style={{ top: `${notePosition}%`, borderColor: lane.color, color: lane.color, boxShadow: `0 0 18px ${lane.color}55` }}
                        aria-label={`${lane.label} beat`}
                      >
                        <Icon size={15} aria-hidden="true" />
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => tapLane(laneIndex)}
                    disabled={gameState !== "playing"}
                    className="absolute inset-x-1 bottom-1 z-20 flex h-11 flex-col items-center justify-center gap-0.5 border bg-[#0B0C10]/90 transition active:scale-95 disabled:opacity-45 sm:inset-x-2 sm:bottom-2 sm:h-12"
                    style={{ borderColor: `${lane.color}99`, color: lane.color }}
                    aria-label={`Tap lane ${lane.label}, tombol ${lane.key}`}
                  >
                    <span className="font-mono text-base font-bold leading-none">{lane.key}</span>
                    <span className="font-mono text-[8px] uppercase tracking-wider opacity-65">{lane.label}</span>
                  </button>
                  {hitFlash?.lane === laneIndex && (
                    <div
                      key={hitFlash.note}
                      className="radly-hit-burst pointer-events-none absolute left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap font-mono text-[9px] font-bold uppercase tracking-wider"
                      style={{ top: "78%", color: lane.color }}
                      onAnimationEnd={() => setHitFlash((current) => current?.note === hitFlash.note ? null : current)}
                      aria-hidden="true"
                    >
                      <Sparkles size={17} /> PERFECT <Sparkles size={17} />
                      <i className="radly-hit-spark" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex min-h-5 items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-wider sm:text-[10px]">
          <p className={feedback === "PERFECT HIT" ? "text-[#FFD700]" : "text-white/45"} aria-live="polite">{feedback}</p>
          <p className="shrink-0 text-white/40">{gameState === "playing" ? `${Math.max(0, Math.ceil((ROUND_DURATION - elapsed) / 1000))}s` : "D · F · J · K"}</p>
        </div>

        {gameState === "ready" && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="max-w-52 font-mono text-[9px] leading-relaxed text-white/45">Tekan tombol lane saat notenya menyentuh garis. Selesaikan 16 beat sempurna.</p>
            <button type="button" onClick={() => { playUiSound(); void startGame(); }} className="border border-[#FFD700]/80 bg-[#FFD700]/10 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#FFD700] transition hover:bg-[#FFD700]/20">
              Start the set
            </button>
          </div>
        )}

        {gameState === "failed" && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#E60067]">Set belum sempurna · {heroPercent}%</p>
            <button type="button" onClick={() => { playUiSound(); restart(); }} className="border border-[#00E5FF]/60 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-[#00E5FF] transition hover:bg-[#00E5FF]/10">
              Retry set
            </button>
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <button type="button" onClick={() => { playUiSound(); window.setTimeout(onSkip, 80); }} className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/45 transition hover:text-[#E60067]">
            Lewati game <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {blackout && <div className="radly-blackout fixed inset-0 z-20 grid place-items-center bg-black"><span className="font-mono text-xs uppercase tracking-[.5em] text-[#FFD700]">Spotlight on</span></div>}

      <style jsx>{`
        .radly-stage {
          --radly-x: 50vw;
          --radly-y: 35vh;
          background: radial-gradient(ellipse at 50% 115%, #25202a 0%, #0b0c10 55%, #050609 100%);
          font-family: var(--font-geist-mono), monospace;
        }
        .radly-spotlight {
          background: radial-gradient(ellipse 420px 360px at var(--radly-x) var(--radly-y), rgba(255,215,0,.14), transparent 72%), radial-gradient(ellipse 320px 500px at 82% 10%, rgba(0,229,255,.06), transparent 70%);
          pointer-events: none;
        }
        .radly-grain {
          opacity: .12;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
          mix-blend-mode: screen;
        }
        .radly-synthwave {
          position: absolute;
          left: 0; right: 0; bottom: -17%; height: 45%;
          opacity: .32;
          background-image: repeating-linear-gradient(0deg, rgba(0,229,255,.4) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(230,0,103,.34) 0 1px, transparent 1px 42px);
          transform: rotateX(58deg);
          transform-origin: center top;
          mask-image: linear-gradient(to top, #000 12%, transparent 92%);
          animation: synthwave-drift 3.5s linear infinite;
          pointer-events: none;
        }
        .radly-curtain {
          position: absolute;
          left: 0; right: 0; bottom: 0; height: 18%;
          opacity: .38;
          background: repeating-linear-gradient(90deg, #190710 0 28px, #350c1c 28px 48px, #0b0c10 48px 62px);
          mask-image: linear-gradient(to top, #000, transparent);
          pointer-events: none;
        }
        .radly-console { animation: console-arrive .55s cubic-bezier(.2,.8,.2,1) both; }
        .radly-track {
          position: relative;
          height: 270px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.12);
          background: linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.01));
        }
        .radly-hit-line {
          position: absolute;
          z-index: 5;
          top: 88%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00e5ff 15%, #ffd700 50%, #e60067 85%, transparent);
          box-shadow: 0 0 12px rgba(0,229,255,.55);
        }
        .radly-note { background: rgba(11,12,16,.88); }
        .radly-lane-hit { animation: lane-hit .36s ease-out both; }
        .radly-hit-burst { text-shadow: 0 0 12px currentColor; animation: hit-burst .48s cubic-bezier(.2,.8,.2,1) both; }
        .radly-hit-spark { position: absolute; width: 4px; height: 4px; left: 50%; top: 50%; border-radius: 50%; background: #fff; box-shadow: -24px -12px 0 #ffd700, 23px -10px 0 #00e5ff, -18px 14px 0 #e60067, 18px 15px 0 #fff; animation: spark-burst .48s ease-out both; }
        @media (min-width: 640px) { .radly-track { height: 310px; } }
        .radly-blackout { animation: stage-blackout .85s ease-in both; }
        @keyframes console-arrive { from { opacity: 0; transform: translateY(16px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes lane-hit { 35% { background: rgba(255,215,0,.12); } }
        @keyframes hit-burst { 0% { opacity: 0; transform: translate(-50%, 12px) scale(.45); } 35% { opacity: 1; transform: translate(-50%, -3px) scale(1.12); } 100% { opacity: 0; transform: translate(-50%, -22px) scale(1.45); } }
        @keyframes spark-burst { 0% { opacity: 0; transform: scale(.2); } 35% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(2.4); } }
        @keyframes stage-blackout { 0% { opacity: 0; } 22%, 58% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes synthwave-drift { to { background-position: 0 48px, 0 0; } }
        @media (prefers-reduced-motion: reduce) { .radly-console, .radly-blackout, .radly-synthwave, .radly-lane-hit, .radly-hit-burst, .radly-hit-spark { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
      `}</style>
    </div>
  );
}