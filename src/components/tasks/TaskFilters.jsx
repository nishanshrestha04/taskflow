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

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'due_asc', label: 'Due soon' },
  { value: 'due_desc', label: 'Due late' },
];

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
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
      {/* View toggles */}
      <div className="flex items-center w-full lg:w-auto gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm shrink-0">
        <button
          onClick={() => onViewChange('list')}
          className={`flex-1 lg:flex-none flex justify-center items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors outline-none ${
            view === 'list'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <List className="w-4 h-4" />
          <span className="hidden sm:inline">List view</span>
        </button>
        <button
          onClick={() => onViewChange('card')}
          className={`flex-1 lg:flex-none flex justify-center items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors outline-none ${
            view === 'card'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="hidden sm:inline">Card view</span>
        </button>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
        <Select
          options={STATUS_OPTIONS}
          value={filter.status}
          onChange={handleStatus}
          wrapperClassName="flex-1 sm:flex-none min-w-0 sm:min-w-32"
          className="text-sm border-gray-200 shadow-sm"
        />
        <Select
          options={PRIORITY_OPTIONS}
          value={filter.priority}
          onChange={handlePriority}
          wrapperClassName="flex-1 sm:flex-none min-w-0 sm:min-w-32"
          className="text-sm border-gray-200 shadow-sm"
        />
        <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1"></div>
        <Select
          options={SORT_OPTIONS}
          value={filter.sortBy || 'newest'}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          wrapperClassName="flex-1 sm:flex-none min-w-0 sm:min-w-36"
          className="text-sm border-gray-200 shadow-sm"
        />
      </div>
    </div>
  );
}
