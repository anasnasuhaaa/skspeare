"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { X } from "lucide-react";

interface HackTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onHackSuccess: () => void;
  onCredentialSubmit?: () => void;
}

export default function HackTerminal({ isOpen, onClose, onHackSuccess, onCredentialSubmit }: HackTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const bootTextRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const glitchRef = useRef<HTMLDivElement>(null);
  const rainContainerRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"boot" | "login" | "breaching">("boot");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  const [breachText, setBreachText] = useState("");
  const [breachProgress, setBreachProgress] = useState(0);
  const [showAccessGranted, setShowAccessGranted] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setPhase("boot");
      setUsername("");
      setPassword("");
      setErrorText("");
      setAttemptsLeft(3);
      setShowAccessGranted(false);
      setBreachText("");
      setBreachProgress(0);
    } else {
      gsap.killTweensOf("*");
    }
  }, [isOpen]);

  // Phase 1: Boot Sequence
  useEffect(() => {
    if (!isOpen || phase !== "boot") return;

    const lines = [
      "[SYSTEM] Initializing secure connection...",
      "[SYSTEM] Loading kernel modules... OK",
      "[SYSTEM] Establishing encrypted tunnel... OK",
      "[SYSTEM] Firewall bypass: ACTIVE",
      "[SYSTEM] Target system: PROXY_SHAKESPEARE_DB",
      "[SYSTEM] Status: LOCKED 🔒",
      "",
      "WARNING: Unauthorized access detected.",
      "Authentication required.",
    ];

    const tl = gsap.timeline({
      onComplete: () => setPhase("login")
    });

    if (bootTextRef.current) {
      bootTextRef.current.innerHTML = "";
      lines.forEach((line, i) => {
        const lineEl = document.createElement("div");
        lineEl.className = "min-h-[1.5em]";
        bootTextRef.current?.appendChild(lineEl);

        // Typing effect for each line
        tl.to({}, {
          duration: line.length * 0.05, // ~50ms per char for speed
          onUpdate: function () {
            const progress = this.progress();
            const charCount = Math.floor(progress * line.length);
            lineEl.textContent = line.substring(0, charCount) + (progress < 1 ? "█" : "");
          },
          ease: "none"
        }, "+=0.1"); // Small delay between lines
      });
    }

    return () => {
      tl.kill();
    };
  }, [isOpen, phase]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "proxy2025") {
      // Success!
      setErrorText("");
      if (onCredentialSubmit) onCredentialSubmit();
      startBreachSequence();
    } else {
      // Wrong credentials
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setErrorText(`[ERROR] ACCESS DENIED — Invalid credentials.\n[SYSTEM] Intrusion attempt logged. IP: 192.168.1.${Math.floor(Math.random() * 255)}\n[SYSTEM] Retry? (attempts remaining: ${newAttempts})`);

      // Shake animation
      if (formRef.current) {
        gsap.fromTo(formRef.current,
          { x: -10 },
          { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: "power1.inOut", onComplete: () => gsap.set(formRef.current, { x: 0 }) }
        );
      }
    }
  };

  const startBreachSequence = () => {
    setPhase("breaching");
    const tl = gsap.timeline();

    // 1. Glitch Burst
    tl.add(() => {
      if (glitchRef.current) {
        glitchRef.current.classList.add("glitch-active");
      }
    });

    // 2. Bypassing Firewall
    tl.to({}, { duration: 0.3 }) // Wait for glitch
      .add(() => {
        if (glitchRef.current) glitchRef.current.classList.remove("glitch-active");
        setBreachText("BYPASSING FIREWALL...");
      })
      .to({ p: 0 }, {
        p: 100,
        duration: 0.8,
        onUpdate: function () {
          setBreachProgress(Math.floor(this.targets()[0].p));
        }
      });

    // 3. Decrypting Database
    tl.add(() => {
      setBreachText("DECRYPTING DATABASE...");
      setBreachProgress(0);
    })
      .to({ p: 0 }, {
        p: 100,
        duration: 1.2,
        onUpdate: function () {
          setBreachProgress(Math.floor(this.targets()[0].p));
        }
      });

    // 4. Matrix Rain
    tl.add(() => {
      startMatrixRain();
    });

    // 5. Screen Flash & Access Granted
    tl.to(terminalRef.current, {
      backgroundColor: "#ffffff",
      duration: 0.1,
      yoyo: true,
      repeat: 1
    }, "+=0.5")
      .add(() => {
        setShowAccessGranted(true);
      })
      .to({}, { duration: 1.5 }) // Pause on Access Granted
      .add(() => {
        onHackSuccess();
      });
  };

  const startMatrixRain = () => {
    if (!rainContainerRef.current) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソ0123456789";
    const columns = 20;

    for (let i = 0; i < columns; i++) {
      const col = document.createElement("div");
      col.style.position = "absolute";
      col.style.left = `${(i / columns) * 100}%`;
      col.style.top = "-100%";
      col.style.color = "#00ff41";
      col.style.fontFamily = "monospace";
      col.style.fontSize = "20px";
      col.style.whiteSpace = "pre-wrap";
      col.style.wordBreak = "break-all";
      col.style.width = "20px";
      col.style.opacity = (Math.random() * 0.5 + 0.3).toString();

      let content = "";
      for (let j = 0; j < 30; j++) {
        content += chars[Math.floor(Math.random() * chars.length)] + "\\n";
      }
      col.innerHTML = content.replace(/\\n/g, '<br/>');
      rainContainerRef.current.appendChild(col);

      gsap.to(col, {
        top: "100%",
        duration: Math.random() * 2 + 1,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 2
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 crt-flicker scanlines"
        >
          <div
            ref={terminalRef}
            className="w-full max-w-4xl h-[80vh] bg-[#0a0f0d] border-4 border-[#00ff41] rounded-lg shadow-[0_0_30px_rgba(0,255,65,0.3)] flex flex-col overflow-hidden relative"
          >
            {/* Terminal Header */}
            <div className="bg-[#00ff41] text-[#0a0f0d] px-4 py-2 font-mono font-bold flex justify-between items-center">
              <span>ROOT@PROXY_SHAKESPEARE:~#</span>
              <button onClick={onClose} className="hover:bg-[#0a0f0d] hover:text-[#00ff41] p-1 rounded transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Terminal Body */}
            <div ref={glitchRef} className="flex-1 p-6 font-mono text-[#00ff41] text-lg overflow-hidden relative">

              {/* Matrix Rain Container */}
              <div ref={rainContainerRef} className="absolute inset-0 overflow-hidden pointer-events-none opacity-50 z-0"></div>

              <div className="relative z-10 h-full">
                {phase === "boot" && (
                  <div ref={bootTextRef} className="whitespace-pre-wrap leading-relaxed"></div>
                )}

                {phase === "login" && (
                  <div className="flex flex-col h-full">
                    <div className="mb-8 whitespace-pre-wrap leading-relaxed">
                      [SYSTEM] Initializing secure connection...<br />
                      [SYSTEM] Loading kernel modules... OK<br />
                      [SYSTEM] Establishing encrypted tunnel... OK<br />
                      [SYSTEM] Firewall bypass: ACTIVE<br />
                      [SYSTEM] Target system: PROXY_SHAKESPEARE_DB<br />
                      [SYSTEM] Status: LOCKED 🔒<br />
                      <br />
                      WARNING: Unauthorized access detected.<br />
                      Authentication required.
                    </div>

                    <form ref={formRef} onSubmit={handleLogin} className="flex flex-col gap-4 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="w-24">username:</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="bg-transparent border-b-2 border-[#00ff41] outline-none text-[#00ff41] flex-1 font-mono focus:border-white focus:text-white transition-colors"
                          autoFocus
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-24">password:</span>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-transparent border-b-2 border-[#00ff41] outline-none text-[#00ff41] flex-1 font-mono focus:border-white focus:text-white transition-colors"
                        />
                      </div>
                      <button type="submit" className="mt-4 border-2 border-[#00ff41] py-2 hover:bg-[#00ff41] hover:text-[#0a0f0d] transition-colors font-bold tracking-widest text-left px-4 group">
                        {">"} [EXECUTE LOGIN]<span className="cursor-blink group-hover:hidden">_</span>
                      </button>
                    </form>

                    {errorText && (
                      <div className="mt-6 text-red-500 whitespace-pre-wrap">
                        {errorText}
                      </div>
                    )}
                  </div>
                )}

                {phase === "breaching" && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    {!showAccessGranted ? (
                      <div className="w-full max-w-2xl">
                        <div className="text-2xl mb-4 font-bold">{breachText}</div>
                        <div className="w-full h-8 border-2 border-[#00ff41] p-1">
                          <div
                            className="h-full bg-[#00ff41]"
                            style={{ width: `${breachProgress}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-right">{breachProgress}%</div>
                      </div>
                    ) : (
                      <div className="text-6xl font-bold text-[#00ff41] animate-pulse drop-shadow-[0_0_20px_rgba(0,255,65,0.8)]">
                        ACCESS GRANTED
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Leaked Note Hint */}
              {phase === "login" && (
                <div className="absolute bottom-8 right-8 w-48 bg-[#fdfd96] p-4 text-black transform -rotate-6 shadow-lg border-2 border-black rotate-[-5deg]">
                  <div className="font-serif text-sm opacity-80 mb-2 underline">Note to self:</div>
                  <div className="font-sans text-sm font-bold">don't forget the login!!</div>
                  <div className="font-mono text-xs mt-2 bg-yellow-300 p-1">user: admin</div>
                  <div className="font-mono text-xs mt-1 bg-yellow-300 p-1">pass: proxy2025</div>

                  {/* Coffee Stain */}
                  <div className="absolute top-2 right-2 w-10 h-10 border-[3px] border-[#8b4513] rounded-full opacity-20 pointer-events-none"></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
