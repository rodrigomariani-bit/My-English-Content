import { cx } from '../../lib/utils'

/** Mão aberta, palma para cima, polegar para fora (a outra é espelhada). */
function Hand() {
  return (
    <>
      <path d="M31 55V34a2.4 2.4 0 0 0-4.8 0v-5a2.4 2.4 0 0 0-4.8 0v-2a2.4 2.4 0 0 0-4.8 0v2.5a2.4 2.4 0 0 0-4.8 0V43l-3.6-5.2a2.5 2.5 0 0 0-4.1 2.8l5.6 9.2c1.8 3 4.4 5.2 7.9 5.2H31z" />
      <path d="M26.2 34v6M21.4 29v11M16.6 29.5V40M14 55v6M31 55v6" />
    </>
  )
}

/**
 * Ícone do perfil especial de comunidade: mãos brancas, sem preenchimento,
 * recebendo uma moeda com o símbolo monetário universal (¤).
 */
export function CareHandsIcon({
  size = 64,
  animated = true,
  className,
  title = 'Perfil especial de comunidade',
}: {
  size?: number
  animated?: boolean
  className?: string
  title?: string
}) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={cx('text-white', className)} role="img" aria-label={title}>
      <g className={animated ? 'coin-drop' : undefined}>
        <circle cx="32" cy="12" r="7" fill="#f2c14e" stroke="currentColor" strokeWidth="2" />
        <g stroke="#7a5200" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <circle cx="32" cy="12" r="2.4" />
          <path d="M29.7 9.7l-1.4-1.4M34.3 9.7l1.4-1.4M29.7 14.3l-1.4 1.4M34.3 14.3l1.4 1.4" />
        </g>
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(-9 31 58)">
          <Hand />
        </g>
        <g transform="matrix(-1 0 0 1 64 0) rotate(-9 31 58)">
          <Hand />
        </g>
      </g>
    </svg>
  )
}

/** Selo compacto: o ícone sobre um disco verde-azulado. */
export function CareHandsBadge({ size = 56, animated = true }: { size?: number; animated?: boolean }) {
  return (
    <span
      className="inline-grid shrink-0 place-items-center rounded-full shadow-[var(--shadow-soft)]"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(140deg, #1f9d67 0%, #11734f 45%, #2672ad 100%)',
      }}
    >
      <CareHandsIcon size={size * 0.78} animated={animated} />
    </span>
  )
}
