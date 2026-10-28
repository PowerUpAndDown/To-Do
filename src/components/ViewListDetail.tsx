import React, { useState } from 'react';
import { Camera, Check, Plus, Share2, Trash2 } from 'lucide-react';
import { TodoList, TodoItem } from '../types/todo';

interface ViewListDetailProps {
  list: TodoList;
  onClose: () => void;
  onCompleteList: (list: TodoList) => void;
  onUpdateList: (updatedList: TodoList) => void;
  onStartManual: () => void;
  onStartAI: () => void;
  onShare: (list: TodoList) => void;
}

export const ViewListDetail: React.FC<ViewListDetailProps> = ({
  list,
  onClose,
  onCompleteList,
  onUpdateList,
  onStartManual,
  onStartAI,
  onShare,
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [newItemAntal, setNewItemAntal] = useState('');
  const [newItemTid, setNewItemTid] = useState('');
  const [showAddRow, setShowAddRow] = useState(false);

  // Toggle single item completion
  const handleToggleItem = (itemId: string) => {
    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateList({ ...list, items: updatedItems });
  };

  // Add new item to this list
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: TodoItem = {
      id: `item-${Date.now()}`,
      text: newItemText.trim(),
      antal: newItemAntal.trim(),
      uppskattadTid: newItemTid.trim(),
      completed: false,
    };

    onUpdateList({
      ...list,
      items: [...list.items, newItem],
    });

    setNewItemText('');
    setNewItemAntal('');
    setNewItemTid('');
    setShowAddRow(false);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = list.items.filter((item) => item.id !== itemId);
    onUpdateList({ ...list, items: updatedItems });
  };

  const completedCount = list.items.filter((i) => i.completed).length;
  const totalCount = list.items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#2b2724] tracking-tight">
          Översyn av pågående listor
        </h2>
        {totalCount > 0 && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-[#475569] border border-slate-200">
            {completedCount} av {totalCount} klara ({progressPercent}%)
          </span>
        )}
      </div>

      {/* Main Active List Card matching Image 4 */}
      <div className="relative bg-white/95 backdrop-blur-xs rounded-2xl p-5 shadow-xs border border-[#eee7db] overflow-hidden">
        {/* Left vertical colored bar matching list's color */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-2xl"
          style={{ backgroundColor: list.färg }}
        />

        <div className="pl-3 space-y-4">
          {/* Top Row: Färg, Icon, Titel, Plus */}
          <div className="flex items-center gap-3">
            <div>
              <span className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Färg
              </span>
              <div
                className="w-8 h-8 rounded-full border border-black/10 shadow-xs"
                style={{ backgroundColor: list.färg }}
              />
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Icon
              </span>
              <div className="w-8 h-8 rounded-full bg-[#f4efe8] border border-[#e3ded4] flex items-center justify-center text-lg">
                {list.icon}
              </div>
            </div>

            <div className="flex-1">
              <span className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Titel
              </span>
              <div className="bg-[#f4efe8] rounded-full px-4 py-1.5 text-sm font-bold text-[#1f1d1b] border border-[#e5dfd5] truncate">
                {list.titel}
              </div>
            </div>

            <div className="pt-5">
              <button
                onClick={() => setShowAddRow(true)}
                className="text-[#22c55e] hover:text-[#16a34a] p-1 rounded-full transition-colors cursor-pointer"
                title="Lägg till to-do"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Beskrivning Row */}
          <div>
            <span className="block text-[11px] font-semibold text-[#5e564d] mb-1">
              Beskrivning
            </span>
            <div className="bg-[#f4efe8] rounded-full px-4 py-1.5 text-sm text-[#443d37] border border-[#e5dfd5]">
              {list.beskrivning || '—'}
            </div>
          </div>

          {/* Row: Datum, Tid, Butik, Plats */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <span className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Datum
              </span>
              <div className="bg-[#f4efe8] rounded-full px-2 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] text-center truncate">
                {list.datum || 'Idag?'}
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Tid
              </span>
              <div className="bg-[#f4efe8] rounded-full px-2 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] text-center truncate">
                {list.tid || ':'}
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Butik
              </span>
              <div className="bg-[#f4efe8] rounded-full px-2 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] text-center truncate relative">
                <span>{list.butik || '—'}</span>
                <span className="absolute right-2 top-1 text-[#78716c] text-[10px]">↓</span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Plats
              </span>
              <div className="bg-[#f4efe8] rounded-full px-2 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] text-center truncate">
                {list.plats || '+'}
              </div>
            </div>
          </div>

          {/* To-Do Items Table with interactive checkboxes */}
          <div>
            <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-[#5e564d] mb-1.5 px-1">
              <span className="col-span-6">Lista</span>
              <span className="col-span-3 text-center">Antal</span>
              <span className="col-span-3 text-right pr-2">Uppskattattid</span>
            </div>

            <div className="max-h-56 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {list.items.map((item) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 gap-2 items-center group p-1 rounded-xl transition-all ${
                    item.completed ? 'opacity-60 bg-emerald-50/40' : 'hover:bg-neutral-50/60'
                  }`}
                >
                  {/* Task description with check button */}
                  <div className="col-span-6 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleItem(item.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                        item.completed
                          ? 'bg-[#22c55e] text-white shadow-xs'
                          : 'border border-[#cbbeaa] bg-white hover:border-[#22c55e]'
                      }`}
                      title={item.completed ? 'Markera som oavslutad' : 'Markera som klar'}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div
                      onClick={() => handleToggleItem(item.id)}
                      className={`bg-[#f4efe8] rounded-full px-3 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] flex-1 truncate cursor-pointer select-none ${
                        item.completed ? 'line-through text-[#8c827a]' : 'font-medium'
                      }`}
                    >
                      {item.text}
                    </div>
                  </div>

                  {/* Antal */}
                  <div className="col-span-3">
                    <div className="bg-[#f4efe8] rounded-full px-2 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] text-center truncate">
                      {item.antal || '—'}
                    </div>
                  </div>

                  {/* Uppskattad tid + Delete on hover */}
                  <div className="col-span-3 flex items-center gap-1">
                    <div className="bg-[#f4efe8] rounded-full px-2 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] text-center flex-1 truncate">
                      {item.uppskattadTid || '—'}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-rose-500 transition-opacity p-0.5 cursor-pointer"
                      title="Ta bort punkt"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Inline add row form */}
            {showAddRow && (
              <form onSubmit={handleAddItem} className="mt-3 p-3 bg-[#fcfaf7] border border-[#e8e0d1] rounded-2xl space-y-2">
                <div className="text-xs font-semibold text-[#4a423a]">Lägg till ny punkt:</div>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="Vad ska göras?"
                    className="col-span-6 bg-white rounded-full px-3 py-1 text-xs border border-[#ddd3c1] focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={newItemAntal}
                    onChange={(e) => setNewItemAntal(e.target.value)}
                    placeholder="Antal"
                    className="col-span-3 bg-white rounded-full px-2 py-1 text-xs border border-[#ddd3c1] focus:outline-none text-center"
                  />
                  <input
                    type="text"
                    value={newItemTid}
                    onChange={(e) => setNewItemTid(e.target.value)}
                    placeholder="Tid (1/h)"
                    className="col-span-3 bg-white rounded-full px-2 py-1 text-xs border border-[#ddd3c1] focus:outline-none text-center"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddRow(false)}
                    className="px-3 py-1 rounded-full text-xs text-[#78716c] hover:bg-neutral-200/50"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded-full text-xs font-semibold bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-xs"
                  >
                    Lägg till
                  </button>
                </div>
              </form>
            )}

            {/* Addera fler listor button */}
            {!showAddRow && (
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRow(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#4a423a] hover:text-black py-1 px-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <span>Addera fler listor</span>
                  <Plus className="w-4 h-4 text-[#22c55e]" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[#f0ebd9]">
            {/* Dela listan button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onShare(list)}
                className="w-8 h-8 rounded-full bg-[#fed7aa] hover:bg-[#fdba74] text-[#7c2d12] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                title="Dela listan"
              >
                <Share2 className="w-4 h-4 stroke-[2.2]" />
              </button>
              <span className="text-[11px] font-medium text-[#78716c]">Dela listan</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Avbryt button */}
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-full bg-[#f47285] hover:bg-[#e15368] active:scale-95 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
              >
                Avbryt
              </button>

              {/* Klar skrivlistan button -> triggers celebration modal! */}
              <button
                type="button"
                onClick={() => onCompleteList(list)}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] active:scale-95 text-white font-semibold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
              >
                Klar skrivlistan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick compact bottom bar: "Skapa en ny lista? [AI 📷] [Skapa]" matching Image 4 */}
      <div className="relative bg-white/95 backdrop-blur-xs rounded-2xl p-3.5 shadow-xs border border-[#eee7db] overflow-hidden flex items-center justify-between">
        <div
          className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-2xl"
          style={{
            background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
          }}
        />

        <div className="pl-3">
          <span className="text-base font-bold text-[#23201d]">
            Skapa en ny lista?
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStartAI}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fce7d8] hover:bg-[#fad8c3] text-[#7c2d12] font-semibold text-xs transition-colors cursor-pointer border border-[#f5c7ad]"
          >
            <span>AI</span>
            <Camera className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onStartManual}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#86efac] to-[#4ade80] hover:from-[#4ade80] hover:to-[#22c55e] text-[#14532d] font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            Skapa
          </button>
        </div>
      </div>
    </div>
  );
};
