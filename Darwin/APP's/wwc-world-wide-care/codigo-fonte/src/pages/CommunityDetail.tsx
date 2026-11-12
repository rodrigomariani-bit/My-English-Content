import { useState } from 'react'
import { ArrowLeft, ExternalLink, HandCoins, Languages, MapPin, MessagesSquare, Pencil, Trash2, UserRound, Users, Sparkles } from 'lucide-react'
import { useAppStore, useCommunity } from '../store/useAppStore'
import { CareHandsBadge } from '../components/brand/CareHandsIcon'
import { VerifiedTag } from '../components/community/CommunityCard'
import { MethodList } from '../components/community/MethodList'
import { DonateSheet } from '../components/community/DonateSheet'
import { ChatPanel } from '../components/community/ChatPanel'
import { WorldMap } from '../components/map/WorldMap'
import { EmptyState, ProgressBar, SdgBadge } from '../components/ui/Primitives'
import { ConfirmDialog } from '../components/ui/Modal'
import { LANGUAGES, NEEDS } from '../data/communities'
import { formatLatLng, googleMapsUrl, osmUrl } from '../lib/geo'
import { href, navigate } from '../lib/router'
import { fmt, fmtDate } from '../lib/utils'

export function CommunityDetailPage({ id }: { id?: string }) {
  const c = useCommunity(id)
  const remove = useAppStore((s) => s.deleteCommunity)
  const myDonations = useAppStore((s) => s.donations.filter((d) => d.communityId === id).length)
  const [donating, setDonating] = useState(false)
  const [confirm, setConfirm] = useState(false)

  if (!c) {
    return (
      <EmptyState
        icon={MapPin}
        title="Comunidade não encontrada"
        text="Ela pode ter sido removida deste aparelho."
        action={
          <a href={href.comunidades} className="btn btn-primary">
            Ver comunidades
          </a>
        }
      />
    )
  }

  const scrollToChat = () => document.getElementById('community-chat')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const actions = (
    <>
      <button type="button" className="btn btn-coin" onClick={() => setDonating(true)}>
        <HandCoins size={18} /> Doar sem taxas
      </button>
      <button type="button" className="btn btn-secondary" onClick={scrollToChat}>
        <MessagesSquare size={18} /> Conversar
      </button>
    </>
  )

  return (
    <div className="flex flex-col gap-6">
      <a href={href.comunidades} className="btn btn-ghost btn-sm -ml-2 self-start">
        <ArrowLeft size={16} /> Comunidades
      </a>

      {/* Perfil especial */}
      <section className="card overflow-hidden">
        <div className="relative h-28 bg-[linear-gradient(120deg,#1f9d67,#11734f_45%,#2672ad)] sm:h-36">
          <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
            <defs>
              <pattern id="contours" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M0 30 Q15 18 30 30 T60 30 M0 50 Q15 38 30 50 T60 50 M0 10 Q15 -2 30 10 T60 10" stroke="#fff" fill="none" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contours)" />
          </svg>
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
            <Sparkles size={13} /> Perfil especial de comunidade
          </span>
        </div>
        <div className="relative px-5 pb-6 sm:px-8">
          <div className="-mt-14 flex items-end justify-between gap-4">
            <span className="rounded-full border-4 border-surface bg-surface">
              <CareHandsBadge size={104} />
            </span>
            <div className="hidden flex-wrap justify-end gap-2 pb-1 sm:flex">{actions}</div>
          </div>
          <h1 className="mt-3 text-[1.75rem] leading-tight font-extrabold text-ink sm:text-[2.1rem]">{c.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-ink-soft">
            <MapPin size={16} className="shrink-0" /> {c.city}, {c.country}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 sm:hidden">{actions}</div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <VerifiedTag verified={c.verified} />
            {c.example && <span className="tag">Comunidade de exemplo (fictícia)</span>}
            {c.createdBy === 'user' && <span className="tag bg-sky text-ocean">Cadastrada por você em {fmtDate(c.createdAt)}</span>}
            {myDonations > 0 && <span className="tag bg-coin-soft text-ink">Você apoiou {myDonations}×</span>}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-surface-2/70 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                <Users size={14} /> Participantes
              </p>
              <p className="num mt-1 font-display text-[1.6rem] leading-none font-bold text-ink">{fmt(c.participants)}</p>
            </div>
            <div className="rounded-2xl bg-surface-2/70 p-4 sm:col-span-2">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs font-semibold text-ink-soft">Meta de apoios deste mês</p>
                <p className="num text-sm font-bold text-ink">
                  {fmt(c.supporters)} de {fmt(c.goal)}
                </p>
              </div>
              <ProgressBar value={c.supporters / c.goal} tone="var(--coin)" className="mt-3 h-3" label="Meta de apoios" />
            </div>
          </div>

          {c.createdBy === 'user' && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              <a href={href.editar(c.id)} className="btn btn-secondary btn-sm">
                <Pencil size={15} /> Editar cadastro
              </a>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirm(true)}>
                <Trash2 size={15} /> Excluir
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-6">
          <section className="card p-5 sm:p-6" aria-labelledby="about">
            <h2 id="about" className="text-[1.2rem] font-bold text-ink">
              Sobre a comunidade
            </h2>
            <p className="mt-2 whitespace-pre-line text-ink-soft">{c.about}</p>
            <h3 className="mt-5 mb-2 text-sm font-bold tracking-wider text-ink-faint uppercase">Principais necessidades</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {c.needs.map((n) => {
                const need = NEEDS[n]
                const Icon = need.icon
                return (
                  <li key={n} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-leaf-soft text-brand">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-semibold text-ink">{need.label}</span>
                    <SdgBadge n={need.sdg} />
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="card p-5 sm:p-6" aria-labelledby="methods">
            <h2 id="methods" className="text-[1.2rem] font-bold text-ink">
              Formas de doação
            </h2>
            <p className="mt-0.5 mb-4 text-sm text-ink-soft">Canais oficiais informados pela comunidade. O WWC não cobra nada.</p>
            <MethodList community={c} />
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="card overflow-hidden" aria-labelledby="where">
            <div className="p-5 pb-3 sm:px-6">
              <h2 id="where" className="text-[1.2rem] font-bold text-ink">
                Localização
              </h2>
              <p className="mt-1 font-mono text-sm text-ink">{formatLatLng(c)}</p>
            </div>
            <WorldMap markers={[{ id: c.id, lat: c.lat, lng: c.lng, label: c.name }]} selectedId={c.id} focus={{ lat: c.lat, lng: c.lng, k: 6 }} className="mx-3 rounded-2xl sm:mx-4" label={`Localização de ${c.name}`} />
            <div className="flex flex-wrap gap-2 p-5 pt-3 sm:px-6">
              <a href={googleMapsUrl(c)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                Google Maps <ExternalLink size={14} />
              </a>
              <a href={osmUrl(c)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                OpenStreetMap <ExternalLink size={14} />
              </a>
            </div>
          </section>

          <section className="card space-y-3 p-5 sm:p-6">
            <p className="flex items-center gap-2 text-sm text-ink">
              <UserRound size={16} className="text-ink-faint" /> <span className="font-semibold">Responsável:</span> {c.contact}
            </p>
            <p className="flex flex-wrap items-center gap-2 text-sm text-ink">
              <Languages size={16} className="text-ink-faint" /> <span className="font-semibold">Idiomas:</span>
              {c.languages.map((l) => (
                <span key={l} className="tag">
                  {LANGUAGES[l] ?? l}
                </span>
              ))}
            </p>
          </section>
        </div>
      </div>

      <section id="community-chat" className="scroll-mt-24" aria-label={`Chat de ${c.name}`}>
        <ChatPanel channel={c.id} channelName={`Chat · ${c.name}`} height="h-[380px]" />
      </section>

      <DonateSheet community={c} open={donating} onClose={() => setDonating(false)} />
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          remove(c.id)
          navigate(href.comunidades)
        }}
        title="Excluir comunidade?"
        description={`O cadastro de “${c.name}” e as mensagens do chat dela serão apagados deste aparelho.`}
        confirmLabel="Excluir comunidade"
        danger
      />
    </div>
  )
}
