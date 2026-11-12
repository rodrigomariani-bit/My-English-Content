export interface LatLng {
  lat: number
  lng: number
}

export function isValidLatLng(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
}

/**
 * Lê coordenadas de um texto colado: "-23.55, -46.63", um link do Google Maps
 * (…/@-23.55,-46.63,15z ou ?q=-23.55,-46.63), do OpenStreetMap (mlat/mlon ou #map=z/lat/lng)
 * ou graus com hemisfério ("23.55 S 46.63 W").
 */
export function parseCoordinates(input: string): LatLng | null {
  const text = input.trim()
  if (!text) return null
  const num = '(-?\\d{1,3}(?:[.,]\\d+)?)'

  const patterns: RegExp[] = [
    new RegExp(`@${num},\\s*${num}`), // google .../@lat,lng,zoom
    new RegExp(`[?&](?:q|query|ll|destination)=${num}(?:,|%2C)\\s*${num}`, 'i'),
    new RegExp(`!3d${num}!4d${num}`), // google data param
    new RegExp(`#map=\\d+/${num}/${num}`), // openstreetmap
  ]
  for (const re of patterns) {
    const m = text.match(re)
    if (m) {
      const p = { lat: toNum(m[1]), lng: toNum(m[2]) }
      if (isValidLatLng(p.lat, p.lng)) return p
    }
  }

  const mlat = text.match(new RegExp(`mlat=${num}`, 'i'))
  const mlon = text.match(new RegExp(`mlon=${num}`, 'i'))
  if (mlat && mlon) {
    const p = { lat: toNum(mlat[1]), lng: toNum(mlon[1]) }
    if (isValidLatLng(p.lat, p.lng)) return p
  }

  // "23.55 S, 46.63 W" ou "23.55°S 46.63°O"
  const hemi = text.match(/(\d{1,3}(?:[.,]\d+)?)\s*°?\s*([NS])[\s,;]+(\d{1,3}(?:[.,]\d+)?)\s*°?\s*([EWLO])/i)
  if (hemi) {
    let lat = toNum(hemi[1])
    let lng = toNum(hemi[3])
    if (hemi[2].toUpperCase() === 'S') lat = -lat
    if (['W', 'O'].includes(hemi[4].toUpperCase())) lng = -lng
    if (isValidLatLng(lat, lng)) return { lat, lng }
  }

  // Par simples "lat, lng" ou "lat lng"
  const pair = text.match(/^\s*(-?\d{1,3}(?:\.\d+)?)\s*[,;\s]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/)
  if (pair) {
    const p = { lat: Number(pair[1]), lng: Number(pair[2]) }
    if (isValidLatLng(p.lat, p.lng)) return p
  }
  return null
}

function toNum(s: string) {
  return Number(s.replace(',', '.'))
}

/** Formato legível: 2.6243° S · 60.9431° O */
export function formatLatLng({ lat, lng }: LatLng, digits = 4): string {
  const ns = lat >= 0 ? 'N' : 'S'
  const ew = lng >= 0 ? 'L' : 'O'
  return `${Math.abs(lat).toFixed(digits)}° ${ns} · ${Math.abs(lng).toFixed(digits)}° ${ew}`
}

export function googleMapsUrl({ lat, lng }: LatLng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`
}

export function osmUrl({ lat, lng }: LatLng, zoom = 13) {
  return `https://www.openstreetmap.org/?mlat=${lat.toFixed(6)}&mlon=${lng.toFixed(6)}#map=${zoom}/${lat.toFixed(5)}/${lng.toFixed(5)}`
}

/** Distância aproximada em km (fórmula de haversine). */
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}
