import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { AppShell } from './components/layout/AppShell'
import { Toaster } from './components/ui/Toaster'
import { HomePage } from './pages/Home'
import { RecyclingPage } from './pages/Recycling'
import { TipsPage } from './pages/Tips'
import { ChallengesPage } from './pages/Challenges'
import { CommunitiesPage } from './pages/Communities'
import { CommunityDetailPage } from './pages/CommunityDetail'
import { RegisterCommunityPage } from './pages/RegisterCommunity'
import { GlobalChatPage } from './pages/GlobalChat'
import { ProfilePage } from './pages/Profile'
import { ProjectPage } from './pages/Project'
import { useRoute, type Route } from './lib/router'
import { useAllChallenges, useAppStore } from './store/useAppStore'
import { BADGES, earnedBadges } from './lib/badges'
import { toast } from './store/toast'

const TITLES: Record<Route['name'], string> = {
  inicio: 'Início',
  reciclagem: 'Reciclagem',
  dicas: 'Dicas sustentáveis',
  desafios: 'Desafios ambientais',
  comunidades: 'Comunidades e doações',
  comunidade: 'Comunidade',
  cadastrar: 'Cadastrar comunidade',
  editar: 'Editar comunidade',
  mural: 'Mural global',
  perfil: 'Meu perfil',
  projeto: 'Apresentação do projeto',
}

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case 'reciclagem':
      return <RecyclingPage />
    case 'dicas':
      return <TipsPage />
    case 'desafios':
      return <ChallengesPage />
    case 'comunidades':
      return <CommunitiesPage />
    case 'comunidade':
      return <CommunityDetailPage id={route.param} />
    case 'cadastrar':
      return <RegisterCommunityPage />
    case 'editar':
      return <RegisterCommunityPage editId={route.param} />
    case 'mural':
      return <GlobalChatPage />
    case 'perfil':
      return <ProfilePage />
    case 'projeto':
      return <ProjectPage />
    default:
      return <HomePage />
  }
}

/** Aplica a preferência de tema escolhida no app sem apagar a do sistema/anfitrião. */
function useThemePreference() {
  const theme = useAppStore((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-app-theme')
    else root.setAttribute('data-app-theme', theme)
  }, [theme])
}

/** Avisa quando uma conquista nova é desbloqueada. */
function useBadgeWatcher() {
  const s = useAppStore()
  const all = useAllChallenges()
  const earned = useMemo(
    () =>
      earnedBadges({
        points: s.points,
        challenges: all,
        records: s.challenges,
        quizBest: s.quiz.best,
        donations: s.donations,
        communities: s.communities,
        messages: s.messages,
        activities: s.activities,
        customCount: s.customChallenges.length,
      }),
    [s.points, all, s.challenges, s.quiz.best, s.donations, s.communities, s.messages, s.activities, s.customChallenges.length],
  )
  const first = useRef(true)
  useEffect(() => {
    const fresh = [...earned].filter((id) => !s.seenBadges.includes(id))
    if (!fresh.length) return
    // Na primeira renderização só sincroniza, sem avisos (ex.: dados já existentes).
    if (!first.current) {
      for (const id of fresh.slice(0, 2)) {
        const b = BADGES.find((x) => x.id === id)
        if (b) toast({ title: `Conquista desbloqueada: ${b.name}`, detail: b.description, tone: 'badge' })
      }
    }
    s.markBadgesSeen(fresh)
  }, [earned]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    first.current = false
  }, [])
}

export default function App() {
  const route = useRoute()
  const key = `${route.name}-${route.param ?? ''}`
  useThemePreference()
  useBadgeWatcher()

  useEffect(() => {
    window.scrollTo({ top: 0 })
    document.title = `${TITLES[route.name]} · WWC – World Wide Care`
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MotionConfig reducedMotion="user">
      <AppShell route={route}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
            <Page route={route} />
          </motion.div>
        </AnimatePresence>
      </AppShell>
      <Toaster />
    </MotionConfig>
  )
}
