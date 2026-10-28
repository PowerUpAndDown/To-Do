export interface TodoItem {
  id: string;
  text: string;
  antal?: string;
  uppskattadTid?: string;
  completed?: boolean;
}

export interface TodoList {
  id: string;
  titel: string;
  beskrivning: string;
  icon: string;
  färg: string; // Hex color or color name
  datum?: string;
  tid?: string;
  butik?: string;
  plats?: string;
  items: TodoItem[];
  completed?: boolean;
  completedAt?: string;
  priorityRank?: number; // 1, 2, 3 for status table
}

export interface Suggestion {
  id: string;
  titel: string;
  undertitel: string;
  beskrivning: string;
  icon: string;
  färg: string;
  defaultItems: { text: string; antal?: string; uppskattadTid?: string }[];
}

export interface AppSettings {
  userName: string;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  themeAccent: string;
}
