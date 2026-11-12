import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Globe2, MapPinPlus, MessagesSquare, Search, Users, Flag, HandHeart, MapPinned, X } from 'lucide-react'
import { PageHeader, StatTile, SectionHeader, EmptyState } from '../components/ui/Primitives'
import { WorldMap } from '../components/map/WorldMap'
import { CommunityCard } from '../components/community/CommunityCard'
import { CareHandsBadge } from '../components/brand/CareHandsIcon'
import { useAppStore, useCommunities } from '../store/useAppStore'
import { NEEDS, NEED_KEYS } from '../data/communities'
import { href, navigate } from '../lib/router'
import type { NeedKey } from '../types'
import { fmt } from '../lib/utils'

const HOW = [
  { title: 'Encontre', text: 'Explore o mapa e conheça comunidades de todos os continentes.' },
  { title: 'Entenda', text: 'Veja quantas pessoas vivem ali e quais são as principais necessidades.' },
  { title: 'Apoie', text: 'Doe dinheiro, itens ou tempo direto pelos canais oficiais, sem taxas.' },
  { title: 'Converse', text: 'Acompanhe as novidades e troque experiências pelo chat internacional.' },
]

export function CommunitiesPage() {
  const communities = useCommunities()
  const donations = useAppStore((s) => s.donations)
  const [q, setQ] = useState('')
  const [need, setNeed] = useState<NeedKey | null>(null)
  const [hover, setHover] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return communities.filter(
      (c) =>
        (!need || c.needs.includes(need)) &&
        (!term || `${c.name} ${c.city} ${c.country}`.toLowerCase().includes(term)),
    )
  }, [communities, q, need])

  const people = communities.reduce((n, c) => n + c.participants, 0)
  const countries = new Set(communities.map((c) => c.country)).size

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={Globe2}
        eyebrow="Comunidades e doações"
        title="Unidos pelo planeta"
        description="Comunidades de vários países mostram onde estão, o que precisam e como receber ajuda. Você apoia diretamente, sem intermediários."
        tone="var(--ocean)"
        actions={
          <>
            <a href={href.mural} className="btn btn-secondary">
              <MessagesSquare size={18} /> Mural global
            </a>
            <a href={href.cadastrar} className="btn btn-primary">
              <MapPinPlus size={18} /> Cadastrar comunidade
            </a>
          </>
        }
      />

      <section className="flex flex-col gap-5 overflow-hidden rounded-[1.75rem] border border-line bg-[linear-gradient(120deg,var(--surface-3),var(--surface)_60%,var(--coin-soft))] p-5 sm:flex-row sm:items-center sm:p-6">
        <CareHandsBadge size={76} />
        <div className="min-w-0 flex-1">
          <h2 className="text-[1.3rem] font-bold text-ink">Doação direta, do seu bolso para a comunidade</h2>
          <p className="mt-1 max-w-[62ch] text-sm text-ink-soft">
            Cada comunidade tem um perfil especial, marcado pelas mãos que recebem a moeda universal ¤. A doação vai direto pelos canais oficiais dela.
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-2 text-center sm:w-auto">
          {[
            ['0%', 'taxa da plataforma'],
            ['100%', 'para a comunidade'],
            ['0', 'impostos (proposta)'],
          ].map(([v, l]) => (
            <li key={l} className="rounded-2xl bg-surface/80 px-3 py-2.5 shadow-[var(--shadow-soft)]">
              <p className="num font-display text-[1.35rem] leading-none font-extrabold text-brand">{v}</p>
              <p className="mt-1 text-[0.7rem] leading-tight font-semibold text-ink-soft">{l}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={MapPinned} label="Comunidades" value={fmt(communities.length)} tone="var(--coin)" />
        <StatTile icon={Users} label="Pessoas alcançadas" value={fmt(people)} tone="var(--ocean)" />
        <StatTile icon={Flag} label="Países" value={fmt(countries)} tone="var(--leaf)" />
        <StatTile icon={HandHeart} label="Seus apoios" value={fmt(donations.length)} tone="#d0566c" />
      </div>

      <section aria-labelledby="map-title">
        <SectionHeader id="map-title" title="Mapa das comunidades" description="Toque em um marcador para abrir o perfil da comunidade." />
        <WorldMap
          markers={filtered.map((c) => ({ id: c.id, lat: c.lat, lng: c.lng, label: `${c.name} · ${c.city}, ${c.country}`, tone: c.createdBy === 'user' ? 'ocean' : 'coin' }))}
          selectedId={hover}
          onMarkerClick={(id) => navigate(href.comunidade(id))}
        />
      </section>

      <section aria-labelledby="list-title">
        <SectionHeader id="list-title" title="Encontre uma comunidade" />
        <div className="mb-4 flex flex-col gap-3">
          <div className="relative max-w-md">
            <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint" />
            <label htmlFor="community-search" className="sr-only">
              Buscar por nome, cidade ou país
            </label>
            <input id="community-search" className="input pl-11" placeholder="Buscar por nome, cidade ou país" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filtrar por necessidade">
            <button type="button" className="chip" aria-pressed={need === null} onClick={() => setNeed(null)}>
              Todas
            </button>
            {NEED_KEYS.map((k) => {
              const Icon = NEEDS[k].icon
              return (
                <button key={k} type="button" className="chip" aria-pressed={need === k} onClick={() => setNeed(need === k ? null : k)}>
                  <Icon size={15} /> {NEEDS[k].label}
                </button>
              )
            })}
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhuma comunidade encontrada"
            text="Tente outro termo ou remova o filtro de necessidade."
            action={
              <button type="button" className="btn btn-soft" onClick={() => (setQ(''), setNeed(null))}>
                <X size={16} /> Limpar filtros
              </button>
            }
          />
        ) : (
          <motion.div layout className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <CommunityCard key={c.id} c={c} selected={hover === c.id} onHover={setHover} />
            ))}
          </motion.div>
        )}
      </section>

      <section className="card p-5 sm:p-6" aria-labelledby="how-title">
        <h2 id="how-title" className="text-[1.3rem] font-bold text-ink">
          Como funciona a doação direta
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map((s, i) => (
            <li key={s.title} className="rounded-2xl bg-surface-2/70 p-4">
              <span className="num grid size-8 place-items-center rounded-full bg-coin font-display text-sm font-bold text-[#2b1d00]">{i + 1}</span>
              <p className="mt-3 font-display font-bold text-ink">{s.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-ink-soft">
          Representa uma comunidade?{' '}
          <a href={href.cadastrar} className="font-semibold text-brand underline-offset-4 hover:underline">
            Cadastre-a no mapa
          </a>{' '}
          com localização, necessidades e formas de doação.
        </p>
      </section>
    </div>
  )
}
