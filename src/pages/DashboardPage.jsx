import { useState, useCallback } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'
import TaskFilters from '../components/tasks/TaskFilters'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import useTaskStore from '../store/taskStore'
import { toast } from '../components/ui/Toast'

function StatCard({ label, value, color = 'gray', icon }) {
  const colors = {
    gray: 'bg-gray-50 text-gray-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    indigo: 'bg-indigo-50 text-indigo-700',
  }
  return (
    <div className={`rounded-xl p-4 flex items-center gap-3 ${colors[color]}`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs mt-0.5 opacity-75">{label}</p>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-40 bg-gray-100 rounded-xl" />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { tasks, stats, isLoading, error, filter, createTask, updateTask, handleStatusChange, handleDelete, handleFilterChange } = useTasks()
  const { isSubmitting } = useTaskStore()
  const { user, logout } = useAuth()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const handleOpenCreate = useCallback(() => {
    setEditingTask(null)
    setIsModalOpen(true)
  }, [])

  const handleOpenEdit = useCallback((task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingTask(null)
  }, [])

  const handleSubmit = async (formData) => {
    if (editingTask) {
      const result = await updateTask(editingTask.id, formData)
      if (result.success) {
        toast('Task updated successfully')
        handleCloseModal()
      } else {
        toast(result.error || 'Failed to update task', 'error')
      }
    } else {
      const result = await createTask(formData)
      if (result.success) {
        toast('Task created!')
        handleCloseModal()
      } else {
        toast(result.error || 'Failed to create task', 'error')
      }
    }
  }

  const handleDeleteWithToast = async (id) => {
    const result = await handleDelete(id)
    if (result?.success) toast('Task deleted', 'info')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-semibold">
                {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm text-gray-700">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Button onClick={handleOpenCreate} size="md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New task</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total" value={stats.total} color="indigo" icon="📋" />
          <StatCard label="In Progress" value={stats.inProgress} color="blue" icon="⚡" />
          <StatCard label="Completed" value={stats.done} color="green" icon="✅" />
          <StatCard label="High Priority" value={stats.highPriority} color="red" icon="🔥" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <TaskFilters filter={filter} onFilterChange={handleFilterChange} taskCount={tasks.length} />
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Task grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-medium text-gray-700">No tasks found</p>
            <p className="text-sm mt-1">Try adjusting your filters or create a new task.</p>
            <Button onClick={handleOpenCreate} variant="secondary" size="sm" className="mt-4">
              Create your first task
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteWithToast}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create / Edit Modal */}
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
  )
}
