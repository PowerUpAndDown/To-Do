import React from 'react';

export const SidebarArt: React.FC = () => {
  return (
    <div className="relative w-20 md:w-28 lg:w-36 flex-shrink-0 self-stretch min-h-screen overflow-hidden rounded-r-3xl shadow-lg select-none">
      {/* Sunset ocean gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#6355a4] via-[#bd6c8a] via-45% to-[#e08953] to-85% flex flex-col justify-between"
        style={{
          background: 'linear-gradient(180deg, #514289 0%, #76569d 20%, #bf6c8c 45%, #f69d62 70%, #ffc078 85%, #886fa7 100%)',
        }}
      >
        {/* Shimmering sea ripple overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-30 bg-repeat-x bg-bottom mix-blend-overlay pointer-events-none"
             style={{
               backgroundImage: 'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.8) 0%, transparent 70%)'
             }} 
        />
      </div>

      {/* Cloud Sticker with Washi Tape pinned at top-left */}
      <div className="absolute top-6 -left-3 md:left-2 z-20 transform -rotate-6 transition-transform hover:rotate-0 duration-300">
        {/* Mint green washi tape */}
        <div 
          className="w-5 h-8 mx-auto -mb-3 relative z-30 opacity-85 shadow-sm rounded-xs transform -rotate-3"
          style={{
            backgroundColor: '#4ade80',
            background: 'repeating-linear-gradient(45deg, #4ade80, #4ade80 4px, #86efac 4px, #86efac 8px)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
          }}
        />
        {/* Soft pastel cloud */}
        <div 
          className="relative px-4 py-3 rounded-[35px] shadow-md backdrop-blur-sm border border-white/40"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(230,225,250,0.9) 50%, rgba(255,240,245,0.88) 100%)',
            boxShadow: '0 8px 20px -3px rgba(99, 85, 164, 0.35)'
          }}
        >
          <div className="flex items-center space-x-1">
            <span className="text-xl">☁️</span>
            <span className="text-[10px] font-bold text-purple-700 tracking-wider uppercase opacity-75">Monika</span>
          </div>
        </div>
      </div>

      {/* Gentle vertical aesthetic quote/tag */}
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rotate-90 text-white/50 text-[11px] font-medium tracking-[0.3em] uppercase pointer-events-none whitespace-nowrap">
        Varje dag räknas ✨
      </div>
    </div>
  );
};

export const FloatingHeartSticker: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 md:right-10 z-10 pointer-events-none select-none transform rotate-12 transition-transform hover:rotate-6 duration-300">
      {/* Blue washi tape */}
      <div 
        className="w-5 h-7 mx-auto -mb-2 relative z-20 opacity-80 rounded-xs transform rotate-12"
        style={{
          background: 'repeating-linear-gradient(45deg, #60a5fa, #60a5fa 3px, #93c5fd 3px, #93c5fd 6px)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.12)'
        }}
      />
      {/* Iridescent heart sticker */}
      <div 
        className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center p-3 shadow-lg border border-white/50"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 230, 240, 0.95) 0%, rgba(230, 240, 255, 0.9) 50%, rgba(255, 245, 230, 0.95) 100%)',
          boxShadow: '0 10px 25px -4px rgba(236, 72, 153, 0.25)'
        }}
      >
        <span className="text-3xl md:text-4xl filter drop-shadow">💖</span>
      </div>
    </div>
  );
};
