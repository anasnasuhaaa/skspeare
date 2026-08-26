"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, FileText } from "lucide-react";
import { MemberData } from "../types/member";

interface MemberCardProps {
  member: MemberData;
  onClick: () => void;
}

export default function MemberCard({ member, onClick }: MemberCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="nb-card bg-nb-white p-4 cursor-pointer flex flex-col w-full h-full"
    >
      {/* Photo — fixed aspect ratio */}
      <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden border-[3px] border-nb-black bg-nb-cream">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-base sm:text-lg font-display font-extrabold text-nb-black leading-tight line-clamp-1 mb-1">
          {member.name}
        </h3>
        <p className="font-mono text-xs sm:text-sm text-nb-black/70 font-bold mb-3">
          {member.nim || "NIM belum diisi"}
        </p>

        {/* Action Icons */}
        <div className="mt-auto flex gap-2">
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 sm:w-9 sm:h-9 nb-btn bg-nb-blue flex items-center justify-center text-nb-black"
              title="LinkedIn"
            >
              <ExternalLink size={16} strokeWidth={2.5} />
            </a>
          )}
          {member.cvUrl && (
            <a
              href={member.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 sm:w-9 sm:h-9 nb-btn bg-nb-pink flex items-center justify-center text-nb-black"
              title="CV"
            >
              <FileText size={16} strokeWidth={2.5} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
