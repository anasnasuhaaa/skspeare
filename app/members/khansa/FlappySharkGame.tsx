"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Sparkles, Trophy, RotateCcw, ArrowRight, Play } from "lucide-react";
import { oceanSound } from "./oceanSound";

interface FlappySharkGameProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface Obstacle {
  x: number;
  width: number;
  topHeight: number;
  bottomY: number;
  bottomHeight: number;
  topImgIndex: number;
  bottomImgIndex: number;
  passed: boolean;
}

interface BubbleParticle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
}

export default function FlappySharkGame({ onComplete, onSkip }: FlappySharkGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // React state for HUD overlays
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover" | "victory">("ready");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // References for game loop state
  const stateRef = useRef({
    gameState: "ready" as "ready" | "playing" | "gameover" | "victory",
    score: 0,
    highScore: 0,
    shark: {
      x: 80,
      y: 200,
      width: 58,
      height: 48,
      vy: 0,
      rotation: 0,
      targetRotation: 0,
    },
    obstacles: [] as Obstacle[],
    bubbles: [] as BubbleParticle[],
    confetti: [] as ConfettiParticle[],
    lastSpawnX: 0,
    frameCount: 0,
    canvasWidth: 420,
    canvasHeight: 560,
  });

  // Image assets
  const sharkImgRef = useRef<HTMLImageElement | null>(null);
  const topImgsRef = useRef<HTMLImageElement[]>([]);
  const bottomImgsRef = useRef<HTMLImageElement[]>([]);

  // Sound toggle
  const handleToggleSound = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = oceanSound.toggleMute();
    setIsMuted(muted);
  }, []);

  // Preload game image assets
  useEffect(() => {
    let isMounted = true;

    const shark = new Image();
    shark.src = "/asset/khansa/shark.png";

    const top1 = new Image();
    top1.src = "/asset/khansa/atas 1.png";

    const top2 = new Image();
    top2.src = "/asset/khansa/atas 2.png";

    const bottom1 = new Image();
    bottom1.src = "/asset/khansa/bawah 1.png";

    const bottom2 = new Image();
    bottom2.src = "/asset/khansa/bawah 2.png";

    const allImages = [shark, top1, top2, bottom1, bottom2];
    let loadedCount = 0;

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === allImages.length && isMounted) {
        sharkImgRef.current = shark;
        topImgsRef.current = [top1, top2];
        bottomImgsRef.current = [bottom1, bottom2];
        setAssetsLoaded(true);
      }
    };

    allImages.forEach((img) => {
      if (img.complete) {
        checkComplete();
      } else {
        img.onload = checkComplete;
        img.onerror = checkComplete; // Fail-soft
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize background bubbles
  useEffect(() => {
    const { canvasWidth, canvasHeight } = stateRef.current;
    const initialBubbles: BubbleParticle[] = [];
    for (let i = 0; i < 28; i++) {
      initialBubbles.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: 3 + Math.random() * 8,
        speed: 0.6 + Math.random() * 1.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.04,
        opacity: 0.25 + Math.random() * 0.45,
      });
    }
    stateRef.current.bubbles = initialBubbles;
  }, []);

  // Spawn confetti particles on victory
  const spawnConfetti = useCallback(() => {
    const { canvasWidth, canvasHeight } = stateRef.current;
    const colors = ["#ff6b9d", "#4ecdc4", "#ffe156", "#a8e6cf", "#c3aed6", "#ffffff", "#ffab76"];
    const particles: ConfettiParticle[] = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvasWidth / 2 + (Math.random() - 0.5) * 60,
        y: canvasHeight / 2 - 40 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 10,
        vy: -7 - Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 7,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
      });
    }
    stateRef.current.confetti = particles;
  }, []);

  // Trigger Shark Jump / Swim Upward
  const handleJump = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState === "ready") {
      s.gameState = "playing";
      setGameState("playing");
      s.shark.vy = -6.8;
      s.shark.targetRotation = -0.35;
      oceanSound.playSwim();
    } else if (s.gameState === "playing") {
      s.shark.vy = -6.8;
      s.shark.targetRotation = -0.38;
      oceanSound.playSwim();
    } else if (s.gameState === "gameover") {
      // Restart game
      s.gameState = "playing";
      setGameState("playing");
      s.score = 0;
      setScore(0);
      s.shark.y = s.canvasHeight / 2 - 30;
      s.shark.vy = -6.8;
      s.shark.rotation = 0;
      s.shark.targetRotation = -0.35;
      s.obstacles = [];
      s.lastSpawnX = 0;
      oceanSound.playSwim();
    }
  }, []);

  // Reset / Retry Game
  const handleRestart = useCallback(() => {
    const s = stateRef.current;
    s.gameState = "playing";
    setGameState("playing");
    s.score = 0;
    setScore(0);
    s.shark.y = s.canvasHeight / 2 - 30;
    s.shark.vy = -6.8;
    s.shark.rotation = 0;
    s.shark.targetRotation = -0.35;
    s.obstacles = [];
    s.lastSpawnX = 0;
    oceanSound.playSwim();
  }, []);

  // Keyboard controls listener (Spacebar, Up Arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleJump]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const TARGET_SCORE = 5;
    const GRAVITY = 0.36;
    const PIPE_SPEED = 2.4;
    const GAP_SIZE = 175; // Comfortable gap for fun & cute experience
    const SPAWN_INTERVAL = 170; // Distance between obstacles
    const FLOOR_HEIGHT = 45;

    const gameLoop = () => {
      const s = stateRef.current;
      const width = s.canvasWidth;
      const height = s.canvasHeight;
      s.frameCount++;

      // 1. UPDATE PHYSICS
      if (s.gameState === "ready") {
        // Gentle bobbing motion
        s.shark.y = height / 2 - 20 + Math.sin(s.frameCount * 0.06) * 10;
        s.shark.rotation = Math.sin(s.frameCount * 0.05) * 0.12;
      } else if (s.gameState === "playing") {
        // Gravity & Velocity
        s.shark.vy += GRAVITY;
        if (s.shark.vy > 9) s.shark.vy = 9;
        s.shark.y += s.shark.vy;

        // Smooth rotation following velocity
        if (s.shark.vy < 0) {
          s.shark.targetRotation = -0.32;
        } else {
          s.shark.targetRotation = Math.min(Math.PI / 4, (s.shark.vy / 9) * 0.7);
        }
        s.shark.rotation += (s.shark.targetRotation - s.shark.rotation) * 0.15;

        // Boundary collision: ceiling (water surface)
        if (s.shark.y < 15) {
          s.shark.y = 15;
          s.shark.vy = 0;
        }

        // Boundary collision: floor (sea bed)
        if (s.shark.y + s.shark.height / 2 >= height - FLOOR_HEIGHT) {
          s.gameState = "gameover";
          setGameState("gameover");
          oceanSound.playHit();
        }

        // Spawn obstacles
        if (
          s.obstacles.length === 0 ||
          width - s.obstacles[s.obstacles.length - 1].x >= SPAWN_INTERVAL
        ) {
          const minTop = 60;
          const maxTop = height - FLOOR_HEIGHT - GAP_SIZE - 70;
          const topHeight = minTop + Math.random() * (maxTop - minTop);
          const bottomY = topHeight + GAP_SIZE;
          const bottomHeight = height - FLOOR_HEIGHT - bottomY;

          s.obstacles.push({
            x: width + 20,
            width: 72,
            topHeight,
            bottomY,
            bottomHeight,
            topImgIndex: Math.random() > 0.5 ? 1 : 0,
            bottomImgIndex: Math.random() > 0.5 ? 1 : 0,
            passed: false,
          });
        }

        // Update obstacles
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const ob = s.obstacles[i];
          ob.x -= PIPE_SPEED;

          // Check score point
          if (!ob.passed && ob.x + ob.width < s.shark.x) {
            ob.passed = true;
            s.score += 1;
            setScore(s.score);
            if (s.score > s.highScore) {
              s.highScore = s.score;
              setHighScore(s.highScore);
            }

            // Check Victory Condition!
            if (s.score >= TARGET_SCORE) {
              s.gameState = "victory";
              setGameState("victory");
              oceanSound.playVictory();
              spawnConfetti();
              break;
            } else {
              oceanSound.playPoint();
            }
          }

          // Hitbox collision check with obstacle
          // Shark hitbox slightly smaller than sprite for forgiveness & cute feel
          const sharkHbX = s.shark.x - s.shark.width * 0.32;
          const sharkHbY = s.shark.y - s.shark.height * 0.32;
          const sharkHbW = s.shark.width * 0.64;
          const sharkHbH = s.shark.height * 0.64;

          const hitTop =
            sharkHbX + sharkHbW > ob.x + 8 &&
            sharkHbX < ob.x + ob.width - 8 &&
            sharkHbY < ob.topHeight;

          const hitBottom =
            sharkHbX + sharkHbW > ob.x + 8 &&
            sharkHbX < ob.x + ob.width - 8 &&
            sharkHbY + sharkHbH > ob.bottomY;

          if (hitTop || hitBottom) {
            s.gameState = "gameover";
            setGameState("gameover");
            oceanSound.playHit();
            break;
          }

          // Remove offscreen obstacles
          if (ob.x + ob.width < -30) {
            s.obstacles.splice(i, 1);
          }
        }
      } else if (s.gameState === "victory") {
        // Gentle celebratory float
        s.shark.y = height / 2 - 20 + Math.sin(s.frameCount * 0.05) * 8;
        s.shark.rotation = Math.sin(s.frameCount * 0.08) * 0.15;
      }

      // Update background bubbles
      s.bubbles.forEach((b) => {
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        b.x += Math.sin(b.wobble) * 0.4;
        if (b.y < -15) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }
      });

      // Update victory confetti
      if (s.confetti.length > 0) {
        s.confetti.forEach((c) => {
          c.x += c.vx;
          c.y += c.vy;
          c.vy += 0.22;
          c.rotation += c.rotSpeed;
        });
      }

      // 2. RENDER GRAPHICS
      ctx.clearRect(0, 0, width, height);

      // --- Deep Pastel Ocean Gradient Background ---
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
      oceanGrad.addColorStop(0, "#c2f0fc"); // Sunlit shallow sea
      oceanGrad.addColorStop(0.35, "#7ee0f5"); // Turquoise midwater
      oceanGrad.addColorStop(0.75, "#48b2e3"); // Cerulean
      oceanGrad.addColorStop(1, "#21689c"); // Deep sea floor
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, width, height);

      // --- Sun rays filtering through water ---
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.09)";
      ctx.beginPath();
      ctx.moveTo(width * 0.2, 0);
      ctx.lineTo(width * 0.05, height);
      ctx.lineTo(width * 0.35, height);
      ctx.lineTo(width * 0.45, 0);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width * 0.65, 0);
      ctx.lineTo(width * 0.5, height);
      ctx.lineTo(width * 0.82, height);
      ctx.lineTo(width * 0.9, 0);
      ctx.fill();
      ctx.restore();

      // --- Draw Background Bubbles ---
      s.bubbles.forEach((b) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(180, 240, 255, ${b.opacity + 0.2})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Bubble highlight reflection
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity + 0.35})`;
        ctx.fill();
        ctx.restore();
      });

      // --- Draw Obstacles ---
      s.obstacles.forEach((ob) => {
        // TOP OBSTACLE (Stalactite hanging down)
        const topImg = topImgsRef.current[ob.topImgIndex];
        if (topImg && topImg.complete && topImg.naturalWidth > 0) {
          ctx.drawImage(topImg, ob.x, 0, ob.width, ob.topHeight);
        } else {
          // Fallback pastel coral pillar
          ctx.fillStyle = "#8fa3b0";
          ctx.fillRect(ob.x, 0, ob.width, ob.topHeight);
        }

        // BOTTOM OBSTACLE (Coral growing up)
        const bottomImg = bottomImgsRef.current[ob.bottomImgIndex];
        if (bottomImg && bottomImg.complete && bottomImg.naturalWidth > 0) {
          ctx.drawImage(bottomImg, ob.x, ob.bottomY, ob.width, ob.bottomHeight);
        } else {
          // Fallback pastel coral pillar
          ctx.fillStyle = "#9db4c0";
          ctx.fillRect(ob.x, ob.bottomY, ob.width, ob.bottomHeight);
        }
      });

      // --- Sandy Ocean Floor & Sea Grass ---
      ctx.save();
      // Wave dune
      const sandGrad = ctx.createLinearGradient(0, height - FLOOR_HEIGHT, 0, height);
      sandGrad.addColorStop(0, "#fde68a"); // Warm golden sand
      sandGrad.addColorStop(1, "#d97706");
      ctx.fillStyle = sandGrad;
      ctx.beginPath();
      ctx.moveTo(0, height - FLOOR_HEIGHT);
      for (let x = 0; x <= width; x += 30) {
        const wave = Math.sin((x + s.frameCount * 1.5) * 0.04) * 4;
        ctx.lineTo(x, height - FLOOR_HEIGHT + wave);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Top line border of sand
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#1a1a2e";
      ctx.stroke();

      // Cute Little Shells on Floor
      ctx.fillStyle = "#ff6b9d";
      ctx.beginPath();
      ctx.arc(60, height - 16, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4ecdc4";
      ctx.beginPath();
      ctx.arc(220, height - 12, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffe156";
      ctx.beginPath();
      ctx.arc(340, height - 15, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- Draw Cute Shark Player ---
      ctx.save();
      ctx.translate(s.shark.x, s.shark.y);
      ctx.rotate(s.shark.rotation);

      const sharkImg = sharkImgRef.current;
      if (sharkImg && sharkImg.complete && sharkImg.naturalWidth > 0) {
        // Draw shark centered
        ctx.drawImage(
          sharkImg,
          -s.shark.width / 2,
          -s.shark.height / 2,
          s.shark.width,
          s.shark.height
        );
      } else {
        // Fallback Chibi Shark SVG/Canvas
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.ellipse(0, 0, s.shark.width / 2, s.shark.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(12, -4, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Small trailing bubbles behind shark when moving up
      if (s.shark.vy < -1) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.beginPath();
        ctx.arc(-s.shark.width * 0.55, 5, 3, 0, Math.PI * 2);
        ctx.arc(-s.shark.width * 0.65, 8, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // --- Draw Victory Confetti ---
      if (s.confetti.length > 0) {
        s.confetti.forEach((c) => {
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rotation);
          ctx.fillStyle = c.color;
          ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [spawnConfetti]);

  return (
    <div className="relative w-full max-w-[440px] mx-auto flex flex-col items-center select-none font-sans">
      {/* Neobrutalist Kawaii Game Card Container */}
      <div className="relative w-full bg-[#f0fbfb] border-[3.5px] border-[#1a1a2e] rounded-3xl shadow-[6px_6px_0px_#1a1a2e] overflow-hidden flex flex-col items-center p-3 sm:p-4">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between gap-2 mb-2 px-1">
          {/* Badge: Flappy Shark */}
          <div className="flex items-center gap-1.5 bg-[#ffe156] border-2 border-[#1a1a2e] rounded-xl px-2.5 py-1 shadow-[2px_2px_0px_#1a1a2e]">
            <span className="text-base leading-none">🦈</span>
            <span className="font-mono font-black text-xs text-[#1a1a2e] uppercase tracking-wide">
              Flappy Shark
            </span>
          </div>

          {/* Target Score & Sound Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#b4f8c8] border-2 border-[#1a1a2e] rounded-xl px-2.5 py-1 shadow-[2px_2px_0px_#1a1a2e] font-mono font-black text-xs text-[#1a1a2e]">
              <Trophy size={13} className="text-[#1a1a2e]" />
              <span>Target: 5 🫧</span>
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              className="w-8 h-8 rounded-xl bg-[#ffaebc] hover:bg-[#ff94a5] border-2 border-[#1a1a2e] shadow-[2px_2px_0px_#1a1a2e] flex items-center justify-center text-[#1a1a2e] transition-transform active:translate-y-0.5 cursor-pointer"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>

        {/* Canvas Game Area */}
        <div
          className="relative w-full aspect-[420/560] max-h-[72vh] rounded-2xl overflow-hidden border-[3px] border-[#1a1a2e] shadow-[3px_3px_0px_#1a1a2e] cursor-pointer touch-none"
          onClick={handleJump}
          onTouchStart={(e) => {
            e.preventDefault();
            handleJump();
          }}
        >
          <canvas
            ref={canvasRef}
            width={420}
            height={560}
            className="w-full h-full block"
          />

          {/* Floating Score Display while playing */}
          {gameState === "playing" && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col items-center">
              <div className="bg-[#ffffff]/90 backdrop-blur-sm border-[2.5px] border-[#1a1a2e] rounded-2xl px-5 py-1.5 shadow-[3px_3px_0px_#1a1a2e] flex items-center gap-2">
                <span className="text-xl">🫧</span>
                <span className="font-mono font-black text-2xl text-[#1a1a2e] tracking-wider">
                  {score} / 5
                </span>
              </div>
            </div>
          )}

          {/* OVERLAY: Ready State (Game Start Instructions) */}
          {gameState === "ready" && (
            <div className="absolute inset-0 bg-[#0f2b3c]/45 backdrop-blur-[2px] flex flex-col items-center justify-center p-5 text-center z-20 animate-in fade-in duration-300">
              <div className="bg-[#ffffff] border-[3px] border-[#1a1a2e] rounded-3xl p-5 shadow-[5px_5px_0px_#1a1a2e] max-w-[320px] flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#c2f0fc] border-2 border-[#1a1a2e] shadow-[2px_2px_0px_#1a1a2e] flex items-center justify-center text-3xl mb-3 animate-bounce">
                  🦈
                </div>
                <h3 className="font-mono font-black text-lg text-[#1a1a2e] mb-1">
                  Bantu Sharky Berenang!
                </h3>
                <p className="text-xs text-[#1a1a2e]/80 font-medium mb-4 leading-relaxed">
                  Ketuk layar, klik mouse, atau tekan <strong>Spasi</strong> untuk berenang menghindari karang. Raih <strong>skor 5</strong> untuk membuka profil Khansa! 🌊✨
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJump();
                  }}
                  className="w-full py-2.5 px-4 bg-[#ffe156] hover:bg-[#ffd624] border-[2.5px] border-[#1a1a2e] rounded-xl shadow-[3px_3px_0px_#1a1a2e] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1a1a2e] font-mono font-black text-sm text-[#1a1a2e] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Play size={16} fill="#1a1a2e" />
                  <span>Mulai Berenang!</span>
                </button>
              </div>
            </div>
          )}

          {/* OVERLAY: Game Over */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-[#0f2b3c]/65 backdrop-blur-[3px] flex flex-col items-center justify-center p-5 text-center z-20 animate-in zoom-in-95 duration-200">
              <div className="bg-[#ffffff] border-[3px] border-[#1a1a2e] rounded-3xl p-5 shadow-[6px_6px_0px_#1a1a2e] max-w-[320px] flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#ffaebc] border-2 border-[#1a1a2e] shadow-[2px_2px_0px_#1a1a2e] flex items-center justify-center text-2xl mb-2">
                  🥺
                </div>
                <h3 className="font-mono font-black text-lg text-[#1a1a2e] mb-1">
                  Ups! Sharky Terbentur!
                </h3>
                <p className="text-xs text-[#1a1a2e]/75 font-medium mb-3">
                  Jangan menyerah, ayo coba berenang lagi bareng Sharky! 🫧
                </p>

                {/* Score Summary Box */}
                <div className="w-full bg-[#e8f7fa] border-2 border-[#1a1a2e] rounded-xl p-2.5 mb-4 flex justify-around items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono font-bold text-[#1a1a2e]/70 uppercase">
                      Skor
                    </span>
                    <span className="font-mono font-black text-xl text-[#1a1a2e]">
                      {score}
                    </span>
                  </div>
                  <div className="w-0.5 h-8 bg-[#1a1a2e]/20" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono font-bold text-[#1a1a2e]/70 uppercase">
                      Target
                    </span>
                    <span className="font-mono font-black text-xl text-[#0d9488]">
                      5
                    </span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestart();
                    }}
                    className="w-full py-2.5 px-4 bg-[#4ecdc4] hover:bg-[#3db8af] border-[2.5px] border-[#1a1a2e] rounded-xl shadow-[3px_3px_0px_#1a1a2e] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1a1a2e] font-mono font-black text-xs sm:text-sm text-[#1a1a2e] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <RotateCcw size={15} />
                    <span>Coba Lagi 🔄</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSkip();
                    }}
                    className="w-full py-2 px-3 bg-[#fff8e7] hover:bg-[#ffefc2] border-2 border-[#1a1a2e] rounded-xl shadow-[2px_2px_0px_#1a1a2e] font-mono font-bold text-xs text-[#1a1a2e] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Langsung ke Profil Khansa 🫧</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OVERLAY: Victory State! */}
          {gameState === "victory" && (
            <div className="absolute inset-0 bg-[#0f2b3c]/60 backdrop-blur-[3px] flex flex-col items-center justify-center p-5 text-center z-20 animate-in zoom-in-95 duration-300">
              <div className="bg-[#ffffff] border-[3.5px] border-[#1a1a2e] rounded-3xl p-6 shadow-[7px_7px_0px_#1a1a2e] max-w-[330px] flex flex-col items-center animate-bounce-subtle">
                <div className="w-16 h-16 rounded-full bg-[#ffe156] border-[2.5px] border-[#1a1a2e] shadow-[3px_3px_0px_#1a1a2e] flex items-center justify-center text-3xl mb-2.5">
                  🎉
                </div>
                <div className="flex items-center gap-1 text-[#ff6b9d] text-xs font-mono font-black uppercase tracking-wider mb-1">
                  <Sparkles size={14} />
                  <span>Misi Berhasil!</span>
                  <Sparkles size={14} />
                </div>
                <h3 className="font-mono font-black text-xl text-[#1a1a2e] mb-2 leading-tight">
                  Yeay! Kamu Hebat! 🦈✨
                </h3>
                <p className="text-xs text-[#1a1a2e]/80 font-medium mb-4 leading-relaxed">
                  Sharky berhasil melewati rintangan laut! Gerbang dunia Khansa sekarang telah terbuka untukmu~
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComplete();
                  }}
                  className="w-full py-3 px-4 bg-[#ffe156] hover:bg-[#ffd81b] border-[2.5px] border-[#1a1a2e] rounded-2xl shadow-[4px_4px_0px_#1a1a2e] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1a1a2e] font-mono font-black text-sm text-[#1a1a2e] flex items-center justify-center gap-2 transition-all cursor-pointer animate-pulse"
                >
                  <span>Buka Profil Khansa Sekarang! 💖</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar: Skip Option & Control Tip */}
        <div className="w-full flex items-center justify-between gap-2 mt-3 px-1">
          <span className="text-[11px] font-mono font-bold text-[#1a1a2e]/70 flex items-center gap-1">
            <span>💡</span>
            <span>Tap / Klik untuk berenang</span>
          </span>

          <button
            type="button"
            onClick={onSkip}
            className="px-3.5 py-1.5 bg-[#ffffff] hover:bg-[#ffe156] border-2 border-[#1a1a2e] rounded-xl shadow-[2px_2px_0px_#1a1a2e] font-mono font-black text-[11px] text-[#1a1a2e] flex items-center gap-1 transition-all active:translate-y-0.5 cursor-pointer"
            title="Lewati permainan dan langsung lihat profil"
          >
            <span>Skip Game 🫧</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
