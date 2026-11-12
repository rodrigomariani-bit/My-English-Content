import { useState } from 'react'
import type { Activity } from '../../types'
import { pointsByDay } from '../../lib/progress'
import { cx, fmt } from '../../lib/utils'

const WEEKDAY = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
const FULL = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })

function niceMax(v: number) {
  if (v <= 20) return 20
  const steps = [25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000]
  return steps.find((s) => s >= v) ?? Math.ceil(v / 500) * 500
}

/** Pontos ganhos por dia nos últimos 7 dias (série única, barras). */
export function WeeklyChart({ activities }: { activities: Activity[] }) {
  const data = pointsByDay(activities, 7)
  const max = niceMax(Math.max(...data.map((d) => d.points)))
  const total = data.reduce((n, d) => n + d.points, 0)
  const best = data.reduce((a, b) => (b.points > a.points ? b : a), data[0])
  const [hover, setHover] = useState<number | null>(null)
  const ticks = [max, max / 2, 0]

  return (
    <figure className="card flex flex-col p-5 sm:p-6">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="font-display text-[1.15rem] font-bold text-ink">Pontos nos últimos 7 dias</span>
        <span className="num text-sm font-semibold text-ink-soft">{fmt(total)} pts</span>
      </figcaption>

      <div className="relative mt-5 grid grid-cols-[2rem_1fr] gap-2">
        <div className="relative h-40 text-right text-[0.7rem] text-ink-faint" aria-hidden="true">
          {ticks.map((t, i) => (
            <span key={t} className="num absolute right-0 -translate-y-1/2" style={{ top: `${(i / (ticks.length - 1)) * 100}%` }}>
              {fmt(t)}
            </span>
          ))}
        </div>
        <div className="relative h-40">
          {ticks.map((t, i) => (
            <span key={t} className="absolute inset-x-0 border-t border-line" style={{ top: `${(i / (ticks.length - 1)) * 100}%` }} aria-hidden="true" />
          ))}
          <div className="absolute inset-0 flex items-end gap-[2px] px-1">
            {data.map((d, i) => {
              const isToday = i === data.length - 1
              const label = d.points > 0 && (isToday || d.key === best.key)
              return (
                <button
                  key={d.key}
                  type="button"
                  className="group relative flex h-full flex-1 items-end justify-center focus:outline-none"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`${FULL.format(d.date)}: ${d.points} pontos`}
                >
                  {label && hover === null && (
                    <span className="num absolute text-[0.72rem] font-bold text-ink" style={{ bottom: `calc(${(d.points / max) * 100}% + 4px)` }}>
                      {d.points}
                    </span>
                  )}
                  <span
                    className={cx(
                      'w-full max-w-7 rounded-t-[4px] transition-[height,background-color] duration-500',
                      isToday ? 'bg-brand' : 'bg-leaf/70',
                      hover === i && 'bg-brand-strong',
                      'group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ocean',
                    )}
                    style={{ height: d.points > 0 ? `max(3px, ${(d.points / max) * 100}%)` : '0px' }}
                  />
                </button>
              )
            })}
          </div>
          {hover !== null && (
            <div
              className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-line bg-surface px-3 py-1.5 text-xs whitespace-nowrap shadow-[var(--shadow-lift)]"
              style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}
            >
              <span className="block font-semibold text-ink capitalize">{FULL.format(data[hover].date)}</span>
              <span className="num text-ink-soft">{data[hover].points} pontos</span>
            </div>
          )}
        </div>
        <span />
        <div className="flex gap-[2px] px-1 text-center text-[0.72rem] font-semibold text-ink-faint" aria-hidden="true">
          {data.map((d, i) => (
            <span key={d.key} className={cx('flex-1 capitalize', i === data.length - 1 && 'text-ink')}>
              {i === data.length - 1 ? 'Hoje' : WEEKDAY.format(d.date).replace('.', '')}
            </span>
          ))}
        </div>
      </div>
    </figure>
  )
}
