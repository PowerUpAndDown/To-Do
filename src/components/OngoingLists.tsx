import React from 'react';
import { TodoList } from '../types/todo';

interface OngoingListsProps {
  lists: TodoList[];
  activeListId?: string;
  onOpenList: (list: TodoList) => void;
  onOpenOldLists: () => void;
  searchQuery?: string;
}

export const OngoingLists: React.FC<OngoingListsProps> = ({
  lists,
  activeListId,
  onOpenList,
  onOpenOldLists,
  searchQuery = '',
}) => {
  // Filter by search query if provided
  const filteredLists = lists.filter((l) => {
    if (l.completed) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const inTitle = l.titel.toLowerCase().includes(q);
    const inDesc = l.beskrivning.toLowerCase().includes(q);
    const inItems = l.items.some((i) => i.text.toLowerCase().includes(q));
    return inTitle || inDesc || inItems;
  });

  // Color maps for "Visa" buttons matching the screenshots
  const getButtonStyles = (color: string, isOpened: boolean) => {
    if (isOpened) {
      return 'bg-[#7dd3fc] text-[#0369a1] hover:bg-[#38bdf8] font-semibold';
    }
    // Match colors from screenshot
    if (color.includes('purple') || color === '#a855f7') {
      return 'bg-[#b8a4dc] hover:bg-[#a68ed0] text-[#3b1764]';
    }
    if (color.includes('yellow') || color === '#eab308' || color === '#f59e0b') {
      return 'bg-[#f4cf65] hover:bg-[#ecc048] text-[#5c3e03]';
    }
    if (color.includes('rose') || color.includes('pink') || color === '#f43f5e' || color === '#ec4899') {
      return 'bg-[#f8a8b8] hover:bg-[#f493a6] text-[#6b1426]';
    }
    if (color.includes('green') || color === '#84cc16' || color === '#22c55e' || color === '#10b981') {
      return 'bg-[#b6dbba] hover:bg-[#a0cca5] text-[#1b4322]';
    }
    if (color.includes('blue') || color === '#38bdf8' || color === '#0ea5e9') {
      return 'bg-[#98cde3] hover:bg-[#83bed8] text-[#0f3c50]';
    }
    return 'bg-[#e2d5c3] hover:bg-[#d6c4ad] text-[#332219]';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-[#2b2724] tracking-tight">
        Pågående listor
      </h2>

      {/* List Cards Stack */}
      <div className="space-y-3.5">
        {filteredLists.length === 0 ? (
          <div className="bg-white/70 rounded-2xl p-6 text-center text-[#78716c] border border-dashed border-[#ddd5c7]">
            {searchQuery ? 'Inga listor matchade din sökning.' : 'Inga pågående listor just nu.'}
          </div>
        ) : (
          filteredLists.map((list) => {
            const isOpened = activeListId === list.id;
            const remainingCount = list.items.filter((i) => !i.completed).length;
            const totalCount = list.items.length;
            const countDisplay = totalCount > 0 ? `${remainingCount} st/to-do` : '0 st/to-do';

            // Estimated time summary
            const firstTime = list.items.find((i) => i.uppskattadTid)?.uppskattadTid;
            const timeDisplay = firstTime || (list.titel === 'Renovering' ? '48/h' : list.titel === 'Resa' ? '12/h' : list.titel === 'Julklappar' ? '8/h' : list.titel === 'Tacokväll' ? '48/h' : '1/h');

            return (
              <div
                key={list.id}
                className={`relative bg-white/95 backdrop-blur-xs rounded-2xl p-4 shadow-xs border transition-all duration-200 overflow-hidden ${
                  isOpened
                    ? 'border-sky-300 ring-2 ring-sky-200 shadow-md'
                    : 'border-[#eee7db] hover:shadow-md hover:border-[#dfd6c6]'
                }`}
              >
                {/* Vertical colored bar on left */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-2xl"
                  style={{ backgroundColor: list.färg }}
                />

                <div className="pl-3 grid grid-cols-12 items-center gap-2">
                  {/* Left Column: Icon + Title + Subtitle */}
                  <div className="col-span-5 min-w-0 pr-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl flex-shrink-0">{list.icon}</span>
                      <h3 className="font-bold text-base sm:text-lg text-[#1f1d1b] truncate">
                        {list.titel}
                      </h3>
                    </div>
                    <p className="text-xs text-[#78716c] mt-0.5 pl-7 truncate">
                      {list.beskrivning}
                    </p>
                  </div>

                  {/* Middle Column: Kvar att göra stats */}
                  <div className="col-span-4 border-l border-[#f0ebd9] pl-3 text-xs">
                    <div className="text-[#6c645b] font-medium">Kvar att göra:</div>
                    <div className="font-semibold text-[#292524] mt-0.5">
                      {countDisplay}
                    </div>
                    <div className="text-[#57534e] text-[11px] font-medium">
                      {timeDisplay}
                    </div>
                  </div>

                  {/* Right Column: Visa / Öppnad Button */}
                  <div className="col-span-3 flex justify-end">
                    <button
                      onClick={() => onOpenList(list)}
                      className={`px-5 py-1.5 rounded-full text-sm font-medium shadow-xs transition-all active:scale-95 cursor-pointer ${getButtonStyles(
                        list.färg,
                        isOpened
                      )}`}
                    >
                      {isOpened ? 'Öppnad' : 'Visa'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Gamla listor Card at bottom right */}
      <div className="pt-2">
        <div className="relative bg-white/95 backdrop-blur-xs rounded-2xl p-4 shadow-xs border border-[#eee7db] overflow-hidden flex items-center justify-between hover:shadow-md transition-shadow">
          {/* Vertical gradient bar (gold-to-pink) */}
          <div
            className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-2xl"
            style={{
              background: 'linear-gradient(180deg, #f59e0b 0%, #ec4899 100%)',
            }}
          />

          <div className="pl-3 flex items-center gap-2">
            <span className="text-lg font-bold text-[#23201d]">Gamla listor</span>
            <span className="text-[#e16834] text-xl font-bold">✔️</span>
          </div>

          <button
            onClick={onOpenOldLists}
            className="px-6 py-1.5 rounded-full bg-gradient-to-r from-[#f7c28e] to-[#f3a46f] hover:from-[#f4b37a] hover:to-[#ee9256] text-[#3e2416] font-medium text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Visa
          </button>
        </div>
      </div>
    </div>
  );
};
