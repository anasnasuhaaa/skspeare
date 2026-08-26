"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[90] bg-nb-cream/95 backdrop-blur-sm border-b-[3px] border-nb-black shadow-[0_4px_0_var(--nb-black)]">
      <div className="container mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo Text - Neobrutalism Solid Black */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-display font-black text-2xl sm:text-3xl text-nb-black uppercase tracking-tight hover:-translate-y-0.5 transition-transform"
        >
          Proxy Shakespeare
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="px-5 py-2 text-base font-bold text-nb-black bg-nb-white border-[3px] border-nb-black rounded-lg shadow-[4px_4px_0px_var(--nb-black)] hover:bg-nb-yellow hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_var(--nb-black)] transition-all cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger (CSS Animated Neobrutalism Button) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-12 h-12 bg-nb-white border-[3px] border-nb-black rounded-lg shadow-[4px_4px_0px_var(--nb-black)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0px_var(--nb-black)] transition-all cursor-pointer p-2"
          aria-label="Toggle Menu"
        >
          <span
            className={`w-6 h-1 bg-nb-black rounded-full transition-all duration-300 transform ${
              isOpen ? "rotate-45 translate-y-2" : "mb-1"
            }`}
          />
          <span
            className={`w-6 h-1 bg-nb-black rounded-full transition-all duration-300 ${
              isOpen ? "opacity-0 scale-0" : "mb-1 opacity-100"
            }`}
          />
          <span
            className={`w-6 h-1 bg-nb-black rounded-full transition-all duration-300 transform ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-nb-cream border-t-[3px] border-nb-black shadow-[0_4px_0_var(--nb-black)] ${
          isOpen ? "max-h-72 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="px-6 py-3 text-left font-bold text-nb-black bg-nb-white border-[3px] border-nb-black rounded-lg shadow-[4px_4px_0px_var(--nb-black)] hover:bg-nb-yellow hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_var(--nb-black)] transition-all w-full text-lg cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
