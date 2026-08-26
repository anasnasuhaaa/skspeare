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
      className="group bg-nb-white border-[3px] sm:border-4 border-nb-black rounded-xl sm:rounded-2xl shadow-[4px_4px_0px_var(--nb-black)] sm:shadow-[6px_6px_0px_var(--nb-black)] hover:shadow-[6px_6px_0px_var(--nb-black)] sm:hover:shadow-[10px_10px_0px_var(--nb-black)] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_var(--nb-black)] sm:active:shadow-[4px_4px_0px_var(--nb-black)] p-3 sm:p-4 md:p-5 cursor-pointer flex flex-col w-full h-full transition-all duration-200"
    >
      {/* Photo — square aspect ratio */}
      <div className="relative w-full aspect-square mb-2.5 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden border-[2.5px] sm:border-[3px] border-nb-black bg-nb-cream">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-sm sm:text-lg md:text-xl font-display font-black text-nb-black leading-tight line-clamp-2 mb-1 sm:mb-2">
          {member.name}
        </h3>
        <p className="font-mono text-[11px] sm:text-xs md:text-sm text-nb-black/80 font-bold mb-2.5 sm:mb-3">
          {member.nim || "NIM not available"}
        </p>

        {/* Action Icons (LinkedIn & CV) */}
        {/* {(member.linkedinUrl || member.cvUrl) && (
          <div className="mt-auto flex items-center gap-2 pt-1">
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-nb-blue border-[2.5px] sm:border-[3px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_var(--nb-black)] flex items-center justify-center text-nb-black transition-all"
                title="LinkedIn"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" strokeWidth={2.5} />
              </a>
            )}
            {member.cvUrl && (
              <a
                href={member.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-nb-pink border-[2.5px] sm:border-[3px] border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] sm:shadow-[3px_3px_0px_var(--nb-black)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_var(--nb-black)] flex items-center justify-center text-nb-black transition-all"
                title="CV"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" strokeWidth={2.5} />
              </a>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
}
