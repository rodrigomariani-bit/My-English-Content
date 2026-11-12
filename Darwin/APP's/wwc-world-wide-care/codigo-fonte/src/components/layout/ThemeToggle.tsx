import { Monitor, Moon, Sun } from 'lucide-react'
import { useAppStore, type ThemePref } from '../../store/useAppStore'
import { cx } from '../../lib/utils'

const ORDER: ThemePref[] = ['system', 'light', 'dark']
const META: Record<ThemePref, { label: string; icon: typeof Sun }> = {
  system: { label: 'Tema do sistema', icon: Monitor },
  light: { label: 'Tema claro', icon: Sun },
  dark: { label: 'Tema escuro', icon: Moon },
}

export function ThemeToggle({ withLabel = false, className }: { withLabel?: boolean; className?: string }) {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]
  const Icon = META[theme].icon
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={cx('btn btn-ghost', withLabel ? 'btn-sm justify-start' : 'btn-icon btn-sm', className)}
      aria-label={`${META[theme].label}. Trocar para ${META[next].label.toLowerCase()}`}
      title={META[theme].label}
    >
      <Icon size={18} />
      {withLabel && <span>{META[theme].label}</span>}
    </button>
  )
}
