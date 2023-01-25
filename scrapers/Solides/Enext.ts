import { SolidesScraper } from "./index.ts";

class EnextScraper extends SolidesScraper {

    url = 'https://api.solides.jobs/v2/vacancy/search?reference_id=70885&vacancyType=jobs'
    source = {
        name: 'Enext',
        url: 'https://enext.solides.jobs/'
    }

}

export const Enext = new EnextScraper()