import { Opportunity } from '../../architecture/Opportunity.ts'
import { Scraper } from "../../architecture/Scraper.ts";

type SolidesResponse = { 
    code_request_jobs: number
    totalPages: number
    data: Vacancy[]
}

type Vacancy = {
    name: string
    city: {
        name: string
    },
    state: {
        acronym: string
    }
    pcdOnly: boolean
    linkVacancy: string
    availablePositions: number
}

export abstract class SolidesScraper implements Scraper {

    url = ''
    source = {
        name: '',
        url: '' 
    }

    async execute() {
        let opportunities : Opportunity[] = []

        try {
            const { totalPages } = await fetch(this.url).then(res => res.json()) as SolidesResponse
            
            const pages = Array.from({length: totalPages}, (_, i) => i + 1)

            await Promise.all(
                pages.map((page) => this.getVacancies(page))
            ).then((results) => {
                for (const result of results) {
                    opportunities = opportunities.concat(result)
                }
            })

        } catch(e) {
            console.log(e)
        }
        
        return opportunities
    }

    private async getVacancies(page: number) {

        const opportunities : Opportunity[] = []

        try {
            const { data } = await fetch(this.url + `&page=${page}`).then(res => res.json()) as SolidesResponse
            
            return await Promise.all(
                data.map((vacancy) => this.getOpportunity(vacancy))
            )
        } catch(e) {
            console.log(e)
        }

        return opportunities
    }

    private getOpportunity(vacancy: Vacancy) : Opportunity {
        
        let subtitle = vacancy.city.name + ' / ' + vacancy.state.acronym + ' | Vagas: ' + vacancy.availablePositions
        
        if(vacancy.pcdOnly) subtitle += ' | PCD'
        
        const description = this.getDescription()

        return {
            title: vacancy.name,
            subtitle,
            description,
            url: vacancy.linkVacancy,
            source: this.source
        }
    }

    private getDescription() {        
        // o html está vindo vazio porque o fetch não roda o javascript
        const description = ''


        return description
    }

}