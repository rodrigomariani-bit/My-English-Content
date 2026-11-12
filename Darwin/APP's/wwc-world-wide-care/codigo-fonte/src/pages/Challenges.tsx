import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus, Trophy, Flag, CheckCircle2, Sparkles } from 'lucide-react'
import { PageHeader, Segmented, StatTile, EmptyState } from '../components/ui/Primitives'
import { ChallengeCard } from '../components/challenges/ChallengeCard'
import { CreateChallengeSheet } from '../components/challenges/CreateChallengeSheet'
import { useAllChallenges, useAppStore } from '../store/useAppStore'
import { challengeStatus } from '../lib/progress'
import { CATEGORIES } from '../data/categories'
import type { Category } from '../types'
import { fmt } from '../lib/utils'

type Tab = 'disponiveis' | 'andamento' | 'concluidos'

export function ChallengesPage() {
  const all = useAllChallenges()
  const records = useAppStore((s) => s.challenges)
  const activities = useAppStore((s) => s.activities)
  const [tab, setTab] = useState<Tab>('disponiveis')
  const [cat, setCat] = useState<Category | 'todas'>('todas')
  const [creating, setCreating] = useState(false)

  const withStatus = useMemo(() => all.map((ch) => ({ ch, ...challengeStatus(ch, records[ch.id]) })), [all, records])
  const groups = {
    disponiveis: withStatus.filter((c) => c.status === 'available'),
    andamento: withStatus.filter((c) => c.status === 'active'),
    concluidos: withStatus.filter((c) => c.times > 0).sort((a, b) => b.times - a.times),
  }
  const visible = groups[tab].filter((c) => cat === 'todas' || c.ch.category === cat)
  const completions = withStatus.reduce((n, c) => n + c.times, 0)
  const pointsFromChallenges = activities.filter((a) => a.type === 'challenge').reduce((n, a) => n + a.points, 0)
  const usedCategories = Array.from(new Set(all.map((c) => c.category)))

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={Trophy}
        eyebrow="Desafios ambientais"
        title="Aceite, cumpra, comemore"
        description="Desafios diários e semanais para economizar água, evitar plástico, separar o lixo e muito mais. Cada desafio concluído soma pontos ao seu perfil."
        tone="var(--leaf)"
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
            <Plus size={18} /> Criar desafio
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={CheckCircle2} label="Concluídos" value={fmt(completions)} tone="var(--leaf)" />
        <StatTile icon={Flag} label="Em andamento" value={fmt(groups.andamento.length)} tone="var(--ocean)" />
        <StatTile icon={Sparkles} label="Pontos com desafios" value={fmt(pointsFromChallenges)} tone="var(--brand)" />
        <StatTile icon={Trophy} label="Desafios disponíveis" value={fmt(all.length)} hint={`${all.filter((c) => c.custom).length} criados por você`} tone="var(--coin)" />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Segmented
          label="Situação dos desafios"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'disponiveis', label: 'Disponíveis', count: groups.disponiveis.length },
            { value: 'andamento', label: 'Em andamento', count: groups.andamento.length },
            { value: 'concluidos', label: 'Concluídos', count: groups.concluidos.length },
          ]}
        />
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
          Tema
          <select className="input min-h-10 w-auto py-1.5" value={cat} onChange={(e) => setCat(e.target.value as Category | 'todas')} id="challenge-category">
            <option value="todas">Todos</option>
            {usedCategories.map((c) => (
              <option key={c} value={c}>
                {CATEGORIES[c].label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={tab === 'andamento' ? Flag : tab === 'concluidos' ? CheckCircle2 : Sparkles}
          title={tab === 'andamento' ? 'Nenhum desafio em andamento' : tab === 'concluidos' ? 'Nenhum desafio concluído ainda' : 'Tudo feito por aqui!'}
          text={
            tab === 'andamento'
              ? 'Aceite um desafio na aba “Disponíveis” para começar.'
              : tab === 'concluidos'
                ? 'Conclua seu primeiro desafio para ganhar a conquista “Primeiro passo”.'
                : 'Os desafios diários voltam amanhã. Que tal criar um desafio próprio?'
          }
          action={
            tab === 'disponiveis' ? (
              <button type="button" className="btn btn-primary" onClick={() => setCreating(true)}>
                <Plus size={18} /> Criar desafio
              </button>
            ) : (
              <button type="button" className="btn btn-soft" onClick={() => setTab('disponiveis')}>
                Ver disponíveis
              </button>
            )
          }
        />
      ) : (
        <motion.div layout className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {visible.map(({ ch }) => (
              <ChallengeCard key={ch.id} ch={ch} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <CreateChallengeSheet open={creating} onClose={() => setCreating(false)} />
    </div>
  )
}
