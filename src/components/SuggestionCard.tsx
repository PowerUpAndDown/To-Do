import React, { useState } from 'react';
import { Camera, Plus } from 'lucide-react';
import { Suggestion } from '../types/todo';
import { SUGGESTIONS } from '../data/initialData';

interface SuggestionCardProps {
  onStartManual: () => void;
  onStartAI: () => void;
  onApplySuggestion: (suggestion: Suggestion) => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  onStartManual,
  onStartAI,
  onApplySuggestion,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentSuggestion = SUGGESTIONS[currentIdx] || SUGGESTIONS[0];

  const handleNextSuggestion = () => {
    setCurrentIdx((prev) => (prev + 1) % SUGGESTIONS.length);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-[#2b2724] tracking-tight">
        Skapa en ny lista?
      </h2>

      {/* Suggestion Card with green accent line on the left */}
      <div className="relative bg-white/90 backdrop-blur-xs rounded-2xl p-5 shadow-xs border border-[#eee8dd] overflow-hidden transition-all hover:shadow-md">
        {/* Left vertical neon green bar */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-b from-[#22c55e] to-[#16a34a] rounded-l-2xl" />

        <div className="pl-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#766e65]">
              {currentSuggestion.undertitel}
            </span>
            <button
              onClick={handleNextSuggestion}
              title="Visa ett annat förslag"
              className="text-[#22c55e] hover:text-[#16a34a] p-1 rounded-full hover:bg-emerald-50 transition-colors"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="pr-4">
            <h3 className="text-lg font-bold text-[#1f1d1b] leading-snug">
              {currentSuggestion.titel}
            </h3>
            <p className="text-sm text-[#5d564e] italic mt-1 font-serif">
              {currentSuggestion.beskrivning}
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => onApplySuggestion(currentSuggestion)}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-medium text-sm shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              Kör på
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          onClick={onStartAI}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f7ba8e] to-[#f29c69] hover:from-[#f4ab7a] hover:to-[#eb8a50] text-[#3d2417] font-semibold text-sm shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer border border-[#f5b387]"
        >
          <span>Skanna med kameran</span>
          <Camera className="w-4 h-4 text-[#3d2417]" />
        </button>

        <button
          onClick={onStartManual}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white font-semibold text-sm shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
        >
          <span>Skapa ny lista</span>
        </button>
      </div>
    </div>
  );
};
