
import React, { useEffect, useRef, useState } from "react";
import { X, Copy, Terminal, FileText, ExternalLink, Music, Code2 } from "lucide-react";
import Instagram from "@/app/components/InstagramIcon";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Dark Translucent Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Main Glassmorphism Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex flex-col gap-5 scrollbar-hide animate-fade-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/20 border border-white/10 rounded-full p-2 transition-all z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* 1. Header Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-4 hover:bg-white/10 transition-colors">
  <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden border border-white/20 bg-black/20">
    <img 
      src="/member/p4.jpeg" 
      alt="Adit"
      className="w-full h-full object-cover opacity-100" 
    />
  </div>
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1 pt-1">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-md text-xs font-bold mb-3 flex items-center gap-2 shadow-sm">
              🔥 Anggota // Data Science enthusiast
            </span>
            <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
              Muhamad Aditya Firmansyah<span className="text-emerald-400 animate-pulse"></span>
            </h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 w-full">
              <span className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-md text-sm font-mono text-gray-200 flex items-center gap-2">
                NIM: M0403251113
              </span>
              <span className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-md text-sm text-gray-200 flex items-center gap-2">
                📍 Bekasi, West Java
              </span>
            </div>
          </div>
        </div>

        {/* 2. Quote Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center shadow-inner hover:bg-white/10 transition-colors">
          <p className="text-lg italic text-gray-200 font-medium tracking-wide">
            “When something is important enough, you do it even if the odds are not in your favour.”
          </p>
        </div>

        {/* 3. Hobbies Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono text-gray-300">Hobbies</h3>
            <span className="text-xs text-gray-400 font-mono">5 items</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {['Chess', 'Coding', 'Sudoku', 'Reading', 'Gaming'].map(hobby => (
              <span key={hobby} className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 backdrop-blur-md cursor-default hover:bg-yellow-500/20 transition-colors">
                <span className="text-yellow-500">{'•'}</span> {hobby}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Social Links Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
          <h3 className="text-sm font-mono text-gray-300 mb-4">Social Media</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
              @m.adityaaaf
            <a
                                href={`https://instagram.com/m.adityaaaf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#101b28] border-2 border-[#ec4899] hover:bg-[#ec4899] hover:text-white rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs text-white transition-all truncate"
                                title="Buka profil Instagram"
                              >
                                <Instagram size={15} className="text-[#ec4899] group-hover:text-white shrink-0" />
                                <span className="truncate"></span>
                                <ExternalLink size={12} className="opacity-60 shrink-0" />
                              </a>
            </button>
            <button className="bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
              LinkedIn Profile
            <a
  href="https://www.linkedin.com/in/muhamad-aditya-firmansyah-02755137a/" // Ganti bagian ini dengan URL LinkedIn yang benar
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#101b28] border-2 border-[#0284c7] hover:bg-[#0284c7] hover:text-white rounded-xl shadow-[3px_3px_0px_#000000] font-mono font-bold text-xs text-white transition-all"
  title="Buka profil LinkedIn"
>
  {/* Tambahkan ikon atau teks di sini jika diperlukan */}
  LinkedIn
</a>
            </button>
            <button className="bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 text-teal-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 backdrop-blur-sm">
              Curriculum Vitae
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;