export type Lang = 'pt' | 'en'

export interface PresentationSection {
  q: Record<Lang, string>
  intro?: Record<Lang, string>
  points?: Record<Lang, string[]>
  ordered?: boolean
}

export const PRESENTATION: PresentationSection[] = [
  {
    q: {
      pt: 'Qual problema ambiental o aplicativo pretende resolver?',
      en: 'What environmental problem does the app solve?',
    },
    intro: {
      pt: 'O WWC enfrenta três problemas ligados entre si: o lixo descartado no lugar errado, o desperdício de água e energia no dia a dia e a falta de apoio às comunidades que mais sofrem com a crise climática.',
      en: 'WWC tackles three connected problems: waste thrown in the wrong place, the daily waste of water and energy, and the lack of support for the communities that suffer the most from the climate crisis.',
    },
    points: {
      pt: [
        'Cerca de 2,2 bilhões de pessoas ainda não têm água potável segura (OMS/UNICEF).',
        'Aproximadamente um terço dos alimentos produzidos no mundo é perdido ou desperdiçado (FAO).',
        'Muita gente quer ajudar, mas não sabe por onde começar — e, quando doa, parte do valor se perde em taxas e intermediários.',
      ],
      en: [
        'About 2.2 billion people still lack safely managed drinking water (WHO/UNICEF).',
        'Roughly one third of all food produced in the world is lost or wasted (FAO).',
        'Many people want to help but do not know where to start — and when they donate, part of the money is lost in fees and middlemen.',
      ],
    },
  },
  {
    q: { pt: 'Para quem o aplicativo foi desenvolvido?', en: 'Who is the app for?' },
    points: {
      pt: [
        'Estudantes e jovens que querem aprender e agir pelo planeta.',
        'Famílias que querem economizar água, energia e dinheiro.',
        'Escolas e professores, que podem usar os desafios e o quiz em sala de aula.',
        'Comunidades vulneráveis de qualquer país, que ganham visibilidade e recebem apoio direto.',
        'ONGs, cooperativas de reciclagem e voluntários.',
      ],
      en: [
        'Students and young people who want to learn and act for the planet.',
        'Families who want to save water, energy and money.',
        'Schools and teachers, who can use the challenges and the quiz in class.',
        'Vulnerable communities in any country, who gain visibility and receive direct support.',
        'NGOs, recycling cooperatives and volunteers.',
      ],
    },
  },
  {
    q: { pt: 'Como o aplicativo funciona?', en: 'How does the app work?' },
    ordered: true,
    points: {
      pt: [
        'Crie seu perfil só com um nome. Não precisa de login: seus dados ficam salvos no seu aparelho.',
        'Aprenda com o guia de reciclagem, a busca “Onde descarto?” e a dica do dia.',
        'Aceite desafios ambientais, marque como concluídos e ganhe pontos.',
        'Acompanhe no perfil seus pontos, nível, conquistas, histórico e impacto estimado.',
        'Encontre comunidades no mapa-múndi, converse no chat internacional e doe diretamente, sem taxas.',
      ],
      en: [
        'Create your profile with just a name. No login needed: your data is saved on your device.',
        'Learn with the recycling guide, the “Where do I throw it?” search and the tip of the day.',
        'Accept environmental challenges, mark them as done and earn points.',
        'Follow your points, level, badges, history and estimated impact on your profile.',
        'Find communities on the world map, talk in the international chat and donate directly, with zero fees.',
      ],
    },
  },
  {
    q: { pt: 'Quais são suas principais funcionalidades?', en: 'What are its main features?' },
    points: {
      pt: [
        'Reciclagem: as 8 cores de lixeira do padrão CONAMA, busca com quase 50 itens, quiz “Qual lixeira?”, códigos dos plásticos e descarte especial.',
        'Dicas sustentáveis: dica do dia, dicas por categoria, calculadoras de água e de energia e os 17 ODS da ONU.',
        'Desafios ambientais diários e semanais, com pontos, e a opção de criar desafios próprios.',
        'Perfil: pontuação, níveis de Semente a Guardião do Planeta, conquistas, gráfico da semana e histórico de atividades.',
        'Comunidades e doações: mapa-múndi interativo, cadastro com coordenadas, perfil especial de comunidade e doação direta com taxa zero.',
        'Chat internacional: mural global e conversa de cada comunidade, com tradução das mensagens.',
      ],
      en: [
        'Recycling: the 8 bin colours of the Brazilian CONAMA standard, a search with almost 50 items, a “Which bin?” quiz, plastic codes and special disposal.',
        'Sustainable tips: tip of the day, tips by category, water and energy calculators and the 17 UN SDGs.',
        'Daily and weekly environmental challenges with points, plus the option to create your own.',
        'Profile: score, levels from Seed to Planet Guardian, badges, a weekly chart and an activity history.',
        'Communities and donations: an interactive world map, registration with coordinates, a special community profile and direct, zero-fee donations.',
        'International chat: a global wall and a chat for each community, with message translation.',
      ],
    },
  },
  {
    q: { pt: 'Quais benefícios ele oferece à sociedade?', en: 'How does it benefit society?' },
    points: {
      pt: [
        'Transforma hábitos em números: litros de água, quilos de CO₂ e plásticos evitados.',
        'Mais reciclagem correta significa mais renda para catadores e menos lixo em rios e oceanos.',
        'A ajuda chega direto a quem precisa, sem taxas da plataforma.',
        'Educação ambiental gratuita e acessível, pronta para ser usada em escolas.',
        'Une pessoas de países diferentes em torno de uma mesma causa e contribui com 11 dos 17 ODS.',
      ],
      en: [
        'It turns habits into numbers: litres of water, kilos of CO₂ and plastic items avoided.',
        'More correct recycling means more income for waste pickers and less trash in rivers and oceans.',
        'Help goes straight to the people who need it, with no platform fees.',
        'Free and accessible environmental education, ready to be used in schools.',
        'It unites people from different countries around one cause and contributes to 11 of the 17 SDGs.',
      ],
    },
  },
  {
    q: {
      pt: 'O que diferencia o aplicativo de outras soluções?',
      en: 'What makes the app different from other solutions?',
    },
    points: {
      pt: [
        'Reúne num só lugar o que hoje está espalhado em vários apps: educação ambiental, gamificação de hábitos e solidariedade global.',
        'Doação direta com taxa zero e uma proposta de isenção de impostos para doações humanitárias, em parceria com governos e a ONU.',
        'Perfil especial e verificado para comunidades, com localização exata por coordenadas.',
        'Chat internacional com tradução, ligando comunidades de todos os continentes.',
        'Sem login e sem anúncios; funciona em celular, tablet e computador.',
      ],
      en: [
        'It brings together what is now spread across many apps: environmental education, habit gamification and global solidarity.',
        'Direct, zero-fee donations and a proposal for tax exemption on humanitarian donations, in partnership with governments and the UN.',
        'A special, verified profile for communities, with an exact location by coordinates.',
        'An international chat with translation, connecting communities on every continent.',
        'No login and no ads; it works on phones, tablets and computers.',
      ],
    },
  },
]

export const ROADMAP: Record<Lang, string[]> = {
  pt: [
    'Servidor na nuvem para o chat em tempo real e o mapa compartilhado entre todos os usuários.',
    'Tradução automática das mensagens para qualquer idioma.',
    'Verificação das comunidades por ONGs e agências parceiras.',
    'Pagamentos integrados (PIX e cartões internacionais) com recibo para isenção fiscal.',
    'Versão instalável (PWA) e interface em vários idiomas.',
  ],
  en: [
    'A cloud server for real-time chat and a map shared by every user.',
    'Automatic translation of messages into any language.',
    'Community verification by partner NGOs and agencies.',
    'Built-in payments (PIX and international cards) with receipts for tax exemption.',
    'An installable version (PWA) and an interface in many languages.',
  ],
}

export interface PitchPart {
  label: string
  en: string
  pt: string
}

/** Roteiro de ~1 minuto. As expressões-chave pedidas estão marcadas em KEY_EXPRESSIONS. */
export const PITCH: PitchPart[] = [
  {
    label: 'Abertura',
    en: 'Hello, everyone! We are proud to present WWC – World Wide Care.',
    pt: 'Olá a todos! Temos orgulho de apresentar o WWC – World Wide Care.',
  },
  {
    label: 'Problema',
    en: 'Every day, our planet suffers with trash in the wrong place, wasted water and energy, and climate change. And the communities that suffer the most often get the least help.',
    pt: 'Todos os dias, nosso planeta sofre com lixo no lugar errado, desperdício de água e energia e mudanças climáticas. E as comunidades que mais sofrem muitas vezes recebem menos ajuda.',
  },
  {
    label: 'Solução',
    en: 'Our app is designed to change that. It helps people to learn simple, sustainable habits and to practice them every day.',
    pt: 'Nosso app foi criado para mudar isso. Ele ajuda as pessoas a aprender hábitos simples e sustentáveis e a praticá-los todos os dias.',
  },
  {
    label: 'Como usar',
    en: 'This app can be used to sort trash correctly, save water and energy, and join environmental challenges that give you points for every green action.',
    pt: 'Este app pode ser usado para separar o lixo corretamente, economizar água e energia e participar de desafios ambientais que dão pontos a cada atitude verde.',
  },
  {
    label: 'Destaque',
    en: 'One of its main features is our world map of communities. A community can register its location, its needs and how to help. Anyone can donate directly, with zero fees, and talk to people from other countries in our international chat.',
    pt: 'Uma de suas principais funções é o nosso mapa-múndi de comunidades. Uma comunidade pode cadastrar sua localização, suas necessidades e como ajudar. Qualquer pessoa pode doar diretamente, sem taxas, e conversar com pessoas de outros países no nosso chat internacional.',
  },
  {
    label: 'Importância',
    en: 'Small actions, multiplied by millions of people, make a big difference.',
    pt: 'Pequenas atitudes, multiplicadas por milhões de pessoas, fazem uma grande diferença.',
  },
  {
    label: 'Encerramento',
    en: 'Our goal is to make the world a better place. Thank you!',
    pt: 'Nosso objetivo é tornar o mundo um lugar melhor. Obrigado!',
  },
]

export const KEY_EXPRESSIONS = [
  'Our app is designed to',
  'This app can be used to',
  'It helps people to',
  'One of its main features is',
  'Our goal is to make the world a better place.',
]

export const TECH_STACK = [
  { name: 'React 19 + TypeScript', role: 'Interface em componentes reutilizáveis e tipados' },
  { name: 'Vite 8', role: 'Ferramenta de build e servidor de desenvolvimento' },
  { name: 'Tailwind CSS 4', role: 'Design responsivo com tokens de cor e tema claro/escuro' },
  { name: 'Zustand', role: 'Estado global salvo no armazenamento local (localStorage)' },
  { name: 'Motion', role: 'Animações leves e acessíveis' },
  { name: 'D3-geo + Natural Earth', role: 'Globo e mapa-múndi interativos, sem depender de serviços externos' },
]
