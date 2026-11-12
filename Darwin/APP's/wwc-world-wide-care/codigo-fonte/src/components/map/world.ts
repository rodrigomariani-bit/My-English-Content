import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from 'geojson'
import type { GeometryCollection, Topology } from 'topojson-specification'
import { feature } from 'topojson-client'
import { NUMERIC_TO_ALPHA2 } from '../../data/isoNumeric'

export type CountryFeature = Feature<Polygon | MultiPolygon, { name: string }> & { id?: string }

let countries50: Promise<CountryFeature[]> | null = null

/** Países em resolução 1:50m (carregado sob demanda, só quando um mapa aparece). */
export function loadCountries(): Promise<CountryFeature[]> {
  countries50 ??= import('world-atlas/countries-50m.json').then((mod) => {
    const topo = (mod.default ?? mod) as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>
    const fc = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>
    return fc.features as CountryFeature[]
  })
  return countries50
}

let land110: Promise<Feature | FeatureCollection> | null = null

/** Continentes em baixa resolução para o globo da tela inicial. */
export function loadLand(): Promise<Feature | FeatureCollection> {
  land110 ??= import('world-atlas/land-110m.json').then((mod) => {
    const topo = (mod.default ?? mod) as unknown as Topology<{ land: GeometryCollection }>
    return feature(topo, topo.objects.land)
  })
  return land110
}

let displayNames: Intl.DisplayNames | null = null

export function countryNamePt(f: CountryFeature): string {
  const a2 = f.id ? NUMERIC_TO_ALPHA2[String(f.id)] : undefined
  if (a2) {
    try {
      displayNames ??= new Intl.DisplayNames(['pt-BR'], { type: 'region' })
      const n = displayNames.of(a2)
      if (n) return n
    } catch {
      /* navegador sem Intl.DisplayNames */
    }
  }
  return f.properties.name
}
