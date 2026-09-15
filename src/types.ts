export type ScheduleCategory =
  | 'work'
  | 'study'
  | 'health'
  | 'personal'
  | 'routine'
  | 'meeting'
  | 'leisure';

export type Priority = 'high' | 'medium' | 'low';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ScheduleItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // "09:00"
  endTime?: string; // "10:30"
  isAllDay?: boolean;
  category: ScheduleCategory;
  priority: Priority;
  completed: boolean;
  notes?: string;
  checklist?: ChecklistItem[];
  color?: string;
}

export interface Habit {
  id: string;
  title: string;
  iconName: string;
  category: ScheduleCategory;
  streak: number;
  history: Record<string, boolean>; // date string YYYY-MM-DD -> completed
}

export type ViewMode = 'timeline' | 'list' | 'habits';

export type StatusFilter = 'all' | 'pending' | 'completed';

export interface CategoryMeta {
  id: ScheduleCategory;
  nameFa: string;
  color: string;
  bgLight: string;
  borderLight: string;
  badgeBg: string;
  badgeText: string;
}
