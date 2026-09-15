import React, { useEffect, useState } from 'react';
import {
  Check,
  Clock,
  Edit2,
  ListChecks,
  Play,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { ScheduleItem } from '../types';
import { CATEGORIES } from '../utils/categories';
import {
  formatTimeWithPersianDigits,
  isDateToday,
  toPersianDigits,
} from '../utils/persianDate';

interface TimelineViewProps {
  selectedDate: Date;
  items: ScheduleItem[];
  onToggleComplete: (id: string) => void;
  onEditItem: (item: ScheduleItem) => void;
  onDeleteItem: (id: string) => void;
  onAddAtHour: (hour: string) => void;
  onStartTimerForTask: (taskTitle: string) => void;
}

const HOURS = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

export const TimelineView: React.FC<TimelineViewProps> = ({
  selectedDate,
  items,
  onToggleComplete,
  onEditItem,
  onDeleteItem,
  onAddAtHour,
  onStartTimerForTask,
}) => {
  const isToday = isDateToday(selectedDate);
  const [currentMinutesFrom6am, setCurrentMinutesFrom6am] = useState<number | null>(null);

  // Update current time indicator every minute
  useEffect(() => {
    if (!isToday) {
      setCurrentMinutesFrom6am(null);
      return;
    }

    const updateNow = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();

      // We track 06:00 (360 min) to 24:00 (1440 min)
      if (currentHour >= 6 && currentHour <= 23) {
        const totalMinutes = (currentHour - 6) * 60 + currentMin;
        setCurrentMinutesFrom6am(totalMinutes);
      } else {
        setCurrentMinutesFrom6am(null);
      }
    };

    updateNow();
    const timer = setInterval(updateNow, 60000);
    return () => clearInterval(timer);
  }, [isToday]);

  // Separate timed items vs floating / all-day items
  const timedItems = items.filter((item) => item.startTime && !item.isAllDay);
  const unscheduledItems = items.filter((item) => !item.startTime || item.isAllDay);

  // Helper to check if an item starts within a given hour block (e.g. 09:00 to 09:59)
  const getItemsForHour = (hourStr: string) => {
    const hourNum = parseInt(hourStr.split(':')[0], 10);
    return timedItems.filter((item) => {
      if (!item.startTime) return false;
      const itemHour = parseInt(item.startTime.split(':')[0], 10);
      return itemHour === hourNum;
    });
  };

  const getPriorityLabel = (p: string) => {
    switch (p) {
      case 'high':
        return 'اولویت بالا';
      case 'medium':
        return 'اولویت متوسط';
      default:
        return 'عادی';
    }
  };

  const getPriorityBadgeClass = (p: string) => {
    switch (p) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Unscheduled / Floating items banner if any exist */}
      {unscheduledItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>برنامه‌های شناور و بدون ساعت مشخص ({toPersianDigits(unscheduledItems.length)})</span>
            </h2>
            <span className="text-xs text-neutral-500">کارهای انعطاف‌پذیر روزانه</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unscheduledItems.map((item) => {
              const catMeta = CATEGORIES[item.category] || CATEGORIES.personal;
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all ${
                    item.completed
                      ? 'bg-neutral-50/80 border-neutral-200 opacity-60'
                      : 'bg-white border-neutral-200 hover:border-indigo-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onToggleComplete(item.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        item.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-neutral-300 hover:border-indigo-500 bg-white'
                      }`}
                      aria-label="تغییر وضعیت انجام"
                    >
                      {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold text-neutral-900 truncate ${
                          item.completed ? 'line-through text-neutral-400' : ''
                        }`}
                      >
                        {item.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-[11px] px-1.5 py-0.5 rounded-md ${catMeta.badgeBg} ${catMeta.badgeText}`}
                        >
                          {catMeta.nameFa}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${getPriorityBadgeClass(
                            item.priority
                          )}`}
                        >
                          {getPriorityLabel(item.priority)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditItem(item)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
                        title="ویرایش"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Hourly Timeline */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 shadow-2xs relative">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">جدول زمانی ساعت‌بندی روز</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              برای افزودن برنامه در هر ساعت، روی علامت «+» یا ردیف ساعت مربوطه کلیک کنید.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              انجام شده
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              در انتظار انجام
            </span>
          </div>
        </div>

        {/* Hour slots list */}
        <div className="relative space-y-1">
          {/* Current time indicator line if viewing today */}
          {currentMinutesFrom6am !== null && currentMinutesFrom6am >= 0 && (
            <div
              className="absolute right-0 left-0 z-20 pointer-events-none flex items-center"
              style={{
                // Each hour row is ~76px height (min-h-[72px] + margin/border)
                top: `${(currentMinutesFrom6am / 60) * 76 + 18}px`,
              }}
            >
              <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm ring-4 ring-rose-100 -mr-1.5 z-10" />
              <div className="h-0.5 bg-rose-500 w-full opacity-80" />
              <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded -ml-1 shadow-xs whitespace-nowrap">
                اکنون
              </span>
            </div>
          )}

          {HOURS.map((hourStr) => {
            const hourItems = getItemsForHour(hourStr);
            const hourDisplay = formatTimeWithPersianDigits(hourStr);

            return (
              <div
                key={hourStr}
                className="group relative min-h-[72px] flex items-start gap-3 sm:gap-4 py-2 border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 rounded-lg transition-colors px-1 sm:px-2"
              >
                {/* Time Gutter (Right side in RTL) */}
                <div className="w-14 sm:w-16 shrink-0 pt-1 text-right">
                  <span className="text-xs sm:text-sm font-bold text-neutral-700 tracking-tight block">
                    {hourDisplay}
                  </span>
                  <button
                    onClick={() => onAddAtHour(hourStr)}
                    className="opacity-0 group-hover:opacity-100 mt-1 inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 transition-opacity font-medium"
                    title={`افزودن در ساعت ${hourDisplay}`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>افزودن</span>
                  </button>
                </div>

                {/* Vertical Divider / Timeline bar */}
                <div className="w-px self-stretch bg-neutral-200 relative">
                  <div className="w-2 h-2 rounded-full bg-neutral-300 -right-[3.5px] top-2.5 absolute" />
                </div>

                {/* Items in this hour slot or empty placeholder */}
                <div className="flex-1 space-y-2.5">
                  {hourItems.length === 0 ? (
                    <div
                      onClick={() => onAddAtHour(hourStr)}
                      className="cursor-pointer h-10 border border-dashed border-transparent group-hover:border-neutral-200 rounded-xl flex items-center px-3 text-xs text-neutral-400 group-hover:text-indigo-600 transition-colors"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        + برای برنامه‌ریزی ساعت {hourDisplay} اینجا کلیک کنید
                      </span>
                    </div>
                  ) : (
                    hourItems.map((item) => {
                      const catMeta = CATEGORIES[item.category] || CATEGORIES.personal;
                      const hasChecklist = item.checklist && item.checklist.length > 0;
                      const completedSubtasks = item.checklist
                        ? item.checklist.filter((c) => c.done).length
                        : 0;

                      return (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-xl border transition-all ${
                            item.completed
                              ? 'bg-neutral-50/90 border-neutral-200 text-neutral-500'
                              : `${catMeta.bgLight} ${catMeta.borderLight} shadow-2xs hover:shadow-xs`
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            {/* Checkbox and Title */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <button
                                onClick={() => onToggleComplete(item.id)}
                                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                                  item.completed
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-neutral-400 hover:border-indigo-600 bg-white'
                                }`}
                                aria-label="علامت زدن به عنوان انجام شده"
                              >
                                {item.completed && (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3
                                    className={`text-sm sm:text-base font-bold text-neutral-900 ${
                                      item.completed
                                        ? 'line-through text-neutral-400 font-normal'
                                        : ''
                                    }`}
                                  >
                                    {item.title}
                                  </h3>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-md font-medium ${catMeta.badgeBg} ${catMeta.badgeText}`}
                                  >
                                    {catMeta.nameFa}
                                  </span>
                                  <span
                                    className={`text-[11px] px-2 py-0.5 rounded border font-medium ${getPriorityBadgeClass(
                                      item.priority
                                    )}`}
                                  >
                                    {getPriorityLabel(item.priority)}
                                  </span>
                                </div>

                                {/* Time range and note */}
                                <div className="flex items-center gap-3 mt-1 text-xs text-neutral-600">
                                  <span className="flex items-center gap-1 font-semibold text-neutral-800">
                                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                                    {formatTimeWithPersianDigits(item.startTime)}
                                    {item.endTime && (
                                      <>
                                        {' '}تا{' '}
                                        {formatTimeWithPersianDigits(item.endTime)}
                                      </>
                                    )}
                                  </span>

                                  {hasChecklist && (
                                    <span className="flex items-center gap-1 text-neutral-500 font-medium">
                                      <ListChecks className="w-3.5 h-3.5" />
                                      {toPersianDigits(completedSubtasks)} از{' '}
                                      {toPersianDigits(item.checklist!.length)} زیرکار
                                    </span>
                                  )}
                                </div>

                                {item.notes && (
                                  <p className="text-xs text-neutral-600 mt-2 bg-white/70 p-2 rounded-lg border border-neutral-200/50 leading-relaxed">
                                    {item.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Actions toolbar */}
                            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                              {!item.completed && (
                                <button
                                  onClick={() => onStartTimerForTask(item.title)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shadow-2xs"
                                  title="شروع تمرکز برای این کار"
                                >
                                  <Play className="w-3 h-3 text-indigo-600" />
                                  <span>تمرکز</span>
                                </button>
                              )}

                              <button
                                onClick={() => onEditItem(item)}
                                className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-white rounded-lg transition-colors"
                                title="ویرایش برنامه"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                                title="حذف برنامه"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
