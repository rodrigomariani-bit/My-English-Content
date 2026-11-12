import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Check, Copy, type LucideIcon } from 'lucide-react'
import { cx, copyText } from '../../lib/utils'
import { sdg } from '../../data/sdgs'

export function PageHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
  actions,
  tone = 'var(--brand)',
}: {
  icon: LucideIcon
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
  tone?: string
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-2xl md:size-14"
          style={{ background: `color-mix(in srgb, ${tone} 14%, var(--surface))`, color: tone }}
        >
          <Icon size={26} strokeWidth={2.1} />
        </span>
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
          <h1 className="text-[1.85rem] leading-[1.1] font-extrabold text-ink md:text-[2.35rem]">{title}</h1>
          {description && <p className="mt-2 max-w-[62ch] text-ink-soft md:text-[1.02rem]">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2 md:shrink-0">{actions}</div>}
    </header>
  )
}

export function SectionHeader({ title, description, action, id }: { title: string; description?: string; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 id={id} className="text-[1.3rem] font-bold text-ink md:text-[1.45rem]">
          {title}
        </h2>
        {description && <p className="mt-0.5 max-w-[65ch] text-sm text-ink-soft md:text-[0.95rem]">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function ProgressBar({ value, tone = 'var(--leaf)', className, label }: { value: number; tone?: string; className?: string; label?: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div
      className={cx('h-2.5 w-full overflow-hidden rounded-full bg-surface-2', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: tone }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', damping: 26, stiffness: 160 }}
      />
    </div>
  )
}

export function SdgBadge({ n, withName = false }: { n: number; withName?: boolean }) {
  const s = sdg(n)
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.7rem] font-bold leading-none"
      style={{ background: s.color, color: s.darkText ? '#1d1d1b' : '#ffffff' }}
      title={`ODS ${n} · ${s.name}`}
    >
      ODS {n}
      {withName && <span className="font-semibold">· {s.name}</span>}
    </span>
  )
}

export function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'var(--brand)',
}: {
  icon: LucideIcon
  label: string
  value: ReactNode
  hint?: ReactNode
  tone?: string
}) {
  return (
    <div className="card flex items-center gap-3 p-3.5 sm:p-4">
      <span
        className="hidden size-11 shrink-0 place-items-center rounded-2xl min-[400px]:grid"
        style={{ background: `color-mix(in srgb, ${tone} 14%, var(--surface))`, color: tone }}
      >
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="text-[0.78rem] leading-tight font-semibold text-ink-faint">{label}</p>
        <p className="num font-display text-[1.45rem] leading-tight font-bold text-ink">{value}</p>
        {hint && <p className="text-xs leading-snug text-ink-soft">{hint}</p>}
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-surface/60 px-6 py-10 text-center">
      <span className="mb-3 grid size-14 place-items-center rounded-full bg-surface-2 text-brand">
        <Icon size={26} />
      </span>
      <p className="font-display text-lg font-bold text-ink">{title}</p>
      <p className="mt-1 max-w-[42ch] text-sm text-ink-soft">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; count?: number }[]
  label: string
}) {
  return (
    <div role="tablist" aria-label={label} className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-line bg-surface p-1">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cx(
              'relative flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[0.84rem] font-semibold transition-colors sm:px-4 sm:text-sm',
              active ? 'text-brand-ink' : 'text-ink-soft hover:text-ink',
            )}
          >
            {active && (
              <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-full bg-brand" transition={{ type: 'spring', damping: 30, stiffness: 380 }} />
            )}
            <span className="relative">{o.label}</span>
            {o.count !== undefined && (
              <span className={cx('num relative hidden rounded-full px-1.5 text-xs sm:inline', active ? 'bg-white/20' : 'bg-surface-2')}>{o.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function CopyField({ value, label }: { value: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'manual'>('idle')
  const [el, setEl] = useState<HTMLElement | null>(null)
  const onCopy = async () => {
    const ok = await copyText(value)
    if (ok) {
      setState('ok')
    } else if (el) {
      const range = document.createRange()
      range.selectNodeContents(el)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
      setState('manual')
    }
    window.setTimeout(() => setState('idle'), 2400)
  }
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2/60 py-1.5 pr-1.5 pl-3">
      <code ref={setEl} className="min-w-0 flex-1 truncate font-mono text-[0.82rem] text-ink select-all" title={value}>
        {value}
      </code>
      <button type="button" onClick={onCopy} className="btn btn-secondary btn-sm shrink-0" aria-label={`Copiar ${label ?? value}`}>
        {state === 'ok' ? <Check size={16} /> : <Copy size={16} />}
        {state === 'ok' ? 'Copiado' : state === 'manual' ? 'Selecionado' : 'Copiar'}
      </button>
    </div>
  )
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>
      ) : null}
    </div>
  )
}
