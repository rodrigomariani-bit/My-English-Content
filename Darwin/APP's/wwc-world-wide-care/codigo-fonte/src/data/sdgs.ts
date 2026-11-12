/** Objetivos de Desenvolvimento Sustentável (Agenda 2030 da ONU) — cores oficiais. */
export interface Sdg {
  n: number
  name: string
  color: string
  darkText?: boolean
}

export const SDGS: Sdg[] = [
  { n: 1, name: 'Erradicação da pobreza', color: '#E5243B' },
  { n: 2, name: 'Fome zero e agricultura sustentável', color: '#DDA63A', darkText: true },
  { n: 3, name: 'Saúde e bem-estar', color: '#4C9F38' },
  { n: 4, name: 'Educação de qualidade', color: '#C5192D' },
  { n: 5, name: 'Igualdade de gênero', color: '#FF3A21' },
  { n: 6, name: 'Água potável e saneamento', color: '#26BDE2', darkText: true },
  { n: 7, name: 'Energia limpa e acessível', color: '#FCC30B', darkText: true },
  { n: 8, name: 'Trabalho decente e crescimento econômico', color: '#A21942' },
  { n: 9, name: 'Indústria, inovação e infraestrutura', color: '#FD6925' },
  { n: 10, name: 'Redução das desigualdades', color: '#DD1367' },
  { n: 11, name: 'Cidades e comunidades sustentáveis', color: '#FD9D24', darkText: true },
  { n: 12, name: 'Consumo e produção responsáveis', color: '#BF8B2E' },
  { n: 13, name: 'Ação contra a mudança global do clima', color: '#3F7E44' },
  { n: 14, name: 'Vida na água', color: '#0A97D9' },
  { n: 15, name: 'Vida terrestre', color: '#56C02B' },
  { n: 16, name: 'Paz, justiça e instituições eficazes', color: '#00689D' },
  { n: 17, name: 'Parcerias e meios de implementação', color: '#19486A' },
]

export const sdg = (n: number) => SDGS[n - 1]

/** ODS diretamente apoiados pelas funções do WWC. */
export const WWC_SDGS = [1, 2, 4, 6, 7, 11, 12, 13, 14, 15, 17]
