import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12"

import { Opportunity } from '../../architecture/Opportunity.ts'
import { Scraper } from "../../architecture/Scraper.ts";

type SolidesResponse = { 
    code_request_jobs: number
    totalPages: number
    data: Vacancy[]
}

type Vacancy = {
    id: number
    name: string
    city: {
        name: string
    },
    state: {
        acronym: string
    }
    pcdOnly: boolean
    linkVacancy: string
    availablePositions: number,
    description?: string
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

        try {
            const { data } = await fetch(this.url + `&page=${page}`).then(res => res.json()) as SolidesResponse
            
            return await Promise.all(
                // data.map((vacancy) => this.getOpportunity(vacancy))
                [this.getOpportunity(data[0])]
            )
            .then((opportunities) => opportunities)
            .catch(() => [])
        } catch(e) {
            console.log(e)
        }

        return []
    }

    private async getOpportunity(vacancy: Vacancy) : Promise<Opportunity> {
        
        let subtitle = vacancy.city.name + ' / ' + vacancy.state.acronym + ' | Vagas: ' + vacancy.availablePositions
        
        if(vacancy.pcdOnly) subtitle += ' | PCD'
        
        const description = await this.getDescription(vacancy.id)

        console.log(description)

        return {
            title: vacancy.name,
            subtitle,
            description,
            url: vacancy.linkVacancy,
            source: this.source
        }
    }

    private async getDescription(id: number) {        

        const response = await fetch(`https://api.solides.jobs/v2/vacancy/${id}`).then(res => res.json())

        if(!response?.data) return ''

        const data = response.data as Vacancy
        if(!data.description) return ''

        const $ = cheerio.load(data.description) 

        let description = ''

        $('p, ul').each((_, element) => {
            if (description != '') description += '\n'
      
            if (element.tagName == 'p') {
              description += '\n' + $(element)
                                    .find('br')
                                    .replaceWith('\n')
                                    .end()
                                    .text()
                                    .trim()
            }
            
            else if (element.tagName == 'ul') {
              $(element)
                .children('li')
                .each((_, li) => {
                  description += ' - ' + $(li).text().trim() + '\n'
                })
            }
        })

        return description
    }

}