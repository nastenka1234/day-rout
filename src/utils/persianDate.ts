/**
 * Persian (Jalali) Date Helpers
 */

export const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const PERSIAN_WEEKDAYS = [
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
  'شنبه',
];

export const PERSIAN_WEEKDAYS_SHORT = [
  'ی',
  'د',
  'س',
  'چ',
  'پ',
  'ج',
  'ش',
];

// Map 0-9 to Persian digits
export function toPersianDigits(strOrNum: string | number): string {
  if (strOrNum === null || strOrNum === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(strOrNum).replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

// Convert Gregorian to Jalali using standard astronomical formula
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

// Parse "YYYY-MM-DD" safely to a Date at local midnight
export function parseISODate(isoStr: string): Date {
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

// Format Date object to "YYYY-MM-DD"
export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Get Persian weekday name (Saturday is index 6 in standard JS getDay(), so remapped)
export function getPersianDayName(date: Date): string {
  return PERSIAN_WEEKDAYS[date.getDay()];
}

// Full readable Persian date: e.g. "سه‌شنبه ۲۵ شهریور ۱۴۰۵"
export function formatPersianFullDate(dateOrIso: Date | string): string {
  const date = typeof dateOrIso === 'string' ? parseISODate(dateOrIso) : dateOrIso;
  const [jy, jm, jd] = gregorianToJalali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  const dayName = getPersianDayName(date);
  const monthName = PERSIAN_MONTHS[jm - 1];
  return `${dayName} ${toPersianDigits(jd)} ${monthName} ${toPersianDigits(jy)}`;
}

// Short Persian date: e.g. "۲۵ شهریور"
export function formatPersianShortDate(dateOrIso: Date | string): string {
  const date = typeof dateOrIso === 'string' ? parseISODate(dateOrIso) : dateOrIso;
  const [, jm, jd] = gregorianToJalali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  const monthName = PERSIAN_MONTHS[jm - 1];
  return `${toPersianDigits(jd)} ${monthName}`;
}

// Get Persian Day Number
export function getPersianDayNumber(date: Date): number {
  const [, , jd] = gregorianToJalali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  return jd;
}

// Check if two dates represent the same day
export function isSameDay(d1: Date | string, d2: Date | string): boolean {
  const str1 = typeof d1 === 'string' ? d1 : formatDateToISO(d1);
  const str2 = typeof d2 === 'string' ? d2 : formatDateToISO(d2);
  return str1 === str2;
}

// Check if date is today
export function isDateToday(dateOrIso: Date | string): boolean {
  return isSameDay(dateOrIso, new Date());
}

// Get 7 days for the week containing the given date (starting from Saturday: Iran standard)
export function getWeekDaysStartingSaturday(date: Date): Date[] {
  const d = new Date(date);
  // In JS: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const dayOfWeek = d.getDay();
  // Saturday offset: if dayOfWeek === 6 (Sat), offset = 0; if Sun (0), offset = 1; if Mon (1), offset = 2, etc.
  const daysSinceSaturday = (dayOfWeek + 1) % 7;

  const saturday = new Date(d);
  saturday.setDate(d.getDate() - daysSinceSaturday);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(saturday);
    nextDay.setDate(saturday.getDate() + i);
    week.push(nextDay);
  }
  return week;
}

// Format "HH:mm" to Persian digits
export function formatTimeWithPersianDigits(timeStr?: string): string {
  if (!timeStr) return '';
  return toPersianDigits(timeStr);
}
