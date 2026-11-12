import { ExternalLink } from 'lucide-react'
import type { Community } from '../../types'
import { METHODS } from '../../data/communities'
import { CopyField } from '../ui/Primitives'

const isUrl = (v: string) => /^https?:\/\/\S+$/i.test(v)

export function MethodList({ community }: { community: Community }) {
  return (
    <ul className="space-y-3">
      {community.methods.map((m, i) => {
        const meta = METHODS[m.type]
        const Icon = meta.icon
        const copyable = m.type === 'pix' || m.type === 'banco' || m.type === 'link'
        return (
          <li key={`${m.type}-${i}`} className="rounded-2xl border border-line p-3.5">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="grid size-8 place-items-center rounded-xl bg-coin-soft text-[color-mix(in_srgb,var(--coin)_60%,var(--ink))]">
                <Icon size={16} />
              </span>
              {meta.label}
              <span className="text-xs font-normal text-ink-faint">· {meta.hint}</span>
            </p>
            {copyable ? (
              <div className="space-y-2">
                <CopyField value={m.value} label={meta.label} />
                {m.type === 'link' && isUrl(m.value) && !community.example && (
                  <a href={m.value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-ocean hover:underline">
                    Abrir página de doação <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-ink-soft">{m.value}</p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
