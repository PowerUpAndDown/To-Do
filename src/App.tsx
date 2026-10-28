/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SidebarArt, FloatingHeartSticker } from './components/SidebarArt';
import { Header } from './components/Header';
import { SuggestionCard } from './components/SuggestionCard';
import { StatusCard } from './components/StatusCard';
import { OngoingLists } from './components/OngoingLists';
import { CreateListForm } from './components/CreateListForm';
import { ViewListDetail } from './components/ViewListDetail';
import { CelebrationModal } from './components/CelebrationModal';
import { OldListsModal } from './components/OldListsModal';
import { SettingsModal } from './components/SettingsModal';
import { ShareModal } from './components/ShareModal';
import { CameraCaptureModal } from './components/CameraCaptureModal';

import { TodoList, Suggestion, AppSettings } from './types/todo';
import { INITIAL_LISTS, INITIAL_OLD_LISTS } from './data/initialData';

export default function App() {
  // Persistence in localStorage
  const [lists, setLists] = useState<TodoList[]>(() => {
    const saved = localStorage.getItem('monika_todo_lists');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_LISTS;
  });

  const [oldLists, setOldLists] = useState<TodoList[]>(() => {
    const saved = localStorage.getItem('monika_old_lists');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_OLD_LISTS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('monika_todo_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      userName: 'Monika',
      soundEnabled: true,
      confettiEnabled: true,
      themeAccent: '#a855f7',
    };
  });

  // Navigation and active state
  const [activeView, setActiveView] = useState<'dashboard' | 'create-manual' | 'create-ai' | 'inspect-list'>('dashboard');
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

  // Modals state
  const [showSettings, setShowSettings] = useState(false);
  const [showOldLists, setShowOldLists] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [shareData, setShareData] = useState<TodoList | { titel: string; items: string[] } | null>(null);

  // Celebration state (Image 5)
  const [celebratingList, setCelebratingList] = useState<TodoList | null>(null);

  // Status card collapsed state when creating or viewing
  const [statusCollapsed, setStatusCollapsed] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('monika_todo_lists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem('monika_old_lists', JSON.stringify(oldLists));
  }, [oldLists]);

  useEffect(() => {
    localStorage.setItem('monika_todo_settings', JSON.stringify(settings));
  }, [settings]);

  // Handler to open and inspect a list (Image 4)
  const handleOpenList = (list: TodoList) => {
    setActiveListId(list.id);
    setActiveView('inspect-list');
  };

  // Handler to create a new list
  const handleCreateList = (newListData: Omit<TodoList, 'id'>) => {
    const newList: TodoList = {
      ...newListData,
      id: `list-${Date.now()}`,
    };
    setLists((prev) => [newList, ...prev]);
    setActiveListId(newList.id);
    setActiveView('inspect-list');
    setSelectedSuggestion(null);
  };

  // Handler when applying a suggestion from the SuggestionCard
  const handleApplySuggestion = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setActiveView('create-manual');
  };

  // Complete a list (triggered by "Klar skrivlistan" in ViewListDetail)
  const handleCompleteList = (list: TodoList) => {
    setCelebratingList(list);
  };

  // Confirm celebration modal "Stäng"
  const handleConfirmCelebrationClose = () => {
    if (!celebratingList) return;
    const completedList: TodoList = {
      ...celebratingList,
      completed: true,
      completedAt: new Date().toLocaleDateString('sv-SE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      items: celebratingList.items.map((i) => ({ ...i, completed: true })),
    };

    setLists((prev) => prev.filter((l) => l.id !== celebratingList.id));
    setOldLists((prev) => [completedList, ...prev]);
    setCelebratingList(null);
    setActiveListId(null);
    setActiveView('dashboard');
  };

  // Undo celebration modal "Ops! Nu blev det fel"
  const handleUndoCelebration = () => {
    // Keep list active and opened
    setCelebratingList(null);
  };

  // Update list content
  const handleUpdateList = (updatedList: TodoList) => {
    setLists((prev) => prev.map((l) => (l.id === updatedList.id ? updatedList : l)));
  };

  // Restore old list
  const handleRestoreOldList = (listId: string) => {
    const listToRestore = oldLists.find((l) => l.id === listId);
    if (!listToRestore) return;

    const restored: TodoList = {
      ...listToRestore,
      completed: false,
      completedAt: undefined,
    };

    setOldLists((prev) => prev.filter((l) => l.id !== listId));
    setLists((prev) => [restored, ...prev]);
  };

  // Delete old list permanently
  const handleDeleteOldList = (listId: string) => {
    setOldLists((prev) => prev.filter((l) => l.id !== listId));
  };

  // Reset demo data to match screenshots
  const handleResetDemoData = () => {
    setLists(INITIAL_LISTS);
    setOldLists(INITIAL_OLD_LISTS);
    setSettings({
      userName: 'Monika',
      soundEnabled: true,
      confettiEnabled: true,
      themeAccent: '#a855f7',
    });
    setActiveView('dashboard');
    setActiveListId(null);
  };

  const activeList = lists.find((l) => l.id === activeListId);

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-row relative font-sans text-[#2d2926] selection:bg-purple-200">
      {/* Left Sunset Wallpaper Strip with pinned stickers */}
      <SidebarArt />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 max-w-7xl mx-auto min-w-0">
        {/* Header bar matching screenshots */}
        <Header
          userName={settings.userName}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenSettings={() => setShowSettings(true)}
          activeView={activeView}
          celebratingListName={celebratingList?.titel}
        />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 of 12 columns on desktop) */}
          <section className="lg:col-span-6 xl:col-span-6 space-y-6">
            {/* View 1: Dashboard Idle (Image 1) */}
            {activeView === 'dashboard' && (
              <>
                <SuggestionCard
                  onStartManual={() => {
                    setSelectedSuggestion(null);
                    setActiveView('create-manual');
                  }}
                  onStartAI={() => {
                    setSelectedSuggestion(null);
                    setActiveView('create-ai');
                  }}
                  onApplySuggestion={handleApplySuggestion}
                />
                <StatusCard
                  lists={lists}
                  onOpenList={handleOpenList}
                  collapsed={false}
                />
              </>
            )}

            {/* View 2: Manual Create (Image 2) */}
            {activeView === 'create-manual' && (
              <>
                <CreateListForm
                  isAIMode={false}
                  prefillSuggestion={selectedSuggestion}
                  onCancel={() => {
                    setSelectedSuggestion(null);
                    setActiveView('dashboard');
                  }}
                  onCreate={handleCreateList}
                  onSharePreview={(title, items) => setShareData({ titel: title, items })}
                />
                <StatusCard
                  lists={lists}
                  onOpenList={handleOpenList}
                  collapsed={statusCollapsed}
                  onToggleCollapse={() => setStatusCollapsed(!statusCollapsed)}
                />
              </>
            )}

            {/* View 3: AI Camera Create (Image 3) */}
            {activeView === 'create-ai' && (
              <>
                <CreateListForm
                  isAIMode={true}
                  prefillSuggestion={selectedSuggestion}
                  onCancel={() => {
                    setSelectedSuggestion(null);
                    setActiveView('dashboard');
                  }}
                  onCreate={handleCreateList}
                  onSharePreview={(title, items) => setShareData({ titel: title, items })}
                  onOpenLiveCamera={() => setShowCameraModal(true)}
                />
                <StatusCard
                  lists={lists}
                  onOpenList={handleOpenList}
                  collapsed={statusCollapsed}
                  onToggleCollapse={() => setStatusCollapsed(!statusCollapsed)}
                />
              </>
            )}

            {/* View 4: Inspect Active List (Image 4) */}
            {activeView === 'inspect-list' && activeList && (
              <ViewListDetail
                list={activeList}
                onClose={() => {
                  setActiveListId(null);
                  setActiveView('dashboard');
                }}
                onCompleteList={handleCompleteList}
                onUpdateList={handleUpdateList}
                onStartManual={() => {
                  setSelectedSuggestion(null);
                  setActiveView('create-manual');
                }}
                onStartAI={() => {
                  setSelectedSuggestion(null);
                  setActiveView('create-ai');
                }}
                onShare={(list) => setShareData(list)}
              />
            )}
          </section>

          {/* Right Column: Pågående listor & Gamla listor (Image 1, 2, 3, 4) */}
          <section className="lg:col-span-6 xl:col-span-6">
            <OngoingLists
              lists={lists}
              activeListId={activeView === 'inspect-list' ? activeListId || undefined : undefined}
              onOpenList={handleOpenList}
              onOpenOldLists={() => setShowOldLists(true)}
              searchQuery={searchQuery}
            />
          </section>
        </div>
      </main>

      {/* Floating Heart Sticker with tape in bottom right */}
      <FloatingHeartSticker />

      {/* Celebration Modal (Image 5) */}
      {celebratingList && (
        <CelebrationModal
          list={celebratingList}
          userName={settings.userName}
          onConfirmClose={handleConfirmCelebrationClose}
          onUndo={handleUndoCelebration}
          soundEnabled={settings.soundEnabled}
        />
      )}

      {/* Gamla listor Modal */}
      {showOldLists && (
        <OldListsModal
          lists={oldLists}
          onClose={() => setShowOldLists(false)}
          onRestoreList={handleRestoreOldList}
          onDeleteList={handleDeleteOldList}
        />
      )}

      {/* Inställningar Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={setSettings}
          onResetDemoData={handleResetDemoData}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Dela listan Modal */}
      {shareData && (
        <ShareModal
          list={shareData}
          onClose={() => setShareData(null)}
        />
      )}

      {/* Live Camera Modal */}
      {showCameraModal && (
        <CameraCaptureModal
          onCapture={(base64) => {
            setShowCameraModal(false);
            // Open AI create form with captured picture
            setActiveView('create-ai');
          }}
          onClose={() => setShowCameraModal(false)}
        />
      )}
    </div>
  );
}
