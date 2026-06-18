import { useState, useCallback } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskList from '../components/tasks/TaskList';
import Sidebar from '../components/layout/Sidebar';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import useTaskStore from '../store/taskStore';
import { toast } from '../components/ui/Toast';

function StatCard({ label, value, color = 'gray', icon }) {
  const colors = {
    gray: 'bg-white border border-gray-100 text-gray-700',
    blue: 'bg-white border border-gray-100 text-blue-700',
    green: 'bg-white border border-gray-100 text-green-700',
    red: 'bg-white border border-gray-100 text-red-700',
    indigo: 'bg-white border border-gray-100 text-indigo-700',
  };
  const iconColors = {
    gray: 'text-gray-400 bg-gray-50',
    blue: 'text-blue-500 bg-blue-50',
    green: 'text-green-500 bg-green-50',
    red: 'text-red-500 bg-red-50',
    indigo: 'text-indigo-500 bg-indigo-50',
  };

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm flex flex-col justify-between ${colors[color]}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconColors[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 leading-none mb-1">
          {value}
        </p>
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex-1 p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="col-span-2 h-40 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
      </div>
      <div className="h-64 bg-gray-200 rounded-xl" />
    </div>
  );
}

export default function DashboardPage() {
  const {
    tasks,
    stats,
    isLoading,
    error,
    filter,
    createTask,
    updateTask,
    handleStatusChange,
    handleDelete,
    handleFilterChange,
  } = useTasks();
  const { isSubmitting } = useTaskStore();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleOpenCreate = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleSubmit = async (formData) => {
    if (editingTask) {
      const result = await updateTask(editingTask.id, formData);
      if (result.success) {
        toast('Task updated successfully');
        handleCloseModal();
      } else {
        toast(result.error || 'Failed to update task', 'error');
      }
    } else {
      const result = await createTask(formData);
      if (result.success) {
        toast('Task created!');
        handleCloseModal();
      } else {
        toast(result.error || 'Failed to create task', 'error');
      }
    }
  };

  const handleDeleteWithToast = async (id) => {
    const result = await handleDelete(id);
    if (result?.success) toast('Task deleted', 'info');
  };

  const handleSearch = (e) => {
    handleFilterChange('search', e.target.value);
  };

  const highPriorityTask =
    tasks.find((t) => t.priority === 'high' && t.status !== 'done') || tasks[0];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 px-8 flex items-center justify-between border-b border-transparent bg-gray-50 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Good morning, {user?.name?.split(' ')[0] || 'Ram'} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={filter.search}
                onChange={handleSearch}
                className="w-64 pl-9 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-sans font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded">
                  ⌘
                </kbd>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-sans font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded">
                  K
                </kbd>
              </div>
            </div>

            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-600 border-2 border-gray-50 rounded-full"></span>
            </button>

            <Button
              onClick={handleOpenCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2.5 shadow-sm text-sm font-medium"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New task
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 pt-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-11 gap-4 mb-8">
                <div className="col-span-1 md:col-span-3 lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red-500">🎯</span>
                      <h3 className="font-bold text-gray-900">Today's focus</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      You have {stats.todo + stats.inProgress} tasks due today.
                    </p>

                    {highPriorityTask && (
                      <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:bg-red-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {highPriorityTask.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1 text-red-600 font-medium">
                                ∧ High priority
                              </span>
                              <span className="flex items-center gap-1">
                                📅 Due{' '}
                                {highPriorityTask.dueDate
                                  ? new Date(
                                      highPriorityTask.dueDate,
                                    ).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })
                                  : 'today'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
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
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-900 mb-2">
                      <span>Daily progress</span>
                      <span>
                        {stats.total > 0
                          ? Math.round((stats.done / stats.total) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{
                          width: `${stats.total > 0 ? (stats.done / stats.total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3 lg:col-span-7 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    label="Total tasks"
                    value={stats.total}
                    color="indigo"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    }
                  />
                  <StatCard
                    label="In progress"
                    value={stats.inProgress}
                    color="blue"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    }
                  />
                  <StatCard
                    label="Completed"
                    value={stats.done}
                    color="green"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                  />
                  <StatCard
                    label="Overdue"
                    value={
                      tasks.filter(
                        (t) =>
                          t.status !== 'done' &&
                          t.dueDate &&
                          new Date(t.dueDate) < new Date(),
                      ).length
                    }
                    color="red"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>

              <TaskFilters
                filter={filter}
                onFilterChange={handleFilterChange}
                taskCount={tasks.length}
              />

              <TaskList
                tasks={tasks}
                onStatusChange={handleStatusChange}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteWithToast}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit task' : 'New task'}
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}
