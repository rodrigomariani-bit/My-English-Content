import { useMemo, useState } from 'react'
import { Plug } from 'lucide-react'
import { fmt, fmt1, fmtMoney } from '../../lib/utils'

interface Appliance {
  id: string
  name: string
  watts: number
  hours: number
}

const DEFAULTS: Appliance[] = [
  { id: 'chuveiro', name: 'Chuveiro elétrico', watts: 5500, hours: 0.7 },
  { id: 'ar', name: 'Ar-condicionado', watts: 1000, hours: 3 },
  { id: 'geladeira', name: 'Geladeira', watts: 62, hours: 24 },
  { id: 'tv', name: 'TV LED', watts: 90, hours: 4 },
  { id: 'pc', name: 'Computador', watts: 150, hours: 4 },
  { id: 'lampadas', name: 'Lâmpadas LED (5 un.)', watts: 45, hours: 6 },
  { id: 'lavar', name: 'Máquina de lavar', watts: 500, hours: 0.5 },
  { id: 'ferro', name: 'Ferro de passar', watts: 1000, hours: 0.3 },
]

const FACTORS = [
  { id: 'br', label: 'Matriz brasileira (~0,05 kg/kWh)', k: 0.05 },
  { id: 'mundo', label: 'Média mundial (~0,48 kg/kWh)', k: 0.48 },
]

/** Estima consumo mensal (kWh), custo e emissões dos aparelhos da casa. */
export function EnergyCalculator() {
  const [items, setItems] = useState(DEFAULTS)
  const [tariff, setTariff] = useState(0.85)
  const [factor, setFactor] = useState('br')
  const k = FACTORS.find((f) => f.id === factor)!.k

  const rows = useMemo(() => items.map((a) => ({ ...a, kwh: (a.watts * a.hours * 30) / 1000 })), [items])
  const total = rows.reduce((s, r) => s + r.kwh, 0)
  const top = rows.reduce((a, b) => (b.kwh > a.kwh ? b : a), rows[0])
  const max = Math.max(...rows.map((r) => r.kwh), 1)

  const setHours = (id: string, hours: number) => setItems((list) => list.map((a) => (a.id === id ? { ...a, hours } : a)))

  return (
    <section className="card flex flex-col p-5 sm:p-6" aria-labelledby="energy-calc">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-coin-soft text-coin">
          <Plug size={22} />
        </span>
        <div>
          <h3 id="energy-calc" className="text-[1.15rem] font-bold text-ink">
            Calculadora de energia
          </h3>
          <p className="text-sm text-ink-soft">Ajuste as horas de uso por dia de cada aparelho.</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {rows.map((r) => (
          <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-x-3 gap-y-1">
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="truncate font-semibold text-ink">{r.name}</span>
                <span className="num shrink-0 text-xs text-ink-faint">{fmt1(r.kwh)} kWh</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-coin transition-[width] duration-300" style={{ width: `${(r.kwh / max) * 100}%` }} />
              </div>
            </div>
            <label className="flex items-center gap-1 text-xs text-ink-faint">
              <span className="sr-only">Horas por dia de {r.name}</span>
              <input
                type="number"
                min={0}
                max={24}
                step={0.1}
                value={r.hours}
                onChange={(e) => setHours(r.id, Math.max(0, Math.min(24, +e.target.value || 0)))}
                className="input num min-h-9 rounded-xl px-2 py-1 text-right text-sm"
              />
              h
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="ec-tariff" className="field-label">
            Tarifa (R$/kWh)
          </label>
          <input id="ec-tariff" type="number" min={0} step={0.01} className="input num" value={tariff} onChange={(e) => setTariff(Math.max(0, +e.target.value || 0))} />
        </div>
        <div>
          <label htmlFor="ec-factor" className="field-label">
            Fator de emissão
          </label>
          <select id="ec-factor" className="input" value={factor} onChange={(e) => setFactor(e.target.value)}>
            {FACTORS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-surface-2 p-3">
          <dt className="text-xs font-semibold text-ink-soft">Consumo</dt>
          <dd className="num mt-1 font-display text-[1.2rem] leading-none font-bold text-ink">{fmt(total)}</dd>
          <dd className="text-xs text-ink-faint">kWh/mês</dd>
        </div>
        <div className="rounded-2xl bg-coin-soft p-3">
          <dt className="text-xs font-semibold text-ink-soft">Custo</dt>
          <dd className="num mt-1 font-display text-[1.2rem] leading-none font-bold text-ink">{fmtMoney(total * tariff, 'BRL')}</dd>
          <dd className="text-xs text-ink-faint">por mês</dd>
        </div>
        <div className="rounded-2xl bg-surface-2 p-3">
          <dt className="text-xs font-semibold text-ink-soft">Emissões</dt>
          <dd className="num mt-1 font-display text-[1.2rem] leading-none font-bold text-ink">{fmt1(total * k)}</dd>
          <dd className="text-xs text-ink-faint">kg CO₂/mês</dd>
        </div>
      </dl>
      {top && top.kwh > 0 && (
        <p className="mt-3 text-sm text-ink-soft">
          Maior gasto: <b className="text-ink">{top.name}</b> ({Math.round((top.kwh / total) * 100)}% do total). Reduzir 30 minutos por dia economiza{' '}
          <b className="num text-ink">{fmtMoney(((top.watts * Math.min(0.5, top.hours) * 30) / 1000) * tariff, 'BRL')}</b> por mês.
        </p>
      )}
      <p className="mt-2 text-xs text-ink-faint">Valores estimados. Potências médias de referência; confira a etiqueta do seu aparelho.</p>
    </section>
  )
}
