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
    <nav className="fixed top-0 left-0 right-0 z-90 bg-nb-cream/95 backdrop-blur-sm border-b-[3px] border-nb-black shadow-[0_4px_0_var(--nb-black)]">
      <div className="container mx-auto px-4 flex items-center justify-between h-15 sm:h-16">
        {/* Logo Text - Neobrutalism Solid Black */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-display font-black text-xl sm:text-2xl text-nb-black tracking-tight hover:-translate-y-0.5 transition-transform"
        >
          Proxy Shakespeare
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-3">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="px-4 py-1.5 text-sm font-bold text-nb-black bg-nb-white border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] hover:bg-nb-yellow hover:translate-y-[1.5px] hover:translate-x-[1.5px] hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] transition-all cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger (CSS Animated Precise X Toggle) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative w-10 h-10 bg-nb-white border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] active:translate-y-[1.5px] active:translate-x-[1.5px] active:shadow-[1.5px_1.5px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center justify-center"
          aria-label="Toggle Menu"
        >
          <div className="w-5 h-4 relative flex flex-col justify-between items-center">
            <span
              className={`w-5 h-[2.5px] bg-nb-black rounded-full transition-all duration-300 origin-center ${isOpen ? "absolute top-1/2 -translate-y-1/2 rotate-45" : ""
                }`}
            />
            <span
              className={`w-5 h-[2.5px] bg-nb-black rounded-full transition-all duration-200 ${isOpen ? "opacity-0 scale-0" : "opacity-100"
                }`}
            />
            <span
              className={`w-5 h-[2.5px] bg-nb-black rounded-full transition-all duration-300 origin-center ${isOpen ? "absolute top-1/2 -translate-y-1/2 -rotate-45" : ""
                }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-nb-cream border-t-[3px] border-nb-black shadow-[0_4px_0_var(--nb-black)] ${isOpen ? "max-h-72 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
          }`}
      >
        <div className="container mx-auto px-4 flex flex-col gap-2.5">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="px-5 py-2.5 text-left font-bold text-nb-black bg-nb-white border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] hover:bg-nb-yellow hover:translate-y-[1.5px] hover:translate-x-[1.5px] hover:shadow-[1.5px_1.5px_0px_var(--nb-black)] transition-all w-full text-base cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

