import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, User, RefreshCw, X } from 'lucide-react';
import { AppSettings } from '../types/todo';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onResetDemoData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onResetDemoData,
  onClose,
}) => {
  const [userName, setUserName] = useState(settings.userName);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [confettiEnabled, setConfettiEnabled] = useState(settings.confettiEnabled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      userName: userName.trim() || 'Monika',
      soundEnabled,
      confettiEnabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#eee7db]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ebd9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#f8beaa] text-[#3e2723] flex items-center justify-center text-lg font-bold">
              ⚙️
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#23201d]">Inställningar</h2>
              <p className="text-xs text-[#78716c]">Anpassa din to-do upplevelse</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-5 space-y-4">
          {/* User Name input */}
          <div>
            <label className="block text-xs font-semibold text-[#5e564d] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-600" />
              <span>Ditt namn (visas i hälsningen)</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Monika"
              className="w-full bg-[#f4efe8] rounded-full px-4 py-2 text-sm font-semibold text-[#292524] border border-[#e5dfd5] focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <span className="text-[11px] text-[#8c827a] block mt-1 pl-2">
              T.ex. &quot;Hej {userName || 'Monika'} 💜&quot;
            </span>
          </div>

          {/* Sound toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fcfaf7] border border-[#eee7db]">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-neutral-400" />
              )}
              <div>
                <div className="text-xs font-semibold text-[#292524]">Ljudeffekter</div>
                <div className="text-[11px] text-[#78716c]">Glatt ackord vid slutförd lista</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>

          {/* Confetti toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fcfaf7] border border-[#eee7db]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-xs font-semibold text-[#292524]">Konfettiregn</div>
                <div className="text-[11px] text-[#78716c]">Fira med konfetti och ballonger</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={confettiEnabled}
                onChange={(e) => setConfettiEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          {/* Reset Demo Data button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (confirm('Vill du återställa till startläget med bildernas exempel-listor?')) {
                  onResetDemoData();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-dashed border-[#dcd4c6] hover:bg-[#faf6ee] text-[#78716c] hover:text-[#2d2926] text-xs font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Återställ exempel-listor (från bilderna)</span>
            </button>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-[#f0ebd9] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-semibold text-[#78716c] hover:bg-neutral-100 transition-colors"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full text-xs font-semibold bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-xs transition-colors cursor-pointer"
            >
              Spara
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
