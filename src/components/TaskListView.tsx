import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit2,
  Filter,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { ScheduleCategory, ScheduleItem, StatusFilter } from '../types';
import { CATEGORIES, CATEGORY_LIST } from '../utils/categories';
import {
  formatPersianFullDate,
  formatTimeWithPersianDigits,
  toPersianDigits,
} from '../utils/persianDate';

interface TaskListViewProps {
  selectedDate: Date;
  items: ScheduleItem[];
  onToggleComplete: (id: string) => void;
  onToggleChecklist: (itemId: string, checkId: string) => void;
  onEditItem: (item: ScheduleItem) => void;
  onDeleteItem: (id: string) => void;
  onOpenAddModal: () => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  selectedDate,
  items,
  onToggleComplete,
  onToggleChecklist,
  onEditItem,
  onDeleteItem,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<ScheduleCategory | 'all'>('all');
  const [expandedChecklists, setExpandedChecklists] = useState<Record<string, boolean>>({});

  const toggleChecklistExpand = (id: string) => {
    setExpandedChecklists((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes) return false;
    }

    // Status filter
    if (statusFilter === 'pending' && item.completed) return false;
    if (statusFilter === 'completed' && !item.completed) return false;

    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

    return true;
  });

  // Sort: completed to bottom, then by startTime
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const timeA = a.startTime || '99:99';
    const timeB = b.startTime || '99:99';
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 shadow-2xs space-y-5">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-tasks-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در عنوان یا توضیحات برنامه‌ها..."
            className="w-full pl-3 pr-9 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-neutral-900"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-neutral-900 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            همه ({toPersianDigits(items.length)})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              statusFilter === 'pending'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            در انتظار ({toPersianDigits(items.filter((i) => !i.completed).length)})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              statusFilter === 'completed'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            انجام شده ({toPersianDigits(items.filter((i) => i.completed).length)})
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="shrink-0">
          <select
            id="category-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-700"
          >
            <option value="all">تمام دسته‌بندی‌ها</option>
            {CATEGORY_LIST.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameFa}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-neutral-200 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-800">هیچ برنامه‌ای یافت نشد</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'موردی با فیلترهای انتخابی مطابقت ندارد. فیلترها را تغییر دهید.'
              : 'برای این روز هنوز برنامه‌ای ثبت نکرده‌اید. با دکمه زیر برنامه جدید بسازید.'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>افزودن برنامه جدید</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedItems.map((item) => {
            const catMeta = CATEGORIES[item.category] || CATEGORIES.personal;
            const hasChecklist = item.checklist && item.checklist.length > 0;
            const isExpanded = expandedChecklists[item.id] ?? false;
            const completedChecks = item.checklist
              ? item.checklist.filter((c) => c.done).length
              : 0;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.completed
                    ? 'bg-neutral-50/80 border-neutral-200 opacity-70'
                    : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Checkbox and Content */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleComplete(item.id)}
                      className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        item.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-neutral-300 hover:border-indigo-600 bg-white'
                      }`}
                      aria-label="علامت زدن انجام"
                    >
                      {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm sm:text-base font-bold text-neutral-900 ${
                            item.completed ? 'line-through text-neutral-400 font-normal' : ''
                          }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-medium ${catMeta.badgeBg} ${catMeta.badgeText}`}
                        >
                          {catMeta.nameFa}
                        </span>
                        {item.priority === 'high' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                            اولویت بالا
                          </span>
                        )}
                      </div>

                      {/* Time and details info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-neutral-500">
                        {item.startTime ? (
                          <span className="flex items-center gap-1 font-medium text-neutral-700">
                            <Clock className="w-3.5 h-3.5 text-neutral-400" />
                            {formatTimeWithPersianDigits(item.startTime)}
                            {item.endTime && (
                              <> تا {formatTimeWithPersianDigits(item.endTime)}</>
                            )}
                          </span>
                        ) : (
                          <span className="text-neutral-400">بدون ساعت مشخص (شناور)</span>
                        )}

                        {hasChecklist && (
                          <button
                            onClick={() => toggleChecklistExpand(item.id)}
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            <span>
                              {toPersianDigits(completedChecks)} از{' '}
                              {toPersianDigits(item.checklist!.length)} زیرکار
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-xs text-neutral-600 mt-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 leading-relaxed">
                          {item.notes}
                        </p>
                      )}

                      {/* Checklist Subitems */}
                      {hasChecklist && isExpanded && (
                        <div className="mt-3 space-y-1.5 pr-2 border-r-2 border-indigo-100">
                          {item.checklist!.map((check) => (
                            <label
                              key={check.id}
                              className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer hover:text-neutral-900"
                            >
                              <input
                                type="checkbox"
                                checked={check.done}
                                onChange={() => onToggleChecklist(item.id, check.id)}
                                className="w-3.5 h-3.5 text-indigo-600 rounded border-neutral-300 focus:ring-indigo-500"
                              />
                              <span className={check.done ? 'line-through text-neutral-400' : ''}>
                                {check.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
                      title="ویرایش"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
