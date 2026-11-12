import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  Check,
  Droplets,
  Globe2,
  HandHeart,
  Lock,
  MapPinPlus,
  Package,
  Pencil,
  Recycle,
  Sparkles,
  Sprout,
  Trophy,
  Wind,
  Zap,
  TreePine,
  Database,
  Trash2,
  MapPinned,
} from 'lucide-react'
import { Avatar, AVATARS } from '../components/brand/Avatar'
import { CareHandsBadge } from '../components/brand/CareHandsIcon'
import { ProgressBar, SectionHeader, StatTile, EmptyState, Segmented } from '../components/ui/Primitives'
import { ConfirmDialog } from '../components/ui/Modal'
import { WeeklyChart } from '../components/profile/WeeklyChart'
import { ActivityTimeline } from '../components/profile/ActivityTimeline'
import { useAllChallenges, useAppStore, type AvatarKey, type ThemePref } from '../store/useAppStore'
import { levelFor, streakDays, sumImpact, LEVELS } from '../lib/progress'
import { BADGES, earnedBadges } from '../lib/badges'
import { href } from '../lib/router'
import { cx, fmt, fmt1, fmtDate, fmtMoney, plural } from '../lib/utils'
import type { Donation } from '../types'

function donationLabel(d: Donation) {
  if (d.kind === 'dinheiro' && d.amount) return fmtMoney(d.amount, d.currency ?? 'BRL')
  if (d.kind === 'itens') return d.items ?? 'Itens'
  return `${d.hours ?? 0} h de voluntariado`
}

export function ProfilePage() {
  const s = useAppStore()
  const all = useAllChallenges()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(s.user.name)
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmDemo, setConfirmDemo] = useState(false)

  const level = levelFor(s.points)
  const completed = Object.values(s.challenges).reduce((n, r) => n + r.completions.length, 0)
  const impact = sumImpact(all, s.challenges)
  const streak = streakDays(s.activities)
  const earned = useMemo(
    () =>
      earnedBadges({
        points: s.points,
        challenges: all,
        records: s.challenges,
        quizBest: s.quiz.best,
        donations: s.donations,
        communities: s.communities,
        messages: s.messages,
        activities: s.activities,
        customCount: s.customChallenges.length,
      }),
    [s.points, all, s.challenges, s.quiz.best, s.donations, s.communities, s.messages, s.activities, s.customChallenges.length],
  )

  const saveName = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) s.setName(name)
    setEditing(false)
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Cabeçalho do perfil */}
      <section className="card overflow-hidden">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative self-start">
              <Avatar avatar={s.user.avatar} size={96} />
              <span className="num absolute -right-1 -bottom-1 grid size-9 place-items-center rounded-full border-4 border-surface bg-coin font-display text-sm font-extrabold text-[#2b1d00]">
                {level.current.n}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="eyebrow">Meu perfil</p>
              {editing ? (
                <form onSubmit={saveName} className="mt-1 flex flex-col gap-3">
                  <div className="flex gap-2">
                    <label htmlFor="profile-name" className="sr-only">
                      Seu nome
                    </label>
                    <input id="profile-name" className="input" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} autoFocus />
                    <button type="submit" className="btn btn-primary btn-icon shrink-0" aria-label="Salvar nome">
                      <Check size={18} />
                    </button>
                  </div>
                  <div role="radiogroup" aria-label="Escolha seu avatar" className="flex flex-wrap gap-1.5">
                    {(Object.keys(AVATARS) as AvatarKey[]).map((a) => (
                      <button
                        key={a}
                        type="button"
                        role="radio"
                        aria-checked={s.user.avatar === a}
                        aria-label={AVATARS[a].label}
                        onClick={() => s.setAvatar(a)}
                        className={cx('rounded-full p-0.5 ring-2 transition', s.user.avatar === a ? 'ring-brand' : 'ring-transparent hover:ring-line')}
                      >
                        <Avatar avatar={a} size={36} />
                      </button>
                    ))}
                  </div>
                </form>
              ) : (
                <div className="mt-1 flex items-center gap-2">
                  <h1 className="truncate text-[2rem] leading-tight font-extrabold text-ink">{s.user.named ? s.user.name : 'Visitante'}</h1>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon btn-sm shrink-0"
                    onClick={() => {
                      setName(s.user.name)
                      setEditing(true)
                    }}
                    aria-label="Editar nome e avatar"
                  >
                    <Pencil size={17} />
                  </button>
                </div>
              )}
              <p className="mt-1 text-sm text-ink-soft">
                Nível {level.current.n} · <b className="text-ink">{level.current.name}</b> · no WWC desde {fmtDate(s.user.joinedAt, { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-surface-2/70 p-5">
            <div className="flex items-baseline justify-between gap-2">
              <p className="num font-display text-[2.4rem] leading-none font-extrabold text-brand">
                {fmt(s.points)} <span className="text-base font-bold text-ink-soft">pontos</span>
              </p>
              <Sprout size={26} className="text-leaf" />
            </div>
            <ProgressBar value={level.progress} className="mt-4 h-3" label="Progresso até o próximo nível" />
            <p className="mt-2 text-sm text-ink-soft">
              {level.next ? (
                <>
                  Faltam <b className="num text-ink">{fmt(level.toNext)}</b> pontos para <b className="text-ink">{level.next.name}</b>
                </>
              ) : (
                'Você chegou ao nível máximo. Obrigado por cuidar do planeta!'
              )}
            </p>
            <ol className="mt-4 flex gap-1" aria-label="Níveis">
              {LEVELS.map((l) => (
                <li key={l.n} className="flex-1" title={`${l.name} · ${l.min} pts`}>
                  <span className={cx('block h-1.5 rounded-full', s.points >= l.min ? 'bg-leaf' : 'bg-line')} />
                  <span className={cx('mt-1 hidden truncate text-[0.65rem] font-semibold sm:block', s.points >= l.min ? 'text-ink-soft' : 'text-ink-faint')}>{l.name}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={Trophy} label="Desafios concluídos" value={fmt(completed)} hint={plural(streak, 'dia seguido', 'dias seguidos')} tone="var(--leaf)" />
        <StatTile icon={Sparkles} label="Pontuação" value={fmt(s.points)} hint="Atitudes sustentáveis" tone="var(--brand)" />
        <StatTile icon={HandHeart} label="Doações" value={fmt(s.donations.length)} hint={`${new Set(s.donations.map((d) => d.communityId)).size} comunidades`} tone="#d0566c" />
        <StatTile icon={MapPinned} label="Comunidades cadastradas" value={fmt(s.communities.length)} tone="var(--coin)" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WeeklyChart activities={s.activities} />
        <section className="card p-5 sm:p-6" aria-labelledby="impact-title">
          <h2 id="impact-title" className="font-display text-[1.15rem] font-bold text-ink">
            Meu impacto estimado
          </h2>
          <p className="text-sm text-ink-soft">Somado a partir dos desafios que você concluiu.</p>
          <dl className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {[
              { icon: Droplets, label: 'litros de água', value: fmt(impact.waterL), tone: 'var(--ocean)' },
              { icon: Wind, label: 'kg de CO₂', value: fmt1(impact.co2Kg), tone: 'var(--ink-soft)' },
              { icon: Zap, label: 'kWh de energia', value: fmt1(impact.kwh), tone: 'var(--coin)' },
              { icon: Package, label: 'plásticos a menos', value: fmt(impact.plastic), tone: '#d0566c' },
              { icon: Recycle, label: 'kg de resíduos', value: fmt1(impact.wasteKg), tone: 'var(--brand)' },
              { icon: TreePine, label: 'mudas plantadas', value: fmt(impact.trees), tone: 'var(--leaf)' },
            ].map((x) => (
              <div key={x.label} className="rounded-2xl bg-surface-2/70 p-3.5">
                <x.icon size={18} style={{ color: x.tone }} />
                <dd className="num mt-1.5 font-display text-[1.35rem] leading-none font-bold text-ink">{x.value}</dd>
                <dt className="mt-1 text-xs font-medium text-ink-soft">{x.label}</dt>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Conquistas */}
      <section aria-labelledby="badges-title">
        <SectionHeader id="badges-title" title="Conquistas" description={`${earned.size} de ${BADGES.length} desbloqueadas`} />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {BADGES.map((b, i) => {
            const got = earned.has(b.id)
            const Icon = b.icon
            return (
              <motion.li
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cx('card flex flex-col items-center gap-2 p-4 text-center', !got && 'bg-surface-2/50 shadow-none')}
              >
                <span
                  className={cx('relative grid size-14 place-items-center rounded-full', got ? 'bg-[linear-gradient(140deg,var(--leaf),var(--brand))] text-white' : 'bg-surface-2 text-ink-faint')}
                >
                  <Icon size={26} />
                  {!got && (
                    <span className="absolute -right-0.5 -bottom-0.5 grid size-6 place-items-center rounded-full border-2 border-surface bg-line text-ink-soft">
                      <Lock size={11} />
                    </span>
                  )}
                </span>
                <p className={cx('text-sm font-bold', got ? 'text-ink' : 'text-ink-soft')}>{b.name}</p>
                <p className="text-xs text-ink-faint">{b.description}</p>
              </motion.li>
            )
          })}
        </ul>
      </section>

      {/* Área de doações */}
      <section aria-labelledby="donations-title">
        <SectionHeader
          id="donations-title"
          title="Área de doações"
          description="Seus apoios a comunidades do mundo todo e as comunidades que você cadastrou."
          action={
            <div className="flex flex-wrap gap-2">
              <a href={href.cadastrar} className="btn btn-secondary btn-sm">
                <MapPinPlus size={16} /> Cadastrar comunidade
              </a>
              <a href={href.comunidades} className="btn btn-primary btn-sm">
                <Globe2 size={16} /> Ver mapa
              </a>
            </div>
          }
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card p-5">
            <h3 className="mb-3 font-display font-bold text-ink">Minhas doações</h3>
            {s.donations.length === 0 ? (
              <EmptyState
                icon={HandHeart}
                title="Nenhuma doação ainda"
                text="Escolha uma comunidade no mapa e apoie com dinheiro, itens ou tempo."
                action={
                  <a href={href.comunidades} className="btn btn-coin btn-sm">
                    Encontrar comunidade
                  </a>
                }
              />
            ) : (
              <ul className="divide-y divide-line">
                {s.donations.map((d) => (
                  <li key={d.id}>
                    <a href={href.comunidade(d.communityId)} className="flex items-center gap-3 py-3 hover:text-brand">
                      <CareHandsBadge size={40} animated={false} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">{d.communityName}</span>
                        <span className="block truncate text-xs text-ink-soft">
                          {donationLabel(d)}
                          {d.message && ` · “${d.message}”`}
                        </span>
                      </span>
                      <span className="num shrink-0 text-xs text-ink-faint">{fmtDate(d.at)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="card p-5">
            <h3 className="mb-3 font-display font-bold text-ink">Comunidades que cadastrei</h3>
            {s.communities.length === 0 ? (
              <EmptyState
                icon={MapPinPlus}
                title="Nenhuma comunidade cadastrada"
                text="Conhece uma comunidade que precisa de apoio? Marque no mapa, informe as necessidades e as formas de doação."
                action={
                  <a href={href.cadastrar} className="btn btn-primary btn-sm">
                    Cadastrar agora
                  </a>
                }
              />
            ) : (
              <ul className="divide-y divide-line">
                {s.communities.map((c) => (
                  <li key={c.id}>
                    <a href={href.comunidade(c.id)} className="flex items-center gap-3 py-3">
                      <CareHandsBadge size={40} animated={false} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">{c.name}</span>
                        <span className="block truncate text-xs text-ink-soft">
                          {c.city}, {c.country} · {fmt(c.participants)} participantes
                        </span>
                      </span>
                      <span className="tag bg-coin-soft text-ink">Em verificação</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Histórico */}
      <section aria-labelledby="history-title">
        <SectionHeader id="history-title" title="Histórico de atividades" description={`${fmt(s.activities.length)} atividades registradas`} />
        <ActivityTimeline activities={s.activities} />
      </section>

      {/* Preferências */}
      <section className="card p-5 sm:p-6" aria-labelledby="settings-title">
        <h2 id="settings-title" className="font-display text-[1.15rem] font-bold text-ink">
          Preferências e dados
        </h2>
        <p className="mt-0.5 text-sm text-ink-soft">Seus dados ficam salvos apenas neste aparelho (armazenamento local do navegador).</p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-ink">Tema</span>
            <Segmented<ThemePref>
              label="Tema"
              value={s.theme}
              onChange={s.setTheme}
              options={[
                { value: 'system', label: 'Sistema' },
                { value: 'light', label: 'Claro' },
                { value: 'dark', label: 'Escuro' },
              ]}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setConfirmDemo(true)}>
              <Database size={16} /> Carregar exemplo
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirmReset(true)}>
              <Trash2 size={16} /> Apagar meus dados
            </button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={confirmDemo}
        onClose={() => setConfirmDemo(false)}
        onConfirm={s.loadDemo}
        title="Carregar dados de exemplo?"
        description="Útil para apresentar o app: preenche uma semana de desafios, pontos, um quiz e uma doação. Seu progresso atual de desafios, pontos e histórico será substituído."
        confirmLabel="Carregar exemplo"
      />
      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={s.resetAll}
        title="Apagar todos os seus dados?"
        description="Pontos, desafios, histórico, doações, comunidades cadastradas e mensagens serão apagados deste aparelho. Não dá para desfazer."
        confirmLabel="Apagar tudo"
        danger
      />
    </div>
  )
}
