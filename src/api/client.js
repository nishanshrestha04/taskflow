import axios from 'axios'
import { getTokenFromStorage, isTokenValid, removeTokenFromStorage } from '../utils/jwt'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── REQUEST INTERCEPTOR ─────────────────────────────────────────────────────
// Automatically attaches JWT token to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    const token = getTokenFromStorage()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Log outgoing requests in dev mode
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '')
    }
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────────────────────
// Handles 401 Unauthorized globally (expired/invalid token)
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status}`, response.data)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      removeTokenFromStorage()
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }

    if (error.response?.status === 403) {
      console.error('[API] Forbidden — insufficient permissions')
    }

    if (error.response?.status >= 500) {
      console.error('[API] Server error', error.response.data)
    }

    // Normalize error message for UI consumption
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'

    return Promise.reject(new Error(message))
  }
)

// ─── MOCK API HANDLERS ───────────────────────────────────────────────────────
// These simulate server responses since we don't have a real backend

import { USERS, INITIAL_TASKS } from './mockData'
import { createToken, isTokenValid as validateToken } from '../utils/jwt'

// In-memory task store (persisted to localStorage)
function getStoredTasks() {
  try {
    const stored = localStorage.getItem('taskflow_tasks')
    return stored ? JSON.parse(stored) : INITIAL_TASKS
  } catch {
    return INITIAL_TASKS
  }
}

function saveTasks(tasks) {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks))
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const authAPI = {
  login: async (email, password) => {
    await delay(800) // Simulate network latency
    const user = USERS.find((u) => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Invalid email or password')
    }
    const token = createToken({ userId: user.id, email: user.email, name: user.name })
    return { token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar } }
  },

  logout: async () => {
    await delay(300)
    return { success: true }
  },

  getProfile: async () => {
    await delay(400)
    const token = getTokenFromStorage()
    if (!token || !validateToken(token)) {
      throw new Error('Unauthorized')
    }
    return { success: true }
  },
}

export const tasksAPI = {
  getAll: async () => {
    await delay(600)
    return getStoredTasks()
  },

  create: async (taskData) => {
    await delay(500)
    const tasks = getStoredTasks()
    const newTask = {
      ...taskData,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    const updated = [newTask, ...tasks]
    saveTasks(updated)
    return newTask
  },

  update: async (id, updates) => {
    await delay(400)
    const tasks = getStoredTasks()
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))
    saveTasks(updated)
    return updated.find((t) => t.id === id)
  },

  delete: async (id) => {
    await delay(400)
    const tasks = getStoredTasks()
    const updated = tasks.filter((t) => t.id !== id)
    saveTasks(updated)
    return { success: true }
  },
}

export default apiClient
