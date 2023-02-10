import { SolidesScraper } from "./index.ts";

class TrintoScraper extends SolidesScraper {

    url = 'https://api.solides.jobs/v2/vacancy/search?reference_id=44852&vacancyType=jobs'
    source = {
        name: 'Trinto',
        url: 'https://trinto.solides.jobs/'
    }

}

export const Trinto = new TrintoScraper()