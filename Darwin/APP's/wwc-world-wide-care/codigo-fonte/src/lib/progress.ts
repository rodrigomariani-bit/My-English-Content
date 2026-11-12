import type { Activity, Challenge, Impact } from '../types'
import { dayKey, daysBetween } from './utils'

export interface Level {
  n: number
  name: string
  min: number
}

export const LEVELS: Level[] = [
  { n: 1, name: 'Semente', min: 0 },
  { n: 2, name: 'Broto', min: 100 },
  { n: 3, name: 'Muda', min: 300 },
  { n: 4, name: 'Árvore', min: 700 },
  { n: 5, name: 'Floresta', min: 1400 },
  { n: 6, name: 'Guardião do Planeta', min: 2500 },
]

export function levelFor(points: number) {
  let current = LEVELS[0]
  for (const l of LEVELS) if (points >= l.min) current = l
  const next = LEVELS.find((l) => l.min > points) ?? null
  const progress = next ? (points - current.min) / (next.min - current.min) : 1
  return { current, next, progress, toNext: next ? next.min - points : 0 }
}

export interface ChallengeRecord {
  activeSince?: string
  completions: string[]
}

export type ChallengeStatus = 'available' | 'active' | 'cooldown' | 'done'

export function challengeStatus(ch: Challenge, rec: ChallengeRecord | undefined, now = new Date()) {
  const completions = rec?.completions ?? []
  const last = completions.length ? new Date(completions[completions.length - 1]) : null
  let status: ChallengeStatus = rec?.activeSince ? 'active' : 'available'
  let availableIn = 0
  if (last) {
    if (ch.frequency === 'once') status = 'done'
    else if (ch.frequency === 'daily' && dayKey(last) === dayKey(now)) {
      status = 'cooldown'
      availableIn = 1
    } else if (ch.frequency === 'weekly') {
      const d = daysBetween(last, now)
      if (d < 7) {
        status = 'cooldown'
        availableIn = 7 - d
      }
    }
  }
  return { status, availableIn, times: completions.length }
}

export function sumImpact(challenges: Challenge[], records: Record<string, ChallengeRecord>): Required<Impact> {
  const total: Required<Impact> = { waterL: 0, co2Kg: 0, plastic: 0, wasteKg: 0, trees: 0, kwh: 0 }
  for (const ch of challenges) {
    const times = records[ch.id]?.completions.length ?? 0
    if (!times) continue
    for (const k of Object.keys(total) as (keyof Impact)[]) total[k] += (ch.impact[k] ?? 0) * times
  }
  return total
}

/** Dias seguidos com pelo menos uma atividade, terminando hoje ou ontem. */
export function streakDays(activities: Activity[], now = new Date()): number {
  const days = new Set(activities.map((a) => dayKey(new Date(a.at))))
  let streak = 0
  const cursor = new Date(now)
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  while (days.has(dayKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

/** Pontos por dia nos últimos `n` dias (mais antigo primeiro). */
export function pointsByDay(activities: Activity[], n = 7, now = new Date()) {
  const out: { key: string; date: Date; points: number }[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    out.push({ key: dayKey(d), date: d, points: 0 })
  }
  const idx = new Map(out.map((o, i) => [o.key, i]))
  for (const a of activities) {
    const i = idx.get(dayKey(new Date(a.at)))
    if (i !== undefined) out[i].points += a.points
  }
  return out
}
