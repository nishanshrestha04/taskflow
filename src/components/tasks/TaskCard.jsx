import { useCallback, memo } from 'react';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

// memo prevents re-render unless task/handlers actually change
const TaskCard = memo(function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  isSubmitting,
}) {
  const priorityDot = {
    high: 'bg-red-400',
    medium: 'bg-amber-400',
    low: 'bg-slate-400',
  };

  const handleStatusCycle = useCallback(() => {
    const cycle = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };
    onStatusChange(task.id, cycle[task.status]);
  }, [task.id, task.status, onStatusChange]);

  const isOverdue =
    task.status !== 'done' &&
    task.dueDate &&
    new Date(task.dueDate) < new Date();

  return (
    <div className="group bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`shrink-0 w-2 h-2 rounded-full mt-0.5 ${priorityDot[task.priority]}`}
          />
          <h3
            className={`text-sm font-semibold text-gray-900 leading-snug line-clamp-2 ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}
          >
            {task.title}
          </h3>
        </div>
        {/* Actions — visible on hover */}
        <div className="flex gap-1 shrink-0 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
            aria-label="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded"
            >
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
            <span
              className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}
            >
              {isOverdue && <AlertTriangle className="w-3 h-3" />}
              {new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default TaskCard;
