import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Gamepad2, RotateCcw, Trophy, XCircle } from 'lucide-react'
import { BINS, WASTE_ITEMS, binByKey, type BinKey, type WasteItem } from '../../data/recycling'
import { useAppStore } from '../../store/useAppStore'
import { ProgressBar } from '../ui/Primitives'
import { cx } from '../../lib/utils'

const ROUND = 10

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Phase = 'intro' | 'play' | 'end'

export function SortingQuiz() {
  const best = useAppStore((s) => s.quiz.best)
  const recordQuiz = useAppStore((s) => s.recordQuiz)
  const [phase, setPhase] = useState<Phase>('intro')
  const [items, setItems] = useState<WasteItem[]>([])
  const [i, setI] = useState(0)
  const [answer, setAnswer] = useState<BinKey | null>(null)
  const [score, setScore] = useState(0)
  const [earned, setEarned] = useState(0)
  const pool = useMemo(() => WASTE_ITEMS.filter((w) => w.quiz !== false), [])

  const startGame = () => {
    setItems(shuffle(pool).slice(0, ROUND))
    setI(0)
    setScore(0)
    setAnswer(null)
    setPhase('play')
  }

  const choose = (k: BinKey) => {
    if (answer) return
    setAnswer(k)
    if (k === items[i].bin) setScore((s) => s + 1)
  }

  const next = () => {
    if (i + 1 >= items.length) {
      const final = score
      setEarned(recordQuiz(final, items.length))
      setPhase('end')
      return
    }
    setI(i + 1)
    setAnswer(null)
  }

  const item = items[i]

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line bg-surface-2/60 px-5 py-4 sm:px-6">
        <span className="grid size-11 place-items-center rounded-2xl bg-brand text-brand-ink">
          <Gamepad2 size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[1.2rem] font-bold text-ink">Quiz: Qual é a lixeira certa?</h2>
          <p className="text-sm text-ink-soft">
            {ROUND} objetos · 3 pontos por acerto · recorde: <span className="num font-bold">{best}/{ROUND}</span>
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {phase === 'intro' && (
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[52ch] text-ink-soft">
              Vamos ver se você já sabe separar o lixo? Escolha a lixeira de cada objeto e confira a explicação. Ótimo para treinar em família ou na sala de aula.
            </p>
            <button type="button" className="btn btn-primary btn-lg shrink-0" onClick={startGame}>
              <Gamepad2 size={19} /> Jogar agora
            </button>
          </div>
        )}

        {phase === 'play' && item && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="num text-sm font-bold text-ink-soft">
                {i + 1}/{items.length}
              </span>
              <ProgressBar value={(i + (answer ? 1 : 0)) / items.length} label="Progresso do quiz" />
              <span className="num text-sm font-bold text-brand">{score} ✓</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={item.name}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="mb-4 font-display text-[1.6rem] leading-tight font-bold text-ink sm:text-[1.9rem]"
              >
                {item.name}
              </motion.p>
            </AnimatePresence>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {BINS.map((b) => {
                const isRight = answer && b.key === item.bin
                const isWrong = answer === b.key && b.key !== item.bin
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => choose(b.key)}
                    disabled={!!answer}
                    className={cx(
                      'flex min-h-14 items-center gap-2.5 rounded-2xl border-2 p-2.5 text-left text-sm font-semibold transition-all',
                      !answer && 'border-line hover:-translate-y-0.5 hover:border-brand',
                      isRight && 'border-leaf bg-leaf-soft',
                      isWrong && 'border-danger bg-danger-soft',
                      answer && !isRight && !isWrong && 'border-line opacity-50',
                    )}
                  >
                    <span className="size-7 shrink-0 rounded-lg ring-1 ring-black/10" style={{ background: b.color }} />
                    <span className="min-w-0 leading-tight text-ink">{b.name}</span>
                  </button>
                )
              })}
            </div>
            {answer && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-col gap-3 rounded-2xl bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2 text-sm text-ink">
                  {answer === item.bin ? (
                    <CheckCircle2 size={20} className="shrink-0 text-leaf" />
                  ) : (
                    <XCircle size={20} className="shrink-0 text-danger" />
                  )}
                  <span>
                    <b>{answer === item.bin ? 'Acertou!' : `É na lixeira ${binByKey(item.bin).colorName.toLowerCase()} (${binByKey(item.bin).name}).`}</b> {item.tip}
                  </span>
                </p>
                <button type="button" className="btn btn-primary shrink-0" onClick={next} data-autofocus>
                  {i + 1 >= items.length ? 'Ver resultado' : 'Próximo'}
                </button>
              </motion.div>
            )}
          </div>
        )}

        {phase === 'end' && (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-coin-soft text-coin">
              <Trophy size={32} />
            </span>
            <p className="font-display text-[2rem] font-extrabold text-ink">
              <span className="num">{score}</span>/{items.length} acertos
            </p>
            <p className="max-w-[46ch] text-ink-soft">
              {score >= 8 ? 'Excelente! Você é um(a) mestre da reciclagem.' : score >= 5 ? 'Muito bem! Revise as lixeiras abaixo e tente de novo.' : 'Bom começo! Use a busca “Onde descarto?” e tente outra vez.'}{' '}
              {earned > 0 ? `Você ganhou ${earned} pontos.` : 'Você já atingiu o limite de pontos do quiz hoje, mas pode continuar treinando.'}
            </p>
            <button type="button" className="btn btn-primary" onClick={startGame}>
              <RotateCcw size={18} /> Jogar de novo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
