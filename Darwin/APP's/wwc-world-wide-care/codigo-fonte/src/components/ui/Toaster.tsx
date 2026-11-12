import { AnimatePresence, motion } from 'motion/react'
import { Award, CheckCircle2, Coins, Info, AlertCircle } from 'lucide-react'
import { useToasts, type ToastTone } from '../../store/toast'

const TONE: Record<ToastTone, { icon: typeof Info; color: string }> = {
  success: { icon: CheckCircle2, color: 'var(--leaf)' },
  info: { icon: Info, color: 'var(--ocean)' },
  coin: { icon: Coins, color: 'var(--coin)' },
  badge: { icon: Award, color: 'var(--coin)' },
  error: { icon: AlertCircle, color: 'var(--danger)' },
}

export function Toaster() {
  const { toasts, dismiss } = useToasts()
  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[90] flex flex-col items-center gap-2 px-4 bottom-[calc(84px+env(safe-area-inset-bottom,0px))] lg:bottom-6 lg:left-[264px]"
      aria-live="polite"
      role="status"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const tone = TONE[t.tone ?? 'success']
          const Icon = tone.icon
          return (
            <motion.button
              type="button"
              key={t.id}
              layout
              onClick={() => dismiss(t.id)}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-left shadow-[var(--shadow-lift)]"
            >
              <Icon size={22} style={{ color: tone.color }} className="shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-ink">{t.title}</span>
                {t.detail && <span className="block truncate text-sm text-ink-soft">{t.detail}</span>}
              </span>
              {t.points ? (
                <span className="num shrink-0 rounded-full bg-leaf-soft px-2.5 py-1 text-sm font-bold text-brand">+{t.points}</span>
              ) : null}
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
