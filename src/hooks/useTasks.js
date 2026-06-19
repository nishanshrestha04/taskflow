import { useMemo, useCallback, useEffect } from 'react'
import useTaskStore from '../store/taskStore'

export function useTasks() {
  const { tasks, isLoading, error, filter, fetchTasks, setFilter, createTask, updateTask, deleteTask } =
    useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    if (filter.status !== 'all') {
      result = result.filter((t) => t.status === filter.status)
    }

    if (filter.priority !== 'all') {
      result = result.filter((t) => t.priority === filter.priority)
    }

    if (filter.sortBy === 'due_asc') {
      result.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'))
    } else if (filter.sortBy === 'due_desc') {
      result.sort((a, b) => new Date(b.dueDate || '0000-01-01') - new Date(a.dueDate || '0000-01-01'))
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return result
  }, [tasks, filter.status, filter.priority, filter.sortBy])

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
