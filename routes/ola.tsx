import type { Handlers } from "$fresh/server.ts";

type Opportunity = {
  source: {
    name: string; // Original.io
    url: string; // https://originalio.solides.jobs/
  };
  title: string; // Software Engineer
  // ...
};

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const originalPromise = fetch(
      "https://api.solides.jobs/v2/vacancy/search?reference_id=61196&search=&page=1&pagination=25&vacancyType=jobs",
    ).then((r) => r.json());

    const outraOrgPromise = fetch(
      "https://api.solides.jobs/v2/vacancy/search?reference_id=92&search=&page=1&pagination=25&vacancyType=jobs",
    ).then((r) => r.json());

    const [original, outra] = await Promise.all([
      originalPromise,
      outraOrgPromise,
    ]);

    // 1. Requisitar APIs de todas as fontes (dica: usar Promise.all ao invés de vários await fetch)
    // 2. Identificar o tipo de retorno (Quicktype)
    // 3. Mapear todas as vagas para um schema comum (pode se inspirar no da Solide)
    // 4. Retornar um array de jobs

    return Response.json({ teste: null });
  },
};

export interface SolidesJobs {
  code_request_jobs: number;
  code_request_gestao: number;
  data: Datum[];
  totalRecords: number;
  totalPages: number;
  page: number;
  pagination: number;
  totalAvailablePositions: number;
}

export interface Datum {
  id: number;
  name: string;
  departament: null;
  place: null;
  city: City;
  company: Company;
  pcdOnly: boolean;
  state: State;
  description: null;
  videoUrl: null;
  linkVacancy: string;
  availablePositions: number;
}

export interface City {
  id: number;
  name: string;
}

export interface Company {
  name: string;
  logo: string;
}

export interface State {
  name: string;
  acronym: string;
}
