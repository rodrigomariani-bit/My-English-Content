import { ArrowLeft, MessagesSquare } from 'lucide-react'
import { PageHeader } from '../components/ui/Primitives'
import { ChatPanel } from '../components/community/ChatPanel'
import { GLOBAL_CHANNEL } from '../data/chat'
import { href } from '../lib/router'

export function GlobalChatPage() {
  return (
    <div className="flex flex-col gap-4">
      <a href={href.comunidades} className="btn btn-ghost btn-sm -ml-2 self-start">
        <ArrowLeft size={16} /> Comunidades
      </a>
      <PageHeader
        icon={MessagesSquare}
        eyebrow="Chat internacional"
        title="Mural global"
        description="Um espaço para comunidades e apoiadores de todos os países trocarem notícias e ideias. Toque em “Traduzir” para ler as mensagens em português."
        tone="var(--ocean)"
      />
      <ChatPanel channel={GLOBAL_CHANNEL} channelName="Mural global WWC" height="h-[min(560px,60dvh)]" />
    </div>
  )
}
