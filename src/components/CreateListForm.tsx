import React, { useState, useRef } from 'react';
import { Camera, Plus, Share2, Trash2, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { TodoList, TodoItem, Suggestion } from '../types/todo';

interface CreateListFormProps {
  isAIMode?: boolean;
  prefillSuggestion?: Suggestion | null;
  onCancel: () => void;
  onCreate: (newList: Omit<TodoList, 'id'>) => void;
  onSharePreview?: (title: string, items: string[]) => void;
  onOpenLiveCamera?: () => void;
}

const AVAILABLE_COLORS = [
  '#4ade80', // green
  '#a855f7', // purple
  '#eab308', // yellow
  '#f43f5e', // rose/pink
  '#38bdf8', // sky blue
  '#f97316', // orange
  '#84cc16', // lime
  '#8b5cf6', // violet
];

const AVAILABLE_ICONS = ['💚', '🛁', '🇬🇷', '🎄', '🌮', '👩‍💻', '🛒', '✈️', '🎁', '🧹', '🚗', '📚', '🏋️', '🍳', '☕'];

export const CreateListForm: React.FC<CreateListFormProps> = ({
  isAIMode = false,
  prefillSuggestion,
  onCancel,
  onCreate,
  onSharePreview,
}) => {
  const [färg, setFärg] = useState<string>(prefillSuggestion?.färg || (isAIMode ? '#eab308' : '#4ade80'));
  const [icon, setIcon] = useState<string>(prefillSuggestion?.icon || (isAIMode ? '❤️' : '💚'));
  const [titel, setTitel] = useState<string>(prefillSuggestion?.titel.replace(/^Ska vi skapa en: |^Ska vi planera: |^Ska vi förbereda: /, '') || '');
  const [beskrivning, setBeskrivning] = useState<string>(prefillSuggestion?.beskrivning || '');
  const [datum, setDatum] = useState<string>('Idag?');
  const [tid, setTid] = useState<string>('');
  const [butik, setButik] = useState<string>('');
  const [plats, setPlats] = useState<string>('');

  const [items, setItems] = useState<Array<{ text: string; antal: string; uppskattadTid: string }>>(
    prefillSuggestion?.defaultItems.map((i) => ({
      text: i.text,
      antal: i.antal || '',
      uppskattadTid: i.uppskattadTid || '',
    })) || [
      { text: '', antal: '', uppskattadTid: '' },
      { text: '', antal: '', uppskattadTid: '' },
      { text: '', antal: '', uppskattadTid: '' },
      { text: '', antal: '', uppskattadTid: '' },
    ]
  );

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // AI image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddItemRow = () => {
    setItems((prev) => [...prev, { text: '', antal: '', uppskattadTid: '' }]);
  };

  const handleItemChange = (index: number, field: 'text' | 'antal' | 'uppskattadTid', value: string) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      setItems([{ text: '', antal: '', uppskattadTid: '' }]);
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setAiError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeWithAI = async () => {
    if (!imagePreview) {
      fileInputRef.current?.click();
      return;
    }

    setIsAnalyzing(true);
    setAiError(null);

    try {
      const response = await fetch('/api/parse-list-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: imagePreview.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Serverfel vid bildanalys');
      }

      const data = await response.json();

      if (data.titel) setTitel(data.titel);
      if (data.beskrivning) setBeskrivning(data.beskrivning);
      if (data.icon) setIcon(data.icon);
      if (data.färg) setFärg(data.färg);
      if (data.datum) setDatum(data.datum);
      if (data.tid) setTid(data.tid);
      if (data.butik) setButik(data.butik);
      if (data.plats) setPlats(data.plats);

      if (Array.isArray(data.items) && data.items.length > 0) {
        setItems(
          data.items.map((item: any) => ({
            text: item.text || '',
            antal: item.antal || '',
            uppskattadTid: item.uppskattadTid || '',
          }))
        );
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Kunde inte läsa listan. Försök med en tydligare bild.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titel.trim()) {
      alert('Vänligen ange en titel för listan');
      return;
    }

    const cleanedItems: TodoItem[] = items
      .filter((i) => i.text.trim())
      .map((i, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        text: i.text.trim(),
        antal: i.antal.trim(),
        uppskattadTid: i.uppskattadTid.trim(),
        completed: false,
      }));

    onCreate({
      titel: titel.trim(),
      beskrivning: beskrivning.trim() || 'Att göra',
      icon: icon || '📝',
      färg: färg || '#4ade80',
      datum: datum || 'Idag?',
      tid: tid || '',
      butik: butik || '',
      plats: plats || '',
      items: cleanedItems.length > 0 ? cleanedItems : [{ id: `item-${Date.now()}`, text: 'Ny punkt', completed: false }],
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-[#2b2724] tracking-tight">
        {isAIMode ? 'Nu skapar du en ny lista + Ai' : 'Nu skapar du en ny lista'}
      </h2>

      <div className="relative bg-white/95 backdrop-blur-xs rounded-2xl p-5 shadow-xs border border-[#eee7db] overflow-hidden">
        {/* Left vertical colored bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-2xl transition-colors duration-300"
          style={{ backgroundColor: färg }}
        />

        <form onSubmit={handleSubmit} className="pl-3 space-y-4">
          {/* Top Row: Färg, Icon, Titel, Plus icon */}
          <div className="flex items-center gap-3">
            {/* Color picker */}
            <div className="relative">
              <label className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Färg
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowIconPicker(false);
                }}
                className="w-8 h-8 rounded-full border border-black/10 shadow-xs cursor-pointer transition-transform hover:scale-110"
                style={{ backgroundColor: färg }}
                title="Välj färg"
              />
              {showColorPicker && (
                <div className="absolute top-12 left-0 z-30 bg-white p-2.5 rounded-xl shadow-lg border border-[#e8e2d5] flex gap-1.5 flex-wrap w-36">
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setFärg(c);
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded-full border border-black/10 hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Icon picker */}
            <div className="relative">
              <label className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Icon
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowIconPicker(!showIconPicker);
                  setShowColorPicker(false);
                }}
                className="w-8 h-8 rounded-full bg-[#f4efe8] border border-[#e3ded4] flex items-center justify-center text-lg hover:scale-105 transition-transform cursor-pointer"
                title="Välj ikon"
              >
                {icon}
              </button>
              {showIconPicker && (
                <div className="absolute top-12 left-0 z-30 bg-white p-2 rounded-xl shadow-lg border border-[#e8e2d5] grid grid-cols-4 gap-1 w-44">
                  {AVAILABLE_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => {
                        setIcon(ic);
                        setShowIconPicker(false);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-lg hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Titel input */}
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Titel
              </label>
              <input
                type="text"
                value={titel}
                onChange={(e) => setTitel(e.target.value)}
                placeholder="T.ex. Helghandling, Måla sovrummet..."
                className="w-full bg-[#f4efe8] rounded-full px-4 py-1.5 text-sm font-semibold text-[#292524] border border-[#e5dfd5] focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>

            {/* Plus icon on top right */}
            <div className="pt-5">
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-[#22c55e] hover:text-[#16a34a] p-1 rounded-full transition-colors cursor-pointer"
                title="Lägg till rad"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* AI Mode: Bifoga bild box (Image 3) */}
          {isAIMode && (
            <div className="bg-[#fcfaf7] border border-dashed border-[#e6decb] rounded-2xl p-4 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#2d2926]">Bifoga bild:</span>
                    <span className="text-xs text-[#22c55e] bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Gemini AI</span>
                  </div>
                  <p className="text-xs text-[#6e665d]">
                    Bifoga bild på din lista så kommer AI att läsa in listan åt dig.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4ede4] hover:bg-[#eae1d5] text-[#3d2417] text-xs font-semibold border border-[#ded5c5] transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#f97316]" />
                    <span>Välj bild</span>
                  </button>
                </div>
              </div>

              {/* Image Preview Box */}
              {imagePreview && (
                <div className="mt-3 flex items-center gap-3 bg-white p-2 rounded-xl border border-[#ece4d6]">
                  <img
                    src={imagePreview}
                    alt="Förhandsvisning av lista"
                    className="w-16 h-16 object-cover rounded-lg border border-black/5"
                  />
                  <div className="flex-1 text-xs">
                    <div className="font-semibold text-[#292524]">Bild vald</div>
                    <div className="text-[#78716c]">Klicka på knappen för att läsa av</div>
                  </div>
                  <button
                    type="button"
                    disabled={isAnalyzing}
                    onClick={handleAnalyzeWithAI}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-semibold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Läser in...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                        <span>Läs in med AI ✨</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {aiError && (
                <p className="text-xs text-rose-600 mt-2 bg-rose-50 p-2 rounded-lg border border-rose-100">
                  {aiError}
                </p>
              )}
            </div>
          )}

          {/* Beskrivning Row */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5e564d] mb-1">
              Beskrivning
            </label>
            <input
              type="text"
              value={beskrivning}
              onChange={(e) => setBeskrivning(e.target.value)}
              placeholder="T.ex. Badrum, Inköpslista, Projekt..."
              className="w-full bg-[#f4efe8] rounded-full px-4 py-1.5 text-sm text-[#292524] border border-[#e5dfd5] focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Row: Datum, Tid, Butik, Plats */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Datum
              </label>
              <input
                type="text"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                placeholder="Idag?"
                className="w-full bg-[#f4efe8] rounded-full px-3 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] focus:outline-none text-center"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Tid
              </label>
              <input
                type="text"
                value={tid}
                onChange={(e) => setTid(e.target.value)}
                placeholder=":"
                className="w-full bg-[#f4efe8] rounded-full px-3 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] focus:outline-none text-center"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Butik
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={butik}
                  onChange={(e) => setButik(e.target.value)}
                  placeholder="Butik..."
                  className="w-full bg-[#f4efe8] rounded-full px-3 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] focus:outline-none pr-6"
                />
                <span className="absolute right-2 top-2 text-[#78716c] pointer-events-none text-xs">
                  ↓
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5e564d] mb-1">
                Plats
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={plats}
                  onChange={(e) => setPlats(e.target.value)}
                  placeholder="Plats..."
                  className="w-full bg-[#f4efe8] rounded-full px-3 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Item Sub-Table */}
          <div>
            <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-[#5e564d] mb-1.5 px-1">
              <span className="col-span-6">Lista</span>
              <span className="col-span-3 text-center">Antal</span>
              <span className="col-span-3 text-right pr-2">Uppskattattid</span>
            </div>

            {/* Scrollable container with orange scrollbar styling matching screenshot */}
            <div className="max-h-52 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center group">
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => handleItemChange(idx, 'text', e.target.value)}
                      placeholder={`Att göra #${idx + 1}...`}
                      className="w-full bg-[#f4efe8] rounded-full px-3 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="text"
                      value={item.antal}
                      onChange={(e) => handleItemChange(idx, 'antal', e.target.value)}
                      placeholder="T.ex. 2 st"
                      className="w-full bg-[#f4efe8] rounded-full px-2 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] focus:outline-none text-center"
                    />
                  </div>

                  <div className="col-span-3 flex items-center gap-1">
                    <input
                      type="text"
                      value={item.uppskattadTid}
                      onChange={(e) => handleItemChange(idx, 'uppskattadTid', e.target.value)}
                      placeholder="1/h"
                      className="w-full bg-[#f4efe8] rounded-full px-2 py-1.5 text-xs text-[#292524] border border-[#e5dfd5] focus:outline-none text-center"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-rose-500 transition-opacity p-0.5 cursor-pointer"
                        title="Ta bort rad"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Addera fler listor button */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleAddItemRow}
                className="flex items-center gap-1 text-xs font-semibold text-[#4a423a] hover:text-black py-1 px-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <span>Addera fler listor</span>
                <Plus className="w-4 h-4 text-[#22c55e]" />
              </button>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[#f0ebd9]">
            {/* Dela listan button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onSharePreview) {
                    onSharePreview(
                      titel || 'Ny lista',
                      items.map((i) => i.text).filter(Boolean)
                    );
                  }
                }}
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
                onClick={onCancel}
                className="px-6 py-2 rounded-full bg-[#f47285] hover:bg-[#e15368] active:scale-95 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
              >
                Avbryt
              </button>

              {/* Skapa listan button */}
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[#22c55e] hover:bg-[#16a34a] active:scale-95 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
              >
                Skapa listan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
