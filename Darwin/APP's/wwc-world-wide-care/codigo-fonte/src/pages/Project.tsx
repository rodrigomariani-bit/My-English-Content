import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Mic, Pause, Play, Presentation, RotateCcw, Languages, Timer, Rocket, Cpu, Check } from 'lucide-react'
import { PageHeader, SdgBadge, Segmented, SectionHeader } from '../components/ui/Primitives'
import { LogoMark } from '../components/brand/Logo'
import { CareHandsBadge } from '../components/brand/CareHandsIcon'
import { KEY_EXPRESSIONS, PITCH, PRESENTATION, ROADMAP, TECH_STACK, type Lang } from '../data/presentation'
import { WWC_SDGS } from '../data/sdgs'
import { cx } from '../lib/utils'

const TARGET_SECONDS = 60

const words = (s: string) => s.split(/\s+/).filter(Boolean).length

/** Destaca as expressões-chave pedidas no roteiro. */
function highlight(text: string): ReactNode {
  const parts: ReactNode[] = []
  let rest = text
  let key = 0
  while (rest) {
    let hit: { i: number; exp: string } | null = null
    for (const exp of KEY_EXPRESSIONS) {
      const i = rest.indexOf(exp)
      if (i >= 0 && (!hit || i < hit.i)) hit = { i, exp }
    }
    if (!hit) {
      parts.push(rest)
      break
    }
    if (hit.i > 0) parts.push(rest.slice(0, hit.i))
    parts.push(
      <mark key={key++} className="rounded-md bg-leaf-soft px-1 text-brand">
        {hit.exp}
      </mark>,
    )
    rest = rest.slice(hit.i + hit.exp.length)
  }
  return parts
}

function PitchPractice() {
  const [showPt, setShowPt] = useState(false)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const box = useRef<HTMLDivElement>(null)
  const partRefs = useRef<(HTMLDivElement | null)[]>([])

  const totalWords = useMemo(() => PITCH.reduce((n, p) => n + words(p.en), 0), [])
  const bounds = useMemo(() => {
    let acc = 0
    return PITCH.map((p) => {
      const start = acc
      acc += (words(p.en) / totalWords) * TARGET_SECONDS
      return { start, end: acc }
    })
  }, [totalWords])

  useEffect(() => {
    if (!running) return
    const started = performance.now() - elapsed * 1000
    const id = window.setInterval(() => {
      const s = (performance.now() - started) / 1000
      if (s >= TARGET_SECONDS) {
        setElapsed(TARGET_SECONDS)
        setRunning(false)
      } else setElapsed(s)
    }, 100)
    return () => window.clearInterval(id)
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  const current = running || elapsed > 0 ? bounds.findIndex((b) => elapsed >= b.start && elapsed < b.end) : -1

  useEffect(() => {
    const el = partRefs.current[current]
    const container = box.current
    if (el && container) container.scrollTo({ top: el.offsetTop - container.clientHeight / 3, behavior: 'smooth' })
  }, [current])

  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-brand text-brand-ink">
            <Mic size={22} />
          </span>
          <div>
            <h3 className="text-[1.15rem] font-bold text-ink">Pitch in English · 1 minute</h3>
            <p className="num text-sm text-ink-soft">
              {totalWords} palavras · cerca de {Math.round((totalWords / 150) * 60)} s a 150 palavras por minuto
            </p>
          </div>
        </div>
        <button type="button" className="chip" aria-pressed={showPt} onClick={() => setShowPt(!showPt)}>
          <Languages size={15} /> Tradução em português
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-surface-2/60 px-5 py-3 sm:px-6">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => (elapsed >= TARGET_SECONDS ? (setElapsed(0), setRunning(true)) : setRunning(!running))}>
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? 'Pausar' : elapsed > 0 && elapsed < TARGET_SECONDS ? 'Continuar' : 'Ensaiar com cronômetro'}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setRunning(false)
            setElapsed(0)
          }}
          disabled={elapsed === 0}
        >
          <RotateCcw size={16} /> Zerar
        </button>
        <div className="flex min-w-[10rem] flex-1 items-center gap-3">
          <Timer size={18} className="text-ink-faint" />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-leaf transition-[width] duration-100" style={{ width: `${(elapsed / TARGET_SECONDS) * 100}%` }} />
          </div>
          <span className="num font-mono text-sm font-semibold text-ink">
            {mmss(elapsed)} / {mmss(TARGET_SECONDS)}
          </span>
        </div>
      </div>

      <div ref={box} className="relative max-h-[560px] space-y-1 overflow-y-auto px-5 py-5 sm:px-6">
        {PITCH.map((p, i) => {
          const active = i === current
          const dim = current >= 0 && !active
          return (
            <div
              key={p.label}
              ref={(el) => {
                partRefs.current[i] = el
              }}
              className={cx('grid gap-x-4 gap-y-1 rounded-2xl p-3 transition-all sm:grid-cols-[7.5rem_1fr]', active && 'bg-leaf-soft/60', dim && 'opacity-45')}
            >
              <p className="pt-1 text-xs font-bold tracking-wider text-ink-faint uppercase">
                {p.label}
                <span className="num block font-mono font-normal normal-case">{mmss(bounds[i].start)}</span>
              </p>
              <div>
                <p className={cx('font-display leading-snug text-ink transition-all', active ? 'text-[1.35rem] font-bold' : 'text-[1.15rem] font-semibold')}>{highlight(p.en)}</p>
                {showPt && <p className="mt-1 text-sm text-ink-soft italic">{p.pt}</p>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-line px-5 py-4 sm:px-6">
        <p className="mb-2 text-xs font-bold tracking-wider text-ink-faint uppercase">Expressões-chave usadas</p>
        <ul className="flex flex-wrap gap-1.5">
          {KEY_EXPRESSIONS.map((e) => (
            <li key={e} className="inline-flex items-center gap-1 rounded-full bg-leaf-soft px-2.5 py-1 text-xs font-semibold text-brand">
              <Check size={12} /> {e}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function ProjectPage() {
  const [lang, setLang] = useState<Lang>('pt')
  const t = (pt: string, en: string) => (lang === 'pt' ? pt : en)

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        icon={Presentation}
        eyebrow={t('Projeto de Inovação Digital · Tema: Environment', 'Digital Innovation Project · Theme: Environment')}
        title={t('Apresentação do projeto', 'Project presentation')}
        description={t(
          'Tudo o que você precisa para apresentar o WWC: o problema, o público, como funciona, as funcionalidades, os benefícios, o diferencial e o pitch de 1 minuto.',
          'Everything you need to present WWC: the problem, the audience, how it works, the features, the benefits, what makes it different and the 1-minute pitch.',
        )}
        tone="#5b6fd6"
        actions={
          <Segmented<Lang>
            label="Idioma da apresentação"
            value={lang}
            onChange={setLang}
            options={[
              { value: 'pt', label: 'Português' },
              { value: 'en', label: 'English' },
            ]}
          />
        }
      />

      <section className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(125deg,#0b4d36,#11734f_45%,#1f6aa3)] p-6 text-white sm:p-9">
        <div className="pointer-events-none absolute -right-16 -bottom-24 size-80 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -right-4 -bottom-12 size-56 rounded-full border border-white/15" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[60ch]">
            <div className="flex items-center gap-3">
              <LogoMark size={54} />
              <div>
                <p className="font-display text-[2rem] leading-none font-extrabold">WWC</p>
                <p className="text-xs font-bold tracking-[0.18em] uppercase opacity-80">World Wide Care</p>
              </div>
            </div>
            <p className="mt-5 font-display text-[1.45rem] leading-snug font-semibold sm:text-[1.7rem]">
              {t(
                'Um app que transforma pequenas atitudes sustentáveis em impacto real e une comunidades do mundo todo para cuidar do planeta.',
                'An app that turns small sustainable actions into real impact and unites communities around the world to care for the planet.',
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {WWC_SDGS.map((n) => (
                <SdgBadge key={n} n={n} />
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-2 rounded-3xl bg-white/10 p-5 text-center backdrop-blur-sm">
            <CareHandsBadge size={92} />
            <p className="max-w-[16ch] text-sm font-semibold">{t('Doação direta, sem taxas', 'Direct, zero-fee giving')}</p>
          </div>
        </div>
      </section>

      <section aria-label={t('Perguntas do projeto', 'Project questions')} className="gap-4 lg:columns-2 [&>*]:mb-4">
        {PRESENTATION.map((sec, i) => (
          <motion.article
            key={sec.q.pt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card break-inside-avoid p-5 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="num grid size-9 shrink-0 place-items-center rounded-xl bg-brand font-display font-bold text-brand-ink">{i + 1}</span>
              <h2 className="pt-1 text-[1.15rem] leading-snug font-bold text-ink">{sec.q[lang]}</h2>
            </div>
            {sec.intro && <p className="mt-3 text-ink-soft">{sec.intro[lang]}</p>}
            {sec.points &&
              (sec.ordered ? (
                <ol className="mt-3 space-y-2">
                  {sec.points[lang].map((p, j) => (
                    <li key={j} className="flex gap-3 text-sm text-ink">
                      <span className="num grid size-6 shrink-0 place-items-center rounded-full bg-leaf-soft text-xs font-bold text-brand">{j + 1}</span>
                      <span className="pt-0.5">{p}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="mt-3 space-y-2">
                  {sec.points[lang].map((p, j) => (
                    <li key={j} className="flex gap-2.5 text-sm text-ink">
                      <Check size={16} className="mt-0.5 shrink-0 text-leaf" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              ))}
          </motion.article>
        ))}
      </section>

      <section aria-labelledby="pitch-title">
        <SectionHeader
          id="pitch-title"
          title={t('Pitch de apresentação (1 minuto, em inglês)', 'Presentation pitch (1 minute, in English)')}
          description={t(
            'Explica o problema, apresenta a solução e mostra a importância do app. Use o cronômetro para ensaiar: a parte da vez fica em destaque.',
            'It explains the problem, presents the solution and shows why the app matters. Use the timer to rehearse: the current part is highlighted.',
          )}
        />
        <PitchPractice />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-5 sm:p-6" aria-labelledby="next-title">
          <h2 id="next-title" className="flex items-center gap-2 text-[1.15rem] font-bold text-ink">
            <Rocket size={20} className="text-ocean" /> {t('Próximos passos', 'Next steps')}
          </h2>
          <ul className="mt-3 space-y-2">
            {ROADMAP[lang].map((r) => (
              <li key={r} className="flex gap-2.5 text-sm text-ink">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-ocean" />
                {r}
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-5 sm:p-6" aria-labelledby="tech-title">
          <h2 id="tech-title" className="flex items-center gap-2 text-[1.15rem] font-bold text-ink">
            <Cpu size={20} className="text-brand" /> {t('Como foi feito', 'How it was built')}
          </h2>
          <dl className="mt-3 divide-y divide-line">
            {TECH_STACK.map((x) => (
              <Fragment key={x.name}>
                <div className="grid gap-1 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-3">
                  <dt className="text-sm font-bold text-ink">{x.name}</dt>
                  <dd className="text-sm text-ink-soft">{x.role}</dd>
                </div>
              </Fragment>
            ))}
          </dl>
        </section>
      </div>
    </div>
  )
}
