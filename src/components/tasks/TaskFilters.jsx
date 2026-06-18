import { useCallback } from 'react';
import { List, LayoutGrid, SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';
import Select from '../ui/Select';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const SORT_OPTIONS = [{ value: 'due_date', label: 'Due date' }];

export default function TaskFilters({ filter, onFilterChange, taskCount, view, onViewChange }) {
  const handleStatus = useCallback(
    (e) => onFilterChange('status', e.target.value),
    [onFilterChange],
  );
  const handlePriority = useCallback(
    (e) => onFilterChange('priority', e.target.value),
    [onFilterChange],
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      {/* View toggles */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
        <button
          onClick={() => onViewChange('list')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors outline-none ${
            view === 'list'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <List className="w-4 h-4" />
          List view
        </button>
        <button
          onClick={() => onViewChange('card')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors outline-none ${
            view === 'card'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Card view
        </button>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          options={STATUS_OPTIONS}
          value={filter.status}
          onChange={handleStatus}
          className="text-sm border-gray-200 shadow-sm min-w-32.5"
        />
        <Select
          options={PRIORITY_OPTIONS}
          value={filter.priority}
          onChange={handlePriority}
          className="text-sm border-gray-200 shadow-sm min-w-32.5"
        />
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm">
          <ArrowUpDown className="w-4 h-4" />
          Due date
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
