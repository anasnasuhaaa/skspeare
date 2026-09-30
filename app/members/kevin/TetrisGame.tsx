"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Trophy, X } from "lucide-react";

type TetrominoKey = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
type BoardCell = TetrominoKey | 0;

type Piece = {
  type: TetrominoKey;
  matrix: number[][];
  x: number;
  y: number;
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const TARGET_SCORE = 200;
const TARGET_LINES = 2;

const SHAPES: Record<TetrominoKey, number[][]> = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

const COLOR_MAP: Record<TetrominoKey, string> = {
  I: "bg-cyan-400",
  O: "bg-yellow-300",
  T: "bg-violet-400",
  S: "bg-emerald-400",
  Z: "bg-red-400",
  J: "bg-blue-500",
  L: "bg-orange-400",
};

const createEmptyBoard = (): BoardCell[][] =>
  Array.from({ length: BOARD_HEIGHT }, () => Array.from({ length: BOARD_WIDTH }, () => 0 as BoardCell));

const randomTetromino = (): TetrominoKey => {
  const keys = Object.keys(SHAPES) as TetrominoKey[];
  return keys[Math.floor(Math.random() * keys.length)];
};

const createPiece = (): Piece => {
  const type = randomTetromino();
  const matrix = SHAPES[type].map((row) => [...row]);

  return {
    type,
    matrix,
    x: Math.floor((BOARD_WIDTH - matrix[0].length) / 2),
    y: 0,
  };
};

const rotateMatrix = (matrix: number[][]): number[][] =>
  matrix[0].map((_, index) => matrix.map((row) => row[index]).reverse());

const collides = (board: BoardCell[][], matrix: number[][], x: number, y: number): boolean =>
  matrix.some((row, rowIndex) =>
    row.some((value, colIndex) => {
      if (!value) return false;

      const nextX = x + colIndex;
      const nextY = y + rowIndex;

      if (nextX < 0 || nextX >= BOARD_WIDTH || nextY >= BOARD_HEIGHT) {
        return true;
      }

      if (nextY >= 0 && board[nextY][nextX] !== 0) {
        return true;
      }

      return false;
    })
  );

const getCellClass = (cell: BoardCell): string => {
  if (cell === 0) {
    return "bg-[#10172f] border border-white/5";
  }

  return `${COLOR_MAP[cell]} border border-[#111827] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]`;
};

const makePreviewGrid = (piece: Piece): BoardCell[][] => {
  const previewGrid: BoardCell[][] = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0 as BoardCell));
  const offsetX = Math.floor((4 - piece.matrix[0].length) / 2);
  const offsetY = Math.floor((4 - piece.matrix.length) / 2);

  piece.matrix.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (!value) return;

      const x = colIndex + offsetX;
      const y = rowIndex + offsetY;

      if (x >= 0 && x < 4 && y >= 0 && y < 4) {
        previewGrid[y][x] = piece.type;
      }
    });
  });

  return previewGrid;
};

export default function TetrisGame({
  onClose,
  onComplete,
  onSkip,
}: {
  onClose: () => void;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [phase, setPhase] = useState<"intro" | "playing">("intro");
  const [board, setBoard] = useState<BoardCell[][]>(() => createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece>(() => createPiece());
  const [nextPiece, setNextPiece] = useState<Piece>(() => createPiece());
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const completedRef = useRef(false);

  const startGame = useCallback(() => {
    completedRef.current = false;
    const firstPiece = createPiece();
    const upcoming = createPiece();
    setBoard(createEmptyBoard());
    setCurrentPiece(firstPiece);
    setNextPiece(upcoming);
    setScore(0);
    setLines(0);
    setGameOver(false);
    setPhase("playing");
  }, []);

  const resetGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const lockCurrentPiece = useCallback(
    (currentBoard: BoardCell[][], pieceToLock: Piece) => {
      const mergedBoard = currentBoard.map((row) => [...row]);

      pieceToLock.matrix.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (!value) return;

          const boardX = pieceToLock.x + colIndex;
          const boardY = pieceToLock.y + rowIndex;

          if (boardY >= 0) {
            mergedBoard[boardY][boardX] = pieceToLock.type;
          }
        });
      });

      const filteredRows: BoardCell[][] = [];
      let clearedLines = 0;

      mergedBoard.forEach((row) => {
        if (row.every((cell) => cell !== 0)) {
          clearedLines += 1;
          return;
        }

        filteredRows.push(row);
      });

      while (filteredRows.length < BOARD_HEIGHT) {
        filteredRows.unshift(Array.from({ length: BOARD_WIDTH }, () => 0 as BoardCell));
      }

      const nextBoard = filteredRows;
      const nextScore = score + clearedLines * 25 + 10;
      const nextLinesCount = lines + clearedLines;

      setBoard(nextBoard);
      setScore(nextScore);
      setLines(nextLinesCount);

      const chosenPiece = nextPiece;
      const spawnedPiece = createPiece();
      const spawnX = Math.floor((BOARD_WIDTH - chosenPiece.matrix[0].length) / 2);
      const spawnY = 0;

      if (collides(nextBoard, chosenPiece.matrix, spawnX, spawnY)) {
        setGameOver(true);
        setCurrentPiece({ ...chosenPiece, x: spawnX, y: spawnY });
        return;
      }

      setCurrentPiece({ ...chosenPiece, x: spawnX, y: spawnY });
      setNextPiece(spawnedPiece);
    },
    [lines, nextPiece, score]
  );

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      if (phase !== "playing" || gameOver) return;

      const nextX = currentPiece.x + dx;
      const nextY = currentPiece.y + dy;

      if (!collides(board, currentPiece.matrix, nextX, nextY)) {
        setCurrentPiece({ ...currentPiece, x: nextX, y: nextY });
        return;
      }

      if (dy > 0) {
        lockCurrentPiece(board, currentPiece);
      }
    },
    [board, currentPiece, gameOver, lockCurrentPiece, phase]
  );

  const rotatePiece = useCallback(() => {
    if (phase !== "playing" || gameOver) return;

    const rotated = rotateMatrix(currentPiece.matrix);
    const offsets = [0, -1, 1, -2, 2];

    for (const offset of offsets) {
      const candidateX = currentPiece.x + offset;
      if (!collides(board, rotated, candidateX, currentPiece.y)) {
        setCurrentPiece({ ...currentPiece, matrix: rotated, x: candidateX });
        return;
      }
    }
  }, [board, currentPiece, gameOver, phase]);

  const hardDrop = useCallback(() => {
    if (phase !== "playing" || gameOver) return;

    let movedPiece = { ...currentPiece };

    while (!collides(board, movedPiece.matrix, movedPiece.x, movedPiece.y + 1)) {
      movedPiece = { ...movedPiece, y: movedPiece.y + 1 };
    }

    lockCurrentPiece(board, movedPiece);
  }, [board, currentPiece, gameOver, lockCurrentPiece, phase]);

  useEffect(() => {
    if (phase !== "playing" || gameOver) return;

    const interval = window.setInterval(() => {
      const nextY = currentPiece.y + 1;

      if (!collides(board, currentPiece.matrix, currentPiece.x, nextY)) {
        setCurrentPiece({ ...currentPiece, y: nextY });
        return;
      }

      lockCurrentPiece(board, currentPiece);
    }, 500);

    return () => window.clearInterval(interval);
  }, [board, currentPiece, gameOver, lockCurrentPiece, phase]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (phase !== "playing") return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        movePiece(-1, 0);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        movePiece(1, 0);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        movePiece(0, 1);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        rotatePiece();
      }

      if (event.key === " ") {
        event.preventDefault();
        hardDrop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hardDrop, movePiece, phase, rotatePiece]);

  useEffect(() => {
    if (!completedRef.current && (score >= TARGET_SCORE || lines >= TARGET_LINES)) {
      completedRef.current = true;
      onComplete();
    }
  }, [lines, onComplete, score]);

  const displayBoard = useMemo(() => {
    const nextBoard = createEmptyBoard();

    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          nextBoard[y][x] = cell;
        }
      });
    });

    currentPiece.matrix.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (!value) return;

        const boardX = currentPiece.x + colIndex;
        const boardY = currentPiece.y + rowIndex;

        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          nextBoard[boardY][boardX] = currentPiece.type;
        }
      });
    });

    return nextBoard;
  }, [board, currentPiece]);

  const previewGrid = useMemo(() => makePreviewGrid(nextPiece), [nextPiece]);
  const objectiveText = `Target: ${TARGET_SCORE} pts / hapus ${TARGET_LINES} baris`;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-nb-black/75 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      <div className="relative z-10 w-[min(100%,32rem)] max-h-[90vh] overflow-hidden rounded-[28px] border-[4px] border-nb-black bg-nb-cream shadow-[10px_10px_0px_var(--nb-black)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-nb-black bg-nb-red text-nb-white shadow-[3px_3px_0px_var(--nb-black)] transition-all hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)]"
          aria-label="Tutup game"
        >
          <X size={16} />
        </button>

        <div className="border-b-[4px] border-nb-black bg-nb-yellow px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.28em] text-nb-black/70">
                Mini Game
              </p>
              <h3 className="font-display text-xl font-black text-nb-black sm:text-2xl">
                KEVIN&apos;S TETRIS CHALLENGE
              </h3>
            </div>
            <button
              type="button"
              onClick={onSkip}
              className="inline-flex items-center justify-center rounded-xl border-[3px] border-nb-black bg-nb-white px-3 py-2 font-black text-[10px] uppercase tracking-[0.18em] shadow-[3px_3px_0px_var(--nb-black)] transition-all hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)]"
            >
              LEWATI GAME
            </button>
          </div>
        </div>

        {phase === "intro" ? (
          <div className="p-4 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[24px] border-[4px] border-nb-black bg-nb-black p-4 text-white shadow-[8px_8px_0px_var(--nb-black)]">
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex h-3 w-3 rounded-full bg-nb-red" />
                  <span className="inline-flex h-3 w-3 rounded-full bg-nb-yellow" />
                  <span className="inline-flex h-3 w-3 rounded-full bg-nb-lime" />
                </div>

                <p className="font-display text-[10px] uppercase tracking-[0.28em] text-nb-lime/80">
                  Boot sequence // level 01
                </p>
                <h4 className="mt-3 font-display text-3xl font-black leading-none text-nb-yellow sm:text-4xl">
                  {" > KEVIN'S TETRIS"}
                </h4>
                <p className="mt-4 max-w-md text-sm font-bold text-white/80">
                  Raih target 200 poin atau bersihkan 2 baris untuk membuka biodata Kevin.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-black text-nb-black">
                  <div className="rounded-xl border-[3px] border-nb-black bg-nb-yellow p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] opacity-75">TARGET</div>
                    <div className="mt-2 text-2xl">200</div>
                  </div>
                  <div className="rounded-xl border-[3px] border-nb-black bg-nb-lime p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] opacity-75">CLEAR</div>
                    <div className="mt-2 text-2xl">2 LINES</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-[24px] border-[4px] border-nb-black bg-nb-blue p-4 shadow-[8px_8px_0px_var(--nb-black)]">
                <p className="font-display text-[10px] uppercase tracking-[0.2em] text-nb-black/70">Kontrol</p>
                <ul className="space-y-2 text-sm font-black text-nb-black">
                  <li>• ← / → : Geser</li>
                  <li>• ↑ : Rotasi</li>
                  <li>• ↓ : Turun cepat</li>
                  <li>• Space : Drop</li>
                </ul>
                <button
                  type="button"
                  onClick={startGame}
                  className="mt-auto rounded-xl border-[3px] border-nb-black bg-nb-yellow px-4 py-3 font-display text-xs font-black uppercase tracking-[0.18em] shadow-[3px_3px_0px_var(--nb-black)] transition-all hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)]"
                >
                  MULAI GAME
                </button>
                <button
                  type="button"
                  onClick={onSkip}
                  className="rounded-xl border-[3px] border-nb-black bg-nb-white px-4 py-3 font-display text-xs font-black uppercase tracking-[0.18em] shadow-[3px_3px_0px_var(--nb-black)] transition-all hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)]"
                >
                  LEWATI GAME
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 sm:p-4">
            <div className="grid gap-3 sm:grid-cols-[240px_minmax(0,1fr)] sm:items-start">
              <div className="rounded-2xl border-[4px] border-nb-black bg-nb-black p-2 shadow-[6px_6px_0px_var(--nb-black)]">
                <div className="mx-auto grid w-[220px] max-w-full grid-cols-10 gap-[2px] rounded-xl bg-[#0A0F1D] p-1.5">
                  {displayBoard.flatMap((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`aspect-square w-full rounded-[4px] ${getCellClass(cell)}`}
                      />
                    ))
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="rounded-2xl border-[3px] border-nb-black bg-nb-white p-3 shadow-[4px_4px_0px_var(--nb-black)]">
                  <div className="flex items-center gap-2 text-nb-black">
                    <Trophy size={16} className="text-nb-black" />
                    <span className="font-display text-[10px] uppercase tracking-[0.18em]">Skor</span>
                  </div>
                  <div className="mt-2 text-2xl font-black text-nb-black">{score}</div>
                  <div className="mt-1 text-xs font-bold text-nb-black/75">Baris: {lines}</div>
                </div>

                <div className="rounded-2xl border-[3px] border-nb-black bg-nb-blue p-3 text-nb-black shadow-[4px_4px_0px_var(--nb-black)]">
                  <p className="font-display text-[10px] uppercase tracking-[0.18em] font-black">Target</p>
                  <p className="mt-2 text-xs font-bold sm:text-sm">{objectiveText}</p>
                </div>

                <div className="rounded-2xl border-[3px] border-nb-black bg-nb-lime p-3 text-nb-black shadow-[4px_4px_0px_var(--nb-black)]">
                  <p className="font-display text-[10px] uppercase tracking-[0.18em] font-black">NEXT PIECE</p>
                  <div className="mt-2 grid w-20 grid-cols-4 gap-1 rounded-xl border-[2px] border-nb-black bg-[#0d1624] p-1.5">
                    {previewGrid.flatMap((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`aspect-square w-full rounded-[3px] ${cell ? `${COLOR_MAP[nextPiece.type]} border border-[#111827]` : "bg-[#10172f] border border-white/5"}`}
                        />
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border-[3px] border-nb-black bg-nb-white p-3 shadow-[4px_4px_0px_var(--nb-black)]">
                  <p className="font-display text-[10px] uppercase tracking-[0.18em] text-nb-black">Instruksi</p>
                  <ul className="mt-2 space-y-2 text-xs font-bold text-nb-black sm:text-sm">
                    <li>• Panah kiri/kanan</li>
                    <li>• Panah bawah / atas</li>
                    <li>• Space = Drop</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={onSkip}
                  className="rounded-xl border-[3px] border-nb-black bg-nb-white px-4 py-3 font-display text-[10px] font-black uppercase tracking-[0.18em] shadow-[3px_3px_0px_var(--nb-black)] transition-all hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)]"
                >
                  LEWATI GAME
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 rounded-2xl border-[3px] border-nb-black bg-nb-cream p-3 shadow-[4px_4px_0px_var(--nb-black)] md:hidden">
              <button
                type="button"
                onClick={() => movePiece(-1, 0)}
                className="flex h-12 items-center justify-center rounded-xl border-[3px] border-nb-black bg-nb-white text-xl font-black shadow-[3px_3px_0px_var(--nb-black)]"
                aria-label="Geser kiri"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={rotatePiece}
                className="flex h-12 items-center justify-center rounded-xl border-[3px] border-nb-black bg-nb-yellow text-xl font-black shadow-[3px_3px_0px_var(--nb-black)]"
                aria-label="Rotasi"
              >
                <ArrowUp size={18} />
              </button>
              <button
                type="button"
                onClick={() => movePiece(1, 0)}
                className="flex h-12 items-center justify-center rounded-xl border-[3px] border-nb-black bg-nb-white text-xl font-black shadow-[3px_3px_0px_var(--nb-black)]"
                aria-label="Geser kanan"
              >
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => movePiece(0, 1)}
                className="flex h-12 items-center justify-center rounded-xl border-[3px] border-nb-black bg-nb-pink text-xl font-black shadow-[3px_3px_0px_var(--nb-black)]"
                aria-label="Turunkan"
              >
                <ArrowDown size={18} />
              </button>
            </div>

            {gameOver && (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border-[3px] border-nb-black bg-nb-red p-4 text-nb-white shadow-[4px_4px_0px_var(--nb-black)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-[10px] uppercase tracking-[0.18em]">Game Over</p>
                  <p className="mt-1 font-bold">Yuk, coba lagi atau langsung buka profil Kevin.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resetGame}
                    className="rounded-xl border-[3px] border-nb-black bg-nb-yellow px-4 py-2 font-black text-[10px] uppercase tracking-[0.12em] text-nb-black shadow-[3px_3px_0px_var(--nb-black)]"
                  >
                    Coba Lagi
                  </button>
                  <button
                    type="button"
                    onClick={onSkip}
                    className="rounded-xl border-[3px] border-nb-black bg-nb-white px-4 py-2 font-black text-[10px] uppercase tracking-[0.12em] text-nb-black shadow-[3px_3px_0px_var(--nb-black)]"
                  >
                    Lewati
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
