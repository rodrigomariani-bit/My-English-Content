import type { Category } from '../types'
import { Droplets, Zap, Recycle, ShoppingBag, Salad, Bike, TreePine, HeartHandshake, type LucideIcon } from 'lucide-react'

export const CATEGORIES: Record<Category, { label: string; icon: LucideIcon; tone: string }> = {
  agua: { label: 'Água', icon: Droplets, tone: 'var(--ocean)' },
  energia: { label: 'Energia', icon: Zap, tone: 'var(--coin)' },
  residuos: { label: 'Resíduos', icon: Recycle, tone: 'var(--brand)' },
  consumo: { label: 'Consumo consciente', icon: ShoppingBag, tone: '#9a6b2f' },
  alimentacao: { label: 'Alimentação', icon: Salad, tone: 'var(--leaf)' },
  mobilidade: { label: 'Mobilidade', icon: Bike, tone: '#5b6fd6' },
  natureza: { label: 'Natureza', icon: TreePine, tone: 'var(--brand)' },
  comunidade: { label: 'Comunidade', icon: HeartHandshake, tone: '#d0566c' },
}
