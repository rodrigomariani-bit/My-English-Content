import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Clock, HandCoins, Package, ShieldCheck } from 'lucide-react'
import type { Community, DonationKind } from '../../types'
import { Modal } from '../ui/Modal'
import { Field } from '../ui/Primitives'
import { CareHandsBadge } from '../brand/CareHandsIcon'
import { MethodList } from './MethodList'
import { useAppStore } from '../../store/useAppStore'
import { cx, fmtMoney } from '../../lib/utils'

const PRESETS = [10, 25, 50, 100]
const CURRENCIES = ['BRL', 'USD', 'EUR']
const KINDS: { value: DonationKind; label: string; icon: typeof HandCoins }[] = [
  { value: 'dinheiro', label: 'Dinheiro', icon: HandCoins },
  { value: 'itens', label: 'Itens', icon: Package },
  { value: 'voluntariado', label: 'Tempo', icon: Clock },
]

/**
 * Registro de doação direta. O protótipo não processa pagamentos: ele registra o
 * compromisso e mostra os canais oficiais da comunidade para concluir a doação.
 */
export function DonateSheet({ community, open, onClose }: { community: Community; open: boolean; onClose: () => void }) {
  const donate = useAppStore((s) => s.donate)
  const [kind, setKind] = useState<DonationKind>('dinheiro')
  const [amount, setAmount] = useState(25)
  const [currency, setCurrency] = useState('BRL')
  const [items, setItems] = useState('')
  const [hours, setHours] = useState(2)
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)
  const [tried, setTried] = useState(false)

  useEffect(() => {
    if (open) {
      setDone(false)
      setTried(false)
    }
  }, [open])

  const valid = kind === 'dinheiro' ? amount > 0 : kind === 'itens' ? items.trim().length >= 3 : hours > 0

  const submit = () => {
    setTried(true)
    if (!valid) return
    donate({
      communityId: community.id,
      communityName: community.name,
      kind,
      amount: kind === 'dinheiro' ? amount : undefined,
      currency: kind === 'dinheiro' ? currency : undefined,
      items: kind === 'itens' ? items.trim() : undefined,
      hours: kind === 'voluntariado' ? hours : undefined,
      message: message.trim() || undefined,
    })
    setDone(true)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={done ? 'Apoio registrado!' : `Apoiar ${community.name}`}
      description={done ? 'Agora conclua pelo canal oficial da comunidade.' : 'Doação direta: 100% vai para a comunidade.'}
      icon={<CareHandsBadge size={48} />}
      footer={
        done ? (
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Pronto
          </button>
        ) : (
          <>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-coin" onClick={submit}>
              <HandCoins size={18} /> Registrar doação
            </button>
          </>
        )
      }
    >
      {done ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl bg-leaf-soft p-4 text-brand">
            <CheckCircle2 size={22} className="shrink-0" />
            <p className="text-sm font-medium">
              Obrigado! Seu apoio entrou no seu histórico e na meta da comunidade. Use um dos canais abaixo para enviar a doação diretamente, sem intermediários.
            </p>
          </div>
          <MethodList community={community} />
          <p className="text-xs text-ink-faint">
            Protótipo escolar: o WWC não processa pagamentos nem guarda dados bancários. {community.example && 'Esta é uma comunidade de exemplo; as chaves exibidas são fictícias.'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-5">
          <div role="radiogroup" aria-label="Tipo de doação" className="grid grid-cols-3 gap-2">
            {KINDS.map((k) => (
              <button
                key={k.value}
                type="button"
                role="radio"
                aria-checked={kind === k.value}
                onClick={() => setKind(k.value)}
                className={cx(
                  'flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-sm font-semibold transition-colors',
                  kind === k.value ? 'border-coin bg-coin-soft text-ink' : 'border-line text-ink-soft hover:border-coin/60',
                )}
              >
                <k.icon size={22} />
                {k.label}
              </button>
            ))}
          </div>

          {kind === 'dinheiro' && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button key={p} type="button" className="chip num" aria-pressed={amount === p} onClick={() => setAmount(p)}>
                    {fmtMoney(p, currency)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Field label="Valor" htmlFor="don-amount" error={tried && !valid ? 'Informe um valor maior que zero.' : undefined}>
                  <input
                    id="don-amount"
                    type="number"
                    min={1}
                    step={1}
                    className="input num"
                    value={amount || ''}
                    onChange={(e) => setAmount(Math.max(0, +e.target.value || 0))}
                    aria-invalid={tried && !valid}
                  />
                </Field>
                <Field label="Moeda" htmlFor="don-currency">
                  <select id="don-currency" className="input w-28" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    {CURRENCIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <dl className="divide-y divide-line rounded-2xl border border-line text-sm">
                <div className="flex justify-between gap-3 px-4 py-2.5">
                  <dt className="text-ink-soft">Sua doação</dt>
                  <dd className="num font-semibold text-ink">{fmtMoney(amount, currency)}</dd>
                </div>
                <div className="flex justify-between gap-3 px-4 py-2.5">
                  <dt className="text-ink-soft">Taxa da plataforma WWC</dt>
                  <dd className="num font-semibold text-brand">{fmtMoney(0, currency)}</dd>
                </div>
                <div className="flex justify-between gap-3 px-4 py-2.5">
                  <dt className="text-ink-soft">Impostos sobre a doação*</dt>
                  <dd className="num font-semibold text-brand">{fmtMoney(0, currency)}</dd>
                </div>
                <div className="flex justify-between gap-3 bg-coin-soft/70 px-4 py-3">
                  <dt className="font-bold text-ink">A comunidade recebe</dt>
                  <dd className="num font-display text-lg font-bold text-ink">{fmtMoney(amount, currency)} · 100%</dd>
                </div>
              </dl>
              <p className="flex gap-2 text-xs text-ink-faint">
                <ShieldCheck size={14} className="mt-0.5 shrink-0" />
                *Proposta do WWC: doações humanitárias registradas na plataforma com isenção de impostos, em parceria com governos e a ONU.
              </p>
            </div>
          )}

          {kind === 'itens' && (
            <Field
              label="O que você vai doar?"
              htmlFor="don-items"
              hint={community.methods.find((m) => m.type === 'itens')?.value ? `A comunidade precisa de: ${community.methods.find((m) => m.type === 'itens')!.value}` : undefined}
              error={tried && !valid ? 'Descreva os itens da doação.' : undefined}
            >
              <input id="don-items" className="input" value={items} onChange={(e) => setItems(e.target.value)} placeholder="Ex.: 2 filtros de barro e 10 cadernos" aria-invalid={tried && !valid} />
            </Field>
          )}

          {kind === 'voluntariado' && (
            <Field
              label="Quantas horas você pode doar?"
              htmlFor="don-hours"
              hint={community.methods.find((m) => m.type === 'voluntariado')?.value ? `Oportunidade: ${community.methods.find((m) => m.type === 'voluntariado')!.value}` : 'Combine os detalhes pelo chat da comunidade.'}
            >
              <input id="don-hours" type="number" min={1} max={200} className="input num" value={hours} onChange={(e) => setHours(Math.max(0, +e.target.value || 0))} />
            </Field>
          )}

          <Field label="Mensagem para a comunidade (opcional)" htmlFor="don-msg">
            <input id="don-msg" className="input" value={message} maxLength={140} onChange={(e) => setMessage(e.target.value)} placeholder="Uma palavra de apoio" />
          </Field>
        </div>
      )}
    </Modal>
  )
}
