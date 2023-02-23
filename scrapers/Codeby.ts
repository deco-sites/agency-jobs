import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

import { Opportunity } from '../architecture/Opportunity.ts'
import { Scraper } from '../architecture/Scraper.ts'
import { createHashId } from '../utils/utils.ts'

class CodebyScraper implements Scraper {
  url = 'https://codeby.global/pages/vagas/'

  async execute() {
    let opportunities: Opportunity[] = []

    const res = await fetch(this.url)
    const html = await res.text()

    const $ = cheerio.load(html)

    const element = $('main > section > div > div.rte')

    let title = ''
    let description = ''

    element.children().each((_, child) => {
      if (child.tagName == 'h2') {
        const text = $(child).text().trim()
        if (text) title = text
      } else if (child.tagName == 'hr') {
        opportunities.push({
          _id: '',
          title,
          description,
          url: this.url,
          source: {
            name: 'CodeBy',
            url: this.url,
          },
        })

        title = ''
        description = ''
      } else {
        if (child.tagName == 'div') {
          const parsed = $(child)
          const text = parsed.text().trim()
          if (text) {
            description += '\n'

            if (parsed.children('strong').length == 1) {
              description += '\n' + parsed.text().trim() + '\n'
            } else {
              description += text
            }
          }
        } else if (child.tagName == 'ul') {
          $(child)
            .children('li')
            .each((_, li) => {
              description += '\n - ' + $(li).text().trim()
            })
        } else if (child.tagName == 'p') {
          const parsed = $(child)
          const text = parsed.text().trim()
          if (text && text != '&nbsp;') {
            description += '\n'
            description += '\n' + text + '\n'
          }
        }
      }
    })

    opportunities = await Promise.all(
      opportunities.map(async (o: Opportunity) => {
        let { _id, ...opportunityWithoutId } = o

        _id = await createHashId(o.title, o.subtitle, o.description)
        return {
          _id,
          ...opportunityWithoutId,
        }
      }),
    )

    return opportunities
  }
}

export const Codeby = new CodebyScraper()
