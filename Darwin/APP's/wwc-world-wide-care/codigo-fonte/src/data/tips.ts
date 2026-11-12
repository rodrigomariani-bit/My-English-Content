import type { Tip } from '../types'

export const TIPS: Tip[] = [
  // Água
  {
    id: 'agua-banho',
    title: 'Banhos curtos, registro fechado',
    text: 'Um banho de 15 minutos com o registro meio aberto gasta cerca de 135 litros. Fechando o registro ao se ensaboar e reduzindo para 5 minutos, o consumo cai para uns 45 litros.',
    category: 'agua',
    sdg: 6,
    saving: '≈ 90 L por banho',
  },
  {
    id: 'agua-escova',
    title: 'Use um copo ao escovar os dentes',
    text: 'Com a torneira aberta, 5 minutos de escovação gastam até 12 litros. Molhando a escova, fechando a torneira e enxaguando com um copo, você economiza mais de 11 litros.',
    category: 'agua',
    sdg: 6,
    saving: '≈ 11 L por escovação',
  },
  {
    id: 'agua-vazamento',
    title: 'Cace os vazamentos',
    text: 'Uma torneira pingando pode desperdiçar cerca de 46 litros por dia. Feche todos os registros e observe o hidrômetro: se ele girar, há vazamento.',
    category: 'agua',
    sdg: 6,
    saving: 'até 1.380 L por mês',
  },
  {
    id: 'agua-balde',
    title: 'Balde no lugar da mangueira',
    text: 'Lave carro, calçada e quintal com balde e vassoura. A mangueira aberta gasta centenas de litros em poucos minutos.',
    category: 'agua',
    sdg: 6,
  },
  {
    id: 'agua-chuva',
    title: 'Guarde a água da chuva',
    text: 'Um recipiente tampado embaixo da calha junta água para regar plantas e lavar o chão. Mantenha sempre fechado para não criar focos de mosquito.',
    category: 'agua',
    sdg: 6,
  },
  {
    id: 'agua-maquina',
    title: 'Máquina de lavar só cheia',
    text: 'Acumule roupas e use a máquina com carga completa. A água do último enxágue pode ser reaproveitada na limpeza.',
    category: 'agua',
    sdg: 6,
  },
  // Energia
  {
    id: 'energia-led',
    title: 'Troque por lâmpadas LED',
    text: 'Lâmpadas LED gastam até 80% menos energia que as incandescentes e duram muitas vezes mais.',
    category: 'energia',
    sdg: 7,
    saving: 'até 80% na iluminação',
  },
  {
    id: 'energia-standby',
    title: 'Standby também consome',
    text: 'Aparelhos em espera continuam puxando energia. Use réguas com interruptor e desligue tudo de uma vez ao sair.',
    category: 'energia',
    sdg: 7,
  },
  {
    id: 'energia-ar',
    title: 'Ar-condicionado a 23 °C',
    text: 'Cada grau a menos aumenta o consumo. Mantenha portas e janelas fechadas e limpe o filtro todo mês.',
    category: 'energia',
    sdg: 7,
  },
  {
    id: 'energia-chuveiro',
    title: 'Chuveiro elétrico na posição verão',
    text: 'Nos dias quentes, a posição verão (morno) consome bem menos que a posição inverno. O chuveiro costuma ser o maior gasto de energia da casa.',
    category: 'energia',
    sdg: 7,
  },
  {
    id: 'energia-geladeira',
    title: 'Geladeira bem cuidada',
    text: 'Não guarde comida quente, não abra a porta à toa e confira se a borracha veda bem. Deixe espaço atrás dela para o calor sair.',
    category: 'energia',
    sdg: 7,
  },
  {
    id: 'energia-luz-natural',
    title: 'Aproveite a luz do sol',
    text: 'Abra cortinas durante o dia e pinte paredes com cores claras: o ambiente fica iluminado sem gastar energia.',
    category: 'energia',
    sdg: 7,
  },
  // Consumo
  {
    id: 'consumo-sacola',
    title: 'Sacola e garrafa sempre na mochila',
    text: 'Ter itens reutilizáveis à mão evita dezenas de sacolas e garrafas descartáveis por mês.',
    category: 'consumo',
    sdg: 12,
  },
  {
    id: 'consumo-canudo',
    title: 'Recuse descartáveis',
    text: 'Diga “não, obrigado” para canudos, talheres e copos de plástico. Eles são usados por minutos e podem durar séculos na natureza.',
    category: 'consumo',
    sdg: 14,
  },
  {
    id: 'consumo-conserto',
    title: 'Conserte antes de trocar',
    text: 'Roupas, eletrônicos e móveis muitas vezes têm conserto. Isso economiza dinheiro e evita lixo.',
    category: 'consumo',
    sdg: 12,
  },
  {
    id: 'consumo-refil',
    title: 'Prefira refil e menos embalagem',
    text: 'Produtos em refil ou a granel usam menos plástico. Leve seus potes quando puder.',
    category: 'consumo',
    sdg: 12,
  },
  {
    id: 'consumo-doar',
    title: 'Doe o que não usa',
    text: 'Roupas, livros e brinquedos parados podem ajudar outras famílias. Use a área de Comunidades para encontrar quem precisa.',
    category: 'consumo',
    sdg: 1,
  },
  // Alimentação
  {
    id: 'alimento-planejar',
    title: 'Planeje as refeições',
    text: 'Cerca de um terço dos alimentos produzidos no mundo é perdido ou desperdiçado (FAO). Uma lista de compras simples já reduz muito o desperdício em casa.',
    category: 'alimentacao',
    sdg: 2,
  },
  {
    id: 'alimento-integral',
    title: 'Aproveite talos, cascas e sementes',
    text: 'Talos de couve, cascas de abóbora e sementes viram refogados, bolos e chips nutritivos.',
    category: 'alimentacao',
    sdg: 12,
  },
  {
    id: 'alimento-compostagem',
    title: 'Faça compostagem',
    text: 'Cascas, borra de café e folhas viram adubo em uma composteira doméstica. Metade do lixo de uma casa costuma ser orgânico.',
    category: 'alimentacao',
    sdg: 12,
  },
  {
    id: 'alimento-local',
    title: 'Compre local e da estação',
    text: 'Alimentos da estação e de produtores próximos viajam menos, chegam mais frescos e fortalecem a economia local.',
    category: 'alimentacao',
    sdg: 2,
  },
  {
    id: 'alimento-plantas',
    title: 'Mais pratos à base de plantas',
    text: 'Trocar algumas refeições com carne por feijão, lentilha e legumes reduz o uso de água e as emissões ligadas à comida.',
    category: 'alimentacao',
    sdg: 13,
  },
  // Mobilidade
  {
    id: 'mobilidade-ativa',
    title: 'Trajetos curtos a pé ou de bike',
    text: 'Para distâncias de até 3 km, caminhar ou pedalar costuma ser tão rápido quanto o carro — e não emite poluentes.',
    category: 'mobilidade',
    sdg: 11,
  },
  {
    id: 'mobilidade-coletivo',
    title: 'Transporte público e carona',
    text: 'Um ônibus cheio tira dezenas de carros da rua. Combine caronas com colegas para ir à escola ou ao trabalho.',
    category: 'mobilidade',
    sdg: 11,
  },
  {
    id: 'mobilidade-pneu',
    title: 'Pneus calibrados',
    text: 'Pneus murchos aumentam o consumo de combustível. Calibre a cada 15 dias.',
    category: 'mobilidade',
    sdg: 13,
  },
  // Natureza
  {
    id: 'natureza-arvore',
    title: 'Plante e cuide de árvores',
    text: 'Árvores dão sombra, abrigam animais, seguram o solo e ajudam a refrescar as cidades. Prefira espécies nativas da sua região.',
    category: 'natureza',
    sdg: 15,
  },
  {
    id: 'natureza-rios',
    title: 'Rios começam na sua rua',
    text: 'O lixo jogado na calçada vai para bueiros, rios e, por fim, para o oceano. Milhões de toneladas de plástico chegam ao mar todos os anos.',
    category: 'natureza',
    sdg: 14,
  },
  {
    id: 'natureza-oleo',
    title: 'Óleo de cozinha não vai na pia',
    text: 'Um litro de óleo pode contaminar até 25 mil litros de água. Guarde em garrafa PET e leve a um ponto de coleta.',
    category: 'natureza',
    sdg: 6,
  },
  {
    id: 'comunidade-voluntario',
    title: 'Doe seu tempo',
    text: 'Aulas de reforço, oficinas, tradução ou ajuda em mutirões: voluntariado também é doação, e pode ser feito até a distância.',
    category: 'comunidade',
    sdg: 17,
  },
]

export interface Fact {
  text: string
  source: string
}

export const FACTS: Fact[] = [
  { text: 'A Agenda 2030 da ONU reúne 17 Objetivos de Desenvolvimento Sustentável, assumidos por 193 países.', source: 'ONU' },
  { text: 'Cerca de 2,2 bilhões de pessoas ainda não têm acesso a água potável gerida de forma segura.', source: 'OMS/UNICEF' },
  { text: 'Aproximadamente um terço de todo alimento produzido no planeta é perdido ou desperdiçado.', source: 'FAO' },
  { text: 'O alumínio pode ser reciclado infinitas vezes, e o Brasil recicla praticamente todas as latas de bebida.', source: 'Abralatas' },
  { text: 'O vidro é 100% reciclável: um pote velho vira um pote novo sem perder qualidade.', source: 'Abividro' },
  { text: 'Um litro de óleo de cozinha jogado na pia pode contaminar até 25 mil litros de água.', source: 'Sabesp' },
]

export const SUSTAINABILITY_PILLARS = [
  {
    title: 'Ambiental',
    text: 'Usar os recursos da natureza sem esgotá-los: água, solo, florestas, energia e clima.',
  },
  {
    title: 'Social',
    text: 'Garantir que todas as pessoas tenham acesso a água, comida, saúde, educação e moradia dignas.',
  },
  {
    title: 'Econômico',
    text: 'Gerar renda e desenvolvimento sem destruir o ambiente — como as cooperativas de reciclagem.',
  },
]
