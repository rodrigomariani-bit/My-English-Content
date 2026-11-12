import { Bookmark, BookmarkCheck, CheckCircle2, Sparkles } from 'lucide-react'
import type { Tip } from '../../types'
import { CATEGORIES } from '../../data/categories'
import { useAppStore } from '../../store/useAppStore'
import { SdgBadge } from '../ui/Primitives'
import { cx, dayKey } from '../../lib/utils'

export function TipActions({ tip, size = 'sm' }: { tip: Tip; size?: 'sm' | 'md' }) {
  const fav = useAppStore((s) => s.favoriteTips.includes(tip.id))
  const practicedToday = useAppStore((s) => s.practicedTips[tip.id] === dayKey())
  const toggleFav = useAppStore((s) => s.toggleFavoriteTip)
  const practice = useAppStore((s) => s.practiceTip)
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        className={cx('btn', size === 'sm' ? 'btn-sm' : '', practicedToday ? 'btn-soft' : 'btn-primary')}
        onClick={() => practice(tip)}
        disabled={practicedToday}
      >
        <CheckCircle2 size={16} />
        {practicedToday ? 'Praticada hoje' : 'Pratiquei hoje · +5'}
      </button>
      <button
        type="button"
        className={cx('btn btn-ghost btn-icon', size === 'sm' && 'btn-sm', fav && 'text-coin')}
        onClick={() => toggleFav(tip.id)}
        aria-pressed={fav}
        aria-label={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        title={fav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      >
        {fav ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>
    </div>
  )
}

export function TipCard({ tip }: { tip: Tip }) {
  const cat = CATEGORIES[tip.category]
  const Icon = cat.icon
  return (
    <article className="card flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: cat.tone }}>
          <Icon size={18} /> {cat.label}
        </span>
        <SdgBadge n={tip.sdg} />
      </div>
      <h3 className="text-[1.08rem] leading-snug font-bold text-ink">{tip.title}</h3>
      <p className="text-sm text-ink-soft">{tip.text}</p>
      {tip.saving && (
        <span className="tag w-fit bg-sky/70 text-ocean">
          <Sparkles size={12} /> Economia: {tip.saving}
        </span>
      )}
      <div className="mt-auto pt-1">
        <TipActions tip={tip} />
      </div>
    </article>
  )
}
