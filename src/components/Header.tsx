import React from 'react';
import { Search, Settings as SettingsIcon } from 'lucide-react';

interface HeaderProps {
  userName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSettings: () => void;
  activeView: 'dashboard' | 'create-manual' | 'create-ai' | 'inspect-list';
  celebratingListName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  activeView,
  celebratingListName,
}) => {
  // Determine greeting based on current view/state matching the screenshots
  let greeting = `Hej ${userName} 💜`;
  if (celebratingListName) {
    greeting = `Du är grym ${userName}! 💜`;
  } else if (activeView === 'inspect-list') {
    greeting = `Heja dig ${userName}! 💜`;
  }

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 pt-2">
      {/* Dynamic Greeting */}
      <div className="flex items-center space-x-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#23201d] font-sans flex items-center gap-2">
          {greeting}
        </h1>
      </div>

      {/* Search and Settings */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Search Bar matching image */}
        <div className="relative flex items-center flex-1 sm:w-72 md:w-80 bg-white rounded-full border border-[#e8e2d8] shadow-xs px-3 py-1.5 focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-emerald-400 transition-all">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Sök"
            className="w-full bg-transparent text-sm text-[#2d2926] placeholder-[#948b81] focus:outline-none pl-1 pr-2"
          />
          <button 
            type="button"
            className="w-7 h-7 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center transition-colors shadow-xs flex-shrink-0 cursor-pointer"
            title="Sök i dina listor"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Inställningar Button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f8beaa] hover:bg-[#f7ae97] active:scale-95 text-[#3e2723] font-medium text-sm transition-all shadow-xs border border-[#ebaf99] cursor-pointer flex-shrink-0"
        >
          <span>Inställningar</span>
          <SettingsIcon className="w-4 h-4 stroke-[2.2] text-[#4a2e22]" />
        </button>
      </div>
    </header>
  );
};
