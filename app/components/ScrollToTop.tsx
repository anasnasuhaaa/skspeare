"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-80 w-12 h-12 sm:w-14 sm:h-14 bg-nb-yellow border-[3px] border-nb-black rounded-2xl shadow-[4px_4px_0px_var(--nb-black)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_var(--nb-black)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-[0px_0px_0px_var(--nb-black)] flex items-center justify-center text-nb-black cursor-pointer transition-all animate-in fade-in zoom-in duration-200"
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUp size={24} strokeWidth={3} />
    </button>
  );
}

