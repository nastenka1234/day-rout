import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Habit, ScheduleItem, ViewMode } from './types';
import {
  formatDateToISO,
  isDateToday,
  toPersianDigits,
} from './utils/persianDate';
import {
  loadStoredHabits,
  loadStoredItems,
  saveStoredHabits,
  saveStoredItems,
} from './utils/storage';
import { Header } from './components/Header';
import { DayStrip } from './components/DayStrip';
import { DailyStats } from './components/DailyStats';
import { TimelineView } from './components/TimelineView';
import { TaskListView } from './components/TaskListView';
import { HabitsView } from './components/HabitsView';
import { AddEditItemModal } from './components/AddEditItemModal';
import { FocusTimerModal } from './components/FocusTimerModal';
import { AgendaExportModal } from './components/AgendaExportModal';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [items, setItems] = useState<ScheduleItem[]>(() => loadStoredItems());
  const [habits, setHabits] = useState<Habit[]>(() => loadStoredHabits());
  const [activeView, setActiveView] = useState<ViewMode>('timeline');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [initialStartTimeForAdd, setInitialStartTimeForAdd] = useState<string | undefined>();
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [timerTaskTitle, setTimerTaskTitle] = useState<string | undefined>();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Persist items
  useEffect(() => {
    saveStoredItems(items);
  }, [items]);

  // Persist habits
  useEffect(() => {
    saveStoredHabits(habits);
  }, [habits]);

  const selectedDateIso = formatDateToISO(selectedDate);
  const currentDayItems = items.filter((item) => item.date === selectedDateIso);

  // Toggle item completed
  const handleToggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextCompleted = !item.completed;
          return {
            ...item,
            completed: nextCompleted,
            checklist: item.checklist
              ? item.checklist.map((c) => ({
                  ...c,
                  done: nextCompleted ? true : c.done,
                }))
              : undefined,
          };
        }
        return item;
      })
    );
  };

  // Toggle subtask checklist item
  const handleToggleChecklist = (itemId: string, checkId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId && item.checklist) {
          const updatedChecklist = item.checklist.map((c) =>
            c.id === checkId ? { ...c, done: !c.done } : c
          );
          const allDone = updatedChecklist.every((c) => c.done);
          return {
            ...item,
            checklist: updatedChecklist,
            completed: allDone ? true : item.completed,
          };
        }
        return item;
      })
    );
  };

  // Save new or edited item
  const handleSaveItem = (itemData: Partial<ScheduleItem> & { id?: string }) => {
    if (itemData.id) {
      // Edit existing
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemData.id ? ({ ...item, ...itemData } as ScheduleItem) : item
        )
      );
    } else {
      // Add new
      const newItem: ScheduleItem = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: itemData.title || 'برنامه جدید',
        date: itemData.date || selectedDateIso,
        startTime: itemData.startTime,
        endTime: itemData.endTime,
        isAllDay: itemData.isAllDay ?? !itemData.startTime,
        category: itemData.category || 'work',
        priority: itemData.priority || 'medium',
        completed: false,
        notes: itemData.notes,
        checklist: itemData.checklist,
      };
      setItems((prev) => [...prev, newItem]);
    }
    setEditingItem(null);
    setInitialStartTimeForAdd(undefined);
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Trigger add at specific hour
  const handleAddAtHour = (hourStr: string) => {
    setInitialStartTimeForAdd(hourStr);
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const handleEditItem = (item: ScheduleItem) => {
    setEditingItem(item);
    setInitialStartTimeForAdd(undefined);
    setIsAddModalOpen(true);
  };

  // Toggle habit for date
  const handleToggleHabit = (habitId: string, dateIso: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const currentStatus = h.history?.[dateIso] || false;
          const nextStatus = !currentStatus;
          const newHistory = { ...h.history, [dateIso]: nextStatus };
          const newStreak = nextStatus ? h.streak + 1 : Math.max(0, h.streak - 1);
          return {
            ...h,
            history: newHistory,
            streak: newStreak,
          };
        }
        return h;
      })
    );
  };

  // Add new habit
  const handleAddHabit = (newHabitData: Omit<Habit, 'id' | 'streak' | 'history'>) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      ...newHabitData,
      streak: 0,
      history: {},
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  // Open timer for specific task
  const handleStartTimerForTask = (taskTitle: string) => {
    setTimerTaskTitle(taskTitle);
    setIsTimerModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Header */}
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onOpenAddModal={() => {
          setEditingItem(null);
          setInitialStartTimeForAdd(undefined);
          setIsAddModalOpen(true);
        }}
        onOpenTimerModal={() => {
          setTimerTaskTitle(undefined);
          setIsTimerModalOpen(true);
        }}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Persian 7-Day Navigation Strip */}
      <DayStrip
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        items={items}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Daily Stats Bar */}
        <DailyStats items={currentDayItems} />

        {/* View Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-1.5 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-1">
            <button
              id="tab-timeline-view"
              onClick={() => setActiveView('timeline')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeView === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>جدول زمانی روزانه (گاه‌شمار)</span>
            </button>

            <button
              id="tab-list-view"
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeView === 'list'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>فهرست کارها ({toPersianDigits(currentDayItems.length)})</span>
            </button>

            <button
              id="tab-habits-view"
              onClick={() => setActiveView('habits')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeView === 'habits'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>روتین‌ها و عادت‌ها</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 px-3">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>مدیریت هوشمند و منظم فعالیت‌های روز</span>
          </div>
        </div>

        {/* View Switch Content */}
        {activeView === 'timeline' && (
          <TimelineView
            selectedDate={selectedDate}
            items={currentDayItems}
            onToggleComplete={handleToggleComplete}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onAddAtHour={handleAddAtHour}
            onStartTimerForTask={handleStartTimerForTask}
          />
        )}

        {activeView === 'list' && (
          <TaskListView
            selectedDate={selectedDate}
            items={currentDayItems}
            onToggleComplete={handleToggleComplete}
            onToggleChecklist={handleToggleChecklist}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onOpenAddModal={() => {
              setEditingItem(null);
              setInitialStartTimeForAdd(undefined);
              setIsAddModalOpen(true);
            }}
          />
        )}

        {activeView === 'habits' && (
          <HabitsView
            selectedDate={selectedDate}
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        )}
      </main>

      {/* Floating Action Button for quick add on mobile */}
      <div className="fixed bottom-6 left-6 md:hidden z-20">
        <button
          onClick={() => {
            setEditingItem(null);
            setInitialStartTimeForAdd(undefined);
            setIsAddModalOpen(true);
          }}
          className="w-13 h-13 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all focus:outline-none"
          title="افزودن برنامه"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Modals */}
      <AddEditItemModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
          setInitialStartTimeForAdd(undefined);
        }}
        onSave={handleSaveItem}
        editingItem={editingItem}
        defaultDate={selectedDate}
        initialStartTime={initialStartTimeForAdd}
      />

      <FocusTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => {
          setIsTimerModalOpen(false);
          setTimerTaskTitle(undefined);
        }}
        taskTitle={timerTaskTitle}
      />

      <AgendaExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedDate={selectedDate}
        items={currentDayItems}
      />
    </div>
  );
}
