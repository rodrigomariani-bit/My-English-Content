import { useState } from 'react'
import { ShowerHead } from 'lucide-react'
import { fmt } from '../../lib/utils'

const FLOWS = [
  { id: 'eletrico', label: 'Chuveiro elétrico', lpm: 4 },
  { id: 'ducha', label: 'Ducha comum', lpm: 9 },
  { id: 'pressao', label: 'Ducha de alta pressão', lpm: 15 },
]

/** Calcula o consumo mensal de água nos banhos e a economia com banhos de 5 minutos. */
export function WaterCalculator() {
  const [minutes, setMinutes] = useState(12)
  const [flow, setFlow] = useState('ducha')
  const [people, setPeople] = useState(3)
  const lpm = FLOWS.find((f) => f.id === flow)!.lpm
  const monthly = minutes * lpm * people * 30
  const target = Math.min(minutes, 5) * lpm * people * 30
  const saving = monthly - target
  const yearlyTanks = (saving * 12) / 1000

  return (
    <section className="card flex flex-col p-5 sm:p-6" aria-labelledby="water-calc">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-sky text-ocean">
          <ShowerHead size={22} />
        </span>
        <div>
          <h3 id="water-calc" className="text-[1.15rem] font-bold text-ink">
            Calculadora de água no banho
          </h3>
          <p className="text-sm text-ink-soft">Quanto sua casa gasta e quanto pode economizar.</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="wc-min" className="field-label flex justify-between">
            Minutos por banho <span className="num text-ocean">{minutes} min</span>
          </label>
          <input id="wc-min" type="range" min={2} max={30} value={minutes} onChange={(e) => setMinutes(+e.target.value)} className="w-full accent-[var(--ocean)]" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="wc-flow" className="field-label">
              Tipo de chuveiro
            </label>
            <select id="wc-flow" className="input" value={flow} onChange={(e) => setFlow(e.target.value)}>
              {FLOWS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label} (~{f.lpm} L/min)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="wc-people" className="field-label">
              Pessoas na casa
            </label>
            <input id="wc-people" type="number" min={1} max={20} className="input num" value={people} onChange={(e) => setPeople(Math.max(1, Math.min(20, +e.target.value || 1)))} />
          </div>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-surface-2 p-4">
          <dt className="text-xs font-semibold text-ink-soft">Consumo hoje</dt>
          <dd className="num mt-1 font-display text-[1.45rem] leading-none font-bold text-ink">{fmt(monthly)} L</dd>
          <dd className="mt-1 text-xs text-ink-faint">por mês</dd>
        </div>
        <div className="rounded-2xl bg-sky p-4">
          <dt className="text-xs font-semibold text-ocean">Economia com 5 min</dt>
          <dd className="num mt-1 font-display text-[1.45rem] leading-none font-bold text-ink">{fmt(saving)} L</dd>
          <dd className="mt-1 text-xs text-ink-soft">por mês</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-ink-soft">
        {saving > 0 ? (
          <>
            Em um ano, isso daria para encher <b className="num text-ink">{fmt(yearlyTanks)}</b> caixas d’água de 1.000 litros.
          </>
        ) : (
          'Parabéns! Seus banhos já estão dentro da meta de 5 minutos.'
        )}
      </p>
    </section>
  )
}
