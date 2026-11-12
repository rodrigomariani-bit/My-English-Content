# WWC – World Wide Care

Aplicativo web responsivo sobre **meio ambiente (Environment)**, criado para um Projeto de Inovação Digital.
O WWC ajuda as pessoas a aprender sustentabilidade, reciclar corretamente, economizar água e energia,
cumprir desafios ambientais e apoiar comunidades do mundo inteiro com **doações diretas e sem taxas**,
conversando com elas num **chat internacional**.

## Funcionalidades

| Tela | O que faz |
|---|---|
| **Início** | Logotipo, boas-vindas personalizadas, criação de perfil, globo 3D interativo com as comunidades, resumo das funcionalidades, dica do dia, desafios sugeridos e impacto estimado. |
| **Reciclagem** | Busca “Onde descarto?” (quase 50 objetos), as 8 cores de lixeira do padrão CONAMA 275/2001, separação em 5 passos, quiz “Qual é a lixeira certa?”, códigos dos plásticos (1 a 7) e descarte especial. |
| **Dicas sustentáveis** | Dica do dia, 29 dicas em 7 temas (com favoritas e “Pratiquei hoje”), calculadora de água no banho, calculadora de energia, pilares da sustentabilidade, “Você sabia?” e os 17 ODS da ONU. |
| **Desafios ambientais** | 17 desafios diários, semanais e únicos; aceitar → concluir → pontos; criação de desafios próprios; filtros por situação e tema. |
| **Comunidades e doações** | Mapa-múndi com zoom, busca e filtro por necessidade, perfil especial de comunidade (ícone das mãos com a moeda universal ¤), doação direta com taxa zero, cadastro de comunidade em 4 etapas (localização no mapa, link do Google Maps ou GPS, dados, formas de doação, revisão), edição e exclusão. |
| **Chat internacional** | Mural global e chat de cada comunidade, com tradução das mensagens e respostas rápidas. |
| **Perfil** | Nome e avatar, pontuação, níveis (Semente → Guardião do Planeta), gráfico de pontos da semana, impacto estimado, 10 conquistas, área de doações, histórico de atividades, tema claro/escuro, dados de exemplo e apagar dados. |
| **Apresentação do projeto** | As 6 respostas do projeto (português e inglês), pitch de 1 minuto em inglês com cronômetro de ensaio, próximos passos e tecnologias. |

Todos os dados do usuário ficam salvos no próprio aparelho (`localStorage`); não há login nem servidor.

## Como executar

Requisitos: [Node.js](https://nodejs.org) 20 ou mais recente.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

Outros comandos:

```bash
npm run build          # verifica os tipos e gera a versão de produção em dist/
npm run preview        # serve a versão de produção localmente
npm run build:single   # gera um único arquivo HTML em dist-single/ (abre sem servidor)
```

## Tecnologias

- **React 19 + TypeScript** – interface em componentes reutilizáveis e tipados
- **Vite 8** – servidor de desenvolvimento e build
- **Tailwind CSS 4** – design responsivo com tokens de cor e tema claro/escuro
- **Zustand** – estado global persistido no `localStorage`
- **Motion** – animações leves (respeita “reduzir movimento” do sistema)
- **D3-geo + Natural Earth (world-atlas)** – globo e mapa-múndi desenhados no próprio app, sem serviços externos
- **Lucide** – ícones

## Estrutura

```
src/
  App.tsx                 rotas, transições, tema e avisos de conquistas
  lib/                    roteador por hash, armazenamento seguro, datas, geografia, pontos e conquistas
  store/                  estado global (Zustand) e notificações
  data/                   conteúdo: desafios, dicas, reciclagem, comunidades, chat, ODS, apresentação
  components/
    layout/               barra lateral, abas do celular, tema
    brand/                logotipo WWC, ícone das mãos com a moeda ¤, avatares
    ui/                   botões, cartões, modal, notificações, campos
    map/                  globo (canvas) e mapa-múndi com zoom (SVG)
    challenges/ tips/ recycling/ community/ profile/
  pages/                  uma página por tela
```

## Observações

- As comunidades e as mensagens que vêm com o app são **exemplos fictícios** em lugares reais, identificados como “Exemplo”.
  As chaves de doação usam o domínio reservado `.example`.
- O protótipo **não processa pagamentos**: ele registra o apoio e mostra os canais oficiais da comunidade.
  A isenção de impostos sobre doações humanitárias é uma **proposta** do projeto (parceria com governos e a ONU).
- Dados de referência: CONAMA 275/2001 (cores), ABNT NBR 13230 (plásticos), Sabesp (consumo de água), FAO, OMS/UNICEF e ONU (Agenda 2030).
