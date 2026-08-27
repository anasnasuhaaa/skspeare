import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import Marquee from "./components/Marquee";
import MembersSection from "./components/MembersSection";
import Gallery from "./components/Gallery";
import ScrollToTop from "./components/ScrollToTop";

export default function Home() {
  return (
    <div className="min-h-screen bg-nb-cream overflow-x-hidden flex flex-col">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

      <main className="flex-1">
        {/* Hero / About Section */}
        <AboutSection />

        {/* Diagonal Marquee Banner (Left) */}
        <Marquee direction="left" />

        {/* Members Grid — grouped by role */}
        <MembersSection />

        {/* Gallery — auto-scrolling photo carousel */}
        <Gallery />

        {/* Second Marquee Banner (Right / Reverse) */}
        <Marquee direction="right" />
      </main>

      {/* Footer */}
      <footer className="bg-nb-black text-nb-cream py-10 sm:py-14 border-t-4 border-nb-black relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-display font-black mb-3 uppercase tracking-tight">
            Proxy Shakespeare
          </h3>
          <p className="text-nb-cream/70 font-mono text-xs sm:text-sm mb-6 max-w-md mx-auto">
            Pekan Ilkomerz 62 · Department of Computer Science · IPB University
          </p>
          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="px-3.5 py-1 bg-nb-yellow text-nb-black font-bold border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] text-xs">
              Next.js
            </span>
            <span className="px-3.5 py-1 bg-nb-green text-nb-black font-bold border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] text-xs">
              GSAP
            </span>
            <span className="px-3.5 py-1 bg-nb-pink text-nb-black font-bold border-2 border-nb-black rounded-lg shadow-[2px_2px_0px_var(--nb-black)] text-xs">
              Tailwind CSS
            </span>
          </div>
          <p className="mt-8 text-nb-cream/50 text-xs font-mono">
            © 2026 Proxy Shakespeare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

