import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Droplets,
  Flame,
  Globe2,
  HandHeart,
  Leaf,
  Lightbulb,
  MessagesSquare,
  Recycle,
  Sparkles,
  Trophy,
  UserRound,
  Wind,
  Package,
  type LucideIcon,
} from 'lucide-react'
import { Globe } from '../components/map/Globe'
import { ChallengeCard } from '../components/challenges/ChallengeCard'
import { TipActions } from '../components/tips/TipCard'
import { SdgBadge, StatTile, SectionHeader } from '../components/ui/Primitives'
import { useAllChallenges, useAppStore, useCommunities } from '../store/useAppStore'
import { TIPS } from '../data/tips'
import { CATEGORIES } from '../data/categories'
import { WWC_SDGS } from '../data/sdgs'
import { challengeStatus, levelFor, streakDays, sumImpact } from '../lib/progress'
import { href, navigate } from '../lib/router'
import { dayIndex, fmt, fmt1, plural } from '../lib/utils'

const FEATURES: { title: string; text: string; href: string; icon: LucideIcon; tone: string }[] = [
  {
    title: 'Reciclagem',
    text: 'Cores das lixeiras, busca “Onde descarto?” e quiz para separar o lixo certo.',
    href: href.reciclagem,
    icon: Recycle,
    tone: 'var(--brand)',
  },
  {
    title: 'Dicas sustentáveis',
    text: 'Uma dica por dia e calculadoras para economizar água e energia.',
    href: href.dicas,
    icon: Lightbulb,
    tone: 'var(--coin)',
  },
  {
    title: 'Desafios ambientais',
    text: 'Aceite desafios, marque como concluídos e suba de nível.',
    href: href.desafios,
    icon: Trophy,
    tone: 'var(--leaf)',
  },
  {
    title: 'Comunidades e doações',
    text: 'Mapa-múndi de comunidades e doação direta, sem taxas.',
    href: href.comunidades,
    icon: HandHeart,
    tone: '#d0566c',
  },
  {
    title: 'Chat internacional',
    text: 'Converse com comunidades de outros países, com tradução.',
    href: href.mural,
    icon: MessagesSquare,
    tone: 'var(--ocean)',
  },
  {
    title: 'Meu perfil',
    text: 'Pontuação, conquistas, impacto e histórico de atividades.',
    href: href.perfil,
    icon: UserRound,
    tone: '#5b6fd6',
  },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function NameForm() {
  const setName = useAppStore((s) => s.setName)
  const [name, setValue] = useState('')
  return (
    <form
      className="mt-6 flex max-w-md flex-col gap-2 rounded-3xl border border-line bg-bg p-3 sm:flex-row sm:items-center"
      onSubmit={(e) => {
        e.preventDefault()
        setName(name)
      }}
    >
      <label htmlFor="home-name" className="sr-only">
        Seu nome
      </label>
      <input
        id="home-name"
        className="input min-h-11 flex-1 border-transparent bg-surface"
        placeholder="Como podemos te chamar?"
        value={name}
        maxLength={40}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
        Criar perfil · +10
      </button>
    </form>
  )
}

export function HomePage() {
  const user = useAppStore((s) => s.user)
  const points = useAppStore((s) => s.points)
  const records = useAppStore((s) => s.challenges)
  const activities = useAppStore((s) => s.activities)
  const donations = useAppStore((s) => s.donations)
  const all = useAllChallenges()
  const communities = useCommunities()

  const level = levelFor(points)
  const completed = Object.values(records).reduce((n, r) => n + r.completions.length, 0)
  const streak = streakDays(activities)
  const impact = sumImpact(all, records)
  const supported = new Set(donations.map((d) => d.communityId)).size
  const tip = TIPS[dayIndex(TIPS.length)]
  const tipCat = CATEGORIES[tip.category]

  const myChallenges = useMemo(() => {
    const active = all.filter((ch) => challengeStatus(ch, records[ch.id]).status === 'active')
    if (active.length) return { title: 'Seus desafios em andamento', list: active.slice(0, 2) }
    const available = all.filter((ch) => challengeStatus(ch, records[ch.id]).status === 'available')
    const i = dayIndex(Math.max(1, available.length - 1))
    return { title: 'Desafios sugeridos para hoje', list: available.slice(i, i + 2) }
  }, [all, records])

  const markers = useMemo(() => communities.map((c) => ({ id: c.id, lat: c.lat, lng: c.lng, label: `${c.name} · ${c.country}` })), [communities])

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {/* Abertura */}
      <section className="card grid overflow-hidden lg:grid-cols-[1.08fr_0.92fr]">
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="eyebrow flex items-center gap-2 text-brand">
            <Leaf size={14} />
            {user.named ? `${greeting()}, ${user.name}!` : 'Bem-vindo(a) ao WWC – World Wide Care'}
          </p>
          <h1 className="mt-3 text-[2.2rem] leading-[1.04] font-extrabold text-ink sm:text-[2.8rem] lg:text-[3.2rem]">
            Pequenas atitudes.
            <br />
            <span className="bg-gradient-to-r from-brand via-leaf to-ocean bg-clip-text text-transparent">Cuidado do tamanho do mundo.</span>
          </h1>
          <p className="mt-4 max-w-[54ch] text-[1.02rem] text-ink-soft">
            O WWC ajuda você a reciclar certo, economizar água e energia, cumprir desafios ambientais e apoiar comunidades de todos os
            continentes com doações diretas, sem taxas.
          </p>
          {!user.named && <NameForm />}
          <div className="mt-6 flex flex-wrap gap-2.5">
            <a href={href.desafios} className="btn btn-primary btn-lg">
              <Trophy size={19} /> Começar um desafio
            </a>
            <a href={href.comunidades} className="btn btn-secondary btn-lg">
              <Globe2 size={19} /> Explorar comunidades
            </a>
          </div>
        </div>
        <div className="relative flex items-center justify-center bg-[radial-gradient(circle_at_50%_45%,var(--sky)_0%,var(--surface-3)_55%,var(--surface)_100%)] px-6 pt-8 pb-5 lg:py-8">
          <div className="w-full max-w-[460px]">
            <Globe markers={markers} onSelect={(id) => navigate(href.comunidade(id))} />
          </div>
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1 text-xs font-bold text-ink shadow-[var(--shadow-soft)]">
            <span className="size-2 rounded-full bg-coin" /> {plural(communities.length, 'comunidade', 'comunidades')} no mapa
          </span>
        </div>
      </section>

      {/* Resumo pessoal */}
      <section aria-label="Seu progresso" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Sparkles} label="Pontuação" value={fmt(points)} hint={`Nível ${level.current.n} · ${level.current.name}`} tone="var(--brand)" />
        <StatTile icon={Trophy} label="Desafios concluídos" value={fmt(completed)} hint="Diários e semanais" tone="var(--leaf)" />
        <StatTile icon={Flame} label="Sequência" value={plural(streak, 'dia', 'dias')} hint="Dias seguidos com atitudes" tone="#e0743a" />
        <StatTile icon={HandHeart} label="Comunidades apoiadas" value={fmt(supported)} hint={`${fmt(donations.length)} doações registradas`} tone="#d0566c" />
      </section>

      {/* Funcionalidades */}
      <section aria-labelledby="home-features">
        <SectionHeader id="home-features" title="O que você pode fazer no WWC" description="Aprenda, aja e conecte-se com quem cuida do planeta em outros países." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <a key={f.title} href={f.href} className="card group flex items-start gap-4 p-5 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
                <span
                  className="grid size-12 shrink-0 place-items-center rounded-2xl transition-transform group-hover:scale-105"
                  style={{ background: `color-mix(in srgb, ${f.tone} 15%, var(--surface))`, color: f.tone }}
                >
                  <Icon size={24} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 font-display text-[1.08rem] font-bold text-ink">
                    {f.title}
                    <ArrowRight size={18} className="shrink-0 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                  </span>
                  <span className="mt-1 block text-sm text-ink-soft">{f.text}</span>
                </span>
              </a>
            )
          })}
        </div>
      </section>

      {/* Dica do dia + desafios */}
      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="card relative flex flex-col overflow-hidden p-6">
          <p className="eyebrow flex items-center gap-2">
            <Lightbulb size={14} /> Dica do dia
          </p>
          <h2 className="mt-2 text-[1.5rem] leading-tight font-bold text-ink">{tip.title}</h2>
          <p className="mt-2 text-ink-soft">{tip.text}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="tag" style={{ color: tipCat.tone }}>
              {tipCat.label}
            </span>
            <SdgBadge n={tip.sdg} withName />
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5">
            <TipActions tip={tip} size="md" />
            <a href={href.dicas} className="btn btn-ghost btn-sm">
              Mais dicas <ArrowRight size={16} />
            </a>
          </div>
        </article>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[1.3rem] font-bold text-ink">{myChallenges.title}</h2>
            <a href={href.desafios} className="btn btn-ghost btn-sm">
              Ver todos <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {myChallenges.list.map((ch) => (
              <ChallengeCard key={ch.id} ch={ch} compact />
            ))}
          </div>
        </div>
      </section>

      {/* Impacto */}
      <section className="overflow-hidden rounded-[1.75rem] bg-brand text-brand-ink" aria-labelledby="home-impact">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-[0.72rem] font-bold tracking-[0.09em] uppercase opacity-80">Seu impacto estimado</p>
            <h2 id="home-impact" className="mt-2 text-[1.6rem] leading-tight font-bold">
              Cada desafio concluído vira resultado real para o planeta.
            </h2>
            <a href={href.perfil} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold underline-offset-4 hover:underline">
              Ver meu histórico <ArrowRight size={16} />
            </a>
          </div>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Droplets, label: 'litros de água', value: fmt(impact.waterL) },
              { icon: Wind, label: 'kg de CO₂ evitados', value: fmt1(impact.co2Kg) },
              { icon: Package, label: 'plásticos a menos', value: fmt(impact.plastic) },
              { icon: Recycle, label: 'kg de resíduos', value: fmt1(impact.wasteKg) },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/12 p-4">
                <s.icon size={20} className="opacity-80" />
                <dd className="num mt-2 font-display text-[1.7rem] leading-none font-bold">{s.value}</dd>
                <dt className="mt-1 text-xs font-semibold opacity-85">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ODS */}
      <section className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-[52ch]">
          <p className="eyebrow">Agenda 2030 da ONU</p>
          <h2 className="mt-1 text-[1.25rem] font-bold text-ink">O WWC contribui com 11 dos 17 Objetivos de Desenvolvimento Sustentável</h2>
          <a href={href.projeto} className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-brand underline-offset-4 hover:underline">
            Conheça o projeto e o pitch <ArrowRight size={16} />
          </a>
        </div>
        <div className="flex max-w-md flex-wrap gap-1.5">
          {WWC_SDGS.map((n) => (
            <SdgBadge key={n} n={n} />
          ))}
        </div>
      </section>
    </div>
  )
}
