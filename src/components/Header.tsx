import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Timer,
  Share2,
  CalendarDays,
} from 'lucide-react';
import {
  formatPersianFullDate,
  isDateToday,
  toPersianDigits,
} from '../utils/persianDate';

interface HeaderProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onOpenAddModal: () => void;
  onOpenTimerModal: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onSelectDate,
  onOpenAddModal,
  onOpenTimerModal,
  onOpenExportModal,
}) => {
  const isToday = isDateToday(selectedDate);

  const goToPrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    onSelectDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    onSelectDate(next);
  };

  const goToToday = () => {
    onSelectDate(new Date());
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          {/* Logo & App Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                  برنامه‌ریز روزانه
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    نسخه هوشمند
                  </span>
                </h1>
                <p className="text-xs text-neutral-500 hidden sm:block">
                  مدیریت هوشمند زمان‌بندی، روتین‌ها و کارهای روزمره
                </p>
              </div>
            </div>

            {/* Mobile actions shortcut */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                id="btn-mobile-timer"
                onClick={onOpenTimerModal}
                className="p-2 text-neutral-600 hover:text-indigo-600 hover:bg-neutral-100 rounded-lg transition-colors"
                title="تایمر تمرکز"
                aria-label="تایمر تمرکز"
              >
                <Timer className="w-5 h-5" />
              </button>
              <button
                id="btn-mobile-export"
                onClick={onOpenExportModal}
                className="p-2 text-neutral-600 hover:text-indigo-600 hover:bg-neutral-100 rounded-lg transition-colors"
                title="خروجی برنامه"
                aria-label="خروجی برنامه"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                id="btn-mobile-add"
                onClick={onOpenAddModal}
                className="p-2 bg-indigo-600 text-white rounded-lg shadow-xs hover:bg-indigo-700 transition-colors"
                title="برنامه جدید"
                aria-label="برنامه جدید"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Date Selector & Navigation in RTL */}
          {/* In RTL: ChevronRight goes to previous day, ChevronLeft goes to next day */}
          <div className="flex items-center justify-between sm:justify-center gap-2 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200">
            <button
              id="btn-prev-day"
              onClick={goToPrevDay}
              className="p-1.5 text-neutral-700 hover:text-neutral-900 hover:bg-white rounded-lg transition-colors"
              title="روز قبل"
              aria-label="روز قبل"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1">
              <CalendarIcon className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-sm font-semibold text-neutral-800 whitespace-nowrap">
                {formatPersianFullDate(selectedDate)}
              </span>
              {isToday && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium whitespace-nowrap">
                  امروز
                </span>
              )}
            </div>

            <button
              id="btn-next-day"
              onClick={goToNextDay}
              className="p-1.5 text-neutral-700 hover:text-neutral-900 hover:bg-white rounded-lg transition-colors"
              title="روز بعد"
              aria-label="روز بعد"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {!isToday && (
              <button
                id="btn-go-today"
                onClick={goToToday}
                className="text-xs px-2.5 py-1 text-indigo-600 hover:bg-white rounded-lg font-medium transition-colors border border-transparent hover:border-neutral-200"
              >
                برو به امروز
              </button>
            )}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              id="btn-timer"
              onClick={onOpenTimerModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-2xs"
            >
              <Timer className="w-4 h-4 text-neutral-500" />
              <span>تایمر تمرکز</span>
            </button>

            <button
              id="btn-export"
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-2xs"
            >
              <Share2 className="w-4 h-4 text-neutral-500" />
              <span>خلاصه و اشتراک</span>
            </button>

            <button
              id="btn-add-schedule"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs hover:shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن برنامه جدید</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
