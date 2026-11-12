import { useMemo, useState } from 'react'
import { Coins, Gamepad2, HandHeart, Lightbulb, MapPinPlus, MessagesSquare, PencilRuler, Trophy, UserRound, History, type LucideIcon } from 'lucide-react'
import type { Activity, ActivityType } from '../../types'
import { EmptyState } from '../ui/Primitives'
import { fmtTime, relativeDay } from '../../lib/utils'

const TYPE: Record<ActivityType, { label: string; icon: LucideIcon; tone: string }> = {
  challenge: { label: 'Desafios', icon: Trophy, tone: 'var(--leaf)' },
  custom: { label: 'Desafios', icon: PencilRuler, tone: 'var(--ocean)' },
  tip: { label: 'Dicas', icon: Lightbulb, tone: 'var(--coin)' },
  quiz: { label: 'Quiz', icon: Gamepad2, tone: 'var(--brand)' },
  donation: { label: 'Doações', icon: HandHeart, tone: '#d0566c' },
  community: { label: 'Comunidades', icon: MapPinPlus, tone: 'var(--coin)' },
  chat: { label: 'Chat', icon: MessagesSquare, tone: 'var(--ocean)' },
  profile: { label: 'Perfil', icon: UserRound, tone: 'var(--ink-soft)' },
}

const FILTERS: { value: 'all' | ActivityType[]; label: string }[] = [
  { value: 'all', label: 'Tudo' },
  { value: ['challenge', 'custom'], label: 'Desafios' },
  { value: ['tip', 'quiz'], label: 'Aprendizado' },
  { value: ['donation', 'community', 'chat'], label: 'Comunidades' },
]

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  const [filter, setFilter] = useState(0)
  const [limit, setLimit] = useState(12)
  const f = FILTERS[filter].value
  const list = useMemo(() => (f === 'all' ? activities : activities.filter((a) => f.includes(a.type))), [activities, f])

  const groups: { day: string; items: Activity[] }[] = []
  for (const a of list.slice(0, limit)) {
    const day = relativeDay(a.at)
    const g = groups[groups.length - 1]
    if (g && g.day === day) g.items.push(a)
    else groups.push({ day, items: [a] })
  }

  return (
    <div>
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        {FILTERS.map((x, i) => (
          <button key={x.label} type="button" className="chip" aria-pressed={filter === i} onClick={() => setFilter(i)}>
            {x.label}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={History} title="Nenhuma atividade ainda" text="Conclua um desafio, pratique uma dica ou jogue o quiz. Tudo aparece aqui, com data e pontos." />
      ) : (
        <div className="space-y-5">
          {groups.map((g) => (
            <div key={g.day}>
              <p className="eyebrow mb-2">{g.day}</p>
              <ol className="relative space-y-2 border-l-2 border-line pl-5">
                {g.items.map((a) => {
                  const t = TYPE[a.type]
                  const Icon = t.icon
                  return (
                    <li key={a.id} className="relative">
                      <span
                        className="absolute top-3 -left-[31px] grid size-5 place-items-center rounded-full border-2 border-surface"
                        style={{ background: t.tone }}
                        aria-hidden="true"
                      />
                      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${t.tone} 14%, var(--surface))`, color: t.tone }}>
                          <Icon size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">{a.title}</p>
                          <p className="truncate text-xs text-ink-faint">
                            {a.detail ? `${a.detail} · ` : ''}
                            <span className="num">{fmtTime(a.at)}</span>
                          </p>
                        </div>
                        {a.points > 0 && (
                          <span className="num inline-flex shrink-0 items-center gap-1 rounded-full bg-leaf-soft px-2.5 py-1 text-xs font-bold text-brand">
                            <Coins size={12} /> +{a.points}
                          </span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
          {list.length > limit && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLimit(limit + 20)}>
              Mostrar mais ({list.length - limit})
            </button>
          )}
        </div>
      )}
    </div>
  )
}
