import { Leaf, Sprout, TreePine, Waves, Sun, Mountain, Bird, Flower2, type LucideIcon } from 'lucide-react'
import type { AvatarKey } from '../../store/useAppStore'

export const AVATARS: Record<AvatarKey, { icon: LucideIcon; label: string; from: string; to: string }> = {
  leaf: { icon: Leaf, label: 'Folha', from: '#3fc47f', to: '#11734f' },
  sprout: { icon: Sprout, label: 'Broto', from: '#8bd35d', to: '#2f9e5b' },
  tree: { icon: TreePine, label: 'Árvore', from: '#2fae6d', to: '#0a5239' },
  waves: { icon: Waves, label: 'Oceano', from: '#5cc0ea', to: '#2672ad' },
  sun: { icon: Sun, label: 'Sol', from: '#ffd166', to: '#e59a16' },
  mountain: { icon: Mountain, label: 'Montanha', from: '#7fb4c9', to: '#3d6d84' },
  bird: { icon: Bird, label: 'Pássaro', from: '#66d1c1', to: '#1b8a87' },
  flower: { icon: Flower2, label: 'Flor', from: '#f59fb9', to: '#c4507a' },
}

export function Avatar({ avatar, size = 44 }: { avatar: AvatarKey; size?: number }) {
  const a = AVATARS[avatar] ?? AVATARS.leaf
  const Icon = a.icon
  return (
    <span
      className="inline-grid shrink-0 place-items-center rounded-full text-white"
      style={{ width: size, height: size, background: `linear-gradient(140deg, ${a.from}, ${a.to})` }}
      aria-hidden="true"
    >
      <Icon size={size * 0.5} strokeWidth={2.2} />
    </span>
  )
}
