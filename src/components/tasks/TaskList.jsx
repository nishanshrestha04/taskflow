import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { memo } from 'react';
import { Pencil, Trash2, Calendar } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 border-b border-gray-200 bg-white">
            <tr>
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
                      className="disabled:opacity-50 hover:opacity-80 transition-opacity"
                    >
                      <Badge variant={task.status} />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={task.priority} />
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
                      <Calendar className="w-3.5 h-3.5 text-red-400" />
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
                        <Badge key={tag} variant="neutral">
                          #{tag}
                        </Badge>
                      ))}
                      {task.tags?.length > 2 && (
                        <Badge variant="neutral">+{task.tags.length - 2}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative flex justify-end items-center h-8 w-14 ml-auto">
                      <div className="absolute right-0 flex items-center gap-1 bg-gray-50 z-10">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(task)}
                          className="text-gray-400 hover:text-indigo-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(task.id)}
                          disabled={isSubmitting}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default TaskList;
