import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12"

import { Opportunity } from '../architecture/Opportunity.ts'
import { Scraper } from '../architecture/Scraper.ts'

export class Hibrido implements Scraper {

    url = "https://hibrido.gupy.io/"

    async execute() {
        
        const opportunities: Opportunity[] = []
        
        const res = await fetch(this.url)
        const html = await res.text()
        
        const $ = cheerio.load(html)  
                    
        const elements = $('section#job-listing > ul > li > a')
    
        for (const element of elements) {
            if(element.attribs?.href) {
                const hrefWithoutFirstBar = element.attribs.href.slice(1)
                await this.getOpportunityFromPage( this.url + hrefWithoutFirstBar )
                    .then((opportunity) => {
                        opportunities.push(opportunity)
                    })
            }
        }
        
        return opportunities
    }

    async getOpportunityFromPage(url: string) : Promise<Opportunity> {

        let title = ''        
        let subtitle = ''
        let description = ''

        const res = await fetch(url)
        const html = await res.text()
        
        const $ = cheerio.load(html)

        $('#__next > header > div > div').each((index, element) => {
            if(index == 1) {
                title = $(element).children('h1').text().trim()
            } else if (index == 2) {
                $(element).children('div').children('span').each((_, span) => {
                    if(subtitle != '') subtitle += ' | '
                    subtitle += $(span).text()
                })
            }
        })

        $('#__next > main > section > div[data-testid="text-section"]').each((_, element) => {
            
            const parsed = $(element)

            const h2 = parsed.children('h2').text().trim().toUpperCase()
            if(h2) description += '\n' + h2 + '\n'
            
            parsed.children('div').children().each((_, child) => {
                description += '\n'
                
                if(child.tagName == 'p') description += $(child).text()
                else if(child.tagName == 'ul') {
                    $(child).children('li').each((_, li) => {
                        description += ' - ' + $(li).text().trim() + '\n'
                    })
                }
            })
        })

        return {
            title,
            subtitle,
            description,
            url,
            source: {
                name: 'Hibrido',
                url: this.url
            }
        }
    }

}