import { useState, useCallback } from 'react';
import { Menu, Search, Bell, Plus, ClipboardList, Zap, CheckCircle2, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskList from '../components/tasks/TaskList';
import TaskCard from '../components/tasks/TaskCard';
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
    allTasks,
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
  const [view, setView] = useState('list');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const highPriorityTask = allTasks.find((t) => t.priority === 'high' && t.status !== 'done');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 px-4 lg:px-8 flex items-center justify-between border-b border-transparent bg-gray-50 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                Good morning, {user?.name?.split(' ')[0]}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 hidden sm:block">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">

            <Button
              onClick={handleOpenCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm text-sm font-medium shrink-0"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New task</span>
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
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
                <div className="col-span-1 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">Today's focus</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      You have {stats.todo + stats.inProgress} tasks due today.
                    </p>

                    {highPriorityTask ? (
                      <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:bg-red-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {highPriorityTask.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1 text-red-600 font-medium">
                                High priority
                              </span>
                              <span className="flex items-center gap-1">
                                Due{' '}
                                {highPriorityTask.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center justify-center">
                        <p className="text-sm text-gray-500 font-medium">
                          No high priority tasks
                        </p>
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

                <div className="col-span-1 xl:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard
                    label="Total tasks"
                    value={stats.total}
                    color="indigo"
                    icon={<ClipboardList className="w-5 h-5" />}
                  />
                  <StatCard
                    label="In progress"
                    value={stats.inProgress}
                    color="blue"
                    icon={<Zap className="w-5 h-5" />}
                  />
                  <StatCard
                    label="Completed"
                    value={stats.done}
                    color="green"
                    icon={<CheckCircle2 className="w-5 h-5" />}
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
                    icon={<Clock className="w-5 h-5" />}
                  />
                </div>
              </div>
              <TaskFilters
                filter={filter}
                onFilterChange={handleFilterChange}
                taskCount={tasks.length}
                view={view}
                onViewChange={setView}
              />
              {view === 'list' ? (
                <TaskList
                  tasks={tasks}
                  onStatusChange={handleStatusChange}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteWithToast}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onEdit={handleOpenEdit}
                        onDelete={handleDeleteWithToast}
                        isSubmitting={isSubmitting}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
                      <p className="font-medium text-gray-700">
                        No tasks found
                      </p>
                    </div>
                  )}
                </div>
              )}
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
