import React, { useState } from 'react';
import { Check, Copy, Share2, X } from 'lucide-react';
import { TodoList } from '../types/todo';

interface ShareModalProps {
  list: TodoList | { titel: string; items: string[] };
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ list, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Format list content as nice readable text
  const title = 'titel' in list ? list.titel : 'Min to-do lista';
  const icon = 'icon' in list ? list.icon : '📝';
  const rawItems = 'items' in list ? list.items : [];
  const itemStrings = rawItems.map((item) =>
    typeof item === 'string' ? item : item.text + (item.antal ? ` (${item.antal})` : '')
  );

  const formattedShareText = `${icon} ${title}
-----------------------------
${itemStrings.map((t) => `• ${t}`).join('\n')}

Skapad med Monikas To-Do ✨`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#eee7db]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ebd9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#fed7aa] text-[#7c2d12] flex items-center justify-center text-lg">
              <Share2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#23201d]">Dela listan</h2>
              <p className="text-xs text-[#78716c]">Dela med vänner, familj eller kollegor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <div className="text-xs font-semibold text-[#5e564d]">Förhandsvisning av text:</div>
          <div className="bg-[#fcfaf7] p-3.5 rounded-2xl border border-[#e8dfcf] text-xs font-mono text-[#38332e] whitespace-pre-line max-h-48 overflow-y-auto custom-scrollbar">
            {formattedShareText}
          </div>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-bold text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Kopierad till urklipp!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Kopiera text att skicka</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
