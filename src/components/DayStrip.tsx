import React from 'react';
import {
  formatDateToISO,
  getPersianDayName,
  getPersianDayNumber,
  getWeekDaysStartingSaturday,
  isDateToday,
  isSameDay,
  toPersianDigits,
} from '../utils/persianDate';
import { ScheduleItem } from '../types';

interface DayStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  items: ScheduleItem[];
}

export const DayStrip: React.FC<DayStripProps> = ({
  selectedDate,
  onSelectDate,
  items,
}) => {
  const weekDays = getWeekDaysStartingSaturday(selectedDate);

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isDateToday(day);
            const dayIso = formatDateToISO(day);
            const dayItems = items.filter((item) => item.date === dayIso);
            const totalTasks = dayItems.length;
            const completedTasks = dayItems.filter((i) => i.completed).length;

            return (
              <button
                key={dayIso}
                id={`day-strip-${dayIso}`}
                onClick={() => onSelectDate(day)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all border text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : isToday
                    ? 'bg-indigo-50/70 text-neutral-800 border-indigo-200 hover:bg-indigo-100/60'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200/80'
                }`}
              >
                {/* Persian Weekday Short Name */}
                <span
                  className={`text-xs font-medium mb-0.5 ${
                    isSelected ? 'text-indigo-100' : 'text-neutral-500'
                  }`}
                >
                  {getPersianDayName(day)}
                </span>

                {/* Persian Day of the Month Number */}
                <span
                  className={`text-base sm:text-lg font-bold ${
                    isSelected ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {toPersianDigits(getPersianDayNumber(day))}
                </span>

                {/* Status Dot / Count */}
                <div className="mt-1 flex items-center justify-center gap-1 min-h-[8px]">
                  {totalTasks > 0 ? (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected
                          ? completedTasks === totalTasks
                            ? 'bg-emerald-300'
                            : 'bg-amber-300'
                          : completedTasks === totalTasks
                          ? 'bg-emerald-500'
                          : 'bg-indigo-500'
                      }`}
                      title={`${toPersianDigits(completedTasks)} از ${toPersianDigits(
                        totalTasks
                      )} انجام شده`}
                    />
                  ) : (
                    <span className="w-1.5 h-1.5" />
                  )}
                </div>

                {/* "Today" pill */}
                {isToday && !isSelected && (
                  <span className="absolute -top-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-indigo-600 text-white">
                    امروز
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
