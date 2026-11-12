import type { Activity, Challenge, Donation, Community, ChatMessage } from '../types'
import type { ChallengeRecord } from './progress'
import { streakDays } from './progress'
import { Footprints, Droplets, Zap, Recycle, HeartHandshake, MapPinned, MessagesSquare, Flame, PencilRuler, Trophy, type LucideIcon } from 'lucide-react'

export interface Badge {
  id: string
  name: string
  description: string
  icon: LucideIcon
}

export const BADGES: Badge[] = [
  { id: 'primeiro-passo', name: 'Primeiro passo', description: 'Conclua seu primeiro desafio', icon: Footprints },
  { id: 'guardiao-agua', name: 'Guardião da Água', description: 'Conclua 5 desafios de água', icon: Droplets },
  { id: 'energia-consciente', name: 'Energia consciente', description: 'Conclua 5 desafios de energia', icon: Zap },
  { id: 'mestre-reciclagem', name: 'Mestre da Reciclagem', description: 'Acerte 8 ou mais no quiz “Qual lixeira?”', icon: Recycle },
  { id: 'coracao-global', name: 'Coração Global', description: 'Registre sua primeira doação', icon: HeartHandshake },
  { id: 'fundador', name: 'Fundador(a)', description: 'Cadastre uma comunidade no mapa', icon: MapPinned },
  { id: 'voz-global', name: 'Voz Global', description: 'Envie uma mensagem no chat internacional', icon: MessagesSquare },
  { id: 'constancia', name: 'Constância', description: 'Tenha atividades 3 dias seguidos', icon: Flame },
  { id: 'criador', name: 'Criador(a)', description: 'Crie um desafio próprio', icon: PencilRuler },
  { id: 'pontos-500', name: '500 pontos', description: 'Alcance 500 pontos', icon: Trophy },
]

export interface BadgeInput {
  points: number
  challenges: Challenge[]
  records: Record<string, ChallengeRecord>
  quizBest: number
  donations: Donation[]
  communities: Community[]
  messages: ChatMessage[]
  activities: Activity[]
  customCount: number
}

export function earnedBadges(s: BadgeInput): Set<string> {
  const earned = new Set<string>()
  const completionsBy = (cat: string) =>
    s.challenges.filter((c) => c.category === cat).reduce((n, c) => n + (s.records[c.id]?.completions.length ?? 0), 0)
  const total = Object.values(s.records).reduce((n, r) => n + r.completions.length, 0)
  if (total >= 1) earned.add('primeiro-passo')
  if (completionsBy('agua') >= 5) earned.add('guardiao-agua')
  if (completionsBy('energia') >= 5) earned.add('energia-consciente')
  if (s.quizBest >= 8) earned.add('mestre-reciclagem')
  if (s.donations.length >= 1) earned.add('coracao-global')
  if (s.communities.length >= 1) earned.add('fundador')
  if (s.messages.some((m) => m.mine)) earned.add('voz-global')
  if (streakDays(s.activities) >= 3) earned.add('constancia')
  if (s.customCount >= 1) earned.add('criador')
  if (s.points >= 500) earned.add('pontos-500')
  return earned
}
