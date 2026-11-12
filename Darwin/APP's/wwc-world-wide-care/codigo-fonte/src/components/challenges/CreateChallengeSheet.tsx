import { useState } from 'react'
import { PencilRuler } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Field } from '../ui/Primitives'
import { CATEGORIES } from '../../data/categories'
import { DIFFICULTY_LABEL, DIFFICULTY_POINTS, FREQUENCY_LABEL } from '../../data/challenges'
import { useAppStore, type NewChallengeInput } from '../../store/useAppStore'
import type { Category, Difficulty, Frequency } from '../../types'
import { cx } from '../../lib/utils'

const EMPTY: NewChallengeInput = { title: '', description: '', category: 'residuos', frequency: 'daily', difficulty: 'facil' }

export function CreateChallengeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useAppStore((s) => s.createChallenge)
  const [form, setForm] = useState<NewChallengeInput>(EMPTY)
  const [tried, setTried] = useState(false)
  const titleError = tried && form.title.trim().length < 4 ? 'Escreva um título com pelo menos 4 letras.' : undefined
  const set = <K extends keyof NewChallengeInput>(k: K, v: NewChallengeInput[K]) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (form.title.trim().length < 4) return
    create(form)
    setForm(EMPTY)
    setTried(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Criar um desafio"
      description="Invente um desafio para você, sua família ou sua turma. Ele já começa em andamento."
      icon={
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sky text-ocean">
          <PencilRuler size={22} />
        </span>
      }
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="create-challenge" className="btn btn-primary">
            Criar desafio · +10
          </button>
        </>
      }
    >
      <form id="create-challenge" onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Título" htmlFor="cc-title" error={titleError}>
          <input
            id="cc-title"
            className="input"
            value={form.title}
            maxLength={60}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Ex.: Uma semana sem copo descartável na escola"
            aria-invalid={!!titleError}
          />
        </Field>
        <Field label="Como cumprir (opcional)" htmlFor="cc-desc">
          <textarea id="cc-desc" className="input min-h-20" value={form.description} maxLength={200} onChange={(e) => set('description', e.target.value)} placeholder="Explique o que precisa ser feito." />
        </Field>
        <fieldset>
          <legend className="field-label">Tema</legend>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(CATEGORIES) as Category[]).map((c) => {
              const Icon = CATEGORIES[c].icon
              return (
                <button key={c} type="button" className="chip" aria-pressed={form.category === c} onClick={() => set('category', c)}>
                  <Icon size={15} /> {CATEGORIES[c].label}
                </button>
              )
            })}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className="field-label">Frequência</legend>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(FREQUENCY_LABEL) as Frequency[]).map((f) => (
                <button key={f} type="button" className="chip" aria-pressed={form.frequency === f} onClick={() => set('frequency', f)}>
                  {FREQUENCY_LABEL[f]}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="field-label">Dificuldade</legend>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(DIFFICULTY_LABEL) as Difficulty[]).map((d) => (
                <button key={d} type="button" className={cx('chip')} aria-pressed={form.difficulty === d} onClick={() => set('difficulty', d)}>
                  {DIFFICULTY_LABEL[d]} · {DIFFICULTY_POINTS[d]}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </form>
    </Modal>
  )
}
