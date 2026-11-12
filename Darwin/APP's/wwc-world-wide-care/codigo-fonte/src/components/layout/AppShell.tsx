import type { ReactNode } from 'react'
import { Presentation } from 'lucide-react'
import { Logo } from '../brand/Logo'
import { Avatar } from '../brand/Avatar'
import { NAV } from './nav'
import { ThemeToggle } from './ThemeToggle'
import { href, type Route } from '../../lib/router'
import { useAppStore } from '../../store/useAppStore'
import { levelFor } from '../../lib/progress'
import { cx, fmt } from '../../lib/utils'

export function AppShell({ route, children }: { route: Route; children: ReactNode }) {
  const user = useAppStore((s) => s.user)
  const points = useAppStore((s) => s.points)
  const level = levelFor(points).current

  return (
    <div className="min-h-dvh bg-bg text-ink">
      {/* Trilho lateral — computador */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-line bg-surface pl-[env(safe-area-inset-left,0px)] lg:flex">
        <a href={href.inicio} className="px-6 pt-7 pb-6" aria-label="WWC – World Wide Care, início">
          <Logo />
        </a>
        <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Navegação principal">
          {NAV.map((item) => {
            const active = item.match.includes(route.name)
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[0.95rem] font-semibold transition-colors',
                  active ? 'bg-leaf-soft text-brand' : 'text-ink-soft hover:bg-surface-2 hover:text-ink',
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                {item.label}
              </a>
            )
          })}
        </nav>
        <div className="m-3 rounded-2xl border border-line bg-bg p-3">
          <a href={href.perfil} className="flex items-center gap-3">
            <Avatar avatar={user.avatar} size={40} />
            <span className="min-w-0">
              <span className="block truncate font-semibold text-ink">{user.named ? user.name : 'Visitante'}</span>
              <span className="num block text-xs text-ink-faint">
                {level.name} · {fmt(points)} pts
              </span>
            </span>
          </a>
          <ThemeToggle withLabel className="mt-2 w-full" />
        </div>
      </aside>

      {/* Topo — celular e tablet */}
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line bg-surface/90 backdrop-blur-md lg:hidden">
        <div className="gutter flex h-16 items-center justify-between gap-3">
          <a href={href.inicio} aria-label="WWC – World Wide Care, início">
            <Logo compact />
          </a>
          <div className="flex items-center gap-1">
            <a href={href.projeto} className="btn btn-ghost btn-icon btn-sm" aria-label="Apresentação do projeto" title="Apresentação do projeto">
              <Presentation size={19} />
            </a>
            <ThemeToggle />
            <a href={href.perfil} className="ml-1 flex items-center gap-2 rounded-full border border-line bg-bg py-1 pr-3 pl-1" aria-label="Meu perfil">
              <Avatar avatar={user.avatar} size={30} />
              <span className="num text-sm font-bold text-brand">{fmt(points)}</span>
            </a>
          </div>
        </div>
      </header>

      <main className="pb-[calc(96px+env(safe-area-inset-bottom,0px))] lg:pb-14 lg:pl-[264px]">
        <div className="gutter mx-auto w-full max-w-[1160px] pt-6 md:pt-8 lg:pt-10">{children}</div>
      </main>

      {/* Abas inferiores — celular e tablet */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md lg:hidden"
        aria-label="Navegação principal"
      >
        <div className="gutter mx-auto grid max-w-xl grid-cols-6">
          {NAV.filter((n) => n.mobile).map((item) => {
            const active = item.match.includes(route.name)
            const Icon = item.icon
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'flex flex-col items-center gap-1 pt-2.5 pb-2 text-[0.68rem] font-semibold transition-colors',
                  active ? 'text-brand' : 'text-ink-faint',
                )}
              >
                <span className={cx('grid h-8 w-12 place-items-center rounded-full transition-colors', active && 'bg-leaf-soft')}>
                  <Icon size={21} strokeWidth={active ? 2.4 : 2} />
                </span>
                {item.short}
              </a>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
