"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import anasData from "./data";
import SpotifyEmbed from "@/app/components/SpotifyEmbed";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ==========================================
// 🔒 LOCKED: Core component structure (DO NOT DELETE)
// ==========================================
export default function AnasModal({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm scanlines"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0f0d] border-[3px] border-[#00ff41] rounded-2xl shadow-[8px_8px_0px_0px_#00ff41] p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 
              ==========================================
              🔓 FREE TO CUSTOMIZE: Design & Animations 
              ==========================================
            */}

            {/* Header section */}
            <div className="flex flex-col md:flex-row gap-6 mb-8 items-start relative">
              <button
                onClick={onClose}
                className="absolute top-0 right-0 p-2 text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0a0f0d] border border-transparent hover:border-[#00ff41] rounded transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative w-32 h-32 shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.5)]"></div>
                <Image
                  src={anasData.photo}
                  alt={anasData.name}
                  fill
                  className="rounded-full object-cover p-1"
                />
              </div>

              <div className="pt-2">
                <h2 className="text-3xl md:text-4xl font-bold text-[#00ff41] font-mono mb-2">
                  {anasData.name}
                </h2>
                <div className="inline-block bg-[#00ff41] text-[#0a0f0d] px-3 py-1 font-mono font-bold text-sm uppercase">
                  {anasData.role}
                </div>
              </div>
            </div>

            {/* Terminal Data Section */}
            <div className="font-mono space-y-4 mb-8">
              <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                <span className="text-[#00ff41]/60 w-32 shrink-0">{">"} NIM:</span>
                <span className="text-[#00ff41]">
                  {anasData.nim || "[DATA NOT FOUND]"}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                <span className="text-[#00ff41]/60 w-32 shrink-0">{">"} HOMETOWN:</span>
                <span className="text-[#00ff41]">
                  {anasData.hometown || "[DATA NOT FOUND]"}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                <span className="text-[#00ff41]/60 w-32 shrink-0">{">"} HOBBIES:</span>
                <div className="flex flex-wrap gap-2">
                  {anasData.hobbies && anasData.hobbies.length > 0 ? (
                    anasData.hobbies.map((hobby, index) => (
                      <span key={index} className="border border-[#00ff41] text-[#00ff41] px-2 py-0.5 text-sm">
                        {hobby}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#00ff41]/50">[NO HOBBIES FOUND]</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                <span className="text-[#00ff41]/60 w-32 shrink-0">{">"} INSTAGRAM:</span>
                {anasData.instagramHandle ? (
                  <a
                    href={`https://instagram.com/${anasData.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00ff41] hover:underline"
                  >
                    @{anasData.instagramHandle}
                  </a>
                ) : (
                  <span className="text-[#00ff41]/50">[DATA NOT FOUND]</span>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-baseline gap-2 mt-6">
                <span className="text-[#00ff41]/60 w-32 shrink-0">{">"} QUOTE:</span>
                <div className="text-[#00ff41] italic">
                  {anasData.quote ? `"${anasData.quote}"` : '""'}
                </div>
              </div>
            </div>

            {/* Spotify Section */}
            {anasData.spotifyTrackUri && (
              <div className="mt-8 border-t border-[#00ff41]/30 pt-6">
                <div className="text-[#00ff41]/60 font-mono mb-4 text-sm">{">"} INITIALIZING AUDIO STREAM...</div>
                <SpotifyEmbed trackUri={anasData.spotifyTrackUri} isOpen={isOpen} />
              </div>
            )}

            <div className="mt-4 text-[#00ff41]/40 font-mono text-xs flex items-center">
              <span className="cursor-blink mr-2">_</span> END OF FILE
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
