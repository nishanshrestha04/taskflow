import { useCallback } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export default function TaskFilters({ filter, onFilterChange, taskCount }) {
  const handleSearch = useCallback(
    (e) => onFilterChange('search', e.target.value),
    [onFilterChange]
  )
  const handleStatus = useCallback(
    (e) => onFilterChange('status', e.target.value),
    [onFilterChange]
  )
  const handlePriority = useCallback(
    (e) => onFilterChange('priority', e.target.value),
    [onFilterChange]
  )

  const hasActiveFilters =
    filter.search || filter.status !== 'all' || filter.priority !== 'all'

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
      {/* Search */}
      <div className="flex-1 min-w-0 w-full sm:w-auto">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search tasks…"
            value={filter.search}
            onChange={handleSearch}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Filters row */}
      <div className="flex gap-2 w-full sm:w-auto">
        <Select
          options={STATUS_OPTIONS}
          value={filter.status}
          onChange={handleStatus}
          className="text-sm"
        />
        <Select
          options={PRIORITY_OPTIONS}
          value={filter.priority}
          onChange={handlePriority}
          className="text-sm"
        />
      </div>

      {/* Results count + clear */}
      <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
        <span>{taskCount} {taskCount === 1 ? 'task' : 'tasks'}</span>
        {hasActiveFilters && (
          <button
            onClick={() => {
              onFilterChange('search', '')
              onFilterChange('status', 'all')
              onFilterChange('priority', 'all')
            }}
            className="text-indigo-600 hover:text-indigo-800 text-xs underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
