# Vaga Perto

App para encontrar emprego perto de casa. A pessoa digita a cidade, o bairro e o cargo, escolhe até que distância aceita ir e vê:

- vagas abertas no Espírito Santo, coletadas da Catho, InfoJobs e LinkedIn, com link direto para o anúncio;
- links prontos para os principais sites de vagas, com o cargo e a cidade preenchidos;
- as cidades vizinhas dentro do raio;
- lugares para levar o currículo (SINE, agências, mercados, lojas, restaurantes);
- dicas do que levar e de como evitar golpes.

## Arquivos

- `index.html`: o app.
- `municipios.js`: os 5.570 municípios do IBGE com coordenadas, usados para calcular as distâncias.
- `ofertas.js`: as vagas do ES coletadas na data indicada no próprio arquivo.
- `coletor/coletar.py`: o script que gera o `ofertas.js` (`python3 coletar.py municipios.js ofertas.js`; precisa de `curl` e `beautifulsoup4`).

## Versão atualizada todo dia

Esta pasta é uma cópia. A versão principal fica no Claude, em https://claude.ai/artifact/EZLfYL9g1bdAVjNH3DvcUv. Lá, uma tarefa agendada roda o coletor todo dia às 4h34 e atualiza as vagas. Aqui, o `ofertas.js` só muda quando a pasta for atualizada.

O mural de vagas (onde empresas anunciam) só funciona na versão do Claude, porque usa o banco de dados de lá.
