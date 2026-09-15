import { Habit, ScheduleItem } from '../types';
import { formatDateToISO } from './persianDate';

const STORAGE_KEY_ITEMS = 'daily_planner_items_v1';
const STORAGE_KEY_HABITS = 'daily_planner_habits_v1';

export function getInitialSampleItems(): ScheduleItem[] {
  const todayStr = formatDateToISO(new Date());

  return [
    {
      id: 'sample-1',
      title: 'ورزش صبحگاهی و کشش بدن',
      date: todayStr,
      startTime: '06:30',
      endTime: '07:15',
      category: 'health',
      priority: 'high',
      completed: true,
      notes: '۲۰ دقیقه پیاده‌روی سریع + حرکات کششی و نوشیدن ۲ لیوان آب',
      checklist: [
        { id: 'c1', text: 'گرم کردن بدن', done: true },
        { id: 'c2', text: 'پیاده‌روی یا دویدن آرام', done: true },
        { id: 'c3', text: 'حرکات کششی پایانی', done: true },
      ],
    },
    {
      id: 'sample-2',
      title: 'صرف صبحانه مقوی و مرور اهداف روز',
      date: todayStr,
      startTime: '07:30',
      endTime: '08:15',
      category: 'routine',
      priority: 'medium',
      completed: true,
      notes: 'بررسی اولویت‌های کاری و آماده‌سازی فضای کار',
    },
    {
      id: 'sample-3',
      title: 'بخش تمرکز کاری عمیق (Deep Work)',
      date: todayStr,
      startTime: '09:00',
      endTime: '11:30',
      category: 'work',
      priority: 'high',
      completed: false,
      notes: 'تکمیل گزارش اصلی پروژه و بازبینی کدهای جدید بدون حواس‌پرتی',
      checklist: [
        { id: 'c4', text: 'خاموش کردن اعلانات غیرضروری', done: true },
        { id: 'c5', text: 'آماده‌سازی پیش‌نویس اولیه', done: false },
        { id: 'c6', text: 'ارسال نسخه نهایی جهت بازبینی', done: false },
      ],
    },
    {
      id: 'sample-4',
      title: 'جلسه هماهنگی و بررسی برنامه‌ها',
      date: todayStr,
      startTime: '12:00',
      endTime: '12:45',
      category: 'meeting',
      priority: 'medium',
      completed: false,
      notes: 'بررسی پیشرفت کارهای هفته با اعضای تیم',
    },
    {
      id: 'sample-5',
      title: 'ناهار، استراحت و پیاده‌روی کوتاه',
      date: todayStr,
      startTime: '13:00',
      endTime: '14:00',
      category: 'leisure',
      priority: 'low',
      completed: false,
    },
    {
      id: 'sample-6',
      title: 'مطالعه کتاب و توسعه فردی',
      date: todayStr,
      startTime: '17:00',
      endTime: '18:00',
      category: 'study',
      priority: 'medium',
      completed: false,
      notes: 'خواندن ۳۰ صفحه از کتاب برنامه‌ریزی استراتژیک + یادداشت‌برداری',
    },
    {
      id: 'sample-7',
      title: 'خرید ملزومات منزل و کارهای شخصی',
      date: todayStr,
      startTime: '19:00',
      endTime: '20:00',
      category: 'personal',
      priority: 'low',
      completed: false,
    },
  ];
}

export function getInitialSampleHabits(): Habit[] {
  const todayStr = formatDateToISO(new Date());

  return [
    {
      id: 'habit-1',
      title: 'نوشیدن ۸ لیوان آب',
      iconName: 'Droplets',
      category: 'health',
      streak: 5,
      history: {
        [todayStr]: true,
      },
    },
    {
      id: 'habit-2',
      title: 'ورزش و تحرک روزانه (حداقل ۳۰ دقیقه)',
      iconName: 'Activity',
      category: 'health',
      streak: 3,
      history: {
        [todayStr]: true,
      },
    },
    {
      id: 'habit-3',
      title: 'مطالعه کتاب (حداقل ۲۰ صفحه)',
      iconName: 'BookOpen',
      category: 'study',
      streak: 7,
      history: {
        [todayStr]: false,
      },
    },
    {
      id: 'habit-4',
      title: 'مدیتیشن و تنفس عمیق (۱۰ دقیقه)',
      iconName: 'Smile',
      category: 'personal',
      streak: 4,
      history: {
        [todayStr]: false,
      },
    },
    {
      id: 'habit-5',
      title: 'مرور و ارزیابی دستاوردهای روزانه',
      iconName: 'CheckCircle2',
      category: 'routine',
      streak: 6,
      history: {
        [todayStr]: false,
      },
    },
  ];
}

export function loadStoredItems(): ScheduleItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      const initial = getInitialSampleItems();
      saveStoredItems(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialSampleItems();
  }
}

export function saveStoredItems(items: ScheduleItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving items:', err);
  }
}

export function loadStoredHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HABITS);
    if (!raw) {
      const initial = getInitialSampleHabits();
      saveStoredHabits(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialSampleHabits();
  }
}

export function saveStoredHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
  } catch (err) {
    console.error('Error saving habits:', err);
  }
}
