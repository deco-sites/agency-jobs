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
Como está implementado? Temos um banco `supabase` no qual armazenamos as vagas que foram obtidas no `GET` acima, o que o `POST` faz é: buscar no banco todas as vagas que ainda não foram postadas no canal para em seguida publicá-las.

Tendo falado das rotas, vamos agora explicar qual a necessidade do banco. Utilizamos um banco de dados para evitar que ao executar o scapper novamente, postemos vagas repetidas no canal. A chave primária do banco é composta pelo título + subtítulo (cajo haja) + descrição da vaga, sendo assim, caso já exista no banco uma vaga com essa chave não salvamos-a novamente, portanto ao executar o `POST` (que obtém as vagas do banco da dados) não iremos publicar a mesma vaga pela segunda vez.

Utilizamos o [supabase](https://supabase.com/) e para criar o banco de dados basta executar o comando abaixo:

```
create table opportunities (
  id bigint generated by default as identity,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  _id text,
  title text,
  subtitle text,
  description text,
  url text,
  source jsonb,
  posted boolean,
  PRIMARY KEY (_id)
);
```


## Variáveis de Ambiente

SUPABASE_URL | SUPABASE_KEY | DISCORD_WEBHOOK

## Como executar

```sh
deno task start
```