import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Marquee from "./components/Marquee";
import AboutSection from "./components/AboutSection";
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
        {/* Landing / Hero Section with Kinetic Motion Typography & Photo Showcase */}
        <HeroSection />

        {/* Marquee Banner between Hero and About */}
        <Marquee direction="right" />

        {/* About Section */}
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
      <footer className="bg-nb-black text-nb-cream py-6 sm:py-8 border-t-4 border-nb-black relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center gap-1.5">
          <h3 className="text-lg sm:text-xl font-display font-black uppercase tracking-tight">
            Proxy Shakespeare
          </h3>
          <p className="text-nb-cream/70 font-mono text-xs sm:text-sm">
            Pekan Ilkomerz 62 · Department of Computer Science · IPB University
          </p>
          <p className="text-nb-cream/40 text-[11px] sm:text-xs font-mono mt-1">
            © 2026 Proxy Shakespeare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

