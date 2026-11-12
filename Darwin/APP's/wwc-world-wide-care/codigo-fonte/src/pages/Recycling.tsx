import { useState } from 'react'
import { motion } from 'motion/react'
import { AlertTriangle, ChevronDown, Recycle, Check, X } from 'lucide-react'
import { PageHeader, SectionHeader } from '../components/ui/Primitives'
import { WasteSearch } from '../components/recycling/WasteSearch'
import { SortingQuiz } from '../components/recycling/SortingQuiz'
import { BinSwatch, binText } from '../components/recycling/BinSwatch'
import { BINS, OTHER_COLORS, RESIN_CODES, SEPARATION_STEPS, SPECIAL_DISPOSAL, type Bin } from '../data/recycling'
import { cx } from '../lib/utils'

function BinCard({ bin }: { bin: Bin }) {
  const [open, setOpen] = useState(false)
  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="h-2" style={{ background: bin.color }} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <BinSwatch bin={bin} />
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-wider uppercase" style={{ color: binText(bin.color) }}>
              {bin.colorName}
            </p>
            <h3 className="text-[1.05rem] leading-tight font-bold text-ink">{bin.name}</h3>
          </div>
        </div>
        <ul className="space-y-1 text-sm text-ink-soft">
          {bin.goes.slice(0, open ? undefined : 3).map((g) => (
            <li key={g} className="flex gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-leaf" /> {g}
            </li>
          ))}
        </ul>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
            <div>
              <p className="mb-1 text-xs font-bold tracking-wider text-ink-faint uppercase">Não vai aqui</p>
              <ul className="space-y-1 text-sm text-ink-soft">
                {bin.notGoes.map((g) => (
                  <li key={g} className="flex gap-2">
                    <X size={16} className="mt-0.5 shrink-0 text-danger" /> {g}
                  </li>
                ))}
              </ul>
            </div>
            <p className="rounded-xl bg-surface-2 p-3 text-sm text-ink">{bin.tip}</p>
          </motion.div>
        )}
        <button type="button" className="btn btn-ghost btn-sm mt-auto self-start px-2" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? 'Mostrar menos' : 'O que vai e o que não vai'}
          <ChevronDown size={16} className={cx('transition-transform', open && 'rotate-180')} />
        </button>
      </div>
    </article>
  )
}

export function RecyclingPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        icon={Recycle}
        eyebrow="Área de reciclagem"
        title="Separe certo, recicle mais"
        description="No Brasil, as cores da coleta seletiva seguem a Resolução CONAMA nº 275/2001. Aprenda a identificar cada material e o destino correto de cada resíduo."
      />

      <div className="grid items-start gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <WasteSearch />
        <section className="card p-5 sm:p-6" aria-labelledby="steps-title">
          <h2 id="steps-title" className="font-display text-[1.25rem] font-bold text-ink">
            Como separar o lixo em 5 passos
          </h2>
          <ol className="mt-4 space-y-3">
            {SEPARATION_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span className="num grid size-8 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-brand-ink">{i + 1}</span>
                <div>
                  <p className="font-semibold text-ink">{s.title}</p>
                  <p className="text-sm text-ink-soft">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section aria-labelledby="bins-title">
        <SectionHeader id="bins-title" title="Tipos de materiais e suas lixeiras" description="Toque em cada lixeira para ver o que pode e o que não pode ser descartado nela." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BINS.map((b) => (
            <BinCard key={b.key} bin={b} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink-soft">
          <span className="font-semibold text-ink">Outras cores do padrão:</span>
          {OTHER_COLORS.map((o) => (
            <span key={o.name} className="inline-flex items-center gap-2">
              <span className="size-4 rounded-md ring-1 ring-black/15" style={{ background: o.color }} />
              {o.colorName} · {o.name}
            </span>
          ))}
        </div>
      </section>

      <SortingQuiz />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-5 sm:p-6" aria-labelledby="resin-title">
          <h2 id="resin-title" className="font-display text-[1.25rem] font-bold text-ink">
            Os números dos plásticos
          </h2>
          <p className="mt-0.5 text-sm text-ink-soft">O triângulo com um número no fundo da embalagem indica o tipo de plástico (norma ABNT NBR 13230).</p>
          <ul className="mt-4 divide-y divide-line">
            {RESIN_CODES.map((r) => (
              <li key={r.code} className="flex items-center gap-3 py-2.5">
                <svg viewBox="0 0 40 40" className="size-10 shrink-0 text-brand" aria-hidden="true">
                  <path d="M20 5.5 35 32H5z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                  <text x="20" y="28" textAnchor="middle" className="font-display" fontSize="13" fontWeight="800" fill="currentColor">
                    {r.code}
                  </text>
                </svg>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {r.abbr} <span className="font-normal text-ink-faint">· {r.name}</span>
                  </p>
                  <p className="text-sm text-ink-soft">{r.examples}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5 sm:p-6" aria-labelledby="special-title">
          <h2 id="special-title" className="flex items-center gap-2 font-display text-[1.25rem] font-bold text-ink">
            <AlertTriangle size={20} className="text-[#ef7d1a]" /> Descarte especial
          </h2>
          <p className="mt-0.5 text-sm text-ink-soft">Estes resíduos nunca vão para o lixo comum. A loja ou o fabricante deve recebê-los de volta (logística reversa).</p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {SPECIAL_DISPOSAL.map((s) => (
              <li key={s.title} className="rounded-2xl border border-line p-3.5">
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="mt-1 text-sm text-ink-soft">{s.where}</p>
                <p className="mt-1 text-xs font-medium text-ink-faint">{s.why}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
