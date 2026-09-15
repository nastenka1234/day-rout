import React from 'react';
import { CheckCircle2, Clock, Flame, ListTodo } from 'lucide-react';
import { ScheduleItem } from '../types';
import { toPersianDigits } from '../utils/persianDate';
import { CATEGORIES } from '../utils/categories';

interface DailyStatsProps {
  items: ScheduleItem[];
}

export const DailyStats: React.FC<DailyStatsProps> = ({ items }) => {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Calculate total scheduled minutes
  const totalMinutes = items.reduce((acc, item) => {
    if (!item.startTime || !item.endTime) return acc;
    const [sh, sm] = item.startTime.split(':').map(Number);
    const [eh, em] = item.endTime.split(':').map(Number);
    const diff = eh * 60 + em - (sh * 60 + sm);
    return acc + (diff > 0 ? diff : 0);
  }, 0);

  const completedMinutes = items
    .filter((i) => i.completed)
    .reduce((acc, item) => {
      if (!item.startTime || !item.endTime) return acc;
      const [sh, sm] = item.startTime.split(':').map(Number);
      const [eh, em] = item.endTime.split(':').map(Number);
      const diff = eh * 60 + em - (sh * 60 + sm);
      return acc + (diff > 0 ? diff : 0);
    }, 0);

  const formatHoursMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${toPersianDigits(h)} ساعت و ${toPersianDigits(m)} دقیقه`;
    if (h > 0) return `${toPersianDigits(h)} ساعت`;
    return `${toPersianDigits(m)} دقیقه`;
  };

  // Dynamic message based on progress
  let progressMessage = 'هنوز برنامه‌ای برای این روز ثبت نشده است.';
  if (total > 0) {
    if (percentage === 100) {
      progressMessage = 'آفرین! تمام برنامه‌های امروزت را با موفقیت تکمیل کردی.';
    } else if (percentage >= 70) {
      progressMessage = 'عالی پیش می‌روی! بخش عمده کارهای امروز به پایان رسیده.';
    } else if (percentage >= 40) {
      progressMessage = 'روند خوبی داری! ادامه بده تا به هدف امروزت برسی.';
    } else {
      progressMessage = 'شروع روز یا ادامه برنامه‌ها؛ تمرکزت را حفظ کن.';
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-2xs">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:divide-x-reverse md:divide-x md:divide-neutral-100">
        {/* Progress & Percentage */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-neutral-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-600 transition-all duration-500 ease-out"
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-neutral-900">
                {toPersianDigits(percentage)}٪
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs text-neutral-500 font-medium mb-0.5 flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5 text-indigo-600" />
              <span>پیشرفت کلی روزانه</span>
            </div>
            <div className="text-base font-bold text-neutral-900">
              {toPersianDigits(completed)} از {toPersianDigits(total)} برنامه انجام شد
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{progressMessage}</p>
          </div>
        </div>

        {/* Time Planned */}
        <div className="flex items-center gap-3.5 md:pr-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-500 font-medium mb-0.5">زمان‌بندی شده</div>
            <div className="text-sm font-bold text-neutral-800">
              {totalMinutes > 0 ? formatHoursMinutes(totalMinutes) : 'بدون ساعت'}
            </div>
            <div className="text-xs text-neutral-500">
              {completedMinutes > 0
                ? `${formatHoursMinutes(completedMinutes)} سپری و تکمیل شده`
                : 'در انتظار انجام'}
            </div>
          </div>
        </div>

        {/* Active categories or streak */}
        <div className="flex items-center gap-3.5 md:pr-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-500 font-medium mb-0.5">وضعیت کارها</div>
            <div className="text-sm font-bold text-neutral-800">
              {total - completed > 0
                ? `${toPersianDigits(total - completed)} برنامه باقی‌مانده`
                : total > 0
                ? 'همه برنامه‌ها تکمیل شد!'
                : 'روز بدون برنامه'}
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              {total > 0 && percentage === 100 ? 'روز بی‌نقص و پربار' : 'هدف‌گذاری مستمر'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
