import { House, Recycle, Lightbulb, Trophy, Globe2, UserRound, Presentation, type LucideIcon } from 'lucide-react'
import { href, type RouteName } from '../../lib/router'

export interface NavItem {
  label: string
  short: string
  href: string
  icon: LucideIcon
  match: RouteName[]
  mobile: boolean
}

export const NAV: NavItem[] = [
  { label: 'Início', short: 'Início', href: href.inicio, icon: House, match: ['inicio'], mobile: true },
  { label: 'Reciclagem', short: 'Reciclar', href: href.reciclagem, icon: Recycle, match: ['reciclagem'], mobile: true },
  { label: 'Dicas sustentáveis', short: 'Dicas', href: href.dicas, icon: Lightbulb, match: ['dicas'], mobile: true },
  { label: 'Desafios ambientais', short: 'Desafios', href: href.desafios, icon: Trophy, match: ['desafios'], mobile: true },
  {
    label: 'Comunidades e doações',
    short: 'Mundo',
    href: href.comunidades,
    icon: Globe2,
    match: ['comunidades', 'comunidade', 'cadastrar', 'editar', 'mural'],
    mobile: true,
  },
  { label: 'Meu perfil', short: 'Perfil', href: href.perfil, icon: UserRound, match: ['perfil'], mobile: true },
  { label: 'Apresentação do projeto', short: 'Projeto', href: href.projeto, icon: Presentation, match: ['projeto'], mobile: false },
]
