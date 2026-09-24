import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Marquee from "./components/Marquee";
import AboutSection from "./components/AboutSection";
import MembersSection from "./components/MembersSection";
import Gallery from "./components/Gallery";
import ScrollToTop from "./components/ScrollToTop";
import LoadingScreen from "./components/LoadingScreen";

function GithubIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="shakespeare-stage min-h-screen bg-nb-cream overflow-x-hidden flex flex-col">
      {/* Neo-brutalist Loading Screen / Preloader */}
      <LoadingScreen />

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center gap-2 sm:gap-2.5">
          <h3 className="footer-shake-mark text-lg sm:text-xl font-display font-black uppercase tracking-tight">
            Proxy <span className="text-nb-yellow">Shake</span>speare
          </h3>
          <p className="text-nb-cream/70 font-mono text-xs sm:text-sm">
            Pekan Ilkomerz 62 · Department of Computer Science · IPB University
          </p>

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/anasnasuhaaa/skspeare"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 my-1 bg-nb-cream text-nb-black border-2 border-nb-black rounded-xl font-mono font-bold text-xs sm:text-sm hover:bg-nb-yellow hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--nb-yellow)] transition-all shadow-[2px_2px_0px_rgba(255,255,255,0.2)]"
            title="View source code on GitHub"
          >
            <GithubIcon size={16} />
            <span>Source Code</span>
          </a>

          <p className="text-nb-cream/40 text-[11px] sm:text-xs font-mono">
            © 2026 Proxy Shakespeare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

