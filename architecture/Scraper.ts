import { Opportunity } from "./Opportunity.ts"

export interface Scraper {
    url: string
    execute: () => Promise<Opportunity[]>
}