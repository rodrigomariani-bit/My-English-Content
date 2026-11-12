import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BookOpen, ChevronLeft, ChevronRight, Lightbulb, Quote } from 'lucide-react'
import { PageHeader, SdgBadge, SectionHeader } from '../components/ui/Primitives'
import { TipActions, TipCard } from '../components/tips/TipCard'
import { WaterCalculator } from '../components/tips/WaterCalculator'
import { EnergyCalculator } from '../components/tips/EnergyCalculator'
import { FACTS, SUSTAINABILITY_PILLARS, TIPS } from '../data/tips'
import { CATEGORIES } from '../data/categories'
import { SDGS, WWC_SDGS } from '../data/sdgs'
import { useAppStore } from '../store/useAppStore'
import type { Category } from '../types'
import { cx, dayIndex, fmtDate } from '../lib/utils'

type Filter = Category | 'todas' | 'favoritas'

const TIP_CATEGORIES = Array.from(new Set(TIPS.map((t) => t.category)))

export function TipsPage() {
  const favorites = useAppStore((s) => s.favoriteTips)
  const todayIdx = dayIndex(TIPS.length)
  const [offset, setOffset] = useState(0)
  const [filter, setFilter] = useState<Filter>('todas')
  const idx = (todayIdx + offset + TIPS.length) % TIPS.length
  const tip = TIPS[idx]
  const cat = CATEGORIES[tip.category]
  const CatIcon = cat.icon

  const list = useMemo(() => {
    if (filter === 'todas') return TIPS
    if (filter === 'favoritas') return TIPS.filter((t) => favorites.includes(t.id))
    return TIPS.filter((t) => t.category === filter)
  }, [filter, favorites])

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        icon={Lightbulb}
        eyebrow="Dicas sustentáveis"
        title="Um hábito novo por dia"
        description="Dicas práticas para economizar água e energia, consumir com consciência e cuidar da natureza. Marque as que você praticou e ganhe pontos."
        tone="var(--coin)"
      />

      {/* Dica do dia */}
      <section className="card overflow-hidden" aria-labelledby="tip-day">
        <div className="grid md:grid-cols-[0.36fr_0.64fr]">
          <div
            className="relative flex flex-col justify-between gap-6 p-6 text-white"
            style={{ background: `linear-gradient(150deg, color-mix(in srgb, ${cat.tone} 80%, #0b3d2c), #0b3d2c)` }}
          >
            <div>
              <p className="text-[0.72rem] font-bold tracking-[0.09em] uppercase opacity-85">{offset === 0 ? 'Dica de hoje' : 'Outra dica'}</p>
              <p className="mt-1 text-sm opacity-85">{fmtDate(new Date().toISOString(), { weekday: 'long', day: '2-digit', month: 'long' })}</p>
            </div>
            <CatIcon size={64} strokeWidth={1.4} className="opacity-90" />
            <p className="font-semibold">{cat.label}</p>
          </div>
          <div className="flex flex-col p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={tip.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <h2 id="tip-day" className="text-[1.6rem] leading-tight font-bold text-ink sm:text-[1.9rem]">
                  {tip.title}
                </h2>
                <p className="mt-3 max-w-[60ch] text-[1.02rem] text-ink-soft">{tip.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tip.saving && <span className="tag bg-sky text-ocean">Economia: {tip.saving}</span>}
                  <SdgBadge n={tip.sdg} withName />
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
              <TipActions tip={tip} size="md" />
              <div className="flex items-center gap-1">
                <button type="button" className="btn btn-secondary btn-icon btn-sm" onClick={() => setOffset((o) => o - 1)} aria-label="Dica anterior">
                  <ChevronLeft size={18} />
                </button>
                {offset !== 0 && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOffset(0)}>
                    Hoje
                  </button>
                )}
                <button type="button" className="btn btn-secondary btn-icon btn-sm" onClick={() => setOffset((o) => o + 1)} aria-label="Próxima dica">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Todas as dicas */}
      <section aria-labelledby="all-tips">
        <SectionHeader id="all-tips" title="Todas as dicas" description={`${TIPS.length} dicas em ${TIP_CATEGORIES.length} temas. Salve suas favoritas para encontrá-las depois.`} />
        <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {(['todas', ...TIP_CATEGORIES, 'favoritas'] as Filter[]).map((f) => {
            const label = f === 'todas' ? 'Todas' : f === 'favoritas' ? `Favoritas (${favorites.length})` : CATEGORIES[f].label
            const Icon = f !== 'todas' && f !== 'favoritas' ? CATEGORIES[f].icon : null
            return (
              <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {Icon && <Icon size={15} />}
                {label}
              </button>
            )
          })}
        </div>
        {list.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-line p-8 text-center text-ink-soft">
            Você ainda não salvou nenhuma dica. Toque no marcador de uma dica para guardá-la aqui.
          </p>
        ) : (
          <motion.div layout className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <TipCard key={t.id} tip={t} />
            ))}
          </motion.div>
        )}
      </section>

      {/* Calculadoras */}
      <section aria-labelledby="calcs">
        <SectionHeader id="calcs" title="Economize água e energia" description="Simule o consumo da sua casa e descubra onde dá para economizar." />
        <div className="grid gap-4 lg:grid-cols-2">
          <WaterCalculator />
          <EnergyCalculator />
        </div>
      </section>

      {/* Sustentabilidade */}
      <section aria-labelledby="what-is" className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card p-5 sm:p-6">
          <p className="eyebrow flex items-center gap-2">
            <BookOpen size={14} /> Informações sobre sustentabilidade
          </p>
          <h2 id="what-is" className="mt-1 text-[1.35rem] font-bold text-ink">
            O que é sustentabilidade?
          </h2>
          <p className="mt-2 text-ink-soft">
            É atender às necessidades de hoje sem comprometer as gerações futuras. Ela se apoia em três pilares que precisam andar juntos:
          </p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
            {SUSTAINABILITY_PILLARS.map((p) => (
              <div key={p.title} className="rounded-2xl bg-surface-2 p-4">
                <p className="font-display font-bold text-brand">{p.title}</p>
                <p className="mt-1 text-sm text-ink-soft">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <p className="eyebrow">Você sabia?</p>
          <ul className="mt-3 space-y-3">
            {FACTS.map((f) => (
              <li key={f.text} className="flex gap-3">
                <Quote size={18} className="mt-0.5 shrink-0 text-leaf" />
                <p className="text-sm text-ink">
                  {f.text} <span className="text-xs font-semibold text-ink-faint">({f.source})</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ODS */}
      <section aria-labelledby="sdgs">
        <SectionHeader
          id="sdgs"
          title="Os 17 Objetivos de Desenvolvimento Sustentável"
          description="A Agenda 2030 da ONU guia governos, empresas e pessoas. Os objetivos em destaque são os que o WWC ajuda a alcançar."
        />
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {SDGS.map((s) => {
            const ours = WWC_SDGS.includes(s.n)
            return (
              <li
                key={s.n}
                className={cx('flex min-h-[5.5rem] flex-col justify-between rounded-2xl p-3 transition-opacity', !ours && 'opacity-45')}
                style={{ background: s.color, color: s.darkText ? '#1d1d1b' : '#ffffff' }}
              >
                <span className="num font-display text-[1.6rem] leading-none font-extrabold">{s.n}</span>
                <span className="text-[0.78rem] leading-tight font-semibold">{s.name}</span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
