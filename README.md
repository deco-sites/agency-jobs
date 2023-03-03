# 🇧🇷 Agency Jobs — WebScrapper

Um serviço para capturar vagas de empregos de diversos sites e publica-las como threads no discord.

## Arquitetura:
Vamos trabalhar com duas interfaces nesse projeto `Scraper` e `Opportunity`. 
#### Scraper 
Intuíto: Ser implementada por objetos que são capazes de acessar um url e pegar vagas. `Scraper` nos dá uma array de `Opportunity`
#### Opportunity
Intuíto: Resepresentar uma vaga de emprego, contendo: título, subtítulo, descrição, url, e a origem da vaga sendo a empresa e a url de mais vagas dessa empresa.

## Como isso funciona?

Em [routes/opportunies](https://github.com/deco-sites/agency-jobs/blob/main/routes/opportunities.ts) você vai encontrar a implementação de duas rotas.

#### GET
Objetivo: Pegar as vagas de emprego dos sites
Como está implementado? Tendo uma lista de `Scrapers` vamos executar esses scrapers para que busquem as vagas em seu site. Tendo cada um retornado com suas vagas, cadastramos essa vaga no banco e devolvemos a lista completa para o cliente.

#### POST
Objetivo: Publicar as vagas de emprego no discord
Como está implementado? 

Tendo falado das rotas, vamos agora explicar qual a necessidade do banco

## Variáveis de Ambiente

SUPABASE_URL | SUPABASE_KEY | DISCORD_WEBHOOK

## Como executar

```sh
deno task start
```