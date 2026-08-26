"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

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
    <nav className="fixed top-0 left-0 right-0 z-[90] bg-nb-cream/95 backdrop-blur-sm border-b-[3px] border-nb-black">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-display font-extrabold text-xl text-nb-black tracking-tight"
        >
          <span className="inline-block bg-nb-yellow px-2 py-0.5 border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] mr-1">
            🎭
          </span>
          Proxy Shakespeare
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              className="nb-btn bg-nb-white px-4 py-2 text-sm font-bold text-nb-black hover:bg-nb-yellow transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden nb-btn bg-nb-white p-2"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-nb-cream border-t-[3px] border-nb-black"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleClick(link.href)}
                  className="nb-btn bg-nb-white px-4 py-3 text-left font-bold text-nb-black hover:bg-nb-yellow transition-colors w-full"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
