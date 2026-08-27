"use client";

import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("about");
  const navRef = useRef<HTMLElement>(null);

  // Active section scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      const sections = ["about", "team", "gallery"];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-90 bg-nb-cream/95 backdrop-blur-sm border-b-[3px] border-nb-black shadow-[0_4px_0_var(--nb-black)]"
    >
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
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className={`px-4 py-1.5 text-sm font-bold text-nb-black border-[2.5px] border-nb-black rounded-lg transition-all cursor-pointer ${isActive
                    ? "bg-nb-yellow shadow-[1.5px_1.5px_0px_var(--nb-black)] translate-y-[1.5px] translate-x-[1.5px]"
                    : "bg-nb-white shadow-[3px_3px_0px_var(--nb-black)] hover:bg-nb-yellow hover:translate-y-[1.5px] hover:translate-x-[1.5px] hover:shadow-[1.5px_1.5px_0px_var(--nb-black)]"
                  }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Hamburger (CSS Animated Precise X Toggle) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative w-10 h-10 bg-nb-white border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] active:translate-y-[1.5px] active:translate-x-[1.5px] active:shadow-[1.5px_1.5px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center justify-center"
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
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
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <button
                key={link.href}
                onClick={() => handleClick(link.href)}
                className={`px-5 py-2.5 text-left font-bold text-nb-black border-[2.5px] border-nb-black rounded-lg transition-all w-full text-base cursor-pointer ${isActive
                    ? "bg-nb-yellow shadow-[1.5px_1.5px_0px_var(--nb-black)] translate-y-[1.5px] translate-x-[1.5px]"
                    : "bg-nb-white shadow-[3px_3px_0px_var(--nb-black)] hover:bg-nb-yellow hover:translate-y-[1.5px] hover:translate-x-[1.5px] hover:shadow-[1.5px_1.5px_0px_var(--nb-black)]"
                  }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

