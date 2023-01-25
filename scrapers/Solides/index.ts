import { Opportunity } from '../../architecture/Opportunity.ts'
import { Scraper } from "../../architecture/Scraper.ts";

export abstract class SolidesScraper implements Scraper {

    url = ''

    async execute() {
        const opportunities : Opportunity[] = []


        return opportunities
    }

    text() {
        console.log(this.url)
    }

}