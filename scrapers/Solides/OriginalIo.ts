import { SolidesScraper } from "./index.ts";

class OriginalIoScraper extends SolidesScraper {

    url = 'https://api.solides.jobs/v2/vacancy/search?reference_id=61196&vacancyType=jobs'
    source = {
        name: 'Original.io',
        url: 'https://originalio.solides.jobs/'
    }

}

export const OriginalIo = new OriginalIoScraper()