import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Languages, Send } from 'lucide-react'
import { useAppStore, useChannelMessages } from '../../store/useAppStore'
import { QUICK_REPLIES } from '../../data/chat'
import { LANGUAGES } from '../../data/communities'
import { Avatar } from '../brand/Avatar'
import { cx, fmtTime, relativeDay } from '../../lib/utils'

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

const HUES = [152, 200, 28, 330, 260, 90, 12, 180]
const hueFor = (name: string) => HUES[[...name].reduce((n, ch) => n + ch.charCodeAt(0), 0) % HUES.length]

/** Chat de um canal (mural global ou comunidade), com tradução das mensagens de exemplo. */
export function ChatPanel({ channel, channelName, height = 'h-[460px]' }: { channel: string; channelName: string; height?: string }) {
  const messages = useChannelMessages(channel)
  const send = useAppStore((s) => s.sendMessage)
  const user = useAppStore((s) => s.user)
  const [text, setText] = useState('')
  const [translated, setTranslated] = useState<Record<string, boolean>>({})
  const [translateAll, setTranslateAll] = useState(false)
  const list = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = list.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const submit = (value: string) => {
    if (!value.trim()) return
    send(channel, channelName, value)
    setText('')
  }

  let lastDay = ''

  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-display font-bold text-ink">{channelName}</p>
          <p className="text-xs text-ink-faint">
            {messages.length} mensagens · as de exemplo são fictícias; as suas ficam salvas neste aparelho
          </p>
        </div>
        <button type="button" className="chip min-h-8 text-xs" aria-pressed={translateAll} onClick={() => setTranslateAll(!translateAll)}>
          <Languages size={14} /> Traduzir tudo
        </button>
      </div>

      <div ref={list} className={cx('flex flex-col gap-3 overflow-y-auto bg-bg/60 px-3 py-4 sm:px-4', height)} aria-live="polite">
        {messages.map((m) => {
          const day = relativeDay(m.at)
          const showDay = day !== lastDay
          lastDay = day
          const showTranslation = (translateAll || translated[m.id]) && m.translation
          return (
            <div key={m.id} className="flex flex-col gap-3">
              {showDay && (
                <span className="mx-auto rounded-full bg-surface px-3 py-0.5 text-[0.7rem] font-semibold text-ink-faint shadow-[var(--shadow-soft)]">{day}</span>
              )}
              <motion.div
                initial={m.mine ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                className={cx('flex max-w-[88%] items-end gap-2', m.mine && 'flex-row-reverse self-end')}
              >
                {m.mine ? (
                  <Avatar avatar={user.avatar} size={30} />
                ) : (
                  <span
                    className="grid size-[30px] shrink-0 place-items-center rounded-full text-[0.7rem] font-bold text-white"
                    style={{ background: `hsl(${hueFor(m.author)} 55% 42%)` }}
                    aria-hidden="true"
                  >
                    {initials(m.author)}
                  </span>
                )}
                <div
                  className={cx(
                    'min-w-0 rounded-3xl px-4 py-2.5 shadow-[var(--shadow-soft)]',
                    m.mine ? 'rounded-br-lg bg-brand text-brand-ink' : 'rounded-bl-lg border border-line bg-surface text-ink',
                  )}
                >
                  {!m.mine && (
                    <p className="mb-0.5 flex flex-wrap items-center gap-x-1.5 text-xs">
                      <span className="font-bold text-ink">{m.author}</span>
                      <span className="text-ink-faint">· {m.place}</span>
                      {m.lang !== 'pt' && <span className="rounded bg-surface-2 px-1 font-mono text-[0.65rem] uppercase text-ink-soft">{m.lang}</span>}
                    </p>
                  )}
                  <p className="text-[0.93rem] leading-snug break-words">{showTranslation ? m.translation : m.text}</p>
                  <div className={cx('mt-1 flex items-center gap-2 text-[0.68rem]', m.mine ? 'justify-end opacity-80' : 'text-ink-faint')}>
                    {m.translation && !translateAll && (
                      <button type="button" className="font-semibold text-ocean underline-offset-2 hover:underline" onClick={() => setTranslated((t) => ({ ...t, [m.id]: !t[m.id] }))}>
                        {translated[m.id] ? `Ver original (${LANGUAGES[m.lang] ?? m.lang})` : 'Traduzir'}
                      </button>
                    )}
                    {showTranslation && translateAll && <span>Traduzido do {LANGUAGES[m.lang] ?? m.lang}</span>}
                    <span className="num">{fmtTime(m.at)}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-line p-3">
        <div className="no-scrollbar mb-2 flex gap-1.5 overflow-x-auto">
          {QUICK_REPLIES.map((q) => (
            <button key={q} type="button" className="chip min-h-8 shrink-0 text-xs" onClick={() => submit(q)}>
              {q}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            submit(text)
          }}
        >
          <label htmlFor={`chat-${channel}`} className="sr-only">
            Mensagem para {channelName}
          </label>
          <input
            id={`chat-${channel}`}
            className="input flex-1 rounded-full"
            placeholder="Escreva uma mensagem…"
            value={text}
            maxLength={600}
            onChange={(e) => setText(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary btn-icon" disabled={!text.trim()} aria-label="Enviar mensagem">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
