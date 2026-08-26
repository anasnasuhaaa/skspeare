import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import Marquee from "./components/Marquee";
import MembersSection from "./components/MembersSection";
import Gallery from "./components/Gallery";

export default function Home() {
  return (
    <div className="min-h-screen bg-nb-cream">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Hero / About Section */}
      <AboutSection />

      {/* Diagonal Marquee Banner */}
      <Marquee />

      {/* Members Grid — grouped by role */}
      <MembersSection />

      {/* Gallery — auto-scrolling photo carousel */}
      <Gallery />

      {/* Footer */}
      <footer className="bg-nb-black text-nb-cream py-8 sm:py-12 px-4 border-t-4 border-nb-black">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-display font-bold mb-3 sm:mb-4">
            Proxy Shakespeare
          </h3>
          <p className="text-nb-cream/70 font-mono text-xs sm:text-sm mb-4 sm:mb-6">
            Pekan Ilkomerz 62 · Program Studi Ilmu Komputer · IPB University
          </p>
          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="nb-badge bg-nb-yellow text-nb-black px-3 sm:px-4 py-1 text-[10px] sm:text-xs">
              Next.js
            </span>
            <span className="nb-badge bg-nb-pink text-nb-black px-3 sm:px-4 py-1 text-[10px] sm:text-xs">
              Framer Motion
            </span>
            <span className="nb-badge bg-nb-green text-nb-black px-3 sm:px-4 py-1 text-[10px] sm:text-xs">
              GSAP
            </span>
            <span className="nb-badge bg-nb-blue text-nb-black px-3 sm:px-4 py-1 text-[10px] sm:text-xs">
              Tailwind CSS
            </span>
          </div>
          <p className="mt-6 sm:mt-8 text-nb-cream/50 text-[10px] sm:text-xs font-mono">
            © 2025 Proxy Shakespeare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
