import { Trash } from 'lucide-react'
import type { Bin } from '../../data/recycling'

/** Lixeira na cor oficial do material. */
export function BinSwatch({ bin, size = 44 }: { bin: Pick<Bin, 'color' | 'ink' | 'colorName'>; size?: number }) {
  return (
    <span
      className="inline-grid shrink-0 place-items-center rounded-2xl ring-1 ring-black/10"
      style={{ width: size, height: size, background: bin.color, color: bin.ink }}
      aria-hidden="true"
    >
      <Trash size={size * 0.5} strokeWidth={2.2} />
    </span>
  )
}

/** Cor de texto legível derivada da cor da lixeira, nos dois temas. */
export const binText = (color: string) => `color-mix(in srgb, ${color} 62%, var(--ink))`
