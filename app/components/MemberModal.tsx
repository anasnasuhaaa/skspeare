"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { MemberData } from "../types/member";
import SpotifyEmbed from "./SpotifyEmbed";

interface MemberModalProps {
  member: MemberData | null;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function MemberModal({ member, isOpen, onClose, children }: MemberModalProps) {
  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 modal-backdrop"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto nb-card bg-nb-white p-5 sm:p-6 md:p-8 z-10 flex flex-col gap-4 sm:gap-6"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 nb-btn bg-nb-red text-nb-white flex items-center justify-center text-lg sm:text-xl z-20"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
              {/* Photo */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden border-[3px] border-nb-black">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl nb-heading text-nb-black mb-2">
                  {member.name}
                </h2>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="nb-badge bg-nb-yellow px-3 py-1 text-xs">{member.role}</span>
                  {member.hometown && (
                    <span className="nb-badge bg-nb-lime px-3 py-1 text-xs">📍 {member.hometown}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quote */}
            {member.quote && (
              <p className="italic text-base sm:text-lg font-medium border-l-4 border-nb-black pl-4 text-nb-black/80">
                &ldquo;{member.quote}&rdquo;
              </p>
            )}

            {/* Hobbies */}
            {member.hobbies.length > 0 && (
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-2 text-xs sm:text-sm text-nb-black/60">
                  Hobbies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.hobbies.map((hobby, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-nb-cream border-2 border-nb-black rounded-lg text-xs sm:text-sm font-bold"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Instagram */}
            {member.instagramHandle && (
              <div>
                <a
                  href={`https://instagram.com/${member.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-nb-pink hover:underline text-sm sm:text-base"
                >
                  📸 @{member.instagramHandle}
                </a>
              </div>
            )}

            {/* Spotify */}
            {member.spotifyTrackUri && (
              <div>
                <h4 className="font-bold uppercase tracking-wider mb-2 text-xs sm:text-sm text-nb-black/60">
                  🎵 Now Playing
                </h4>
                <SpotifyEmbed trackUri={member.spotifyTrackUri} isOpen={isOpen} />
              </div>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
