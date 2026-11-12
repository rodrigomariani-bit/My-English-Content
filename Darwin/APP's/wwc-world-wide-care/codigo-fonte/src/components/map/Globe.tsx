import { useEffect, useRef, useState } from 'react'
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo'
import type { Feature, FeatureCollection } from 'geojson'
import { loadLand } from './world'
import { prefersReducedMotion } from '../../lib/utils'

export interface GlobeMarker {
  id: string
  lat: number
  lng: number
  label: string
}

function readColors() {
  const cs = getComputedStyle(document.documentElement)
  const v = (n: string) => cs.getPropertyValue(n).trim()
  return { sea: v('--sea'), land: v('--leaf'), brand: v('--brand'), coin: v('--coin'), sky: v('--sky-strong'), surface: v('--surface'), ink: v('--ink') }
}

/**
 * Globo em canvas (projeção ortográfica). Gira sozinho, pode ser arrastado
 * e cada ponto dourado é uma comunidade clicável.
 */
export function Globe({ markers, onSelect }: { markers: GlobeMarker[]; onSelect: (id: string) => void }) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [hover, setHover] = useState<GlobeMarker | null>(null)
  const markersRef = useRef(markers)
  markersRef.current = markers
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const el = canvas.current
    const box = wrap.current
    if (!el || !box) return
    const ctx = el.getContext('2d')
    if (!ctx) return

    let land: Feature | FeatureCollection | null = null
    let disposed = false
    loadLand().then((l) => {
      if (!disposed) land = l
    })

    const graticule = geoGraticule10()
    const projection = geoOrthographic().clipAngle(90)
    const path = geoPath(projection, ctx)
    const rotation: [number, number] = [50, -12]
    let size = 0
    let dpr = 1
    let colors = readColors()
    let colorTick = 0
    let visible = true
    let raf = 0
    let last = performance.now()
    const reduced = prefersReducedMotion()
    let drag: { x: number; y: number; moved: number; r: [number, number] } | null = null
    let hovered: GlobeMarker | null = null

    const resize = () => {
      size = Math.min(box.clientWidth, 520)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      el.width = size * dpr
      el.height = size * dpr
      el.style.width = `${size}px`
      el.style.height = `${size}px`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(box)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)

    const radius = () => size * 0.44

    const visibleMarkers = () => {
      const center: [number, number] = [-rotation[0], -rotation[1]]
      const out: { m: GlobeMarker; x: number; y: number }[] = []
      for (const m of markersRef.current) {
        if (geoDistance([m.lng, m.lat], center) > Math.PI / 2 - 0.08) continue
        const p = projection([m.lng, m.lat])
        if (p) out.push({ m, x: p[0], y: p[1] })
      }
      return out
    }

    const draw = (t: number) => {
      if (++colorTick % 30 === 0) colors = readColors()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size, size)
      const r = radius()
      const cx = size / 2
      const cy = size / 2
      projection.scale(r).translate([cx, cy]).rotate([rotation[0], rotation[1]])

      // atmosfera
      const halo = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.14)
      halo.addColorStop(0, colors.sky)
      halo.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.globalAlpha = 0.55
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(cx, cy, r * 1.14, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      // oceano
      const sea = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r)
      sea.addColorStop(0, colors.surface)
      sea.addColorStop(0.35, colors.sea)
      sea.addColorStop(1, colors.sky)
      ctx.beginPath()
      path({ type: 'Sphere' })
      ctx.fillStyle = sea
      ctx.fill()

      ctx.beginPath()
      path(graticule)
      ctx.strokeStyle = colors.brand
      ctx.globalAlpha = 0.12
      ctx.lineWidth = 0.7
      ctx.stroke()
      ctx.globalAlpha = 1

      if (land) {
        ctx.beginPath()
        path(land)
        ctx.fillStyle = colors.land
        ctx.fill()
        ctx.strokeStyle = colors.brand
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      // comunidades
      const pulse = reduced ? 0.5 : (t % 1800) / 1800
      for (const { m, x, y } of visibleMarkers()) {
        const isHover = hovered?.id === m.id
        ctx.beginPath()
        ctx.arc(x, y, 5 + pulse * 11, 0, Math.PI * 2)
        ctx.fillStyle = colors.coin
        ctx.globalAlpha = 0.35 * (1 - pulse)
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.arc(x, y, isHover ? 7.5 : 5.5, 0, Math.PI * 2)
        ctx.fillStyle = colors.coin
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#ffffff'
        ctx.stroke()
      }

      // borda
      ctx.beginPath()
      path({ type: 'Sphere' })
      ctx.strokeStyle = colors.brand
      ctx.globalAlpha = 0.25
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    const loop = (t: number) => {
      const dt = Math.min(64, t - last)
      last = t
      if (visible) {
        if (!reduced && !drag && !hovered) rotation[0] += dt * 0.008
        draw(t)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const local = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const pick = (x: number, y: number) => {
      let best: GlobeMarker | null = null
      let bestD = 16
      for (const v of visibleMarkers()) {
        const d = Math.hypot(v.x - x, v.y - y)
        if (d < bestD) {
          bestD = d
          best = v.m
        }
      }
      return best
    }

    const onDown = (e: PointerEvent) => {
      const p = local(e)
      drag = { x: p.x, y: p.y, moved: 0, r: [rotation[0], rotation[1]] }
      el.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      const p = local(e)
      if (drag) {
        const dx = p.x - drag.x
        const dy = p.y - drag.y
        drag.moved = Math.max(drag.moved, Math.hypot(dx, dy))
        const k = 90 / radius()
        rotation[0] = drag.r[0] + dx * k
        rotation[1] = Math.max(-60, Math.min(60, drag.r[1] - dy * k))
        return
      }
      const h = pick(p.x, p.y)
      if (h?.id !== hovered?.id) {
        hovered = h
        setHover(h)
        el.style.cursor = h ? 'pointer' : 'grab'
      }
    }
    const onUp = (e: PointerEvent) => {
      if (drag && drag.moved < 5) {
        const p = local(e)
        const h = pick(p.x, p.y)
        if (h) onSelectRef.current(h.id)
      }
      drag = null
    }
    const onLeave = () => {
      if (!drag) {
        hovered = null
        setHover(null)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') rotation[0] -= 12
      else if (e.key === 'ArrowRight') rotation[0] += 12
      else if (e.key === 'ArrowUp') rotation[1] = Math.max(-60, rotation[1] - 10)
      else if (e.key === 'ArrowDown') rotation[1] = Math.min(60, rotation[1] + 10)
      else return
      e.preventDefault()
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('keydown', onKey)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={wrap} className="relative flex w-full flex-col items-center">
      <canvas
        ref={canvas}
        tabIndex={0}
        className="max-w-full cursor-grab touch-pan-y rounded-full active:cursor-grabbing"
        aria-label="Globo com as comunidades do WWC. Arraste ou use as setas para girar."
        role="img"
      />
      <p className="mt-1 h-5 text-center text-sm font-semibold text-ink-soft" aria-live="polite">
        {hover ? hover.label : 'Arraste o globo e toque num ponto dourado'}
      </p>
    </div>
  )
}
