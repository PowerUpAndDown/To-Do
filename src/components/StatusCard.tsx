import React from 'react';
import { TodoList } from '../types/todo';

interface StatusCardProps {
  lists: TodoList[];
  onOpenList: (list: TodoList) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  lists,
  onOpenList,
  collapsed = false,
  onToggleCollapse,
}) => {
  // Sort or pick priority lists
  const priorityLists = [...lists]
    .filter((l) => !l.completed)
    .sort((a, b) => (a.priorityRank || 99) - (b.priorityRank || 99))
    .slice(0, 3);

  // If collapsed (as seen in Image 2)
  if (collapsed) {
    return (
      <div className="relative bg-white/90 backdrop-blur-xs rounded-2xl p-4 shadow-xs border border-[#eee8dd] overflow-hidden flex items-center justify-between">
        {/* Left vertical gradient accent */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-b from-[#a855f7] to-[#38bdf8] rounded-l-2xl" />

        <div className="pl-3 flex items-center gap-3">
          <span className="text-base font-bold text-[#2b2724]">Status</span>
          {/* Triskele icon */}
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-purple-50 text-purple-600">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
              <circle cx="12" cy="7" r="3" stroke="#a855f7" />
              <circle cx="7" cy="16" r="3" stroke="#38bdf8" />
              <circle cx="17" cy="16" r="3" stroke="#ec4899" />
              <path d="M10 9L8 14M14 9L16 14M9 16h6" stroke="#94a3b8" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <button
          onClick={onToggleCollapse}
          className="px-6 py-1.5 rounded-full bg-gradient-to-r from-[#b39ddb] to-[#9575cd] hover:from-[#a084cf] hover:to-[#8561be] text-white font-medium text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Visa
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#2b2724] tracking-tight">
          Status
        </h2>
      </div>

      <div className="relative bg-white/90 backdrop-blur-xs rounded-2xl p-5 shadow-xs border border-[#eee8dd] overflow-hidden">
        {/* Left vertical purple/blue gradient bar */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-b from-[#a855f7] to-[#38bdf8] rounded-l-2xl" />

        <div className="pl-3">
          {/* Header row with table titles and triskele icon */}
          <div className="flex items-center justify-between border-b border-[#f0ebd9] pb-2 mb-3">
            <div className="grid grid-cols-12 w-full pr-8 text-xs font-semibold text-[#3d3834]">
              <span className="col-span-5">Högprio</span>
              <span className="col-span-4 text-center">Antal To-do</span>
              <span className="col-span-3 text-right">Uppskattat tid</span>
            </div>

            {/* Triskele icon top right */}
            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center" title="Prioritetsöversikt">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none">
                <circle cx="12" cy="6" r="3" stroke="#a855f7" strokeWidth="2" />
                <circle cx="6" cy="17" r="3" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="18" cy="17" r="3" stroke="#ec4899" strokeWidth="2" />
                <path d="M10.5 8.5L7.5 14.5M13.5 8.5L16.5 14.5M8.5 17h7" stroke="#b0b5be" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-3">
            {priorityLists.map((list, idx) => {
              const remainingCount = list.items.filter((i) => !i.completed).length;
              // Calculate total or summary time
              const timeEstimate = list.items.find((i) => i.uppskattadTid)?.uppskattadTid || (idx === 0 ? '48/h' : idx === 1 ? '12/h' : '8/h');
              const countDisplay = idx === 0 ? '32 st' : idx === 1 ? '14 st' : '8st';

              const rankColors = [
                'bg-[#a855f7] text-white',
                'bg-[#eab308] text-white',
                'bg-[#f43f5e] text-white',
              ];

              return (
                <div
                  key={list.id}
                  onClick={() => onOpenList(list)}
                  className="grid grid-cols-12 items-center py-1.5 px-1 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors group"
                >
                  {/* Left Column: Number badge + Title + Subtitle */}
                  <div className="col-span-5 flex items-center gap-2 min-w-0 pr-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${rankColors[idx % rankColors.length]}`}>
                      {idx + 1}.
                    </span>
                    <div className="min-w-0 truncate">
                      <div className="font-bold text-sm text-[#231f1c] flex items-center gap-1.5 truncate group-hover:text-purple-700 transition-colors">
                        <span>{list.titel}</span>
                        <span>{list.icon}</span>
                      </div>
                      <div className="text-[11px] text-[#78716c] truncate">
                        {list.beskrivning}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Antal to-do */}
                  <div className="col-span-4 text-center font-bold text-sm text-[#2b2724]">
                    {remainingCount > 0 ? `${remainingCount} st` : countDisplay}
                  </div>

                  {/* Right Column: Uppskattad tid */}
                  <div className="col-span-3 text-right font-bold text-sm text-[#2b2724] pr-2">
                    {timeEstimate}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
