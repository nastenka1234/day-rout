import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText } from 'lucide-react';
import { ScheduleItem } from '../types';
import {
  formatPersianFullDate,
  formatTimeWithPersianDigits,
  toPersianDigits,
} from '../utils/persianDate';
import { CATEGORIES } from '../utils/categories';

interface AgendaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  items: ScheduleItem[];
}

export const AgendaExportModal: React.FC<AgendaExportModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  items,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const dateStr = formatPersianFullDate(selectedDate);
  const total = items.length;
  const completed = items.filter((i) => i.completed).length;

  // Sort items by time
  const sortedItems = [...items].sort((a, b) => {
    const timeA = a.startTime || '99:99';
    const timeB = b.startTime || '99:99';
    return timeA.localeCompare(timeB);
  });

  // Generate plain text agenda
  let agendaText = `📋 برنامه روزانه: ${dateStr}\n`;
  agendaText += `📊 وضعیت: ${toPersianDigits(completed)} از ${toPersianDigits(total)} کار انجام شده\n`;
  agendaText += `------------------------------------\n`;

  if (sortedItems.length === 0) {
    agendaText += `(هیچ برنامه‌ای برای این روز ثبت نشده است)\n`;
  } else {
    sortedItems.forEach((item, idx) => {
      const statusIcon = item.completed ? '✅' : '⏳';
      const timePart = item.startTime
        ? `[${formatTimeWithPersianDigits(item.startTime)}${
            item.endTime ? ` تا ${formatTimeWithPersianDigits(item.endTime)}` : ''
          }] `
        : '[شناور] ';
      const catName = CATEGORIES[item.category]?.nameFa || '';
      agendaText += `${statusIcon} ${toPersianDigits(idx + 1)}. ${timePart}${item.title} (${catName})\n`;
      if (item.notes) {
        agendaText += `   📝 ${item.notes}\n`;
      }
      if (item.checklist && item.checklist.length > 0) {
        item.checklist.forEach((c) => {
          agendaText += `   ${c.done ? '  ☑' : '  ☐'} ${c.text}\n`;
        });
      }
    });
  }
  agendaText += `------------------------------------\n`;
  agendaText += `✨ ثبت شده با برنامه‌ریز هوشمند روزانه`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(agendaText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>خروجی و اشتراک‌گذاری برنامه</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-xs text-neutral-600 mb-3">
            می‌توانید خلاصه متنی برنامه امروز را کپی کنید و در پیام‌رسان‌ها (واتس‌اپ، تلگرام، بله، ایتا)
            یا دفترچه یادداشت خود به اشتراک بگذارید:
          </p>

          <pre className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-sans text-neutral-800 whitespace-pre-wrap leading-relaxed select-all">
            {agendaText}
          </pre>
        </div>

        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-100 bg-neutral-50/50">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
          >
            <Printer className="w-4 h-4 text-neutral-500" />
            <span>چاپ برنامه</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-200/60 rounded-lg"
            >
              بستن
            </button>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-colors shadow-2xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>کپی در کلیپ‌بورد</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
