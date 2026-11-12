import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { geoContains, geoEqualEarth, geoGraticule10, geoPath } from 'd3-geo'
import { select } from 'd3-selection'
import 'd3-transition'
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom'
import { Minus, Plus, LocateFixed, Maximize2 } from 'lucide-react'
import { loadCountries, countryNamePt, type CountryFeature } from './world'
import { formatLatLng, type LatLng } from '../../lib/geo'
import { cx } from '../../lib/utils'

export interface MapMarker {
  id: string
  lat: number
  lng: number
  label: string
  tone?: 'coin' | 'brand' | 'ocean'
}

export interface PickResult extends LatLng {
  country?: string
}

const W = 960
const projection = geoEqualEarth().fitWidth(W - 16, { type: 'Sphere' })
const sphereBounds = geoPath(projection).bounds({ type: 'Sphere' })
const H = Math.ceil(sphereBounds[1][1] - sphereBounds[0][1]) + 16
projection.translate([W / 2, H / 2])
const pathGen = geoPath(projection)
const SPHERE_D = pathGen({ type: 'Sphere' }) ?? ''
const GRATICULE_D = pathGen(geoGraticule10()) ?? ''

const TONE: Record<NonNullable<MapMarker['tone']>, string> = {
  coin: 'var(--coin)',
  brand: 'var(--brand)',
  ocean: 'var(--ocean)',
}

const Countries = memo(function Countries({ features, picked }: { features: CountryFeature[]; picked?: string }) {
  return (
    <g>
      {features.map((f, i) => (
        <path key={i} d={pathGen(f) ?? ''} className={cx('map-country', picked && f.id === picked && 'is-picked')}>
          <title>{countryNamePt(f)}</title>
        </path>
      ))}
    </g>
  )
})

/**
 * Mapa-múndi vetorial (projeção Equal Earth) com zoom e arrasto.
 * Mostra as comunidades e, no modo de seleção, devolve as coordenadas do clique.
 */
export function WorldMap({
  markers = [],
  selectedId,
  onMarkerClick,
  pickable = false,
  picked,
  onPick,
  focus,
  className,
  label = 'Mapa-múndi das comunidades',
}: {
  markers?: MapMarker[]
  selectedId?: string | null
  onMarkerClick?: (id: string) => void
  pickable?: boolean
  picked?: LatLng | null
  onPick?: (p: PickResult) => void
  focus?: (LatLng & { k?: number }) | null
  className?: string
  label?: string
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [t, setT] = useState<ZoomTransform>(zoomIdentity)
  const [features, setFeatures] = useState<CountryFeature[] | null>(null)
  const [cursor, setCursor] = useState<LatLng | null>(null)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    let alive = true
    loadCountries().then((f) => alive && setFeatures(f))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 24])
      .translateExtent([
        [0, 0],
        [W, H],
      ])
      .filter((e: Event) => {
        if (e.type === 'wheel') return (e as WheelEvent).ctrlKey || (e as WheelEvent).metaKey
        if (e.type === 'touchstart') return (e as TouchEvent).touches.length >= 2
        return !(e as MouseEvent).button
      })
      .on('zoom', (e) => setT(e.transform))
    select(svg).call(z)
    zoomRef.current = z
    return () => {
      select(svg).on('.zoom', null)
    }
  }, [])

  // Centraliza num ponto quando `focus` muda
  useEffect(() => {
    const svg = svgRef.current
    const z = zoomRef.current
    if (!svg || !z || !focus) return
    const p = projection([focus.lng, focus.lat])
    if (!p) return
    const k = focus.k ?? 5
    const target = zoomIdentity
      .translate(W / 2, H / 2)
      .scale(k)
      .translate(-p[0], -p[1])
    select(svg).transition().duration(750).call(z.transform, target)
  }, [focus?.lat, focus?.lng, focus?.k]) // eslint-disable-line react-hooks/exhaustive-deps

  const zoomBy = (factor: number) => {
    const svg = svgRef.current
    if (svg && zoomRef.current) select(svg).transition().duration(300).call(zoomRef.current.scaleBy, factor)
  }
  const reset = () => {
    const svg = svgRef.current
    if (svg && zoomRef.current) select(svg).transition().duration(500).call(zoomRef.current.transform, zoomIdentity)
  }

  const toLatLng = (clientX: number, clientY: number): LatLng | null => {
    const svg = svgRef.current
    if (!svg) return null
    const ctm = svg.getScreenCTM()
    if (!ctm) return null
    const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
    const [x, y] = t.invert([pt.x, pt.y])
    const ll = projection.invert?.([x, y])
    if (!ll || !Number.isFinite(ll[0]) || !Number.isFinite(ll[1])) return null
    // fora da elipse da Terra?
    const back = projection(ll)
    if (!back || Math.hypot(back[0] - x, back[1] - y) > 1) return null
    return { lat: ll[1], lng: ll[0] }
  }

  const pickedCountry = useMemo(() => {
    if (!picked || !features) return undefined
    return features.find((f) => geoContains(f, [picked.lng, picked.lat]))
  }, [picked, features])

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pickable || !onPick) return
    if ((e.target as Element).closest('[data-marker]')) return
    const ll = toLatLng(e.clientX, e.clientY)
    if (!ll) return
    const country = features?.find((f) => geoContains(f, [ll.lng, ll.lat]))
    onPick({ ...ll, country: country ? countryNamePt(country) : undefined })
  }

  const project = (ll: LatLng) => {
    const p = projection([ll.lng, ll.lat])
    return p ? t.apply(p) : null
  }

  const pickedXY = picked ? project(picked) : null

  return (
    <div className={cx('relative overflow-hidden rounded-3xl border border-line bg-[var(--sea)]', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className={cx('block h-auto w-full touch-pan-x touch-pan-y select-none', pickable ? 'map-pickable cursor-crosshair' : 'cursor-grab')}
        role="group"
        aria-label={label}
        onClick={onClick}
        onPointerDown={(e) => setIsTouch(e.pointerType === 'touch')}
        onPointerMove={(e) => pickable && e.pointerType !== 'touch' && setCursor(toLatLng(e.clientX, e.clientY))}
        onPointerLeave={() => setCursor(null)}
      >
        <g transform={t.toString()}>
          <path d={SPHERE_D} fill="var(--sea)" />
          <path d={GRATICULE_D} fill="none" stroke="var(--ocean)" strokeOpacity={0.14} strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
          {features && <Countries features={features} picked={pickedCountry?.id} />}
          <path d={SPHERE_D} fill="none" stroke="var(--ocean)" strokeOpacity={0.3} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        </g>

        {markers.map((m) => {
          const p = project(m)
          if (!p) return null
          const active = selectedId === m.id
          const color = TONE[m.tone ?? 'coin']
          return (
            <g
              key={m.id}
              data-marker
              transform={`translate(${p[0]},${p[1]})`}
              className={onMarkerClick ? 'cursor-pointer' : undefined}
              onClick={(e) => {
                e.stopPropagation()
                onMarkerClick?.(m.id)
              }}
              role={onMarkerClick ? 'button' : undefined}
              tabIndex={onMarkerClick ? 0 : undefined}
              aria-label={m.label}
              onKeyDown={(e) => {
                if (onMarkerClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  onMarkerClick(m.id)
                }
              }}
            >
              <title>{m.label}</title>
              <circle r={16} fill="transparent" />
              {active && <circle r={7} fill={color} className="pin-pulse" />}
              <path
                d="M0 0c-1.2-3.4-7.5-8.6-7.5-13.5a7.5 7.5 0 0 1 15 0C7.5-8.6 1.2-3.4 0 0z"
                fill={color}
                stroke="#ffffff"
                strokeWidth={1.8}
                transform={active ? 'scale(1.3)' : undefined}
              />
              <circle cy={-13.5} r={2.6} fill="#ffffff" transform={active ? 'scale(1.3)' : undefined} />
            </g>
          )
        })}

        {pickedXY && (
          <g transform={`translate(${pickedXY[0]},${pickedXY[1]})`} pointerEvents="none">
            <circle r={8} fill="var(--danger)" className="pin-pulse" />
            <path d="M0 0c-1.4-4-9-10.2-9-16a9 9 0 0 1 18 0c0 5.8-7.6 12-9 16z" fill="var(--danger)" stroke="#ffffff" strokeWidth={2} />
            <circle cy={-16} r={3.2} fill="#ffffff" />
          </g>
        )}
      </svg>

      {!features && (
        <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-ink-soft">Carregando mapa…</div>
      )}

      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        <button type="button" className="btn btn-secondary btn-icon btn-sm shadow-[var(--shadow-soft)]" onClick={() => zoomBy(1.8)} aria-label="Aproximar">
          <Plus size={18} />
        </button>
        <button type="button" className="btn btn-secondary btn-icon btn-sm shadow-[var(--shadow-soft)]" onClick={() => zoomBy(1 / 1.8)} aria-label="Afastar">
          <Minus size={18} />
        </button>
        <button type="button" className="btn btn-secondary btn-icon btn-sm shadow-[var(--shadow-soft)]" onClick={reset} aria-label="Ver o mundo inteiro">
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-2.5 left-3 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-2 text-[0.72rem] font-medium text-ink-soft">
        {pickable && cursor ? (
          <span className="flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 font-mono text-ink shadow-[var(--shadow-soft)]">
            <LocateFixed size={12} /> {formatLatLng(cursor, 2)}
          </span>
        ) : (
          <span className="rounded-full bg-surface/85 px-2.5 py-1">
            {isTouch ? 'Use dois dedos para mover e dar zoom' : 'Arraste para mover · Ctrl + rolagem para zoom'}
          </span>
        )}
      </div>
    </div>
  )
}
