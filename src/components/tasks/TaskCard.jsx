import { useCallback, memo } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

// memo prevents re-render unless task/handlers actually change
const TaskCard = memo(function TaskCard({ task, onStatusChange, onEdit, onDelete, isSubmitting }) {
  const priorityDot = {
    high: 'bg-red-400',
    medium: 'bg-amber-400',
    low: 'bg-slate-400',
  }

  const handleStatusCycle = useCallback(() => {
    const cycle = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' }
    onStatusChange(task.id, cycle[task.status])
  }, [task.id, task.status, onStatusChange])

  const isOverdue =
    task.status !== 'done' &&
    task.dueDate &&
    new Date(task.dueDate) < new Date()

  return (
    <div className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`shrink-0 w-2 h-2 rounded-full mt-0.5 ${priorityDot[task.priority]}`} />
          <h3 className={`text-sm font-semibold text-gray-900 leading-snug line-clamp-2 ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h3>
        </div>
        {/* Actions — visible on hover */}
        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            aria-label="Edit task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            disabled={isSubmitting}
            className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            aria-label="Delete task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 mt-auto">
        <button
          onClick={handleStatusCycle}
          disabled={isSubmitting}
          className="disabled:opacity-50"
          title="Click to advance status"
        >
          <Badge variant={task.status} />
        </button>
        <div className="flex items-center gap-2">
          <Badge variant={task.priority} />
          {task.dueDate && (
            <span className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              {isOverdue ? '⚠ ' : ''}
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
})

export default TaskCard
