"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, FileText } from "lucide-react";
import { MemberData } from "../types/member";

interface MemberCardProps {
  member: MemberData;
  onClick: () => void;
}

export default function MemberCard({ member, onClick }: MemberCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-nb-white border-[4px] border-nb-black rounded-2xl shadow-[6px_6px_0px_var(--nb-black)] hover:shadow-[10px_10px_0px_var(--nb-black)] hover:-translate-y-1 active:translate-y-0 active:shadow-[4px_4px_0px_var(--nb-black)] p-4 sm:p-5 cursor-pointer flex flex-col w-full h-full transition-all duration-200"
    >
      {/* Photo — square aspect ratio */}
      <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden border-[3px] border-nb-black bg-nb-cream">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-lg sm:text-xl font-display font-black text-nb-black leading-tight line-clamp-2 mb-2">
          {member.name}
        </h3>
        <p className="font-mono text-sm text-nb-black/80 font-bold mb-4">
          {member.nim || "NIM belum diisi"}
        </p>

        {/* Action Icons & Detail Button */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex gap-2">
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-nb-blue border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_var(--nb-black)] flex items-center justify-center text-nb-black transition-all"
                title="LinkedIn"
              >
                <ExternalLink size={18} strokeWidth={2.5} />
              </a>
            )}
            {member.cvUrl && (
              <a
                href={member.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-nb-pink border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_var(--nb-black)] flex items-center justify-center text-nb-black transition-all"
                title="CV"
              >
                <FileText size={18} strokeWidth={2.5} />
              </a>
            )}
          </div>

          <button
            className="w-full py-2.5 bg-nb-yellow border-[3px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] font-bold text-sm text-nb-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_var(--nb-black)] transition-all cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}
