import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TodoList } from '../types/todo';
import { playCelebrationSound } from '../utils/sound';

interface CelebrationModalProps {
  list: TodoList;
  userName: string;
  onConfirmClose: () => void;
  onUndo: () => void;
  soundEnabled?: boolean;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  list,
  userName,
  onConfirmClose,
  onUndo,
  soundEnabled = true,
}) => {
  useEffect(() => {
    // Play celebratory chime sound
    if (soundEnabled) {
      playCelebrationSound();
    }

    // Trigger golden confetti burst matching screenshot
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#fde047', '#e11d48', '#a855f7', '#38bdf8', '#22c55e'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.4,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    // Secondary shower from top
    const timer = setTimeout(() => {
      confetti({
        particleCount: 120,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.2 },
        colors: ['#eab308', '#f59e0b', '#ec4899'],
      });
      confetti({
        particleCount: 120,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.2 },
        colors: ['#eab308', '#f59e0b', '#ec4899'],
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [soundEnabled]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-300">
      {/* Decorative Rising Pink Balloons with Swirl Marble Texture matching Image 5 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Balloon 1: bottom-left */}
        <div className="absolute -bottom-6 left-6 sm:left-16 flex flex-col items-center animate-bounce duration-1000">
          <div 
            className="w-24 h-28 sm:w-32 sm:h-36 rounded-full shadow-2xl relative border border-pink-200/50"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #ffd1dc 0%, #f472b6 40%, #db2777 85%, #9d174d 100%)',
              boxShadow: 'inset -5px -5px 12px rgba(0,0,0,0.25), 0 15px 35px rgba(219, 39, 119, 0.4)'
            }}
          >
            {/* Gloss reflection */}
            <div className="absolute top-4 left-5 w-4 h-8 bg-white/60 rounded-full blur-[1px] rotate-20" />
          </div>
          {/* String */}
          <div className="w-0.5 h-20 bg-neutral-300 -mt-1" />
          {/* Hand holding balloon */}
          <div className="text-3xl filter drop-shadow -mt-2">✊🏼</div>
        </div>

        {/* Balloon 2: bottom-center */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center animate-pulse duration-700">
          <div 
            className="w-24 h-28 rounded-full shadow-2xl relative border border-pink-200/50"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #ffe4e6 0%, #fb7185 45%, #e11d48 90%)',
              boxShadow: 'inset -5px -5px 12px rgba(0,0,0,0.25), 0 15px 30px rgba(225, 29, 72, 0.35)'
            }}
          >
            <div className="absolute top-3 left-4 w-3 h-6 bg-white/60 rounded-full blur-[1px] rotate-20" />
          </div>
          <div className="w-0.5 h-16 bg-neutral-300 -mt-1" />
          <div className="text-2xl filter drop-shadow -mt-1">✊🏼</div>
        </div>

        {/* Balloon 3: bottom-right */}
        <div className="absolute -bottom-6 right-6 sm:right-16 flex flex-col items-center animate-bounce duration-1000 delay-150">
          <div 
            className="w-24 h-28 sm:w-32 sm:h-36 rounded-full shadow-2xl relative border border-pink-200/50"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #ffd1dc 0%, #f472b6 40%, #db2777 85%, #9d174d 100%)',
              boxShadow: 'inset -5px -5px 12px rgba(0,0,0,0.25), 0 15px 35px rgba(219, 39, 119, 0.4)'
            }}
          >
            <div className="absolute top-4 left-5 w-4 h-8 bg-white/60 rounded-full blur-[1px] rotate-20" />
          </div>
          <div className="w-0.5 h-20 bg-neutral-300 -mt-1" />
          <div className="text-3xl filter drop-shadow -mt-2">✊🏼</div>
        </div>
      </div>

      {/* Golden Confetti sparkles in the background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="w-full h-full bg-[radial-gradient(#f59e0b_2px,transparent_2px)] [background-size:24px_24px]" />
      </div>

      {/* Main Celebration Card matching Image 5 */}
      <div 
        className="relative z-20 w-full max-w-xl mx-auto rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-white/60 text-center transform scale-100 transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #fbb272 0%, #f69466 40%, #efa07f 70%, #f7a888 100%)',
          boxShadow: '0 25px 60px -15px rgba(246, 148, 102, 0.6), 0 0 0 1px rgba(255,255,255,0.4)',
        }}
      >
        {/* Floating confetti ribbons */}
        <div className="absolute top-4 left-8 text-2xl animate-spin duration-1000">✨</div>
        <div className="absolute bottom-6 left-12 text-2xl">🎉</div>
        <div className="absolute top-6 right-8 text-2xl">⭐</div>
        <div className="absolute bottom-6 right-12 text-2xl animate-bounce">🎈</div>

        <div className="space-y-4 py-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2a1b12] tracking-tight drop-shadow-xs">
            Du är grym {userName}
          </h2>

          <p className="text-xl sm:text-2xl font-bold text-[#3d2417] max-w-md mx-auto leading-relaxed">
            Du genomförde <span className="underline decoration-white/70 underline-offset-4">{list.titel}</span> {list.icon}
          </p>

          <p className="text-sm text-[#4e2f20] font-medium pt-1">
            Alla punkter är avbockade och listan sparas i gamla listor.
          </p>
        </div>

        {/* Action Buttons matching Image 5 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 sm:pt-8">
          {/* Stäng button (purple-blue pill) */}
          <button
            onClick={onConfirmClose}
            className="w-full sm:w-auto min-w-[130px] px-8 py-3 rounded-full bg-gradient-to-r from-[#9f85c7] to-[#8064ae] hover:from-[#8e72b7] hover:to-[#71549f] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer border border-white/30"
          >
            Stäng
          </button>

          {/* Ops! Nu blev det fel button (golden peach pill) */}
          <button
            onClick={onUndo}
            className="w-full sm:w-auto min-w-[180px] px-8 py-3 rounded-full bg-gradient-to-r from-[#fed28d] to-[#f9b867] hover:from-[#fbc577] hover:to-[#f3a84e] text-[#42220d] font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer border border-white/50"
          >
            Ops! Nu blev det fel
          </button>
        </div>
      </div>
    </div>
  );
};
