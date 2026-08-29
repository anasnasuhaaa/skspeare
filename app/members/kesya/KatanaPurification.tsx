"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Sparkles, Zap, ShieldAlert, FastForward, Swords, X } from "lucide-react";
import gsap from "gsap";
import { soundFX } from "./soundEffects";

interface KatanaPurificationProps {
  onSuccess: () => void;
  onSkip: () => void;
  onClose?: () => void;
}

// Particle interface for Blood Splatters, 3D Crystals & Rose Petals
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  rotationY: number;
  vRotY: number;
  type: "blood" | "crystal" | "petal" | "sparkle";
  color: string;
  alpha: number;
  decay: number;
  scale: number;
}

// Trail point interface
interface TrailPoint {
  x: number;
  y: number;
  time: number;
  width: number;
}

// Atmospheric fog particle
interface FogParticle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
}

// Helper to remove white backgrounds on client-side
function processTransparentImage(src: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(src);
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(src);
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i],
          g = d[i + 1],
          b = d[i + 2];

        // Pure white removal for zombie and katana assets
        if (r > 215 && g > 215 && b > 215) {
          d[i + 3] = 0;
        } else if (r > 185 && g > 185 && b > 185) {
          const factor = (215 - Math.max(r, g, b)) / 30;
          d[i + 3] = Math.max(0, Math.min(255, d[i + 3] * factor));
        }
      }
      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export default function KatanaPurification({
  onSuccess,
  onSkip,
  onClose,
}: KatanaPurificationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);

  const [isSwiping, setIsSwiping] = useState(false);
  const [isPurified, setIsPurified] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [showAutoHint, setShowAutoHint] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [slashAngle, setSlashAngle] = useState(-45);
  const [isAberrationActive, setIsAberrationActive] = useState(false);

  // Transparent Asset URLs
  const [zombie1Src, setZombie1Src] = useState<string>("/asset/kesya/zombie1.png");
  const [zombie2Src, setZombie2Src] = useState<string>("/asset/kesya/zombie2.png");
  const [katanaSrc, setKatanaSrc] = useState<string>("/asset/kesya/katana.png");

  // Slash gesture tracking refs
  const pointsRef = useRef<TrailPoint[]>([]);
  const startPointRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const fogRef = useRef<FogParticle[]>([]);
  const lastWhooshTimeRef = useRef(0);
  const hasTriggeredGrowlRef = useRef(false);

  const flashRef = useRef<{
    active: boolean;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    alpha: number;
    width: number;
    radialX: number;
    radialY: number;
    radialRadius: number;
  }>({
    active: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    alpha: 0,
    width: 0,
    radialX: 0,
    radialY: 0,
    radialRadius: 0,
  });

  const animFrameIdRef = useRef<number | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pre-process transparent images on client
  useEffect(() => {
    processTransparentImage("/asset/kesya/zombie1.png").then(setZombie1Src);
    processTransparentImage("/asset/kesya/zombie2.png").then(setZombie2Src);
    processTransparentImage("/asset/kesya/katana.png").then(setKatanaSrc);
  }, []);

  // Inactivity auto-hint timer (after 3.5s of no interaction)
  useEffect(() => {
    idleTimerRef.current = setTimeout(() => {
      if (!isPurified) {
        setShowAutoHint(true);
      }
    }, 3500);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isPurified]);

  // Initialize Fog & Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Initialize atmospheric fog particles
    const rect = canvas.getBoundingClientRect();
    const fogCount = 20;
    fogRef.current = Array.from({ length: fogCount }, () => ({
      x: Math.random() * (rect.width || 800),
      y: Math.random() * (rect.height || 600),
      radius: 70 + Math.random() * 110,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: 0.05 + Math.random() * 0.08,
    }));

    // Animation Loop (60fps)
    const render = () => {
      const width = canvas.width / Math.min(window.devicePixelRatio || 1, 2);
      const height = canvas.height / Math.min(window.devicePixelRatio || 1, 2);

      ctx.clearRect(0, 0, width, height);

      // 1. Draw atmospheric fog (ambient horror mist)
      if (!isPurified) {
        fogRef.current.forEach((fog) => {
          fog.x += fog.vx;
          fog.y += fog.vy;
          if (fog.x < -fog.radius) fog.x = width + fog.radius;
          if (fog.x > width + fog.radius) fog.x = -fog.radius;
          if (fog.y < -fog.radius) fog.y = height + fog.radius;
          if (fog.y > height + fog.radius) fog.y = -fog.radius;

          const grad = ctx.createRadialGradient(
            fog.x,
            fog.y,
            0,
            fog.x,
            fog.y,
            fog.radius
          );
          grad.addColorStop(0, `rgba(255, 46, 158, ${fog.alpha * 1.2})`);
          grad.addColorStop(0.5, `rgba(183, 110, 121, ${fog.alpha * 0.7})`);
          grad.addColorStop(1, "rgba(10, 6, 13, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 2. Draw Katana Blade Ribbon Trail & Blood Drops
      const currentTime = performance.now();
      const points = pointsRef.current;

      while (points.length > 0 && currentTime - points[0].time > 280) {
        points.shift();
      }

      if (points.length > 1) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1];
          const p1 = points[i];
          const ageRatio = 1 - (currentTime - p1.time) / 280;
          if (ageRatio <= 0) continue;

          // Outer Glow (Neon Magenta)
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(255, 46, 158, ${ageRatio * 0.75})`;
          ctx.lineWidth = p1.width * 2.8 * ageRatio;
          ctx.shadowColor = "#FF2E9E";
          ctx.shadowBlur = 20;
          ctx.stroke();

          // Rose Gold Mid layer
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(224, 168, 153, ${ageRatio * 0.9})`;
          ctx.lineWidth = p1.width * 1.5 * ageRatio;
          ctx.shadowColor = "#B76E79";
          ctx.shadowBlur = 10;
          ctx.stroke();

          // Intense White Core Blade Streak
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${ageRatio * 0.95})`;
          ctx.lineWidth = Math.max(2, p1.width * 0.5 * ageRatio);
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Draw Radial Light Burst & Katana Flash Beam
      if (flashRef.current.active && flashRef.current.alpha > 0.01) {
        const flash = flashRef.current;
        ctx.save();

        // Radial burst from cut center
        if (flash.radialRadius > 0) {
          const radGrad = ctx.createRadialGradient(
            flash.radialX,
            flash.radialY,
            0,
            flash.radialX,
            flash.radialY,
            flash.radialRadius
          );
          radGrad.addColorStop(0, `rgba(255, 255, 255, ${flash.alpha * 0.95})`);
          radGrad.addColorStop(0.3, `rgba(255, 46, 158, ${flash.alpha * 0.7})`);
          radGrad.addColorStop(0.7, `rgba(224, 168, 153, ${flash.alpha * 0.4})`);
          radGrad.addColorStop(1, "rgba(255, 46, 158, 0)");

          ctx.fillStyle = radGrad;
          ctx.beginPath();
          ctx.arc(flash.radialX, flash.radialY, flash.radialRadius, 0, Math.PI * 2);
          ctx.fill();

          flash.radialRadius += 16;
        }

        // Mega crystal beam along cut line
        ctx.lineCap = "round";
        const grad = ctx.createLinearGradient(flash.x1, flash.y1, flash.x2, flash.y2);
        grad.addColorStop(0, `rgba(255, 46, 158, 0)`);
        grad.addColorStop(0.2, `rgba(255, 255, 255, ${flash.alpha})`);
        grad.addColorStop(0.5, `rgba(247, 231, 206, ${flash.alpha})`);
        grad.addColorStop(0.8, `rgba(255, 255, 255, ${flash.alpha})`);
        grad.addColorStop(1, `rgba(255, 46, 158, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = flash.width;
        ctx.shadowColor = "#FF2E9E";
        ctx.shadowBlur = 35;

        ctx.beginPath();
        ctx.moveTo(flash.x1, flash.y1);
        ctx.lineTo(flash.x2, flash.y2);
        ctx.stroke();

        ctx.restore();

        flash.alpha *= 0.88;
        flash.width *= 0.92;
        if (flash.alpha <= 0.01) flash.active = false;
      }

      // 4. Update & Render Particles (Blood, 3D Crystals, Petals & Sparkles)
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.rotationY += p.vRotY;
        p.alpha -= p.decay;

        if (p.type === "blood") {
          p.vy += 0.22;
          p.vx *= 0.98;
        } else if (p.type === "petal") {
          p.vy += 0.08;
          p.vx += Math.sin(p.rotation) * 0.05;
        } else if (p.type === "crystal") {
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.vy += 0.04;
        }

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === "blood") {
          // Dark Elegant Crimson Splatter
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = "#8B0000";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.7, p.rotation, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "crystal") {
          // 3D Crystal Shard (Faceted Diamond Polygon with Y-axis perspective scale)
          const scaleX = Math.cos(p.rotationY) * p.scale;
          const scaleY = p.scale;
          ctx.scale(scaleX, scaleY);

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = "#FF2E9E";
          ctx.shadowBlur = 12;

          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.7, 0);
          ctx.lineTo(0, p.size * 1.3);
          ctx.lineTo(-p.size * 0.7, 0);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.4, 0);
          ctx.lineTo(0, p.size * 0.8);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === "petal") {
          // Rose Petal Shape
          const scaleX = Math.cos(p.rotationY * 0.5) * p.scale;
          ctx.scale(scaleX, p.scale);

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.92;
          ctx.shadowColor = "#B76E79";
          ctx.shadowBlur = 6;

          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(
            p.size * 0.8,
            -p.size * 0.5,
            p.size * 0.8,
            p.size * 0.8,
            0,
            p.size
          );
          ctx.bezierCurveTo(
            -p.size * 0.8,
            p.size * 0.8,
            -p.size * 0.8,
            -p.size * 0.5,
            0,
            -p.size
          );
          ctx.closePath();
          ctx.fill();
        } else {
          // Sparkle
          ctx.fillStyle = "#FFFFFF";
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPurified]);

  // Trigger Full Purification FX (Power Fantasy, Blood Burst, Crystals, Petals & SFX)
  const triggerPurificationFX = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      setSlashAngle(angle);

      // 1. Procedural Audio Trigger
      soundFX.playSlashCut();
      soundFX.playSubRumble();
      setTimeout(() => {
        soundFX.playCrystalPurification();
      }, 80);

      // 2. Power Fantasy Flash & Radial Shockwave
      flashRef.current = {
        active: true,
        x1,
        y1,
        x2,
        y2,
        alpha: 1,
        width: 42,
        radialX: midX,
        radialY: midY,
        radialRadius: 25,
      };

      // 3. Brief 1-Frame Chromatic Aberration Power Punch
      if (!prefersReducedMotion) {
        setIsAberrationActive(true);
        setTimeout(() => setIsAberrationActive(false), 90);
      }

      // 4. Spawn Blood Splatters + 3D Crystal Shards + Rose Petals
      const bloodColors = ["#8B0000", "#7A0016", "#9E1B32", "#58000B"];
      const shardColors = ["#FFFFFF", "#E0F7FA", "#FF2E9E", "#B76E79", "#F7E7CE"];
      const petalColors = ["#B76E79", "#D48C95", "#FF2E9E", "#E8A598", "#9B111E"];

      const particleCount = prefersReducedMotion ? 40 : 135;
      const newParticles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        const t = Math.random();
        const px = x1 + dx * t;
        const py = y1 + dy * t;
        const side = Math.random() > 0.5 ? 1 : -1;
        const speed = (3.5 + Math.random() * 8.5) * (prefersReducedMotion ? 0.5 : 1);
        const spreadX = (Math.random() - 0.5) * 5;
        const spreadY = (Math.random() - 0.5) * 5;

        if (i < particleCount * 0.35) {
          // Blood Splatter Particles
          newParticles.push({
            x: px,
            y: py,
            vx: nx * side * speed * 1.25 + spreadX,
            vy: ny * side * speed * 1.25 + spreadY,
            size: 3 + Math.random() * 6,
            rotation: Math.random() * Math.PI * 2,
            vRot: 0.1,
            rotationY: 0,
            vRotY: 0,
            type: "blood",
            color: bloodColors[Math.floor(Math.random() * bloodColors.length)],
            alpha: 1,
            decay: 0.015 + Math.random() * 0.02,
            scale: 0.8 + Math.random() * 0.6,
          });
        } else if (i < particleCount * 0.7) {
          // 3D Crystal Shards
          newParticles.push({
            x: px,
            y: py,
            vx: nx * side * speed + spreadX,
            vy: ny * side * speed + spreadY,
            size: 6 + Math.random() * 11,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.18,
            rotationY: Math.random() * Math.PI * 2,
            vRotY: (Math.random() - 0.5) * 0.25,
            type: "crystal",
            color: shardColors[Math.floor(Math.random() * shardColors.length)],
            alpha: 1,
            decay: 0.012 + Math.random() * 0.015,
            scale: 0.7 + Math.random() * 0.8,
          });
        } else {
          // Rose Petals
          newParticles.push({
            x: px,
            y: py,
            vx: nx * side * speed * 0.7 + spreadX,
            vy: ny * side * speed * 0.7 + spreadY,
            size: 7 + Math.random() * 8,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.12,
            rotationY: Math.random() * Math.PI * 2,
            vRotY: (Math.random() - 0.5) * 0.15,
            type: "petal",
            color: petalColors[Math.floor(Math.random() * petalColors.length)],
            alpha: 1,
            decay: 0.01 + Math.random() * 0.012,
            scale: 0.6 + Math.random() * 0.8,
          });
        }
      }

      particlesRef.current.push(...newParticles);

      // 5. Screen Shake
      if (!prefersReducedMotion && containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { x: -6, y: 4, rotation: -0.5 },
          {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.25,
            ease: "elastic.out(1, 0.3)",
          }
        );
      }

      // 6. Split Zombie Hero & Horde Layers along slash normal
      if (topHalfRef.current && bottomHalfRef.current) {
        const splitDistance = prefersReducedMotion ? 40 : 140;

        gsap.to(topHalfRef.current, {
          x: nx * splitDistance,
          y: ny * splitDistance,
          rotation: (angle > 0 ? -1 : 1) * 10,
          opacity: 0,
          scale: 0.88,
          duration: 0.7,
          ease: "power2.out",
        });

        gsap.to(bottomHalfRef.current, {
          x: -nx * splitDistance,
          y: -ny * splitDistance,
          rotation: (angle > 0 ? 1 : -1) * 10,
          opacity: 0,
          scale: 0.88,
          duration: 0.7,
          ease: "power2.out",
        });
      }

      // 7. Complete transition into revealed modal
      setIsPurified(true);
      setTimeout(() => {
        onSuccess();
      }, 780);
    },
    [onSuccess]
  );

  // Trigger quick instant purification (Keyboard or Button)
  const executeInstantPurification = useCallback(() => {
    if (isPurified || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x1 = rect.width * 0.15;
    const y1 = rect.height * 0.2;
    const x2 = rect.width * 0.85;
    const y2 = rect.height * 0.8;

    triggerPurificationFX(x1, y1, x2, y2);
  }, [isPurified, triggerPurificationFX]);

  // Keyboard shortcut listener (Space / Enter triggers instant slash)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        soundFX.getContext();
        executeInstantPurification();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [executeInstantPurification]);

  // Pointer Event Handlers (Unified Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPurified) return;

    // Safely resume AudioContext & play menacing zombie growl on first interaction
    soundFX.getContext();
    if (!hasTriggeredGrowlRef.current) {
      soundFX.playZombieGrowl();
      hasTriggeredGrowlRef.current = true;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const time = performance.now();

    setIsSwiping(true);
    setShowAutoHint(false);
    startPointRef.current = { x, y, time };
    pointsRef.current = [{ x, y, time, width: 8 }];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (!isSwiping || isPurified) return;

    const time = performance.now();
    const points = pointsRef.current;
    const lastPoint = points[points.length - 1];

    if (lastPoint) {
      const dist = Math.hypot(x - lastPoint.x, y - lastPoint.y);
      if (dist > 3) {
        const dt = Math.max(time - lastPoint.time, 1);
        const velocity = dist / dt;
        const width = Math.min(Math.max(velocity * 4, 4), 16);

        // Update angle for blade cursor orientation
        const angle = Math.atan2(y - lastPoint.y, x - lastPoint.x) * (180 / Math.PI);
        setSlashAngle(angle);

        points.push({ x, y, time, width });

        // Play Procedural Whoosh on fast movement
        if (velocity > 0.55 && time - lastWhooshTimeRef.current > 130) {
          soundFX.playWhoosh(Math.min(velocity, 2.5));
          lastWhooshTimeRef.current = time;
        }

        // Emit Trail Blood Drops & Crystal Sparkles
        if (Math.random() > 0.3) {
          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: 2 + Math.random() * 3.5,
            rotation: Math.random() * Math.PI,
            vRot: 0.1,
            rotationY: 0,
            vRotY: 0,
            type: Math.random() > 0.5 ? "blood" : "sparkle",
            color: Math.random() > 0.5 ? "#8B0000" : "#FF2E9E",
            alpha: 0.85,
            decay: 0.035,
            scale: 1,
          });
        }
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSwiping || isPurified) return;
    setIsSwiping(false);

    const rect = e.currentTarget.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const endTime = performance.now();
    const start = startPointRef.current;

    if (!start) return;

    const distance = Math.hypot(endX - start.x, endY - start.y);
    const duration = Math.max(endTime - start.time, 1);
    const velocity = distance / duration;
    const minDistanceThreshold = Math.max(rect.width * 0.35, 140);
    const minVelocityThreshold = 0.35;

    if (distance >= minDistanceThreshold && velocity >= minVelocityThreshold) {
      triggerPurificationFX(start.x, start.y, endX, endY);
    } else {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      setFeedbackText(
        distance < minDistanceThreshold
          ? "Ayunan kurang panjang! Tarik tebasan lebih lebar ⚔️"
          : "Tebas lebih cepat & tegas untuk membasmi! ⚡"
      );

      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedbackText(null);
      }, 1600);
    }

    startPointRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full h-130 sm:h-145 md:h-155 bg-[#070409] select-none overflow-hidden touch-none md:cursor-none flex flex-col justify-between ${isAberrationActive ? "contrast-150 hue-rotate-15 filter" : ""
        }`}
      role="application"
      aria-label="Interactive Katana Slash Minigame"
    >
      {/* Luxury Gothic Serif & Modern Display Typography */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@400;600;800;900&display=swap');
            .font-luxury-title { font-family: 'Cinzel', serif; }
            .font-luxury-serif { font-family: 'Cormorant Garamond', serif; }
            .font-luxury-sans { font-family: 'Montserrat', sans-serif; }
            @keyframes bladeSheen {
              0% { transform: translateX(-100%) skewX(-25deg); }
              100% { transform: translateX(200%) skewX(-25deg); }
            }
            .animate-blade-sheen {
              animation: bladeSheen 2.5s infinite;
            }
          `,
        }}
      />

      {/* ============================================================
          BASE LAYER: BG.JPEG POST-APOCALYPTIC RUINS BACKDROP
          ============================================================ */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Background Image: Ruins with Overgrown Tree Arch & Cars */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75 contrast-110 saturate-125"
          style={{
            backgroundImage: "url('/asset/kesya/bg.jpeg'), url('/asset/kesya/bg-katana.jpeg'), radial-gradient(ellipse at center, #260e2a 0%, #08030b 75%, #020104 100%)",
          }}
        />
        {/* Dark Moody Vignette & Horror Atmosphere Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-[#08030b]/85 via-[#15071b]/45 to-[#08030b]/90" />
      </div>

      {/* HTML5 Particle, Trail, Blood & Flash Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* ============================================================
          ZOMBIE THREAT SILHOUETTES & ASSETS (SPLIT TWO HALVES)
          ============================================================ */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Top Half Zombie Layer */}
        <div
          ref={topHalfRef}
          className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 55%, 0 45%)",
          }}
        >
          {/* Background Zombie 2 (Distance Decayed Walker Silhouette) */}
          <div className="absolute left-[10%] bottom-[12%] w-36 h-64 sm:w-44 sm:h-72 opacity-40 filter grayscale brightness-50 contrast-150 pointer-events-none">
            <Image
              src={zombie2Src}
              alt="Decayed Zombie Walker"
              fill
              className="object-contain"
              sizes="180px"
              priority
            />
          </div>

          {/* Hero Closeup Zombie 1 (Fresh / Menacing Target Center) */}
          <div className="relative w-72 h-80 sm:w-96 sm:h-100 md:w-md md:h-116 opacity-90 filter contrast-125 brightness-95 drop-shadow-[0_0_30px_rgba(255,46,158,0.5)]">
            <Image
              src={zombie1Src}
              alt="Menacing Zombie Target"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 288px, 448px"
              priority
            />

            {/* Glowing Menacing Red Eyes */}
            <div className="absolute top-[32%] left-[45%] w-2 h-2 rounded-full bg-[#FF2E9E] shadow-[0_0_12px_#FF2E9E] animate-ping" />
            <div className="absolute top-[32%] left-[54%] w-2 h-2 rounded-full bg-[#FF2E9E] shadow-[0_0_12px_#FF2E9E] animate-ping" />
          </div>
        </div>

        {/* Bottom Half Zombie Layer */}
        <div
          ref={bottomHalfRef}
          className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform"
          style={{
            clipPath: "polygon(0 45%, 100% 55%, 100% 100%, 0 100%)",
          }}
        >
          {/* Background Zombie 2 */}
          <div className="absolute left-[10%] bottom-[12%] w-36 h-64 sm:w-44 sm:h-72 opacity-40 filter grayscale brightness-50 contrast-150 pointer-events-none">
            <Image
              src={zombie2Src}
              alt="Decayed Zombie Walker"
              fill
              className="object-contain"
              sizes="180px"
              priority
            />
          </div>

          {/* Hero Closeup Zombie 1 */}
          <div className="relative w-72 h-80 sm:w-96 sm:h-100 md:w-md md:h-116 opacity-90 filter contrast-125 brightness-95 drop-shadow-[0_0_30px_rgba(255,46,158,0.5)]">
            <Image
              src={zombie1Src}
              alt="Menacing Zombie Target"
              fill
              className="object-contain"
              sizes="(max-width: 640px) 288px, 448px"
              priority
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          TOP HUD BAR
          ============================================================ */}
      <div className="relative z-30 p-3.5 sm:p-5 flex items-center justify-between pointer-events-none">
        {/* Left Status Badge */}
        <div className="flex items-center gap-2 bg-[#120817]/90 border border-[#B76E79]/60 px-3 sm:px-4 py-1.5 rounded-xl shadow-[0_0_15px_rgba(255,46,158,0.25)] pointer-events-auto backdrop-blur-md">
          <ShieldAlert size={15} className="text-[#FF2E9E] animate-pulse" />
          <span className="font-luxury-sans font-extrabold text-[10px] sm:text-xs text-[#F7E7CE] tracking-wider uppercase">
            {"SECTOR INFESTATION // SWIPE TO PURIFY"}
          </span>
        </div>

        {/* Right Controls: Skip + Close Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Instant Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFX.getContext();
              onSkip();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[#1a0c20]/90 hover:bg-[#B76E79] text-[#F7E7CE] hover:text-white border border-[#B76E79]/60 hover:border-[#FF2E9E] rounded-xl font-luxury-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_12px_rgba(183,110,121,0.3)] hover:scale-105"
            title="Lewati minigame dan langsung buka profil"
            aria-label="Lewati minigame tebasan katana"
          >
            <FastForward size={13} />
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
              className="w-8 h-8 sm:w-9 sm:h-9 bg-[#1a0c20]/90 hover:bg-[#FF2E9E] text-[#F7E7CE] hover:text-white border border-[#B76E79]/60 hover:border-[#FF2E9E] rounded-xl shadow-[0_0_12px_rgba(255,46,158,0.3)] flex items-center justify-center transition-all cursor-pointer hover:scale-105"
              title="Tutup Modal"
              aria-label="Tutup modal"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* ============================================================
          CENTER INSTRUCTION & ANIMATED SLASH GUIDES
          ============================================================ */}
      <div className="relative z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        {/* Diamond Sparkle Icon */}
        <div className="mb-2.5 relative">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-tr from-[#FF2E9E]/30 via-[#B76E79]/20 to-[#F7E7CE]/30 border border-[#B76E79]/80 flex items-center justify-center shadow-[0_0_25px_rgba(255,46,158,0.5)] rotate-45 animate-pulse">
            <Swords size={22} className="text-[#F7E7CE] -rotate-45" />
          </div>
        </div>

        {/* Main Title */}
        <h3 className="text-xl sm:text-3xl md:text-4xl font-luxury-title font-bold text-transparent bg-clip-text bg-linear-to-r from-[#F7E7CE] via-[#FFFFFF] to-[#FF2E9E] tracking-widest drop-shadow-[0_0_20px_rgba(255,46,158,0.6)] mb-2 uppercase">
          Tebasan Katana Kristal
        </h3>

        {/* Action Prompt */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#15091a]/85 border border-[#B76E79]/50 rounded-full shadow-[0_0_15px_rgba(183,110,121,0.3)] backdrop-blur-md">
          <Sparkles size={13} className="text-[#FF2E9E] animate-spin" />
          <p className="font-luxury-sans font-bold text-xs sm:text-sm text-[#F7E7CE] tracking-wider">
            Swipe katana untuk menebas zombie & memicu purifikasi
          </p>
          <Sparkles size={13} className="text-[#FF2E9E] animate-spin" />
        </div>

        {/* Animated Slash Trajectory Preview */}
        <div className="relative w-48 sm:w-64 h-16 mt-5 opacity-45">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-linear-to-r from-transparent via-[#FF2E9E] to-transparent transform -rotate-12 animate-pulse" />
          </div>
          <div
            className="absolute top-1/2 left-0 w-3 h-3 rounded-full bg-[#FFFFFF] shadow-[0_0_10px_#FF2E9E] -translate-y-1/2"
            style={{
              animation: "slashPreview 2.2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Floating Failed Swipe Feedback */}
        {feedbackText && (
          <div className="mt-3 px-4 py-2 bg-[#2a0e28] border border-[#FF2E9E] text-[#F7E7CE] rounded-xl font-luxury-sans text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(255,46,158,0.5)] animate-in fade-in slide-in-from-bottom-2 duration-200">
            {feedbackText}
          </div>
        )}
      </div>

      {/* ============================================================
          BOTTOM HUD / FALLBACK CONTROLS
          ============================================================ */}
      <div className="relative z-30 p-3.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        {/* Keyboard Hint */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-luxury-sans font-semibold text-[#B76E79]/80 bg-[#0e0614]/80 px-3 py-1 rounded-lg border border-[#B76E79]/30">
          <span>Tips: Tekan</span>
          <kbd className="px-1.5 py-0.5 bg-[#25102a] border border-[#B76E79]/60 rounded text-[#F7E7CE] font-mono text-[10px]">
            SPACE
          </kbd>
          <span>atau</span>
          <kbd className="px-1.5 py-0.5 bg-[#25102a] border border-[#B76E79]/60 rounded text-[#F7E7CE] font-mono text-[10px]">
            ENTER
          </kbd>
          <span>untuk tebasan instan</span>
        </div>

        {/* Auto Hint Assist Button */}
        <div className="w-full sm:w-auto flex justify-center pointer-events-auto">
          {showAutoHint && !isPurified && (
            <button
              type="button"
              onClick={() => {
                soundFX.getContext();
                executeInstantPurification();
              }}
              className="px-4 py-2 bg-linear-to-r from-[#FF2E9E] via-[#B76E79] to-[#F7E7CE] hover:brightness-110 text-white font-luxury-sans font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(255,46,158,0.6)] animate-bounce cursor-pointer flex items-center gap-2"
            >
              <Zap size={14} />
              <span>Bantu Purifikasi Sekarang</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================
          CUSTOM KATANA BLADE CURSOR (DESKTOP)
          ============================================================ */}
      {mousePos && !isPurified && (
        <div
          className="pointer-events-none fixed z-50 transition-transform duration-75 hidden md:block"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: `translate(-20%, -85%) rotate(${slashAngle + 45}deg)`,
          }}
        >
          {/* Katana Blade Pointer with Metallic Sheen */}
          <div className="relative w-24 h-24 filter drop-shadow-[0_0_14px_#FF2E9E]">
            <Image
              src={katanaSrc}
              alt="Katana Cursor"
              fill
              className="object-contain"
              sizes="96px"
              priority
            />
            {/* Shimmer Light Reflection Sweep on Blade */}
            {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent animate-blade-sheen" />
            </div> */}
          </div>
        </div>
      )}

      {/* Preview animation keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes slashPreview {
              0% { left: 0%; opacity: 0; transform: translateY(-50%) scale(0.6); }
              30% { opacity: 1; transform: translateY(-50%) scale(1.2); }
              80% { opacity: 1; transform: translateY(-50%) scale(1); }
              100% { left: 100%; opacity: 0; transform: translateY(-50%) scale(0.6); }
            }
          `,
        }}
      />
    </div>
  );
}
