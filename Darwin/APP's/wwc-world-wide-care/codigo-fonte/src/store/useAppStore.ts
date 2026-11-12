import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useMemo } from 'react'
import type { Activity, ActivityType, Challenge, ChatMessage, Community, Donation, Tip, Category, Frequency, Difficulty } from '../types'
import { CHALLENGES, DIFFICULTY_POINTS } from '../data/challenges'
import { SEED_COMMUNITIES } from '../data/communities'
import { seedMessages } from '../data/chat'
import { safeStorage } from '../lib/storage'
import { challengeStatus, type ChallengeRecord } from '../lib/progress'
import { dayKey, uid } from '../lib/utils'
import { toast } from './toast'

export type ThemePref = 'system' | 'light' | 'dark'
export type AvatarKey = 'leaf' | 'sprout' | 'tree' | 'waves' | 'sun' | 'mountain' | 'bird' | 'flower'

export interface UserProfile {
  name: string
  avatar: AvatarKey
  joinedAt: string
  named: boolean
}

export interface NewChallengeInput {
  title: string
  description: string
  category: Category
  frequency: Frequency
  difficulty: Difficulty
}

export type CommunityInput = Omit<Community, 'id' | 'supporters' | 'goal' | 'verified' | 'createdBy' | 'createdAt' | 'example'> & {
  goal?: number
}

export type DonationInput = Omit<Donation, 'id' | 'at'>

interface QuizStats {
  best: number
  plays: number
  day?: string
  pointsToday: number
}

interface DataState {
  user: UserProfile
  theme: ThemePref
  points: number
  activities: Activity[]
  challenges: Record<string, ChallengeRecord>
  customChallenges: Challenge[]
  favoriteTips: string[]
  practicedTips: Record<string, string>
  quiz: QuizStats
  donations: Donation[]
  communities: Community[]
  messages: ChatMessage[]
  seenBadges: string[]
}

interface Actions {
  setName: (name: string) => void
  setAvatar: (avatar: AvatarKey) => void
  setTheme: (theme: ThemePref) => void
  startChallenge: (id: string) => void
  cancelChallenge: (id: string) => void
  completeChallenge: (id: string) => void
  createChallenge: (input: NewChallengeInput) => string
  deleteChallenge: (id: string) => void
  practiceTip: (tip: Tip) => void
  toggleFavoriteTip: (id: string) => void
  recordQuiz: (correct: number, total: number) => number
  donate: (input: DonationInput) => void
  registerCommunity: (input: CommunityInput) => string
  updateCommunity: (id: string, input: CommunityInput) => void
  deleteCommunity: (id: string) => void
  sendMessage: (channel: string, channelName: string, text: string) => void
  markBadgesSeen: (ids: string[]) => void
  loadDemo: () => void
  resetAll: () => void
}

export type AppState = DataState & Actions

const CATEGORY_SDG: Record<Category, number[]> = {
  agua: [6],
  energia: [7],
  residuos: [12],
  consumo: [12],
  alimentacao: [2, 12],
  mobilidade: [11, 13],
  natureza: [15],
  comunidade: [1, 17],
}

const initialData = (): DataState => ({
  user: { name: '', avatar: 'leaf', joinedAt: new Date().toISOString(), named: false },
  theme: 'system',
  points: 0,
  activities: [],
  challenges: {},
  customChallenges: [],
  favoriteTips: [],
  practicedTips: {},
  quiz: { best: 0, plays: 0, pointsToday: 0 },
  donations: [],
  communities: [],
  messages: [],
  seenBadges: [],
})

function slugify(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32)
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      /** Registra uma atividade no histórico e soma os pontos. */
      const log = (type: ActivityType, title: string, points: number, detail?: string, silent = false) => {
        const activity: Activity = { id: uid('a'), type, title, detail, points, at: new Date().toISOString() }
        set((s) => ({ activities: [activity, ...s.activities].slice(0, 400), points: s.points + points }))
        if (!silent && points > 0) toast({ title, detail, points, tone: 'success' })
      }

      const allChallenges = () => [...CHALLENGES, ...get().customChallenges]

      return {
        ...initialData(),

        setName: (name) => {
          const clean = name.trim().slice(0, 40)
          if (!clean) return
          const first = !get().user.named
          set((s) => ({ user: { ...s.user, name: clean, named: true } }))
          if (first) log('profile', 'Perfil criado', 10, `Bem-vindo(a), ${clean}!`)
          else toast({ title: 'Nome atualizado', tone: 'info' })
        },

        setAvatar: (avatar) => set((s) => ({ user: { ...s.user, avatar } })),

        setTheme: (theme) => set({ theme }),

        startChallenge: (id) => {
          const ch = allChallenges().find((c) => c.id === id)
          if (!ch) return
          set((s) => ({
            challenges: {
              ...s.challenges,
              [id]: { completions: s.challenges[id]?.completions ?? [], activeSince: new Date().toISOString() },
            },
          }))
          toast({ title: 'Desafio aceito!', detail: ch.title, tone: 'info' })
        },

        cancelChallenge: (id) =>
          set((s) => {
            const rec = s.challenges[id]
            if (!rec) return s
            return { challenges: { ...s.challenges, [id]: { completions: rec.completions } } }
          }),

        completeChallenge: (id) => {
          const ch = allChallenges().find((c) => c.id === id)
          if (!ch) return
          const { status } = challengeStatus(ch, get().challenges[id])
          if (status === 'cooldown' || status === 'done') return
          const now = new Date().toISOString()
          set((s) => ({
            challenges: { ...s.challenges, [id]: { completions: [...(s.challenges[id]?.completions ?? []), now] } },
          }))
          log('challenge', ch.title, ch.points, 'Desafio concluído')
        },

        createChallenge: (input) => {
          const id = `custom-${uid()}`
          const ch: Challenge = {
            id,
            title: input.title.trim(),
            description: input.description.trim(),
            category: input.category,
            frequency: input.frequency,
            difficulty: input.difficulty,
            points: DIFFICULTY_POINTS[input.difficulty],
            sdgs: CATEGORY_SDG[input.category],
            impact: {},
            custom: true,
          }
          set((s) => ({
            customChallenges: [ch, ...s.customChallenges],
            challenges: { ...s.challenges, [id]: { completions: [], activeSince: new Date().toISOString() } },
          }))
          log('custom', `Criou o desafio “${ch.title}”`, 10)
          return id
        },

        deleteChallenge: (id) =>
          set((s) => {
            const challenges = { ...s.challenges }
            delete challenges[id]
            return { customChallenges: s.customChallenges.filter((c) => c.id !== id), challenges }
          }),

        practiceTip: (tip) => {
          const today = dayKey()
          if (get().practicedTips[tip.id] === today) return
          set((s) => ({ practicedTips: { ...s.practicedTips, [tip.id]: today } }))
          log('tip', `Praticou: ${tip.title}`, 5, 'Dica sustentável')
        },

        toggleFavoriteTip: (id) =>
          set((s) => ({
            favoriteTips: s.favoriteTips.includes(id) ? s.favoriteTips.filter((t) => t !== id) : [...s.favoriteTips, id],
          })),

        recordQuiz: (correct, total) => {
          const today = dayKey()
          const q = get().quiz
          const usedToday = q.day === today ? q.pointsToday : 0
          const earned = Math.max(0, Math.min(correct * 3, 30 - usedToday))
          set({
            quiz: {
              best: Math.max(q.best, correct),
              plays: q.plays + 1,
              day: today,
              pointsToday: usedToday + earned,
            },
          })
          log('quiz', `Quiz “Qual lixeira?”: ${correct}/${total}`, earned, earned ? 'Reciclagem' : 'Limite diário de pontos do quiz atingido', earned === 0)
          return earned
        },

        donate: (input) => {
          const today = dayKey()
          const already = get().donations.some((d) => d.communityId === input.communityId && dayKey(new Date(d.at)) === today)
          const donation: Donation = { ...input, id: uid('d'), at: new Date().toISOString() }
          set((s) => ({ donations: [donation, ...s.donations] }))
          log('donation', `Apoio a ${input.communityName}`, already ? 0 : 50, 'Doação registrada · 0% de taxas', true)
          toast({ title: 'Obrigado pelo seu apoio!', detail: input.communityName, points: already ? undefined : 50, tone: 'coin' })
        },

        registerCommunity: (input) => {
          const id = `${slugify(input.name) || 'comunidade'}-${uid().slice(0, 4)}`
          const community: Community = {
            ...input,
            id,
            goal: input.goal ?? 100,
            supporters: 0,
            verified: false,
            createdBy: 'user',
            createdAt: new Date().toISOString(),
          }
          set((s) => ({ communities: [community, ...s.communities] }))
          log('community', `Cadastrou ${community.name}`, 100, `${community.city}, ${community.country}`)
          return id
        },

        updateCommunity: (id, input) => {
          set((s) => ({
            communities: s.communities.map((c) => (c.id === id ? { ...c, ...input, goal: input.goal ?? c.goal } : c)),
          }))
          toast({ title: 'Comunidade atualizada', detail: input.name, tone: 'info' })
        },

        deleteCommunity: (id) =>
          set((s) => ({
            communities: s.communities.filter((c) => c.id !== id),
            messages: s.messages.filter((m) => m.channel !== id),
          })),

        sendMessage: (channel, channelName, text) => {
          const clean = text.trim().slice(0, 600)
          if (!clean) return
          const { user } = get()
          const msg: ChatMessage = {
            id: uid('m'),
            channel,
            author: user.named ? user.name : 'Você',
            place: 'Você',
            lang: 'pt',
            text: clean,
            at: new Date().toISOString(),
            mine: true,
          }
          const today = dayKey()
          const loggedToday = get().activities.some(
            (a) => a.type === 'chat' && a.detail === channelName && dayKey(new Date(a.at)) === today,
          )
          set((s) => ({ messages: [...s.messages, msg] }))
          if (!loggedToday) log('chat', 'Participou do chat internacional', 0, channelName, true)
        },

        markBadgesSeen: (ids) => set((s) => ({ seenBadges: Array.from(new Set([...s.seenBadges, ...ids])) })),

        loadDemo: () => {
          const now = new Date()
          const at = (daysAgo: number, hour: number) => {
            const d = new Date(now)
            d.setDate(d.getDate() - daysAgo)
            d.setHours(hour, 15, 0, 0)
            return d.toISOString()
          }
          const plan: Array<[string, number, number]> = [
            ['banho-5', 6, 8], ['torneira-fechada', 6, 21], ['garrafa-reutilizavel', 5, 9], ['standby', 5, 22],
            ['banho-5', 4, 7], ['bike-pe', 4, 12], ['separar-lixo', 3, 19], ['banho-5', 3, 7],
            ['refeicao-vegetal', 2, 20], ['torneira-fechada', 2, 21], ['standby', 1, 22], ['banho-5', 1, 7],
            ['sem-plastico', 1, 18], ['plantar-muda', 0, 10],
          ]
          const challenges: Record<string, ChallengeRecord> = {}
          const activities: Activity[] = []
          let points = 10
          for (const [id, daysAgo, hour] of plan) {
            const ch = CHALLENGES.find((c) => c.id === id)!
            const when = at(daysAgo, hour)
            challenges[id] = { completions: [...(challenges[id]?.completions ?? []), when] }
            activities.push({ id: uid('a'), type: 'challenge', title: ch.title, detail: 'Desafio concluído', points: ch.points, at: when })
            points += ch.points
          }
          challenges['lista-compras'] = { completions: [], activeSince: at(0, 9) }
          activities.push({ id: uid('a'), type: 'quiz', title: 'Quiz “Qual lixeira?”: 9/10', detail: 'Reciclagem', points: 27, at: at(3, 16) })
          activities.push({ id: uid('a'), type: 'tip', title: 'Praticou: Use um copo ao escovar os dentes', detail: 'Dica sustentável', points: 5, at: at(2, 8) })
          activities.push({ id: uid('a'), type: 'donation', title: 'Apoio a Vila Esperança do Rio Negro', detail: 'Doação registrada · 0% de taxas', points: 50, at: at(1, 15) })
          activities.push({ id: uid('a'), type: 'profile', title: 'Perfil criado', detail: 'Exemplo de demonstração', points: 0, at: at(7, 10) })
          points += 27 + 5 + 50
          activities.sort((a, b) => b.at.localeCompare(a.at))
          set((s) => ({
            user: s.user.named ? s.user : { ...s.user, name: 'Estudante WWC', named: true },
            points,
            activities,
            challenges,
            quiz: { best: 9, plays: 3, pointsToday: 0 },
            practicedTips: {},
            donations: [
              {
                id: uid('d'),
                communityId: 'vila-esperanca',
                communityName: 'Vila Esperança do Rio Negro',
                kind: 'itens',
                items: '2 filtros de barro',
                message: 'Para a escola flutuante!',
                at: at(1, 15),
              },
            ],
          }))
          toast({ title: 'Dados de exemplo carregados', detail: 'Explore o perfil e o histórico', tone: 'info' })
        },

        resetAll: () => {
          const theme = get().theme
          set({ ...initialData(), theme })
          toast({ title: 'Dados apagados', detail: 'O app voltou ao início', tone: 'info' })
        },
      }
    },
    {
      name: 'wwc-world-wide-care',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)

/* ---------- Seletores derivados ---------- */

const SEED_MESSAGES = seedMessages()

export function useAllChallenges(): Challenge[] {
  const custom = useAppStore((s) => s.customChallenges)
  return useMemo(() => [...custom, ...CHALLENGES], [custom])
}

export function useCommunities(): Community[] {
  const mine = useAppStore((s) => s.communities)
  const donations = useAppStore((s) => s.donations)
  return useMemo(() => {
    const count = new Map<string, number>()
    for (const d of donations) count.set(d.communityId, (count.get(d.communityId) ?? 0) + 1)
    return [...mine, ...SEED_COMMUNITIES].map((c) => ({ ...c, supporters: c.supporters + (count.get(c.id) ?? 0) }))
  }, [mine, donations])
}

export function useCommunity(id: string | undefined): Community | undefined {
  const all = useCommunities()
  return all.find((c) => c.id === id)
}

export function useChannelMessages(channel: string): ChatMessage[] {
  const mine = useAppStore((s) => s.messages)
  return useMemo(
    () => [...SEED_MESSAGES.filter((m) => m.channel === channel), ...mine.filter((m) => m.channel === channel)].sort((a, b) => a.at.localeCompare(b.at)),
    [mine, channel],
  )
}
