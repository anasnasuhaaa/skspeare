"use client";

import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
  { label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Active section scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      const sections = ["home", "about", "team", "gallery"];

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

  const handleClick = (href: string) => {
    setIsOpen(false);
    const targetId = href.replace("#", "");
    const el = document.getElementById(targetId);
    if (el) {
      const navHeight = navRef.current?.offsetHeight || 64;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = Math.max(0, elementPosition - navHeight + 5);
      window.scrollTo({
        top: targetId === "home" ? 0 : offsetPosition,
        behavior: "smooth",
      });
    } else {
      const fallbackEl = document.querySelector(href);
      if (fallbackEl) {
        fallbackEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-90 bg-nb-cream/95 backdrop-blur-sm border-b-[3px] border-nb-black shadow-[0_4px_0_var(--nb-black)]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-15 sm:h-16">
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
                  type="button"
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
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden relative w-10 h-10 bg-nb-white border-[2.5px] border-nb-black rounded-lg shadow-[3px_3px_0px_var(--nb-black)] active:translate-y-[1.5px] active:translate-x-[1.5px] active:shadow-[1.5px_1.5px_0px_var(--nb-black)] transition-all cursor-pointer flex items-center justify-center z-100"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <div className="w-5 h-4 relative flex flex-col justify-between items-center pointer-events-none">
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
      </nav>

      {/* Transparent Click-Outside Overlay (No blur, no background darkening) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-95 bg-transparent cursor-default"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Mobile Popover Modal (1/4 screen size, detached floating card, no blur) */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-18 sm:top-20 right-4 sm:right-6 z-100 w-48 sm:w-52 bg-nb-cream border-[3px] border-nb-black rounded-2xl shadow-[6px_6px_0px_var(--nb-black)] p-3 origin-top-right transition-all duration-200 ease-out ${isOpen
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto"
            : "scale-90 opacity-0 -translate-y-2 pointer-events-none"
          }`}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-nb-black/20 px-1">
          <span className="font-mono font-black text-[11px] uppercase text-nb-black/75 tracking-wider">
            Navigation
          </span>
        </div>

        {/* Menu Buttons Stack - Names Only, No Icons */}
        <div className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <button
                key={link.href}
                type="button"
                onClick={() => handleClick(link.href)}
                className={`w-full text-center px-4 py-2 font-display font-black text-xs uppercase tracking-wider border-2 border-nb-black rounded-xl transition-all cursor-pointer ${isActive
                    ? "bg-nb-yellow text-nb-black shadow-[2px_2px_0px_var(--nb-black)] translate-y-0.5 translate-x-0.5"
                    : "bg-nb-white text-nb-black shadow-[2.5px_2.5px_0px_var(--nb-black)] hover:bg-nb-yellow hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_var(--nb-black)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[1px_1px_0px_var(--nb-black)]"
                  }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

