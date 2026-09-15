import React, { useState } from 'react';
import {
  Activity,
  BookOpen,
  Check,
  CheckCircle2,
  Droplets,
  Flame,
  Plus,
  Smile,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Habit, ScheduleCategory } from '../types';
import { CATEGORIES } from '../utils/categories';
import {
  formatDateToISO,
  getPersianDayName,
  getWeekDaysStartingSaturday,
  toPersianDigits,
} from '../utils/persianDate';

interface HabitsViewProps {
  selectedDate: Date;
  habits: Habit[];
  onToggleHabit: (habitId: string, dateIso: string) => void;
  onAddHabit: (newHabit: Omit<Habit, 'id' | 'streak' | 'history'>) => void;
  onDeleteHabit: (habitId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Droplets: <Droplets className="w-5 h-5 text-sky-500" />,
  Activity: <Activity className="w-5 h-5 text-emerald-500" />,
  BookOpen: <BookOpen className="w-5 h-5 text-amber-500" />,
  Smile: <Smile className="w-5 h-5 text-violet-500" />,
  CheckCircle2: <CheckCircle2 className="w-5 h-5 text-indigo-500" />,
};

export const HabitsView: React.FC<HabitsViewProps> = ({
  selectedDate,
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ScheduleCategory>('routine');
  const [selectedIcon, setSelectedIcon] = useState('CheckCircle2');

  const selectedDateIso = formatDateToISO(selectedDate);
  const weekDays = getWeekDaysStartingSaturday(selectedDate);

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddHabit({
      title: newTitle.trim(),
      category: newCategory,
      iconName: selectedIcon,
    });
    setNewTitle('');
    setShowAddForm(false);
  };

  const completedTodayCount = habits.filter(
    (h) => h.history && h.history[selectedDateIso]
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 shadow-2xs space-y-6">
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
        <div>
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>عادت‌ها و روتین‌های روزانه</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            تکرار منظم روتین‌های مفید برای ساخت عادات پایدار و ارتقای کیفیت روز
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium border border-indigo-100">
            {toPersianDigits(completedTodayCount)} از {toPersianDigits(habits.length)} روتین امروز
            انجام شد
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>عادت جدید</span>
          </button>
        </div>
      </div>

      {/* Add New Habit Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateHabit}
          className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3"
        >
          <h3 className="text-sm font-bold text-neutral-800">تعریف عادت یا روتین جدید</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                عنوان عادت روزانه *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: پیاده‌روی ۲۰ دقیقه، یادگیری لغات زبان..."
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">دسته‌بندی</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none"
              >
                <option value="routine">روتین روزمره</option>
                <option value="health">ورزش و سلامت</option>
                <option value="study">یادگیری و مطالعه</option>
                <option value="personal">کارهای شخصی</option>
                <option value="work">کاری</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-600">انتخاب آیکون:</span>
              {Object.keys(ICON_MAP).map((iconKey) => (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() => setSelectedIcon(iconKey)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    selectedIcon === iconKey
                      ? 'border-indigo-600 bg-indigo-50 shadow-2xs'
                      : 'border-neutral-200 bg-white hover:bg-neutral-100'
                  }`}
                >
                  {ICON_MAP[iconKey]}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-200/60 rounded-lg"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
              >
                ذخیره عادت
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => {
          const isDone = habit.history && habit.history[selectedDateIso];
          const catMeta = CATEGORIES[habit.category] || CATEGORIES.routine;

          return (
            <div
              key={habit.id}
              className={`p-4 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100 shrink-0">
                    {ICON_MAP[habit.iconName] || (
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-bold text-neutral-900 truncate ${
                        isDone ? 'text-emerald-900' : ''
                      }`}
                    >
                      {habit.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${catMeta.badgeBg} ${catMeta.badgeText}`}
                      >
                        {catMeta.nameFa}
                      </span>
                      {habit.streak > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {toPersianDigits(habit.streak)} روز استمرار
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Big check button for today */}
                <button
                  onClick={() => onToggleHabit(habit.id, selectedDateIso)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'border-neutral-300 hover:border-indigo-600 bg-white text-transparent hover:text-neutral-300'
                  }`}
                  aria-label="تغییر وضعیت روتین"
                  title={isDone ? 'انجام شده در این روز' : 'علامت زدن به عنوان انجام شده'}
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              {/* Weekly Mini-Dots Tracker */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span className="text-[11px]">وضعیت این هفته:</span>
                <div className="flex items-center gap-1.5">
                  {weekDays.map((d) => {
                    const dIso = formatDateToISO(d);
                    const doneOnD = habit.history && habit.history[dIso];
                    return (
                      <div
                        key={dIso}
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          doneOnD
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-100 text-neutral-400'
                        }`}
                        title={`${getPersianDayName(d)}: ${doneOnD ? 'انجام شد' : 'انجام نشد'}`}
                      >
                        {getPersianDayName(d).slice(0, 1)}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="p-1 text-neutral-300 hover:text-rose-500 rounded transition-colors"
                  title="حذف این عادت"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
