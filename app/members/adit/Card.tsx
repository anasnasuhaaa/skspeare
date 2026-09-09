import React from 'react';

interface CardProps {
  onOpenModal: () => void;
}

const Card: React.FC<CardProps> = ({ onOpenModal }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex flex-col items-center max-w-[320px] w-full transition-all duration-300 hover:bg-white/20">
      {/* Profile Image Container */}
      <div className="w-full aspect-square mb-5 rounded-xl overflow-hidden border border-white/30 shadow-inner">
        <img
          src="/path-to-aditya-image.jpg" // Replace with actual image path
          alt="Muhamad Aditya Firmasyah"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Text Content */}
      <h2 className="text-2xl font-bold text-white mb-1 text-center tracking-wide">
        Muhamad Aditya Firmasyah
      </h2>
      <p className="text-gray-300 font-mono text-sm mb-6 font-semibold tracking-wider">
        M0403251113
      </p>
      
      {/* Action Button */}
      <button
        onClick={onOpenModal}
        className="w-full py-3 bg-[#fde047] hover:bg-[#fef08a] text-gray-900 font-bold rounded-lg shadow-[0_4px_14px_0_rgba(253,224,71,0.39)] flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
      >
        <span>✨</span> MAGIC <span>✨</span>
      </button>
    </div>
  );
};

export default Card;