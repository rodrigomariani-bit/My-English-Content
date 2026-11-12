import { create } from 'zustand'
import { uid } from '../lib/utils'

export type ToastTone = 'success' | 'info' | 'coin' | 'badge' | 'error'

export interface Toast {
  id: string
  title: string
  detail?: string
  points?: number
  tone?: ToastTone
}

interface ToastState {
  toasts: Toast[]
  push: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

export const useToasts = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = uid('t')
    set({ toasts: [...get().toasts.slice(-2), { ...t, id }] })
    window.setTimeout(() => get().dismiss(id), 3600)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

export const toast = (t: Omit<Toast, 'id'>) => useToasts.getState().push(t)
