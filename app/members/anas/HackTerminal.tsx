"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { X } from "lucide-react";

interface HackTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onHackSuccess: () => void;
  onCredentialSubmit?: () => void;
}

export default function HackTerminal({
  isOpen,
  onClose,
  onHackSuccess,
  onCredentialSubmit,
}: HackTerminalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
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

          // Fast typing effect (~20ms per char)
          tl.to(
            {},
            {
              duration: line.length * 0.02,
              onUpdate: function () {
                const progress = this.progress();
                const charCount = Math.floor(progress * line.length);
                lineEl.textContent =
                  line.substring(0, charCount) + (progress < 1 ? "█" : "");
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
      if (onCredentialSubmit) onCredentialSubmit();
      startBreachSequence();
    } else {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setErrorText(
        `[ERROR] ACCESS DENIED — Invalid credentials.\n[SYSTEM] Attempt detected. Attempts remaining: ${newAttempts}`
      );

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { x: -10 },
          {
            x: 10,
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

      // 1. Glitch Burst
      tl.add(() => {
        if (glitchRef.current) {
          glitchRef.current.classList.add("glitch-active");
        }
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
            duration: 0.4,
            onUpdate: function () {
              setBreachProgress(Math.floor(this.targets()[0].p));
            },
          }
        );

      // 3. Decrypting Database
      tl.add(() => {
        setBreachText("DECRYPTING DATABASE...");
        setBreachProgress(0);
      }).to(
        { p: 0 },
        {
          p: 100,
          duration: 0.5,
          onUpdate: function () {
            setBreachProgress(Math.floor(this.targets()[0].p));
          },
        }
      );

      // 4. Matrix Rain
      tl.add(() => {
        startMatrixRain();
      });

      // 5. Screen Flash & Access Granted
      tl.to(
        terminalRef.current,
        {
          backgroundColor: "#ffffff",
          duration: 0.08,
          yoyo: true,
          repeat: 1,
        },
        "+=0.1"
      )
        .add(() => {
          setShowAccessGranted(true);
        })
        .to({}, { duration: 0.8 })
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
        className="w-full max-w-2xl md:max-w-4xl max-h-[85vh] h-120 md:h-150 bg-[#0a0f0d] border-2 border-[#4ade80] rounded-xl shadow-[0_0_25px_rgba(74,222,128,0.25)] flex flex-col overflow-hidden relative"
      >
        {/* macOS Style Terminal Header */}
        <div className="bg-[#1e1e1e] border-b border-[#4ade80] px-4 py-3 flex justify-between items-center relative z-20">
          <div className="flex gap-2 items-center">
            <button
              onClick={handleAnimateClose}
              className="w-3.5 h-3.5 rounded-full bg-red-500 hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center text-[10px] text-red-950 font-bold"
              title="Close"
            >
              ×
            </button>
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>
          </div>
          <span className="text-[#4ade80] font-mono text-xs md:text-sm font-bold tracking-widest absolute left-1/2 -translate-x-1/2">
            root@proxy-shakespeare ~ %
          </span>
          <button
            onClick={handleAnimateClose}
            className="text-[#4ade80] hover:text-white transition-colors cursor-pointer p-1"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Terminal Body */}
        <div
          ref={glitchRef}
          className="flex-1 p-4 md:p-6 font-mono text-[#4ade80] text-sm md:text-base overflow-y-auto relative"
        >
          {/* Matrix Rain Container */}
          <div
            ref={rainContainerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 z-0"
          ></div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              {phase === "boot" && (
                <div
                  ref={bootTextRef}
                  className="whitespace-pre-wrap leading-relaxed text-sm md:text-base"
                ></div>
              )}

              {phase === "login" && (
                <div className="flex flex-col">
                  <div className="mb-6 whitespace-pre-wrap leading-relaxed text-xs sm:text-sm md:text-base opacity-90">
                    [SYSTEM] Secure connection established.
                    <br />
                    [SYSTEM] Target: PROXY_SHAKESPEARE_DB
                    <br />
                    [SYSTEM] Status: ENCRYPTED
                    <br />
                    <br />
                    AUTHENTICATION REQUIRED.
                  </div>

                  <form
                    ref={formRef}
                    onSubmit={handleLogin}
                    className="flex flex-col gap-4 max-w-md w-full"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-24 md:w-28 text-xs sm:text-sm md:text-base">
                        password:
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-transparent border-b-2 border-[#4ade80] outline-none text-[#4ade80] flex-1 font-mono focus:border-white focus:text-white transition-colors text-sm md:text-base px-1 py-0.5"
                        autoFocus
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-2 border-2 border-[#4ade80] py-2 px-4 hover:bg-[#4ade80] hover:text-[#0a0f0d] transition-colors font-bold tracking-widest text-left text-xs sm:text-sm md:text-base cursor-pointer"
                    >
                      {">"} [SUBMIT PASSWORD]
                      <span className="cursor-blink">_</span>
                    </button>
                  </form>

                  {errorText && (
                    <div className="mt-4 text-red-400 whitespace-pre-wrap text-xs sm:text-sm bg-red-950/30 p-3 border border-red-500/50 rounded">
                      {errorText}
                    </div>
                  )}
                </div>
              )}

              {phase === "breaching" && (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  {!showAccessGranted ? (
                    <div className="w-full max-w-lg">
                      <div className="text-lg md:text-xl mb-3 font-bold">
                        {breachText}
                      </div>
                      <div className="w-full h-6 border-2 border-[#4ade80] p-1 bg-black">
                        <div
                          className="h-full bg-[#4ade80] transition-all"
                          style={{ width: `${breachProgress}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-right text-xs md:text-sm">
                        {breachProgress}%
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#4ade80] animate-pulse drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]">
                      ACCESS GRANTED
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Leaked Note Hint */}
            {phase === "login" && (
              <div className="self-end mt-4 w-36 sm:w-44 bg-[#fef08a] p-3 text-black transform -rotate-3 shadow-lg border-2 border-black rounded">
                <div className="font-serif text-[10px] sm:text-xs opacity-75 underline">
                  note:
                </div>
                <div className="font-sans text-[11px] sm:text-xs font-bold">
                  terminal password:
                </div>
                <div className="font-mono text-[10px] sm:text-xs mt-1 bg-yellow-300 p-1 font-bold text-center border border-black/30 rounded">
                  pi2026
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
