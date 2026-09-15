import { CategoryMeta, ScheduleCategory } from '../types';

export const CATEGORIES: Record<ScheduleCategory, CategoryMeta> = {
  work: {
    id: 'work',
    nameFa: 'کاری و شغلی',
    color: '#4f46e5', // indigo-600
    bgLight: 'bg-indigo-50',
    borderLight: 'border-indigo-200',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
  },
  study: {
    id: 'study',
    nameFa: 'یادگیری و مطالعه',
    color: '#d97706', // amber-600
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-200',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
  },
  health: {
    id: 'health',
    nameFa: 'ورزش و سلامتی',
    color: '#059669', // emerald-600
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
  },
  personal: {
    id: 'personal',
    nameFa: 'کارهای شخصی',
    color: '#0284c7', // sky-600
    bgLight: 'bg-sky-50',
    borderLight: 'border-sky-200',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
  },
  routine: {
    id: 'routine',
    nameFa: 'روتین روزمره',
    color: '#7c3aed', // violet-600
    bgLight: 'bg-violet-50',
    borderLight: 'border-violet-200',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-800',
  },
  meeting: {
    id: 'meeting',
    nameFa: 'جلسه و قرار ملاقات',
    color: '#e11d48', // rose-600
    bgLight: 'bg-rose-50',
    borderLight: 'border-rose-200',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
  },
  leisure: {
    id: 'leisure',
    nameFa: 'استراحت و فراغت',
    color: '#0d9488', // teal-600
    bgLight: 'bg-teal-50',
    borderLight: 'border-teal-200',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-800',
  },
};

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORIES);
