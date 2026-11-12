import type { StateStorage } from 'zustand/middleware'

/**
 * localStorage protegido: em janelas anônimas ou com armazenamento bloqueado
 * o acesso pode falhar — o app continua funcionando, só não salva.
 */
export const safeStorage: StateStorage = {
  getItem: (key) => {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      /* armazenamento indisponível ou cheio */
    }
  },
  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* ignorado */
    }
  },
}
