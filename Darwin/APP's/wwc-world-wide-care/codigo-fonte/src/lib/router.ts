import { useSyncExternalStore } from 'react'

/**
 * Roteador por hash: cada tela tem um endereço simples (#inicio, #desafios…),
 * o que funciona em qualquer hospedagem estática e permite usar <a href="#…">.
 */
export type RouteName =
  | 'inicio'
  | 'reciclagem'
  | 'dicas'
  | 'desafios'
  | 'comunidades'
  | 'comunidade'
  | 'cadastrar'
  | 'editar'
  | 'mural'
  | 'perfil'
  | 'projeto'

export interface Route {
  name: RouteName
  param?: string
}

const SIMPLE: Record<string, RouteName> = {
  inicio: 'inicio',
  reciclagem: 'reciclagem',
  dicas: 'dicas',
  desafios: 'desafios',
  comunidades: 'comunidades',
  'cadastrar-comunidade': 'cadastrar',
  'mural-global': 'mural',
  perfil: 'perfil',
  projeto: 'projeto',
}

export function parseHash(hash: string): Route {
  const h = decodeURIComponent(hash.replace(/^#\/?/, ''))
  if (SIMPLE[h]) return { name: SIMPLE[h] }
  if (h.startsWith('comunidade-')) return { name: 'comunidade', param: h.slice('comunidade-'.length) }
  if (h.startsWith('editar-')) return { name: 'editar', param: h.slice('editar-'.length) }
  return { name: 'inicio' }
}

export const href = {
  inicio: '#inicio',
  reciclagem: '#reciclagem',
  dicas: '#dicas',
  desafios: '#desafios',
  comunidades: '#comunidades',
  cadastrar: '#cadastrar-comunidade',
  mural: '#mural-global',
  perfil: '#perfil',
  projeto: '#projeto',
  comunidade: (id: string) => `#comunidade-${id}`,
  editar: (id: string) => `#editar-${id}`,
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

const getHash = () => window.location.hash

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash, () => '')
  return parseHash(hash)
}

export function navigate(to: string) {
  if (window.location.hash === to) return
  window.location.hash = to
}
