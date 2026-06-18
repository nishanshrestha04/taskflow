import Badge from '../ui/Badge';
import { memo } from 'react';

const TaskList = memo(function TaskList({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
  isSubmitting,
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
        <p className="font-medium text-gray-700">No tasks found</p>
      </div>
    );
  }

  const priorityStyles = {
    high: 'text-red-600',
    medium: 'text-amber-500',
    low: 'text-gray-500',
  };

  const statusMap = {
    todo: { label: 'To Do', dot: 'bg-gray-400' },
    'in-progress': { label: 'In Progress', dot: 'bg-blue-500' },
    done: { label: 'Done', dot: 'bg-green-500' },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 border-b border-gray-200 bg-white">
            <tr>
              <th className="px-4 py-4 font-medium w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-4 py-4 font-medium">Task</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium">Priority</th>
              <th className="px-4 py-4 font-medium">Assignee</th>
              <th className="px-4 py-4 font-medium">Due date</th>
              <th className="px-4 py-4 font-medium">Tags</th>
              <th className="px-4 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map((task) => {
              const statusInfo = statusMap[task.status] || statusMap['todo'];

              // Helper to cycle status
              const cycleStatus = () => {
                const cycle = {
                  todo: 'in-progress',
                  'in-progress': 'done',
                  done: 'todo',
                };
                onStatusChange(task.id, cycle[task.status]);
              };

              return (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-4 py-4 min-w-60">
                    <p
                      className={`font-medium text-gray-900 ${task.status === 'done' ? 'line-through opacity-70' : ''}`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={cycleStatus}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full px-2.5 py-1 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}
                      />
                      {statusInfo.label}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium ${priorityStyles[task.priority]}`}
                    >
                      {task.priority === 'high' && (
                        <span className="text-red-500">∧</span>
                      )}
                      {task.priority === 'medium' && (
                        <span className="text-amber-500">−</span>
                      )}
                      {task.priority === 'low' && (
                        <span className="text-gray-400">−</span>
                      )}
                      <span className="capitalize">{task.priority}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                        {task.assignee
                          ? task.assignee
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()
                          : 'RT'}
                      </div>
                      <span className="text-gray-600 text-xs">
                        {task.assignee || 'Ram Thapa'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg
                        className="w-3.5 h-3.5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span
                        className={
                          task.status !== 'done' &&
                          task.dueDate &&
                          new Date(task.dueDate) < new Date()
                            ? 'text-red-600 font-medium'
                            : ''
                        }
                      >
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {task.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                      {task.tags?.length > 2 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                          +{task.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 justify-end">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1 text-gray-400 hover:text-indigo-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(task.id)}
                        disabled={isSubmitting}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    {/* Always visible 3 dots when not hovering over actions (optional styling trick) */}
                    <button className="p-1 text-gray-400 group-hover:hidden inline-block">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
        <p className="text-sm text-gray-500">
          Showing 1 to {tasks.length} of {tasks.length} tasks
        </p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-medium text-sm">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 text-sm ml-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

export default TaskList;
