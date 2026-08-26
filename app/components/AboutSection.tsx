import React from "react";

export default function AboutSection() {
  return (
    <section id="about" className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4">
      <div className="container mx-auto max-w-4xl relative">
        <div className="nb-card bg-nb-blue p-6 sm:p-8 md:p-12 relative overflow-hidden">
          {/* Decorative badges */}
          <div className="hidden sm:block absolute top-4 right-4 nb-badge bg-nb-yellow px-3 sm:px-4 py-1 text-xs sm:text-sm transform rotate-12">
            Pekan Ilkomerz 62
          </div>
          <div className="hidden sm:block absolute bottom-6 sm:bottom-8 right-6 sm:right-8 nb-badge bg-nb-pink px-3 sm:px-4 py-1 text-xs sm:text-sm transform -rotate-6">
            Ilmu Komputer IPB
          </div>
          <div className="hidden md:block absolute top-1/2 right-12 nb-badge bg-nb-lime px-4 py-1 text-sm transform rotate-6">
            SSMI
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl nb-heading text-nb-black mb-4 sm:mb-6 leading-none">
            PROXY<br className="sm:hidden" /> SHAKESPEARE
          </h1>

          <div className="bg-nb-white p-4 sm:p-6 nb-card max-w-2xl">
            <p className="text-base sm:text-lg text-nb-black font-medium leading-relaxed">
              Welcome to the digital realm of <strong>Proxy Shakespeare</strong>. This website is created as part of the{" "}
              <strong>Pekan Ilkomerz 62</strong> group assignment for{" "}
              <strong>Program Studi Ilmu Komputer, IPB University</strong>.
            </p>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-nb-black font-medium leading-relaxed">
              We bring code, creativity, and a touch of drama to everything we build. ✨
            </p>
          </div>

          {/* Mobile-only badges */}
          <div className="flex flex-wrap gap-2 mt-4 sm:hidden">
            <span className="nb-badge bg-nb-yellow px-3 py-1 text-xs">Pekan Ilkomerz 62</span>
            <span className="nb-badge bg-nb-pink px-3 py-1 text-xs">Ilkom IPB</span>
            <span className="nb-badge bg-nb-lime px-3 py-1 text-xs">SSMI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
