import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { WASTE_ITEMS, binByKey } from '../../data/recycling'
import { BinSwatch, binText } from './BinSwatch'

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

const SUGGESTIONS = ['pilha', 'caixa de pizza', 'óleo', 'espelho', 'isopor', 'celular']

export function WasteSearch() {
  const [q, setQ] = useState('')
  const results = useMemo(() => {
    const term = norm(q.trim())
    if (term.length < 2) return []
    return WASTE_ITEMS.filter((i) => norm(i.name).includes(term) || i.aliases?.some((a) => norm(a).includes(term))).slice(0, 6)
  }, [q])

  return (
    <div className="card p-5 sm:p-6">
      <label htmlFor="waste-search" className="font-display text-[1.25rem] font-bold text-ink">
        Onde descarto…?
      </label>
      <p className="mt-0.5 text-sm text-ink-soft">Digite um objeto e veja a lixeira certa e como preparar o descarte.</p>
      <div className="relative mt-4">
        <Search size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint" />
        <input
          id="waste-search"
          className="input min-h-13 pl-12 text-base"
          placeholder="Ex.: garrafa PET, pilha, caixa de leite…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
        {q && (
          <button type="button" className="btn btn-ghost btn-icon btn-sm absolute top-1/2 right-2 -translate-y-1/2" onClick={() => setQ('')} aria-label="Limpar busca">
            <X size={18} />
          </button>
        )}
      </div>
      {!q && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-ink-faint">Experimente:</span>
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="chip min-h-8 text-xs" onClick={() => setQ(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 space-y-2" aria-live="polite">
        {q.trim().length >= 2 && results.length === 0 && (
          <p className="rounded-2xl bg-surface-2 p-4 text-sm text-ink-soft">
            Não encontramos “{q}”. Na dúvida, procure a cooperativa ou o ecoponto da sua cidade — e evite misturar com o lixo comum.
          </p>
        )}
        {results.map((item) => {
          const bin = binByKey(item.bin)
          return (
            <div key={item.name} className="flex items-start gap-3 rounded-2xl border border-line p-3.5">
              <BinSwatch bin={bin} size={46} />
              <div className="min-w-0">
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="text-sm font-semibold" style={{ color: binText(bin.color) }}>
                  {bin.colorName} · {bin.name}
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">{item.tip}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
