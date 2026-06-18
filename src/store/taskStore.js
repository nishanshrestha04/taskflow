import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { tasksAPI } from '../api/client';

const useTaskStore = create(
  devtools(
    (set, get) => ({
      // ─── State ───────────────────────────────────────────
      tasks: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
      filter: {
        status: 'all',
        priority: 'all',
        search: '',
        sortBy: 'newest',
      },

      // ─── Actions ─────────────────────────────────────────
      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
          const tasks = await tasksAPI.getAll();
          set({ tasks, isLoading: false });
        } catch (err) {
          set({ error: err.message, isLoading: false });
        }
      },

      createTask: async (taskData) => {
        set({ isSubmitting: true, error: null });
        try {
          const newTask = await tasksAPI.create(taskData);
          set((state) => ({
            tasks: [newTask, ...state.tasks],
            isSubmitting: false,
          }));
          return { success: true };
        } catch (err) {
          set({ error: err.message, isSubmitting: false });
          return { success: false, error: err.message };
        }
      },

      updateTask: async (id, updates) => {
        set({ isSubmitting: true, error: null });
        try {
          const updated = await tasksAPI.update(id, updates);
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
            isSubmitting: false,
          }));
          return { success: true };
        } catch (err) {
          set({ error: err.message, isSubmitting: false });
          return { success: false, error: err.message };
        }
      },

      deleteTask: async (id) => {
        set({ isSubmitting: true, error: null });
        try {
          await tasksAPI.delete(id);
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
            isSubmitting: false,
          }));
          return { success: true };
        } catch (err) {
          set({ error: err.message, isSubmitting: false });
          return { success: false, error: err.message };
        }
      },

      setFilter: (key, value) =>
        set((state) => ({ filter: { ...state.filter, [key]: value } })),

      clearError: () => set({ error: null }),
    }),
    { name: 'TaskStore' },
  ),
);

export default useTaskStore;
