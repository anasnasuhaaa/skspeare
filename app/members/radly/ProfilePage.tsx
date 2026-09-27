"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  Disc3,
  ExternalLink,
  FileText,
  MapPin,
  Music2,
  Sparkles,
  X,
} from "lucide-react";
import { ROLE_LABELS, type MemberData } from "@/app/types/member";
import SpotifyEmbed from "@/app/components/SpotifyEmbed";

interface ProfilePageProps {
  member: MemberData;
  onClose: () => void;
}

export default function ProfilePage({ member, onClose }: ProfilePageProps) {
  const instagram = member.instagramHandle
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
    .replace(/^@/, "")
    .replace(/\/$/, "");
  const linkedinUrl = member.linkedinUrl
    ? member.linkedinUrl.startsWith("http")
      ? member.linkedinUrl
      : `https://${member.linkedinUrl}`
    : "";
  const cvUrl = member.cvUrl
    ? member.cvUrl.startsWith("http")
      ? member.cvUrl
      : `https://${member.cvUrl}`
    : "";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <main
      className="radly-profile fixed inset-0 z-[1100] overflow-y-auto text-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="radly-profile-title"
    >
      <div className="profile-glow pointer-events-none fixed inset-0" aria-hidden="true" />
      <div className="profile-grain pointer-events-none fixed inset-0" aria-hidden="true" />
      <div className="profile-grid pointer-events-none fixed inset-x-0 bottom-0" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 py-4 sm:px-7 sm:py-6 lg:px-10">
        <header className="flex items-center justify-between gap-4 border-b border-[#FFD700]/30 pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <Disc3 className="shrink-0 text-[#FFD700]" size={21} />
            <div className="min-w-0">
              <p className="truncate font-mono text-[10px] uppercase tracking-[.22em] text-[#00E5FF] sm:text-xs">
                Ilkomerz 62
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[.16em] text-white/40">
                Personal archive · Side A
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup profil"
            className="grid size-10 shrink-0 place-items-center border border-white/25 bg-black/30 text-white/75 transition hover:border-[#E60067] hover:bg-[#E60067]/15 hover:text-white"
          >
            <X size={19} />
          </button>
        </header>

        <div className="relative z-10 my-auto py-6 sm:py-9">
          <section className="grid items-center gap-7 md:grid-cols-[minmax(230px,0.72fr)_1.28fr] md:gap-12">
            <div className="relative mx-auto w-full max-w-sm md:mx-0 md:max-w-none">
              <div className="absolute -inset-3 border border-[#00E5FF]/25" aria-hidden="true" />
              <div className="relative aspect-[4/4.6] overflow-hidden border border-[#FFD700]/60 bg-[#15151a] p-1.5 shadow-[0_0_45px_rgba(0,229,255,.12)]">
                <div className="relative size-full overflow-hidden bg-black">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 85vw, 36vw"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0C10]/85 via-transparent to-[#0B0C10]/15" />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
                    style={{
                      backgroundImage: "repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,229,255,.12) 3px 4px)",
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[.2em] text-white/80">Berlin · 1977</span>
                    <span className="border border-[#FFD700]/65 bg-[#0B0C10]/70 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-[#FFD700]">No. 62</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.25em] text-[#E60067] sm:text-xs">
                <Sparkles size={14} /> Profile unlocked
              </p>
              <h1
                id="radly-profile-title"
                className="mt-3 break-words font-serif text-4xl font-bold leading-[1.02] text-[#FFD700] sm:text-5xl lg:text-6xl"
              >
                {member.name}
              </h1>
              <p className="mt-3 font-mono text-xs uppercase tracking-[.2em] text-[#00E5FF] sm:text-sm">
                {ROLE_LABELS[member.role] || member.role} <span className="text-white/30">/</span> Proxy Shakespeare
              </p>

              <div className="mt-6 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                <div className="bg-[#0B0C10]/85 p-4 sm:p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/40">Student ID</p>
                  <p className="mt-2 break-all font-mono text-sm text-white sm:text-base">{member.nim || "Belum tersedia"}</p>
                </div>
                <div className="bg-[#0B0C10]/85 p-4 sm:p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/40">Hometown</p>
                  <p className="mt-2 flex items-center gap-2 font-mono text-sm text-white sm:text-base">
                    <MapPin size={15} className="shrink-0 text-[#E60067]" />
                    <span>{member.hometown || "Belum ditambahkan"}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <h2 className="font-mono text-[10px] uppercase tracking-[.2em] text-[#00E5FF]">Hobbies</h2>
                  {member.hobbies.length > 0 ? (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {member.hobbies.map((hobby) => (
                        <li key={hobby} className="border border-[#00E5FF]/35 bg-[#00E5FF]/[.06] px-2.5 py-1.5 font-mono text-xs text-white/85">
                          {hobby}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 font-mono text-xs text-white/45">Belum ditambahkan</p>
                  )}
                </div>
                <div>
                  <h2 className="font-mono text-[10px] uppercase tracking-[.2em] text-[#00E5FF]">Personal quote</h2>
                  <p className="mt-2 font-serif text-base italic text-white/80 sm:text-lg">
                    {member.quote ? `“${member.quote}”` : "Belum ditambahkan"}
                  </p>
                </div>
              </div>

              <nav className="mt-7 flex flex-wrap gap-2" aria-label="Tautan profil">
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-[#00E5FF]/55 bg-[#00E5FF]/10 px-3 font-mono text-[10px] uppercase tracking-wider text-white transition hover:bg-[#00E5FF]/20 sm:text-xs">
                    LinkedIn <ExternalLink size={13} />
                  </a>
                )}
                {cvUrl && (
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-[#FFD700]/55 bg-[#FFD700]/10 px-3 font-mono text-[10px] uppercase tracking-wider text-[#FFD700] transition hover:bg-[#FFD700]/20 sm:text-xs">
                    <FileText size={14} /> Open CV <ExternalLink size={13} />
                  </a>
                )}
                {instagram && (
                  <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 border border-[#E60067]/55 bg-[#E60067]/10 px-3 font-mono text-[10px] uppercase tracking-wider text-white transition hover:bg-[#E60067]/20 sm:text-xs">
                    Instagram @{instagram} <ExternalLink size={13} />
                  </a>
                )}
              </nav>
            </div>
          </section>

          <section className="mt-8 border-t border-[#FFD700]/25 pt-5 sm:mt-10 sm:pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#FFD700] sm:text-xs">
                <Music2 size={15} /> Soundtrack
              </h2>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/35">The personal side of the record</span>
            </div>
            {member.spotifyTrackUri ? (
              <div className="mt-4 overflow-hidden border border-[#00E5FF]/30 bg-[#0B0C10]/80">
                <SpotifyEmbed trackUri={member.spotifyTrackUri} isOpen />
              </div>
            ) : (
              <p className="mt-3 font-mono text-xs text-white/45">Belum ada track yang ditautkan.</p>
            )}
          </section>
        </div>

        <footer className="relative z-10 flex items-center justify-between gap-4 border-t border-white/10 pt-3 font-mono text-[9px] uppercase tracking-[.14em] text-white/35">
          <span>End of side A</span>
          <button type="button" onClick={onClose} className="text-[#00E5FF] transition hover:text-white">Close profile</button>
        </footer>
      </div>

      <style jsx>{`
        .radly-profile {
          background: radial-gradient(ellipse at 68% 24%, rgba(230,0,103,.12), transparent 42%), radial-gradient(ellipse at 12% 70%, rgba(0,229,255,.09), transparent 40%), #0b0c10;
          animation: profile-reveal .55s cubic-bezier(.2,.8,.2,1) both;
        }
        .profile-glow {
          background: radial-gradient(ellipse 470px 360px at 50% 20%, rgba(255,215,0,.09), transparent 75%);
        }
        .profile-grain {
          opacity: .1;
          mix-blend-mode: screen;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
        }
        .profile-grid {
          height: 34vh;
          opacity: .18;
          background-image: repeating-linear-gradient(0deg, rgba(0,229,255,.35) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(230,0,103,.28) 0 1px, transparent 1px 42px);
          transform: perspective(190px) rotateX(58deg);
          transform-origin: center bottom;
          mask-image: linear-gradient(to top, #000, transparent);
        }
        @keyframes profile-reveal {
          from { opacity: 0; transform: scale(1.025); clip-path: inset(0 0 100% 0); }
          to { opacity: 1; transform: scale(1); clip-path: inset(0 0 0 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .radly-profile { animation-duration: .01ms !important; }
        }
      `}</style>
    </main>
  );
}