import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12"

import { Opportunity } from '../architecture/Opportunity.ts'
import { Scraper } from '../architecture/Scraper.ts'

class AvantiScraper implements Scraper {

    url = "https://penseavanti.enlizt.me/"

    async execute() {
        
        const opportunities: Opportunity[] = []
        
        const res = await fetch(this.url)
        const html = await res.text()
        
        const $ = cheerio.load(html)  
        
        const elements = $('.department-list > ul > li > a')
        
        for(const element of elements) { 
            if( element.attribs?.href && element.attribs?.['data-title'] ) {
                const hrefWithoutFirstBar = element.attribs.href.slice(1)
                await this.getOpportunityFromPage( this.url + hrefWithoutFirstBar)
                    .then((opportunity) => {
                        opportunities.push(opportunity)
                    })
            }
        }
    
        return opportunities
    }

    async getOpportunityFromPage(url: string) : Promise<Opportunity> {
        
        const res = await fetch(url)
        const html = await res.text()
        
        const $ = cheerio.load(html)  
        const main = $('#main-content')

        const title = main.children('header').children('div').children('h1').text().trim()

        let subtitle = ''

        main.children('header').children('div').children('.text-container').children('p').each((_, child) => {
            if(subtitle != '') subtitle += ' | '
            const text = $(child).text().trim() // with strange spaces

            const validText = text.split('  ')
                                    .filter((value) => !!value)
                                    .reduce((prev, next) => prev.trim() + ' ' + next.trim())

            subtitle += validText
        })
        
        let description = ''

        main.children('.frame-content').children('.text-container').each((_, section) => {
            $(section).children().each((_, child) => {
                if(description != '') description += '\n'

                if(child.tagName == 'h2') description += '\n' + $(child).text().trim().toUpperCase() + '\n'
                else if(child.tagName == 'h3') description += '\n' + $(child).text().trim().toUpperCase()
                else if(child.tagName == 'p') description += $(child).text().trim()
                else if(child.tagName == 'hr') description += '----------'
                else if(child.tagName == 'ul') {
                    $(child).children('li').each((_, li) => {
                        description += ' - ' + $(li).text().trim() + '\n'
                    })
                }
                else if(child.tagName == 'div') {
                    $(child).children().each((index, mini_child) => {
                        if(index != 0) description += '\n'

                        if(mini_child.tagName == 'h4') description += '\n' + $(mini_child).text().trim().toUpperCase() + '\n'
                        else if(mini_child.tagName == 'h5') description += $(mini_child).text().trim().toUpperCase() + '\n'
                        else if(mini_child.tagName == 'p') description += $(mini_child).text().trim()
                        else if(mini_child.tagName == 'ul') {
                            $(mini_child).children('li').each((_, li) => {
                                description += ' - ' + $(li).text().trim() + '\n'
                            })
                        }
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
                name: 'Avanti',
                url: this.url
            }   
        }
    }

}

export const Avanti = new AvantiScraper()