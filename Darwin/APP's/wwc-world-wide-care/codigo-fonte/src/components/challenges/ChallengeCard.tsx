import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, CheckCircle2, Clock3, Flag, Leaf, Trash2, X } from 'lucide-react'
import type { Challenge } from '../../types'
import { CATEGORIES } from '../../data/categories'
import { DIFFICULTY_LABEL, FREQUENCY_LABEL } from '../../data/challenges'
import { challengeStatus } from '../../lib/progress'
import { useAppStore } from '../../store/useAppStore'
import { SdgBadge } from '../ui/Primitives'
import { ConfirmDialog } from '../ui/Modal'
import { cx, fmt, fmt1 } from '../../lib/utils'

export function impactLabels(ch: Challenge): string[] {
  const i = ch.impact
  const out: string[] = []
  if (i.waterL) out.push(`≈ ${fmt(i.waterL)} L de água`)
  if (i.co2Kg) out.push(`≈ ${fmt1(i.co2Kg)} kg de CO₂`)
  if (i.kwh) out.push(`≈ ${fmt1(i.kwh)} kWh`)
  if (i.plastic) out.push(`${fmt(i.plastic)} plásticos a menos`)
  if (i.wasteKg) out.push(`≈ ${fmt1(i.wasteKg)} kg de resíduos`)
  if (i.trees) out.push(`${fmt(i.trees)} muda plantada`)
  return out
}

function Burst() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = (i / 9) * Math.PI * 2
        return (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 text-leaf"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
            animate={{ x: Math.cos(angle) * 46, y: Math.sin(angle) * 34 - 10, opacity: 0, scale: 1.1, rotate: 120 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <Leaf size={14} fill="currentColor" />
          </motion.span>
        )
      })}
    </span>
  )
}

export function ChallengeCard({ ch, compact = false }: { ch: Challenge; compact?: boolean }) {
  const rec = useAppStore((s) => s.challenges[ch.id])
  const start = useAppStore((s) => s.startChallenge)
  const complete = useAppStore((s) => s.completeChallenge)
  const cancel = useAppStore((s) => s.cancelChallenge)
  const remove = useAppStore((s) => s.deleteChallenge)
  const [burst, setBurst] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { status, availableIn, times } = challengeStatus(ch, rec)
  const cat = CATEGORIES[ch.category]
  const Icon = cat.icon
  const impacts = impactLabels(ch)

  const onComplete = () => {
    complete(ch.id)
    setBurst((b) => b + 1)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={cx(
        'card relative flex flex-col gap-3 p-5',
        status === 'active' && 'ring-2 ring-leaf/60',
        (status === 'cooldown' || status === 'done') && 'bg-surface-2/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-2xl"
          style={{ background: `color-mix(in srgb, ${cat.tone} 15%, var(--surface))`, color: cat.tone }}
        >
          <Icon size={22} />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {status === 'active' && (
            <span className="tag bg-leaf-soft text-brand">
              <Flag size={12} /> Em andamento
            </span>
          )}
          <span className="tag">{FREQUENCY_LABEL[ch.frequency]}</span>
          <span className="tag">{DIFFICULTY_LABEL[ch.difficulty]}</span>
          {ch.custom && <span className="tag bg-sky text-ocean">Criado por você</span>}
        </div>
      </div>

      <div>
        <h3 className="text-[1.12rem] leading-snug font-bold text-ink">{ch.title}</h3>
        {!compact && <p className="mt-1 text-sm text-ink-soft">{ch.description}</p>}
      </div>

      {!compact && ch.steps && status === 'active' && (
        <ul className="space-y-1 rounded-2xl bg-surface-2/70 p-3 text-sm text-ink-soft">
          {ch.steps.map((s) => (
            <li key={s} className="flex gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-leaf" />
              {s}
            </li>
          ))}
        </ul>
      )}

      {(impacts.length > 0 || ch.sdgs.length > 0) && !compact && (
        <div className="flex flex-wrap items-center gap-1.5">
          {impacts.map((l) => (
            <span key={l} className="tag bg-sky/70 text-ocean">
              {l}
            </span>
          ))}
          {ch.sdgs.map((n) => (
            <SdgBadge key={n} n={n} />
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
        <span className="num font-display text-lg font-bold text-brand">
          +{ch.points} <span className="text-sm font-semibold text-ink-faint">pts</span>
          {times > 0 && <span className="ml-2 text-xs font-semibold text-ink-faint">· feito {times}×</span>}
        </span>

        <div className="relative flex flex-wrap items-center gap-1.5">
          <AnimatePresence>{burst > 0 && <Burst key={burst} />}</AnimatePresence>
          {status === 'available' && (
            <button type="button" className="btn btn-soft btn-sm" onClick={() => start(ch.id)}>
              <Flag size={16} /> Aceitar desafio
            </button>
          )}
          {status === 'active' && (
            <>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => cancel(ch.id)} aria-label={`Desistir de ${ch.title}`}>
                <X size={16} /> Desistir
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={onComplete}>
                <CheckCircle2 size={16} /> Concluir
              </button>
            </>
          )}
          {status === 'cooldown' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-soft px-3 py-1.5 text-sm font-semibold text-brand">
              <Clock3 size={15} />
              {availableIn <= 1 ? 'Feito! Volta amanhã' : `Feito! Volta em ${availableIn} dias`}
            </span>
          )}
          {status === 'done' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-soft px-3 py-1.5 text-sm font-semibold text-brand">
              <CheckCircle2 size={15} /> Concluído
            </span>
          )}
          {ch.custom && (
            <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => setConfirmDelete(true)} aria-label={`Excluir ${ch.title}`}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => remove(ch.id)}
        title="Excluir desafio?"
        description={`“${ch.title}” será removido da sua lista. Os pontos já ganhos continuam no seu perfil.`}
        confirmLabel="Excluir desafio"
        danger
      />
    </motion.article>
  )
}
