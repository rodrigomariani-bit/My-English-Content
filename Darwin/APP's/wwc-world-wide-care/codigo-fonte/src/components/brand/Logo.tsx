import { useId } from 'react'
import { cx } from '../../lib/utils'

/** Marca WWC: um planeta com meridianos e uma folha ao centro. */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  const gid = useId()
  const cid = useId()
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#3fc47f" />
          <stop offset="0.55" stopColor="#1f8f68" />
          <stop offset="1" stopColor="#2672ad" />
        </linearGradient>
        <clipPath id={cid}>
          <circle cx="24" cy="24" r="22" />
        </clipPath>
      </defs>
      <circle cx="24" cy="24" r="22" fill={`url(#${gid})`} />
      <g clipPath={`url(#${cid})`} fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.2">
        <ellipse cx="24" cy="24" rx="11" ry="22" />
        <path d="M2 16.5h44M2 31.5h44" />
      </g>
      <path d="M24 8.5c8.6 5.6 11 13.4 0 31-11-17.6-8.6-25.4 0-31z" fill="#fff" />
      <path
        d="M24 15.5v21M24 23.5l-4.2-3.2M24 29.5l4.6-3.6"
        stroke="#11734f"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={compact ? 34 : 40} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.32rem] font-extrabold tracking-tight text-ink">WWC</span>
        <span className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-ink-faint">World Wide Care</span>
      </span>
    </span>
  )
}
