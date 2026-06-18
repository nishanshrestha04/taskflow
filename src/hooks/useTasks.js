import { useMemo, useCallback, useEffect } from 'react'
import useTaskStore from '../store/taskStore'

export function useTasks() {
  const { tasks, isLoading, error, filter, fetchTasks, setFilter, createTask, updateTask, deleteTask } =
    useTaskStore()

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // ─── useMemo: compute filtered/sorted tasks only when deps change ───────────
  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    if (filter.status !== 'all') {
      result = result.filter((t) => t.status === filter.status)
    }

    if (filter.priority !== 'all') {
      result = result.filter((t) => t.priority === filter.priority)
    }

    if (filter.search.trim()) {
      const q = filter.search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(q))
      )
    }

    return result
  }, [tasks, filter.status, filter.priority, filter.search])

  // ─── useMemo: summary stats for dashboard ───────────────────────────────────
  const stats = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
      highPriority: tasks.filter((t) => t.priority === 'high').length,
    }),
    [tasks]
  )

  // ─── useCallback: stable handler references for child components ─────────────
  const handleStatusChange = useCallback(
    (taskId, newStatus) => updateTask(taskId, { status: newStatus }),
    [updateTask]
  )

  const handleDelete = useCallback(
    (taskId) => deleteTask(taskId),
    [deleteTask]
  )

  const handleFilterChange = useCallback(
    (key, value) => setFilter(key, value),
    [setFilter]
  )

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    stats,
    isLoading,
    error,
    filter,
    createTask,
    updateTask,
    handleStatusChange,
    handleDelete,
    handleFilterChange,
  }
}
