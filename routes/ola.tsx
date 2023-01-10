import type { Handlers } from "$fresh/server.ts";

type Opportunity = {
  source: {
    name: string // Original.io
    url: string // https://originalio.solides.jobs/
  }
  title: string; // Software Engineer
  // ...
}
export const handler: Handlers = {
  GET: async (req, ctx) => {
    const data = await fetch(
      "https://api.solides.jobs/v2/vacancy/search?reference_id=61196&search=&page=1&pagination=25&vacancyType=jobs"
    ).then((r) => r.json()) as SolidesJobs;

    return Response.json({ teste: data });
  },
};

export interface SolidesJobs {
  code_request_jobs:       number;
  code_request_gestao:     number;
  data:                    Datum[];
  totalRecords:            number;
  totalPages:              number;
  page:                    number;
  pagination:              number;
  totalAvailablePositions: number;
}

export interface Datum {
  id:                 number;
  name:               string;
  departament:        null;
  place:              null;
  city:               City;
  company:            Company;
  pcdOnly:            boolean;
  state:              State;
  description:        null;
  videoUrl:           null;
  linkVacancy:        string;
  availablePositions: number;
}

export interface City {
  id:   number;
  name: string;
}

export interface Company {
  name: string;
  logo: string;
}

export interface State {
  name:    string;
  acronym: string;
}

