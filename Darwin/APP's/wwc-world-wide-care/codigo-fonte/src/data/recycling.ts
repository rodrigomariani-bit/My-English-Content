export type BinKey = 'papel' | 'plastico' | 'vidro' | 'metal' | 'organico' | 'rejeito' | 'especial' | 'madeira'

export interface Bin {
  key: BinKey
  name: string
  colorName: string
  color: string
  ink: string
  goes: string[]
  notGoes: string[]
  tip: string
}

/** Padrão de cores da Resolução CONAMA nº 275/2001 (coleta seletiva no Brasil). */
export const BINS: Bin[] = [
  {
    key: 'papel',
    name: 'Papel e papelão',
    colorName: 'Azul',
    color: '#1f63c6',
    ink: '#ffffff',
    goes: ['Jornais e revistas', 'Caixas de papelão', 'Folhas e cadernos', 'Envelopes', 'Caixas de ovos e tubos de papel'],
    notGoes: ['Papel higiênico e guardanapos usados', 'Papel engordurado', 'Fotografias', 'Etiquetas adesivas', 'Papel plastificado'],
    tip: 'Mantenha seco e desmonte as caixas para ocupar menos espaço.',
  },
  {
    key: 'plastico',
    name: 'Plástico',
    colorName: 'Vermelho',
    color: '#d0372b',
    ink: '#ffffff',
    goes: ['Garrafas PET', 'Potes e tampas', 'Frascos de xampu e limpeza', 'Sacolas e filmes', 'Copos descartáveis limpos'],
    notGoes: ['Esponjas', 'Embalagens com restos de comida', 'Cabos de panela', 'Adesivos', 'Fraldas'],
    tip: 'Esvazie, dê uma enxaguada rápida e amasse as garrafas.',
  },
  {
    key: 'vidro',
    name: 'Vidro',
    colorName: 'Verde',
    color: '#1d9549',
    ink: '#ffffff',
    goes: ['Garrafas', 'Potes de conserva', 'Frascos de perfume', 'Copos de vidro'],
    notGoes: ['Espelhos', 'Lâmpadas', 'Cerâmica e porcelana', 'Vidro temperado', 'Ampolas de remédio'],
    tip: 'Vidro quebrado deve ir embrulhado em jornal, com o aviso “vidro quebrado”.',
  },
  {
    key: 'metal',
    name: 'Metal',
    colorName: 'Amarelo',
    color: '#f1c02a',
    ink: '#2a2100',
    goes: ['Latas de alumínio', 'Latas de conserva', 'Tampas metálicas', 'Papel-alumínio limpo', 'Panelas sem cabo'],
    notGoes: ['Pilhas e baterias', 'Latas de tinta com resto', 'Esponjas de aço', 'Clipes enferrujados misturados a papel'],
    tip: 'Amasse as latas. O alumínio pode ser reciclado infinitas vezes.',
  },
  {
    key: 'organico',
    name: 'Orgânico',
    colorName: 'Marrom',
    color: '#7a4a28',
    ink: '#ffffff',
    goes: ['Restos de comida', 'Cascas de frutas e legumes', 'Borra de café e chá', 'Cascas de ovo', 'Folhas e podas'],
    notGoes: ['Óleo de cozinha', 'Fezes de animais em grande quantidade', 'Plásticos “biodegradáveis” sem certificação'],
    tip: 'Pode virar adubo em uma composteira doméstica.',
  },
  {
    key: 'rejeito',
    name: 'Não reciclável (rejeito)',
    colorName: 'Cinza',
    color: '#7d888e',
    ink: '#ffffff',
    goes: ['Papel higiênico usado', 'Fraldas e absorventes', 'Esponjas', 'Bitucas de cigarro', 'Cerâmica quebrada'],
    notGoes: ['Recicláveis limpos', 'Pilhas e eletrônicos', 'Restos de comida (se houver compostagem)'],
    tip: 'Quanto menos rejeito, melhor: revise o que poderia ser reciclado.',
  },
  {
    key: 'especial',
    name: 'Resíduos especiais e perigosos',
    colorName: 'Laranja',
    color: '#ef7d1a',
    ink: '#2a1500',
    goes: ['Pilhas e baterias', 'Lâmpadas', 'Eletrônicos e carregadores', 'Medicamentos vencidos', 'Tintas e solventes', 'Óleo de cozinha'],
    notGoes: ['Lixo comum', 'Pia, vaso sanitário ou ralo'],
    tip: 'Nunca no lixo comum: leve a pontos de coleta específicos (logística reversa).',
  },
  {
    key: 'madeira',
    name: 'Madeira',
    colorName: 'Preto',
    color: '#262626',
    ink: '#ffffff',
    goes: ['Pallets e caixotes', 'Restos de móveis', 'Cabos de vassoura', 'Sobras de marcenaria'],
    notGoes: ['Madeira com tinta ou verniz tóxico em grande quantidade', 'MDF com plástico colado'],
    tip: 'Pallets e caixotes em bom estado podem virar móveis e hortas.',
  },
]

export const OTHER_COLORS = [
  { colorName: 'Branco', color: '#f4f4f4', name: 'Resíduos de saúde (hospitalar)' },
  { colorName: 'Roxo', color: '#6b3fa0', name: 'Resíduos radioativos' },
]

export const binByKey = (k: BinKey) => BINS.find((b) => b.key === k)!

export interface WasteItem {
  name: string
  bin: BinKey
  tip: string
  aliases?: string[]
  quiz?: boolean
}

export const WASTE_ITEMS: WasteItem[] = [
  { name: 'Garrafa PET', bin: 'plastico', tip: 'Esvazie, amasse e feche com a tampa.', aliases: ['refrigerante', 'garrafa de água', 'pet'] },
  { name: 'Lata de refrigerante', bin: 'metal', tip: 'Amasse para ocupar menos espaço.', aliases: ['latinha', 'alumínio', 'lata de cerveja'] },
  { name: 'Jornal', bin: 'papel', tip: 'Mantenha seco. Também serve para embrulhar vidro quebrado.' },
  { name: 'Caixa de papelão', bin: 'papel', tip: 'Desmonte e mantenha seca.', aliases: ['papelão', 'caixa de sapato'] },
  { name: 'Caixa de pizza engordurada', bin: 'rejeito', tip: 'A parte suja de gordura vai no rejeito; a parte limpa pode ir para o papel.', aliases: ['pizza'] },
  { name: 'Garrafa de vidro', bin: 'vidro', tip: 'Não precisa tirar o rótulo. Retire a tampa.', aliases: ['garrafa de vinho', 'cerveja long neck'] },
  { name: 'Pote de vidro de conserva', bin: 'vidro', tip: 'Lave e separe: a tampa de metal vai na lixeira amarela.', aliases: ['pote de palmito', 'pote de geleia'] },
  { name: 'Espelho quebrado', bin: 'rejeito', tip: 'Espelho não é reciclado como vidro comum. Embrulhe e avise “vidro quebrado”.', aliases: ['espelho'] },
  { name: 'Copo descartável', bin: 'plastico', tip: 'Limpo, vai para o plástico. Melhor ainda: use um copo reutilizável.', aliases: ['copinho'] },
  { name: 'Sacola plástica', bin: 'plastico', tip: 'Junte várias sacolas dentro de uma só.', aliases: ['sacolinha'] },
  { name: 'Embalagem de salgadinho', bin: 'rejeito', tip: 'Embalagens metalizadas raramente são aceitas na coleta. Verifique a cooperativa da sua cidade.', aliases: ['metalizado', 'pacote de biscoito'], quiz: false },
  { name: 'Caixa de leite (longa vida)', bin: 'papel', tip: 'É feita de papel, plástico e alumínio. Lave, amasse e descarte conforme a coleta da sua cidade (em geral, com papel).', aliases: ['tetra pak', 'caixa de suco'], quiz: false },
  { name: 'Casca de banana', bin: 'organico', tip: 'Ótima para compostagem.', aliases: ['casca de fruta'] },
  { name: 'Borra de café', bin: 'organico', tip: 'Pode adubar plantas diretamente ou ir para a composteira.', aliases: ['café', 'filtro de café'] },
  { name: 'Restos de comida', bin: 'organico', tip: 'Evite o desperdício planejando as porções.', aliases: ['comida', 'sobra'] },
  { name: 'Folhas secas', bin: 'organico', tip: 'Viram cobertura para hortas e canteiros.', aliases: ['poda', 'grama'] },
  { name: 'Cascas de ovo', bin: 'organico', tip: 'Trituradas, enriquecem o adubo com cálcio.', aliases: ['ovo'] },
  { name: 'Papel higiênico usado', bin: 'rejeito', tip: 'Papel sujo não pode ser reciclado.', aliases: ['papel de banheiro'] },
  { name: 'Fralda descartável', bin: 'rejeito', tip: 'Feche bem e descarte no lixo comum.', aliases: ['fralda', 'absorvente'] },
  { name: 'Guardanapo sujo', bin: 'rejeito', tip: 'Papel com gordura ou comida não é reciclável.', aliases: ['guardanapo'] },
  { name: 'Pilha', bin: 'especial', tip: 'Leve a coletores em supermercados, farmácias e lojas de eletrônicos.', aliases: ['pilhas', 'bateria'] },
  { name: 'Bateria de celular', bin: 'especial', tip: 'Baterias de lítio podem pegar fogo no caminhão de lixo. Leve a um ponto de coleta.', aliases: ['bateria'] },
  { name: 'Celular velho', bin: 'especial', tip: 'Apague seus dados e leve a um ponto de coleta de eletroeletrônicos.', aliases: ['smartphone', 'eletrônico', 'e-lixo'] },
  { name: 'Carregador e cabos', bin: 'especial', tip: 'Fios têm cobre reaproveitável. Entregue em pontos de e-lixo.', aliases: ['fone de ouvido', 'cabo usb'] },
  { name: 'Lâmpada fluorescente', bin: 'especial', tip: 'Contém mercúrio: não quebre e devolva no ponto de venda.', aliases: ['lâmpada'] },
  { name: 'Óleo de cozinha usado', bin: 'especial', tip: 'Guarde em garrafa PET fechada e leve a um ponto de coleta. Pode virar sabão!', aliases: ['óleo', 'gordura de fritura'] },
  { name: 'Remédio vencido', bin: 'especial', tip: 'Devolva em farmácias com coletor. Nunca jogue no vaso sanitário.', aliases: ['medicamento', 'comprimido'] },
  { name: 'Lata de tinta', bin: 'especial', tip: 'Com resto de tinta é resíduo perigoso. Procure o ecoponto da sua cidade.', aliases: ['tinta', 'solvente', 'thinner'] },
  { name: 'Lata de sardinha', bin: 'metal', tip: 'Lave rapidamente para tirar o óleo.', aliases: ['lata de conserva', 'lata de milho'] },
  { name: 'Tampinha de metal', bin: 'metal', tip: 'Junte as tampinhas dentro de uma lata para não se perderem.', aliases: ['tampa de garrafa'] },
  { name: 'Papel-alumínio limpo', bin: 'metal', tip: 'Limpo e amassado em bola.', aliases: ['alumínio'] },
  { name: 'Revista', bin: 'papel', tip: 'Revistas e catálogos são recicláveis.', aliases: ['catálogo', 'panfleto'] },
  { name: 'Folha de caderno', bin: 'papel', tip: 'Pode usar o verso antes de reciclar.', aliases: ['caderno', 'papel sulfite'] },
  { name: 'Pote de margarina', bin: 'plastico', tip: 'Tire o excesso de gordura antes.', aliases: ['pote de sorvete', 'pote plástico'] },
  { name: 'Frasco de xampu', bin: 'plastico', tip: 'Enxágue e tampe.', aliases: ['shampoo', 'frasco de detergente'] },
  { name: 'Isopor limpo', bin: 'plastico', tip: 'É plástico (EPS) reciclável, mas nem toda cidade coleta. Verifique.', aliases: ['isopor', 'bandeja'], quiz: false },
  { name: 'Escova de dentes', bin: 'rejeito', tip: 'Mistura plásticos e cerdas de nylon. Prefira escovas com cabo de bambu.', aliases: ['escova'], quiz: false },
  { name: 'Bituca de cigarro', bin: 'rejeito', tip: 'Nunca jogue no chão: uma bituca contamina a água e o solo.', aliases: ['cigarro'] },
  { name: 'Prato de cerâmica quebrado', bin: 'rejeito', tip: 'Embrulhe bem para proteger quem coleta.', aliases: ['cerâmica', 'porcelana', 'xícara'] },
  { name: 'Pallet de madeira', bin: 'madeira', tip: 'Pallets inteiros podem virar móveis e hortas!', aliases: ['madeira', 'palete', 'caixote'] },
  { name: 'Frasco de perfume de vidro', bin: 'vidro', tip: 'Retire a válvula de spray, que é de outro material.', aliases: ['perfume'] },
  { name: 'Tubo de papel higiênico', bin: 'papel', tip: 'O rolo de papelão é reciclável.', aliases: ['rolo de papel'] },
  { name: 'Caixa de ovos de papelão', bin: 'papel', tip: 'Também pode ir para a compostagem.', aliases: ['caixa de ovo'] },
  { name: 'Esponja de cozinha', bin: 'rejeito', tip: 'Não é reciclável. Prefira buchas vegetais.', aliases: ['esponja'] },
  { name: 'Pote de iogurte', bin: 'plastico', tip: 'Raspe e enxágue rapidamente.', aliases: ['iogurte'] },
  { name: 'Saquinho de chá', bin: 'organico', tip: 'Sem grampo, vai para a compostagem.', aliases: ['chá', 'erva-mate'] },
  { name: 'Teclado de computador', bin: 'especial', tip: 'Eletrônicos têm metais valiosos e tóxicos. Leve ao e-lixo.', aliases: ['computador', 'mouse', 'notebook'] },
  { name: 'Panela de alumínio sem cabo', bin: 'metal', tip: 'Retire o cabo de plástico antes.', aliases: ['panela'] },
]

export const RESIN_CODES = [
  { code: 1, abbr: 'PET', name: 'Polietileno tereftalato', examples: 'Garrafas de refrigerante e água' },
  { code: 2, abbr: 'PEAD', name: 'Polietileno de alta densidade', examples: 'Frascos de xampu e de limpeza' },
  { code: 3, abbr: 'PVC', name: 'Policloreto de vinila', examples: 'Canos, tubos e mangueiras' },
  { code: 4, abbr: 'PEBD', name: 'Polietileno de baixa densidade', examples: 'Sacolas e filmes plásticos' },
  { code: 5, abbr: 'PP', name: 'Polipropileno', examples: 'Potes de margarina, tampas, copos' },
  { code: 6, abbr: 'PS', name: 'Poliestireno', examples: 'Copos descartáveis e isopor (EPS)' },
  { code: 7, abbr: 'Outros', name: 'Mistos e outros plásticos', examples: 'Policarbonato, embalagens multicamadas' },
]

export const SEPARATION_STEPS = [
  { title: 'Separe secos de úmidos', text: 'Restos de comida (úmidos) de um lado; embalagens e papéis (secos) do outro.' },
  { title: 'Limpe as embalagens', text: 'Uma enxaguada rápida basta — use água de reuso, como a da louça.' },
  { title: 'Divida por material', text: 'Papel, plástico, vidro e metal. Na dúvida, use a busca “Onde descarto?”.' },
  { title: 'Reduza o volume', text: 'Amasse latas e garrafas e desmonte caixas para caber mais no caminhão.' },
  { title: 'Entregue no lugar certo', text: 'Coleta seletiva, ecoponto (PEV) ou cooperativa de catadores da sua cidade.' },
]

export const SPECIAL_DISPOSAL = [
  { title: 'Pilhas e baterias', where: 'Coletores em supermercados, farmácias e lojas de eletrônicos.', why: 'Têm metais pesados que contaminam solo e água.' },
  { title: 'Eletrônicos (e-lixo)', where: 'Pontos de coleta de eletroeletrônicos e assistências técnicas.', why: 'Contêm ouro, cobre e substâncias tóxicas.' },
  { title: 'Óleo de cozinha', where: 'Garrafa PET fechada → ecopontos e mercados parceiros.', why: '1 litro pode contaminar até 25 mil litros de água.' },
  { title: 'Medicamentos', where: 'Farmácias com coletor de medicamentos vencidos.', why: 'Remédios no esgoto afetam rios e animais.' },
  { title: 'Lâmpadas', where: 'Devolva no ponto de venda (logística reversa).', why: 'Fluorescentes contêm mercúrio.' },
  { title: 'Pneus', where: 'Borracharias e pontos municipais de coleta.', why: 'Parados acumulam água e viram criadouro de mosquitos.' },
]
