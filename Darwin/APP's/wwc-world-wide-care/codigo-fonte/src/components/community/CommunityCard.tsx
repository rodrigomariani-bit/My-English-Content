import { BadgeCheck, MapPin, ShieldQuestion, Users } from 'lucide-react'
import type { Community } from '../../types'
import { NEEDS } from '../../data/communities'
import { href } from '../../lib/router'
import { CareHandsBadge } from '../brand/CareHandsIcon'
import { ProgressBar } from '../ui/Primitives'
import { cx, fmt } from '../../lib/utils'

export function VerifiedTag({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="tag bg-leaf-soft text-brand" title="Comunidade verificada por parceiros">
      <BadgeCheck size={13} /> Verificada
    </span>
  ) : (
    <span className="tag bg-coin-soft text-[color-mix(in_srgb,var(--coin)_55%,var(--ink))]" title="Aguardando verificação">
      <ShieldQuestion size={13} /> Em verificação
    </span>
  )
}

export function CommunityCard({ c, selected = false, onHover }: { c: Community; selected?: boolean; onHover?: (id: string | null) => void }) {
  return (
    <a
      href={href.comunidade(c.id)}
      onMouseEnter={() => onHover?.(c.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(c.id)}
      className={cx(
        'card group flex flex-col gap-3 p-5 transition-[box-shadow,transform,border-color] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]',
        selected && 'border-coin ring-2 ring-coin/50',
      )}
    >
      <div className="flex items-start gap-3">
        <CareHandsBadge size={52} animated={false} />
        <div className="min-w-0 flex-1">
          <h3 className="text-[1.05rem] leading-snug font-bold text-ink group-hover:text-brand">{c.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-soft">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">
              {c.city}, {c.country}
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <VerifiedTag verified={c.verified} />
        {c.example && <span className="tag">Exemplo</span>}
        {c.createdBy === 'user' && <span className="tag bg-sky text-ocean">Cadastrada por você</span>}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {c.needs.map((n) => {
          const need = NEEDS[n]
          const Icon = need.icon
          return (
            <span key={n} className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-xs font-medium text-ink-soft">
              <Icon size={12} /> {need.label}
            </span>
          )
        })}
      </div>
      <div className="mt-auto space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <Users size={13} /> <span className="num">{fmt(c.participants)}</span> pessoas
          </span>
          <span className="num">
            {fmt(c.supporters)}/{fmt(c.goal)} apoios
          </span>
        </div>
        <ProgressBar value={c.supporters / c.goal} tone="var(--coin)" label="Meta de apoios" />
      </div>
    </a>
  )
}
