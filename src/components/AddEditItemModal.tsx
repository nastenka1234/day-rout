import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock, Calendar, CheckSquare } from 'lucide-react';
import { ChecklistItem, Priority, ScheduleCategory, ScheduleItem } from '../types';
import { CATEGORY_LIST } from '../utils/categories';
import { formatDateToISO } from '../utils/persianDate';

interface AddEditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ScheduleItem> & { id?: string }) => void;
  editingItem: ScheduleItem | null;
  defaultDate: Date;
  initialStartTime?: string;
}

export const AddEditItemModal: React.FC<AddEditItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  defaultDate,
  initialStartTime,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ScheduleCategory>('work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [date, setDate] = useState(formatDateToISO(defaultDate));
  const [hasTime, setHasTime] = useState(true);
  const [startTime, setStartTime] = useState(initialStartTime || '09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Sync state when editing or opening
  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setCategory(editingItem.category);
      setPriority(editingItem.priority);
      setDate(editingItem.date);
      setHasTime(!!editingItem.startTime && !editingItem.isAllDay);
      setStartTime(editingItem.startTime || '09:00');
      setEndTime(editingItem.endTime || '10:00');
      setNotes(editingItem.notes || '');
      setChecklist(editingItem.checklist || []);
    } else {
      setTitle('');
      setCategory('work');
      setPriority('medium');
      setDate(formatDateToISO(defaultDate));
      setHasTime(!!initialStartTime);
      if (initialStartTime) {
        setStartTime(initialStartTime);
        const [h, m] = initialStartTime.split(':').map(Number);
        const endH = (h + 1) % 24;
        setEndTime(`${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      } else {
        setStartTime('09:00');
        setEndTime('10:00');
      }
      setNotes('');
      setChecklist([]);
    }
  }, [editingItem, defaultDate, initialStartTime, isOpen]);

  if (!isOpen) return null;

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist((prev) => [
      ...prev,
      {
        id: `check-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        text: newChecklistText.trim(),
        done: false,
      },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: editingItem ? editingItem.id : undefined,
      title: title.trim(),
      category,
      priority,
      date,
      startTime: hasTime ? startTime : undefined,
      endTime: hasTime ? endTime : undefined,
      isAllDay: !hasTime,
      notes: notes.trim() || undefined,
      checklist: checklist.length > 0 ? checklist : undefined,
      completed: editingItem ? editingItem.completed : false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">
            {editingItem ? 'ویرایش برنامه' : 'افزودن برنامه روزانه جدید'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              عنوان برنامه یا کار *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: جلسه بررسی استراتژی، مطالعه فصل ۳، پیاده‌روی عصرگاهی..."
              className="w-full px-3.5 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-neutral-900"
              autoFocus
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">دسته‌بندی</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ScheduleCategory)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-800"
              >
                {CATEGORY_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameFa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">درجه اهمیت</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-800"
              >
                <option value="high">اولویت بالا (مهم و فوری)</option>
                <option value="medium">اولویت متوسط (عادی)</option>
                <option value="low">اولویت پایین (شناور)</option>
              </select>
            </div>
          </div>

          {/* Time Switch & Settings */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>زمان‌بندی مشخص ساعتی</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTime}
                  onChange={(e) => setHasTime(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {hasTime && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    زمان شروع
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-neutral-200 rounded-lg text-neutral-800"
                    required={hasTime}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                    زمان پایان
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-neutral-200 rounded-lg text-neutral-800"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Checklist / Subtasks */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>زیرفعالیت‌ها و چک‌لیست (اختیاری)</span>
            </label>

            {checklist.length > 0 && (
              <div className="space-y-1.5 mb-2.5">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 px-3 py-1.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs"
                  >
                    <span className="text-neutral-800 truncate">{item.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="text-neutral-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                placeholder="افزودن مرحله یا زیرفعالیت..."
                className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none text-neutral-800"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg transition-colors shrink-0"
              >
                + افزودن
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              یادداشت و جزئیات تکمیلی
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="نکات مهم، لینک‌ها، مدارک یا توضیحاتی که باید به خاطر داشته باشید..."
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-800 resize-none"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs hover:shadow transition-all"
            >
              {editingItem ? 'ذخیره تغییرات' : 'افزودن به برنامه'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
