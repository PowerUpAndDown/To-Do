import React from 'react';
import { CheckCircle2, RotateCcw, Trash2, X } from 'lucide-react';
import { TodoList } from '../types/todo';

interface OldListsModalProps {
  lists: TodoList[];
  onClose: () => void;
  onRestoreList: (listId: string) => void;
  onDeleteList: (listId: string) => void;
}

export const OldListsModal: React.FC<OldListsModalProps> = ({
  lists,
  onClose,
  onRestoreList,
  onDeleteList,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#eee7db] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ebd9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-xs">
              ✔️
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#23201d]">Gamla listor</h2>
              <p className="text-xs text-[#78716c]">
                Tidigare avklarade to-do listor och genomförda projekt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of completed lists */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar">
          {lists.length === 0 ? (
            <div className="py-12 text-center text-[#8c827a] space-y-2">
              <div className="text-4xl">🌱</div>
              <p className="font-medium text-sm">Inga gamla listor än.</p>
              <p className="text-xs text-neutral-400">När du klarskriver en lista sparas den här!</p>
            </div>
          ) : (
            lists.map((list) => {
              const completedCount = list.items.length;
              return (
                <div
                  key={list.id}
                  className="relative bg-[#fcfaf7] border border-[#e8dfcf] rounded-2xl p-4 transition-all hover:shadow-xs"
                >
                  {/* Left accent */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl"
                    style={{ backgroundColor: list.färg }}
                  />

                  <div className="pl-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{list.icon}</span>
                        <h3 className="font-bold text-base text-[#1f1d1b]">
                          {list.titel}
                        </h3>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Genomförd
                        </span>
                      </div>
                      <p className="text-xs text-[#78716c] mt-0.5">
                        {list.beskrivning} • {completedCount} punkter • {list.completedAt || 'Nyligen'}
                      </p>

                      {/* Items preview */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {list.items.slice(0, 4).map((i) => (
                          <span
                            key={i.id}
                            className="text-[11px] bg-white border border-[#ece3d4] px-2 py-0.5 rounded-full text-[#5e564d]"
                          >
                            ✓ {i.text}
                          </span>
                        ))}
                        {list.items.length > 4 && (
                          <span className="text-[11px] text-[#8c827a] self-center">
                            +{list.items.length - 4} till
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onRestoreList(list.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        title="Återaktivera listan"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Återaktivera</span>
                      </button>

                      <button
                        onClick={() => onDeleteList(list.id)}
                        className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-neutral-400 hover:text-rose-600 border border-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
                        title="Ta bort för alltid"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#f0ebd9] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#f4ece1] hover:bg-[#ebdcc9] text-[#332219] font-medium text-xs transition-colors cursor-pointer"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
};
