export type Category = 'agua' | 'energia' | 'residuos' | 'consumo' | 'alimentacao' | 'mobilidade' | 'natureza' | 'comunidade'

export type Frequency = 'daily' | 'weekly' | 'once'
export type Difficulty = 'facil' | 'medio' | 'dificil'

export interface Impact {
  waterL?: number
  co2Kg?: number
  plastic?: number
  wasteKg?: number
  trees?: number
  kwh?: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  category: Category
  frequency: Frequency
  difficulty: Difficulty
  points: number
  sdgs: number[]
  impact: Impact
  steps?: string[]
  custom?: boolean
}

export interface Tip {
  id: string
  title: string
  text: string
  category: Category
  sdg: number
  saving?: string
}

export type NeedKey =
  | 'agua'
  | 'alimentacao'
  | 'educacao'
  | 'saude'
  | 'energia'
  | 'reflorestamento'
  | 'reciclagem'
  | 'moradia'
  | 'renda'

export type MethodType = 'pix' | 'banco' | 'link' | 'itens' | 'voluntariado'

export interface DonationMethod {
  type: MethodType
  value: string
}

export interface Community {
  id: string
  name: string
  city: string
  country: string
  lat: number
  lng: number
  about: string
  participants: number
  needs: NeedKey[]
  methods: DonationMethod[]
  contact: string
  languages: string[]
  supporters: number
  goal: number
  verified: boolean
  example?: boolean
  createdBy: 'seed' | 'user'
  createdAt: string
}

export type DonationKind = 'dinheiro' | 'itens' | 'voluntariado'

export interface Donation {
  id: string
  communityId: string
  communityName: string
  kind: DonationKind
  amount?: number
  currency?: string
  items?: string
  hours?: number
  message?: string
  at: string
}

export interface ChatMessage {
  id: string
  channel: string
  author: string
  place: string
  lang: string
  text: string
  translation?: string
  at: string
  mine?: boolean
}

export type ActivityType = 'challenge' | 'tip' | 'quiz' | 'donation' | 'community' | 'chat' | 'custom' | 'profile'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  detail?: string
  points: number
  at: string
}
