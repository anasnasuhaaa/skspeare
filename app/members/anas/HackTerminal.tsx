"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { X, Volume2, VolumeX } from "lucide-react";

interface HackTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onHackSuccess: () => void;
  onCredentialSubmit?: () => void;
}

// Powerful & Dynamic Web Audio API Sound Generator for HackTerminal
class TerminalSoundEngine {
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

  // 1. Loud & Punchy Mechanical Keystroke (Dual-layer Click + Thump)
  playKey(freq = 1050 + (Math.random() - 0.5) * 400) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Layer A: Crisp mechanical high click
      const oscA = ctx.createOscillator();
      const gainA = ctx.createGain();
      oscA.type = "square";
      oscA.frequency.setValueAtTime(freq, now);
      oscA.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.03);

      gainA.gain.setValueAtTime(0.18, now);
      gainA.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      oscA.connect(gainA);
      gainA.connect(ctx.destination);
      oscA.start(now);
      oscA.stop(now + 0.04);

      // Layer B: Body thump
      const oscB = ctx.createOscillator();
      const gainB = ctx.createGain();
      oscB.type = "sine";
      oscB.frequency.setValueAtTime(220, now);
      oscB.frequency.exponentialRampToValueAtTime(90, now + 0.04);

      gainB.gain.setValueAtTime(0.14, now);
      gainB.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      oscB.connect(gainB);
      gainB.connect(ctx.destination);
      oscB.start(now);
      oscB.stop(now + 0.05);
    } catch { }
  }

  // 2. Heavy Cyberpunk Error / Access Denied Alarm (Dual detuned sawtooth + Sub drop)
  playError() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Osc 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(175, now);
      osc1.frequency.linearRampToValueAtTime(75, now + 0.35);

      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // Osc 2 (Detuned chorus for abrasive grit)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(182, now);
      osc2.frequency.linearRampToValueAtTime(70, now + 0.35);

      gain2.gain.setValueAtTime(0.3, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.4);
    } catch { }
  }

  // 3. High-Energy Cyber Scan / Radar Sweep
  playScan(freq = 1100) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 2.2, now + 0.07);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);

      // Harmonizer
      const oscHarmonic = ctx.createOscillator();
      const gainHarmonic = ctx.createGain();
      oscHarmonic.type = "triangle";
      oscHarmonic.frequency.setValueAtTime(freq * 0.5, now);
      gainHarmonic.gain.setValueAtTime(0.12, now);
      gainHarmonic.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      oscHarmonic.connect(gainHarmonic);
      gainHarmonic.connect(ctx.destination);
      oscHarmonic.start(now);
      oscHarmonic.stop(now + 0.08);
    } catch { }
  }

  // 4. Power Surge / Breach Whoosh (Bass drop impact)
  playBreachSurge() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.45);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
    } catch { }
  }

  // 5. Triumphant 8-Bit Cyber Victory Fanfare (Multi-layered synth arpeggio + sub boom)
  playAccessGranted() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Sub boom impact
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(40, now + 0.6);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.7);

      // Triumphant Cyber Arpeggio: C4, E4, G4, C5, E5, G5, C6, E6
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.075;
        const noteDuration = i === notes.length - 1 ? 0.6 : 0.28;

        osc.type = i % 2 === 0 ? "triangle" : "square";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(i === notes.length - 1 ? 0.35 : 0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + noteDuration + 0.05);
      });
    } catch { }
  }
}

export default function HackTerminal({
  isOpen,
  onClose,
  onHackSuccess,
  onCredentialSubmit,
}: HackTerminalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [soundMuted, setSoundMuted] = useState(false);
  const soundEngineRef = useRef<TerminalSoundEngine>(new TerminalSoundEngine());

  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const bootTextRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const rainContainerRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"boot" | "login" | "breaching">("boot");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [breachText, setBreachText] = useState("");
  const [breachProgress, setBreachProgress] = useState(0);
  const [showAccessGranted, setShowAccessGranted] = useState(false);

  // Sync mute state
  useEffect(() => {
    soundEngineRef.current.enabled = !soundMuted;
  }, [soundMuted]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setPhase("boot");
      setPassword("");
      setErrorText("");
      setAttemptsLeft(3);
      setShowAccessGranted(false);
      setBreachText("");
      setBreachProgress(0);
      document.body.style.overflow = "hidden";
    } else if (shouldRender) {
      handleAnimateClose();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
  }, [isOpen]);

  // GSAP enter animation
  useEffect(() => {
    if (shouldRender && containerRef.current && terminalRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.out" }
        );
        gsap.fromTo(
          terminalRef.current,
          { scale: 0.95, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.4)" }
        );
      });
      return () => ctx.revert();
    }
  }, [shouldRender]);

  // Phase 1: Boot Sequence
  useEffect(() => {
    if (!shouldRender || phase !== "boot") return;

    const ctx = gsap.context(() => {
      const lines = [
        "[SYSTEM] Initializing secure connection...",
        "[SYSTEM] Establishing encrypted tunnel... OK",
        "[SYSTEM] Firewall bypass: ACTIVE",
        "[SYSTEM] Target system: PROXY_SHAKESPEARE_DB",
        "WARNING: Authentication required.",
      ];

      const tl = gsap.timeline({
        onComplete: () => setPhase("login"),
      });

      if (bootTextRef.current) {
        bootTextRef.current.innerHTML = "";
        lines.forEach((line) => {
          const lineEl = document.createElement("div");
          lineEl.className = "min-h-[1.5em]";
          bootTextRef.current?.appendChild(lineEl);

          // Fast typing effect (~20ms per char) with punchy audio clicks
          tl.to(
            {},
            {
              duration: line.length * 0.02,
              onUpdate: function () {
                const progress = this.progress();
                const charCount = Math.floor(progress * line.length);
                lineEl.textContent =
                  line.substring(0, charCount) + (progress < 1 ? "█" : "");
                if (charCount > 0 && charCount % 2 === 0) {
                  soundEngineRef.current.playKey(950 + Math.random() * 450);
                }
              },
              ease: "none",
            },
            "+=0.04"
          );
        });
      }
    });

    return () => ctx.revert();
  }, [shouldRender, phase]);

  const handleAnimateClose = () => {
    if (containerRef.current && terminalRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(terminalRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 20,
        duration: 0.2,
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
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "pi2026") {
      setErrorText("");
      soundEngineRef.current.playBreachSurge();
      if (onCredentialSubmit) onCredentialSubmit();
      startBreachSequence();
    } else {
      soundEngineRef.current.playError();
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setErrorText(
        `[ERROR] ACCESS DENIED — Invalid credentials.\n[SYSTEM] Attempt detected. Attempts remaining: ${newAttempts}`
      );

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { x: -12 },
          {
            x: 12,
            duration: 0.08,
            yoyo: true,
            repeat: 5,
            ease: "power1.inOut",
            onComplete: () => gsap.set(formRef.current, { x: 0 }),
          }
        );
      }
    }
  };

  const startBreachSequence = () => {
    setPhase("breaching");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Glitch Burst & Sound Surge
      tl.add(() => {
        if (glitchRef.current) {
          glitchRef.current.classList.add("glitch-active");
        }
        soundEngineRef.current.playScan(700);
      });

      // 2. Bypassing Firewall
      tl.to({}, { duration: 0.2 })
        .add(() => {
          if (glitchRef.current) glitchRef.current.classList.remove("glitch-active");
          setBreachText("BYPASSING FIREWALL...");
        })
        .to(
          { p: 0 },
          {
            p: 100,
            duration: 0.45,
            onUpdate: function () {
              const p = Math.floor(this.targets()[0].p);
              setBreachProgress(p);
              if (p % 12 === 0) soundEngineRef.current.playScan(800 + p * 8);
            },
          }
        );

      // 3. Decrypting Database
      tl.add(() => {
        setBreachText("DECRYPTING DATABASE...");
        setBreachProgress(0);
        soundEngineRef.current.playScan(1200);
      }).to(
        { p: 0 },
        {
          p: 100,
          duration: 0.55,
          onUpdate: function () {
            const p = Math.floor(this.targets()[0].p);
            setBreachProgress(p);
            if (p % 10 === 0) soundEngineRef.current.playScan(1100 + p * 12);
          },
        }
      );

      // 4. Matrix Rain
      tl.add(() => {
        startMatrixRain();
        soundEngineRef.current.playKey(1600);
      });

      // 5. Screen Flash & Access Granted
      tl.to(
        terminalRef.current,
        {
          backgroundColor: "#ffffff",
          duration: 0.09,
          yoyo: true,
          repeat: 1,
        },
        "+=0.1"
      )
        .add(() => {
          setShowAccessGranted(true);
          soundEngineRef.current.playAccessGranted();
        })
        .to({}, { duration: 0.9 })
        .add(() => {
          document.body.style.overflow = "";
          setShouldRender(false);
          onHackSuccess();
        });
    });
  };

  const startMatrixRain = () => {
    if (!rainContainerRef.current) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const columns = 12;

    for (let i = 0; i < columns; i++) {
      const col = document.createElement("div");
      col.style.position = "absolute";
      col.style.left = `${(i / columns) * 100}%`;
      col.style.top = "-100%";
      col.style.color = "#4ade80";
      col.style.fontFamily = "monospace";
      col.style.fontSize = "16px";
      col.style.whiteSpace = "pre-wrap";
      col.style.wordBreak = "break-all";
      col.style.width = "20px";
      col.style.opacity = (Math.random() * 0.3 + 0.1).toString();

      let content = "";
      for (let j = 0; j < 25; j++) {
        content += chars[Math.floor(Math.random() * chars.length)] + "\n";
      }
      col.innerHTML = content.replace(/\n/g, "<br/>");
      rainContainerRef.current.appendChild(col);

      gsap.to(col, {
        top: "100%",
        duration: Math.random() * 1.5 + 0.8,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 0.5,
      });
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/90 p-3 sm:p-4 crt-flicker scanlines"
    >
      <div
        ref={terminalRef}
        className="w-full max-w-2xl md:max-w-4xl max-h-[88vh] h-130 md:h-145 bg-[#090d14] border-4 border-nb-black rounded-2xl sm:rounded-3xl shadow-[10px_10px_0px_var(--nb-black)] sm:shadow-[14px_14px_0px_var(--nb-black)] flex flex-col overflow-hidden relative"
      >
        {/* Neobrutalist Cyber Terminal Header */}
        <div className="bg-nb-yellow border-b-4 border-nb-black px-4 py-3 sm:py-3.5 flex justify-between items-center relative z-20 select-none">
          {/* Left Window Traffic Lights */}
          <div className="flex gap-2 items-center">
            <button
              onClick={handleAnimateClose}
              className="w-4 h-4 rounded-full bg-nb-red border-2 border-nb-black shadow-[1.5px_1.5px_0px_var(--nb-black)] hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center text-[9px] text-white font-bold"
              title="Tutup Terminal"
              aria-label="Tutup Terminal"
            >
              ×
            </button>
            <div className="w-4 h-4 rounded-full bg-nb-yellow border-2 border-nb-black shadow-[1.5px_1.5px_0px_var(--nb-black)]" />
            <div className="w-4 h-4 rounded-full bg-nb-lime border-2 border-nb-black shadow-[1.5px_1.5px_0px_var(--nb-black)]" />
          </div>

          {/* Center Title Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-nb-white border-2 border-nb-black rounded-lg px-3 py-1 shadow-[2px_2px_0px_var(--nb-black)] font-mono font-black text-xs text-nb-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-nb-lime animate-pulse border border-nb-black" />
            <span>0xANAS // SECURITY GATEWAY</span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundMuted(!soundMuted)}
              className="bg-nb-white hover:bg-nb-cream text-nb-black border-2 border-nb-black rounded-lg px-2.5 py-1 text-xs font-mono font-bold shadow-[2px_2px_0px_var(--nb-black)] flex items-center gap-1 transition-all cursor-pointer"
              title={soundMuted ? "Unmute terminal sounds" : "Mute terminal sounds"}
              aria-label={soundMuted ? "Unmute sound" : "Mute sound"}
            >
              {soundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span className="hidden md:inline">{soundMuted ? "MUTED" : "SFX"}</span>
            </button>

            {/* Skip / Bypass Button */}
            <button
              type="button"
              onClick={() => {
                soundEngineRef.current.playAccessGranted();
                document.body.style.overflow = "";
                setShouldRender(false);
                onHackSuccess();
              }}
              className="px-2.5 sm:px-3 py-1 bg-nb-pink hover:bg-nb-lime text-nb-black border-2 border-nb-black rounded-lg font-display font-black text-xs uppercase shadow-[2px_2px_0px_var(--nb-black)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all cursor-pointer flex items-center gap-1"
              title="Lewati hack sequence dan langsung buka profil"
            >
              <span>Lewati</span>
              <span>→</span>
            </button>

            {/* Close Button */}
            <button
              onClick={handleAnimateClose}
              className="p-1 bg-nb-red hover:bg-nb-yellow text-white hover:text-nb-black border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center justify-center"
              title="Close"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={glitchRef}
          className="flex-1 p-4 sm:p-6 md:p-8 font-mono text-[#4ade80] text-sm md:text-base overflow-y-auto relative bg-[#090d14]"
        >
          {/* Matrix Rain Container */}
          <div
            ref={rainContainerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 z-0"
          />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              {/* Phase 1: Boot Sequence */}
              {phase === "boot" && (
                <div
                  ref={bootTextRef}
                  className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm md:text-base font-mono text-[#4ade80] drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]"
                />
              )}

              {/* Phase 2: Login / Authentication */}
              {phase === "login" && (
                <div className="flex flex-col">
                  {/* Status Banner */}
                  <div className="mb-5 p-3.5 bg-[#121a24] border-2 border-[#4ade80]/60 rounded-xl text-xs sm:text-sm leading-relaxed shadow-[3px_3px_0px_rgba(74,222,128,0.3)]">
                    <div className="flex items-center gap-2 text-nb-lime font-bold mb-1">
                      <span className="w-2 h-2 rounded-full bg-nb-lime animate-ping" />
                      <span>[ENCRYPTED TUNNEL ESTABLISHED]</span>
                    </div>
                    <p className="text-white/80">
                      TARGET: <strong className="text-nb-yellow font-mono">PROXY_SHAKESPEARE_MAINFRAME</strong>
                      <br />
                      STATUS: <span className="text-nb-pink font-bold">LOCKED // PASSWORD REQUIRED</span>
                    </p>
                  </div>

                  {/* Input Form */}
                  <form
                    ref={formRef}
                    onSubmit={handleLogin}
                    className="flex flex-col gap-3.5 max-w-lg w-full"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-[#121922] border-[3px] border-[#4ade80] rounded-xl p-3 sm:p-3.5 shadow-[4px_4px_0px_#4ade80]">
                      <span className="text-xs sm:text-sm font-bold text-nb-lime shrink-0">
                        {">"} ENTER_KEY:
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          soundEngineRef.current.playKey(1000 + Math.random() * 300);
                        }}
                        className="bg-transparent border-b-2 border-[#4ade80]/60 focus:border-nb-lime outline-none text-white font-mono focus:text-nb-lime transition-colors text-sm sm:text-base px-2 py-1 flex-1"
                        autoFocus
                        placeholder="masukkan passcode..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-3 px-5 bg-nb-lime hover:bg-nb-yellow border-[3px] border-nb-black rounded-xl font-display font-black text-xs sm:text-sm uppercase text-nb-black shadow-[4px_4px_0px_var(--nb-black)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_var(--nb-black)] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-between"
                    >
                      <span>[⚡ EXECUTE BREACH]</span>
                      <span className="cursor-blink font-mono font-bold">_</span>
                    </button>
                  </form>

                  {/* Error Notification */}
                  {errorText && (
                    <div className="mt-4 text-nb-red whitespace-pre-wrap text-xs sm:text-sm bg-nb-red/15 p-3.5 border-2 border-nb-red rounded-xl font-bold shadow-[3px_3px_0px_var(--nb-black)]">
                      {errorText}
                    </div>
                  )}
                </div>
              )}

              {/* Phase 3: Breaching Animations */}
              {phase === "breaching" && (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  {!showAccessGranted ? (
                    <div className="w-full max-w-md">
                      <div className="text-base sm:text-lg md:text-xl mb-3 font-display font-black text-nb-lime uppercase tracking-wider flex items-center justify-center gap-2">
                        <span className="animate-spin text-nb-yellow">⚙</span>
                        <span>{breachText}</span>
                      </div>
                      <div className="w-full h-7 border-[3px] border-nb-black rounded-xl p-1 bg-black shadow-[4px_4px_0px_#4ade80] overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-nb-lime via-nb-yellow to-nb-blue rounded-lg transition-all duration-75"
                          style={{ width: `${breachProgress}%` }}
                        />
                      </div>
                      <div className="mt-2.5 text-right font-mono font-black text-xs sm:text-sm text-nb-lime">
                        {breachProgress}% COMPLETED
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center animate-in zoom-in-90 duration-300">
                      <div className="px-6 sm:px-10 py-4 sm:py-6 bg-nb-lime border-4 border-nb-black rounded-2xl sm:rounded-3xl shadow-[8px_8px_0px_var(--nb-black)] text-center transform -rotate-1">
                        <div className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-nb-black tracking-tight drop-shadow-[2px_2px_0px_var(--nb-white)]">
                          ACCESS GRANTED!
                        </div>
                        <div className="mt-1 font-mono text-xs sm:text-sm font-bold text-nb-black uppercase">
                          🔓 Membuka Berkas Profil Anas...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Leaked Sticky Note Clue (Neobrutalism Styled Post-It) */}
            {phase === "login" && (
              <div
                onClick={() => {
                  setPassword("pi2026");
                  soundEngineRef.current.playKey(1250);
                }}
                className="self-end mt-4 max-w-55 sm:max-w-xs bg-nb-yellow p-3.5 sm:p-4 text-nb-black border-[3px] border-nb-black rounded-xl shadow-[5px_5px_0px_var(--nb-black)] transform -rotate-3 hover:rotate-0 hover:scale-105 active:scale-95 transition-all cursor-pointer select-none relative group"
                title="Klik untuk auto-fill passcode"
              >
                {/* Washi Tape on Sticky Note */}
                <div
                  aria-hidden="true"
                  className="absolute -top-2.5 left-6 w-16 h-5 bg-nb-cream/80 border border-nb-black/30 backdrop-blur-xs -rotate-6 pointer-events-none shadow-[1px_1px_0px_rgba(0,0,0,0.15)]"
                />

                <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono font-black text-nb-black/70 mb-1">
                  <span>📌 LEAKED NOTE</span>
                  <span className="bg-nb-black text-nb-yellow px-1.5 py-0.2 rounded text-[9px] font-black group-hover:bg-nb-lime group-hover:text-nb-black transition-colors">
                    TAP TO FILL ⚡
                  </span>
                </div>
                <div className="font-display font-black text-xs sm:text-sm leading-tight text-nb-black mb-1.5">
                  Terminal Passcode:
                </div>
                <div className="font-mono text-xs sm:text-sm bg-nb-white border-2 border-nb-black p-1.5 font-black text-center rounded-lg flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_var(--nb-black)] text-nb-black">
                  <span>pi2026</span>
                  <span className="text-xs">🔑</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
