import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, ClipboardPaste, ExternalLink, LocateFixed, MapPin, MapPinPlus, Send } from 'lucide-react'
import { PageHeader, Field } from '../components/ui/Primitives'
import { WorldMap } from '../components/map/WorldMap'
import { CareHandsBadge } from '../components/brand/CareHandsIcon'
import { useAppStore, useCommunity, type CommunityInput } from '../store/useAppStore'
import { LANGUAGES, METHODS, NEEDS, NEED_KEYS } from '../data/communities'
import { formatLatLng, googleMapsUrl, isValidLatLng, osmUrl, parseCoordinates } from '../lib/geo'
import { href, navigate } from '../lib/router'
import type { Community, MethodType, NeedKey } from '../types'
import { cx, fmt } from '../lib/utils'
import { toast } from '../store/toast'

interface FormState {
  lat: string
  lng: string
  city: string
  country: string
  name: string
  about: string
  participants: string
  needs: NeedKey[]
  languages: string[]
  contact: string
  methods: Record<MethodType, { on: boolean; value: string }>
  goal: string
  agree: boolean
}

const METHOD_KEYS = Object.keys(METHODS) as MethodType[]
const STEPS = ['Localização', 'A comunidade', 'Formas de doação', 'Revisão']

function fromCommunity(c?: Community): FormState {
  const methods = Object.fromEntries(METHOD_KEYS.map((k) => [k, { on: false, value: '' }])) as FormState['methods']
  c?.methods.forEach((m) => (methods[m.type] = { on: true, value: m.value }))
  return {
    lat: c ? String(c.lat) : '',
    lng: c ? String(c.lng) : '',
    city: c?.city ?? '',
    country: c?.country ?? '',
    name: c?.name ?? '',
    about: c?.about ?? '',
    participants: c ? String(c.participants) : '',
    needs: c?.needs ?? [],
    languages: c?.languages ?? ['pt'],
    contact: c?.contact ?? '',
    methods,
    goal: c ? String(c.goal) : '100',
    agree: !!c,
  }
}

type Errors = Partial<Record<string, string>>

function validate(step: number, f: FormState): Errors {
  const e: Errors = {}
  if (step === 0) {
    const lat = Number(f.lat)
    const lng = Number(f.lng)
    if (f.lat === '' || f.lng === '' || !isValidLatLng(lat, lng)) e.coords = 'Marque o local no mapa ou informe latitude (−90 a 90) e longitude (−180 a 180).'
    if (f.city.trim().length < 2) e.city = 'Informe a cidade ou região.'
    if (f.country.trim().length < 2) e.country = 'Informe o país.'
  }
  if (step === 1) {
    if (f.name.trim().length < 3) e.name = 'O nome precisa ter pelo menos 3 letras.'
    if (f.about.trim().length < 30) e.about = `Conte um pouco mais (mínimo de 30 caracteres; faltam ${30 - f.about.trim().length}).`
    const p = Number(f.participants)
    if (!Number.isInteger(p) || p < 1) e.participants = 'Informe o total de participantes (número inteiro).'
    if (f.needs.length === 0) e.needs = 'Escolha pelo menos uma necessidade.'
    if (f.languages.length === 0) e.languages = 'Escolha pelo menos um idioma.'
    if (f.contact.trim().length < 3) e.contact = 'Informe a pessoa ou organização responsável.'
  }
  if (step === 2) {
    const active = METHOD_KEYS.filter((k) => f.methods[k].on)
    if (active.length === 0) e.methods = 'Ative pelo menos uma forma de doação.'
    for (const k of active) if (f.methods[k].value.trim().length < 3) e[`m-${k}`] = 'Preencha esta forma de doação.'
    const g = Number(f.goal)
    if (!Number.isInteger(g) || g < 1) e.goal = 'A meta precisa ser um número inteiro maior que zero.'
  }
  if (step === 3 && !f.agree) e.agree = 'Confirme a declaração para publicar.'
  return e
}

function toInput(f: FormState): CommunityInput {
  return {
    name: f.name.trim(),
    city: f.city.trim(),
    country: f.country.trim(),
    lat: Number(Number(f.lat).toFixed(6)),
    lng: Number(Number(f.lng).toFixed(6)),
    about: f.about.trim(),
    participants: Number(f.participants),
    needs: f.needs,
    languages: f.languages,
    contact: f.contact.trim(),
    methods: METHOD_KEYS.filter((k) => f.methods[k].on).map((k) => ({ type: k, value: f.methods[k].value.trim() })),
    goal: Number(f.goal),
  }
}

export function RegisterCommunityPage({ editId }: { editId?: string }) {
  const existing = useCommunity(editId)
  const register = useAppStore((s) => s.registerCommunity)
  const update = useAppStore((s) => s.updateCommunity)
  const editing = !!editId && existing?.createdBy === 'user'
  const [f, setF] = useState<FormState>(() => fromCommunity(editing ? existing : undefined))
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [paste, setPaste] = useState('')
  const [pasteMsg, setPasteMsg] = useState<string | null>(null)
  const [geoMsg, setGeoMsg] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)
  const [focus, setFocus] = useState<{ lat: number; lng: number; k: number } | null>(null)

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }))
  const picked = useMemo(() => {
    const lat = Number(f.lat)
    const lng = Number(f.lng)
    return f.lat !== '' && f.lng !== '' && isValidLatLng(lat, lng) ? { lat, lng } : null
  }, [f.lat, f.lng])

  if (editId && !editing) {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-lg font-bold text-ink">Só é possível editar comunidades cadastradas por você neste aparelho.</p>
        <a href={href.comunidades} className="btn btn-primary mt-4">
          Ver comunidades
        </a>
      </div>
    )
  }

  const setCoords = (lat: number, lng: number, country?: string, zoom = false) => {
    setF((s) => ({ ...s, lat: lat.toFixed(5), lng: lng.toFixed(5), country: country && !s.country.trim() ? country : s.country }))
    if (zoom) setFocus({ lat, lng, k: 6 })
    setErrors((e) => ({ ...e, coords: undefined }))
  }

  const usePasted = () => {
    const p = parseCoordinates(paste)
    if (!p) {
      setPasteMsg('Não reconhecemos coordenadas aqui. Cole um link do Google Maps/OpenStreetMap ou algo como “-2.62, -60.94”.')
      return
    }
    setCoords(p.lat, p.lng, undefined, true)
    setPasteMsg(`Coordenadas aplicadas: ${formatLatLng(p)}`)
  }

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setGeoMsg('Este navegador não oferece localização. Marque o ponto no mapa ou cole as coordenadas.')
      return
    }
    setLocating(true)
    setGeoMsg(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        setCoords(pos.coords.latitude, pos.coords.longitude, undefined, true)
        setGeoMsg(`Localização encontrada (precisão de ~${fmt(pos.coords.accuracy)} m).`)
      },
      () => {
        setLocating(false)
        setGeoMsg('Não foi possível obter sua localização. Permita o acesso ou marque o ponto no mapa.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const next = () => {
    const e = validate(step, f)
    setErrors(e)
    if (Object.keys(e).length) {
      toast({ title: 'Confira os campos destacados', tone: 'error' })
      return
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const input = toInput(f)
    if (editing && existing) {
      update(existing.id, input)
      navigate(href.comunidade(existing.id))
    } else {
      const id = register(input)
      navigate(href.comunidade(id))
    }
  }

  const back = () => {
    setErrors({})
    setStep(step - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  return (
    <div className="flex flex-col gap-6">
      <a href={editing && existing ? href.comunidade(existing.id) : href.comunidades} className="btn btn-ghost btn-sm -ml-2 self-start">
        <ArrowLeft size={16} /> Voltar
      </a>
      <PageHeader
        icon={MapPinPlus}
        eyebrow={editing ? 'Editar cadastro' : 'Cadastro de comunidade'}
        title={editing ? `Editar ${existing?.name}` : 'Coloque sua comunidade no mapa'}
        description="Comunidades cadastradas ganham um perfil especial no WWC e passam por verificação antes de receber o selo de verificada."
        tone="var(--coin)"
      />

      {/* Etapas */}
      <ol className="grid grid-cols-4 gap-2" aria-label="Etapas do cadastro">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-col gap-1.5" aria-current={i === step ? 'step' : undefined}>
            <span className={cx('h-1.5 rounded-full transition-colors', i <= step ? 'bg-brand' : 'bg-line')} />
            <span className={cx('flex items-center gap-1.5 text-xs font-semibold sm:text-sm', i === step ? 'text-ink' : 'text-ink-faint')}>
              <span className={cx('num grid size-5 shrink-0 place-items-center rounded-full text-[0.68rem]', i < step ? 'bg-brand text-brand-ink' : i === step ? 'bg-ink text-surface' : 'bg-surface-2')}>
                {i < step ? <Check size={12} /> : i + 1}
              </span>
              <span className="hidden truncate sm:inline">{s}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="-mt-3 text-sm font-semibold text-ink sm:hidden">
        Etapa {step + 1} de {STEPS.length}: {STEPS[step]}
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
          {step === 0 && (
            <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="card p-4 sm:p-5">
                <p className="mb-3 flex items-center gap-2 font-semibold text-ink">
                  <MapPin size={18} className="text-danger" /> Clique no mapa para marcar onde fica a comunidade
                </p>
                <WorldMap pickable picked={picked} focus={focus} onPick={(p) => setCoords(p.lat, p.lng, p.country)} label="Mapa para marcar a localização da comunidade" />
                <p className="mt-2 text-xs text-ink-faint">Dica: dê zoom com os botões + e − para marcar com mais precisão.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="card space-y-3 p-4 sm:p-5">
                  <button type="button" className="btn btn-secondary w-full" onClick={locate} disabled={locating}>
                    <LocateFixed size={18} /> {locating ? 'Localizando…' : 'Usar minha localização'}
                  </button>
                  {geoMsg && <p className="text-xs text-ink-soft">{geoMsg}</p>}
                  <div>
                    <label htmlFor="rc-paste" className="field-label">
                      Ou cole um link do Google Maps / coordenadas
                    </label>
                    <div className="flex gap-2">
                      <input id="rc-paste" className="input" value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="https://maps.google.com/… ou -2.62, -60.94" />
                      <button type="button" className="btn btn-soft btn-icon shrink-0" onClick={usePasted} aria-label="Usar coordenadas coladas">
                        <ClipboardPaste size={18} />
                      </button>
                    </div>
                    {pasteMsg && <p className="mt-1.5 text-xs text-ink-soft">{pasteMsg}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Latitude" htmlFor="rc-lat">
                      <input id="rc-lat" className="input num font-mono text-sm" inputMode="decimal" value={f.lat} onChange={(e) => set('lat', e.target.value.replace(',', '.'))} placeholder="-2.62190" aria-invalid={!!errors.coords} />
                    </Field>
                    <Field label="Longitude" htmlFor="rc-lng">
                      <input id="rc-lng" className="input num font-mono text-sm" inputMode="decimal" value={f.lng} onChange={(e) => set('lng', e.target.value.replace(',', '.'))} placeholder="-60.94360" aria-invalid={!!errors.coords} />
                    </Field>
                  </div>
                  {errors.coords && <p className="text-sm font-medium text-danger">{errors.coords}</p>}
                  {picked && (
                    <div className="rounded-2xl bg-surface-2 p-3 text-sm">
                      <p className="font-mono text-ink">{formatLatLng(picked, 5)}</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <a href={googleMapsUrl(picked)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ocean hover:underline">
                          Conferir no Google Maps <ExternalLink size={13} />
                        </a>
                        <a href={osmUrl(picked)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-ocean hover:underline">
                          OpenStreetMap <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="card grid gap-3 p-4 sm:p-5">
                  <Field label="País" htmlFor="rc-country" error={errors.country} hint="Preenchido ao clicar no mapa; ajuste se precisar.">
                    <input id="rc-country" className="input" value={f.country} onChange={(e) => set('country', e.target.value)} aria-invalid={!!errors.country} />
                  </Field>
                  <Field label="Cidade / região" htmlFor="rc-city" error={errors.city}>
                    <input id="rc-city" className="input" value={f.city} onChange={(e) => set('city', e.target.value)} placeholder="Ex.: Novo Airão, AM" aria-invalid={!!errors.city} />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="card grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <Field label="Nome da comunidade" htmlFor="rc-name" error={errors.name}>
                <input id="rc-name" className="input" value={f.name} maxLength={70} onChange={(e) => set('name', e.target.value)} placeholder="Ex.: Associação Rio Limpo" aria-invalid={!!errors.name} />
              </Field>
              <Field label="Total de participantes" htmlFor="rc-part" error={errors.participants} hint="Pessoas ou famílias atendidas.">
                <input id="rc-part" type="number" min={1} className="input num" value={f.participants} onChange={(e) => set('participants', e.target.value)} placeholder="Ex.: 120" aria-invalid={!!errors.participants} />
              </Field>
              <Field label="Sobre a comunidade" htmlFor="rc-about" error={errors.about} className="lg:col-span-2" hint={`${f.about.trim().length}/600 caracteres`}>
                <textarea
                  id="rc-about"
                  className="input"
                  value={f.about}
                  maxLength={600}
                  onChange={(e) => set('about', e.target.value)}
                  placeholder="Quem são vocês, como vivem, que projeto ambiental ou social realizam e por que precisam de apoio."
                  aria-invalid={!!errors.about}
                />
              </Field>
              <fieldset className="lg:col-span-2">
                <legend className="field-label">Principais necessidades</legend>
                <div className="flex flex-wrap gap-2">
                  {NEED_KEYS.map((k) => {
                    const Icon = NEEDS[k].icon
                    return (
                      <button key={k} type="button" className="chip" aria-pressed={f.needs.includes(k)} onClick={() => set('needs', toggle(f.needs, k))}>
                        <Icon size={15} /> {NEEDS[k].label}
                      </button>
                    )
                  })}
                </div>
                {errors.needs && <p className="mt-1.5 text-sm font-medium text-danger">{errors.needs}</p>}
              </fieldset>
              <fieldset>
                <legend className="field-label">Idiomas falados</legend>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(LANGUAGES).map(([k, label]) => (
                    <button key={k} type="button" className="chip" aria-pressed={f.languages.includes(k)} onClick={() => set('languages', toggle(f.languages, k))}>
                      {label}
                    </button>
                  ))}
                </div>
                {errors.languages && <p className="mt-1.5 text-sm font-medium text-danger">{errors.languages}</p>}
              </fieldset>
              <Field label="Responsável pelo cadastro" htmlFor="rc-contact" error={errors.contact} hint="Nome da liderança, associação ou ONG.">
                <input id="rc-contact" className="input" value={f.contact} maxLength={80} onChange={(e) => set('contact', e.target.value)} aria-invalid={!!errors.contact} />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="card space-y-4 p-5 sm:p-6">
              <p className="text-sm text-ink-soft">Ative as formas pelas quais a comunidade recebe apoio. As doações vão direto para esses canais, sem taxas do WWC.</p>
              <ul className="grid gap-3 lg:grid-cols-2">
                {METHOD_KEYS.map((k) => {
                  const meta = METHODS[k]
                  const Icon = meta.icon
                  const m = f.methods[k]
                  return (
                    <li key={k} className={cx('rounded-2xl border-2 p-4 transition-colors', m.on ? 'border-coin bg-coin-soft/40' : 'border-line')}>
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          className="size-5 accent-[var(--brand)]"
                          checked={m.on}
                          onChange={(e) => set('methods', { ...f.methods, [k]: { ...m, on: e.target.checked } })}
                        />
                        <Icon size={20} className="text-ink-soft" />
                        <span>
                          <span className="block font-semibold text-ink">{meta.label}</span>
                          <span className="block text-xs text-ink-faint">{meta.hint}</span>
                        </span>
                      </label>
                      {m.on && (
                        <div className="mt-3">
                          <label htmlFor={`rc-m-${k}`} className="sr-only">
                            {meta.label}
                          </label>
                          <input
                            id={`rc-m-${k}`}
                            className="input"
                            value={m.value}
                            onChange={(e) => set('methods', { ...f.methods, [k]: { ...m, value: e.target.value } })}
                            placeholder={meta.placeholder}
                            aria-invalid={!!errors[`m-${k}`]}
                          />
                          {errors[`m-${k}`] && <p className="mt-1.5 text-sm font-medium text-danger">{errors[`m-${k}`]}</p>}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
              {errors.methods && <p className="text-sm font-medium text-danger">{errors.methods}</p>}
              <Field label="Meta de apoios por mês" htmlFor="rc-goal" error={errors.goal} hint="Quantas doações (de qualquer tipo) a comunidade quer receber no mês." className="max-w-xs">
                <input id="rc-goal" type="number" min={1} className="input num" value={f.goal} onChange={(e) => set('goal', e.target.value)} aria-invalid={!!errors.goal} />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="card overflow-hidden">
                <div className="flex items-center gap-4 bg-[linear-gradient(120deg,#1f9d67,#11734f_45%,#2672ad)] p-5 text-white">
                  <CareHandsBadge size={72} />
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-wider uppercase opacity-85">Prévia do perfil especial</p>
                    <p className="truncate font-display text-xl font-bold">{f.name || 'Nome da comunidade'}</p>
                    <p className="truncate text-sm opacity-90">
                      {f.city}, {f.country}
                    </p>
                  </div>
                </div>
                <dl className="divide-y divide-line text-sm">
                  {[
                    ['Coordenadas', picked ? formatLatLng(picked, 5) : '—'],
                    ['Participantes', fmt(Number(f.participants) || 0)],
                    ['Necessidades', f.needs.map((n) => NEEDS[n].label).join(', ')],
                    ['Idiomas', f.languages.map((l) => LANGUAGES[l]).join(', ')],
                    ['Responsável', f.contact],
                    ['Doações', METHOD_KEYS.filter((k) => f.methods[k].on).map((k) => METHODS[k].label).join(', ')],
                    ['Meta mensal', `${f.goal} apoios`],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 px-5 py-2.5">
                      <dt className="font-semibold text-ink-soft">{k}</dt>
                      <dd className={cx('min-w-0 break-words text-ink', k === 'Coordenadas' && 'font-mono text-[0.82rem]')}>{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="border-t border-line px-5 py-4 text-sm whitespace-pre-line text-ink-soft">{f.about}</p>
              </div>
              <div className="card flex flex-col gap-4 p-5 sm:p-6">
                <h2 className="text-[1.2rem] font-bold text-ink">Antes de publicar</h2>
                <ul className="space-y-2 text-sm text-ink-soft">
                  <li className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-leaf" /> A comunidade aparece no mapa com o selo “Em verificação”.
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-leaf" /> Em uma versão com servidor, ONGs parceiras confirmam os dados e liberam o selo de verificada.
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-leaf" /> Você pode editar ou excluir o cadastro quando quiser.
                  </li>
                </ul>
                <label className={cx('flex cursor-pointer gap-3 rounded-2xl border-2 p-4', errors.agree ? 'border-danger' : 'border-line')}>
                  <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]" checked={f.agree} onChange={(e) => set('agree', e.target.checked)} />
                  <span className="text-sm text-ink">Declaro que as informações são verdadeiras e que tenho autorização para representar esta comunidade.</span>
                </label>
                {errors.agree && <p className="-mt-2 text-sm font-medium text-danger">{errors.agree}</p>}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-5">
        {step > 0 ? (
          <button type="button" className="btn btn-secondary" onClick={back}>
            <ArrowLeft size={18} /> Voltar
          </button>
        ) : (
          <span />
        )}
        <button type="button" className={cx('btn', step === STEPS.length - 1 ? 'btn-coin btn-lg' : 'btn-primary')} onClick={next}>
          {step === STEPS.length - 1 ? (
            <>
              <Send size={18} /> {editing ? 'Salvar alterações' : 'Publicar comunidade · +100'}
            </>
          ) : (
            <>
              Continuar <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
