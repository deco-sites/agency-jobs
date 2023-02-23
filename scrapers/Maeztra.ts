import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

import { Opportunity } from '../architecture/Opportunity.ts'
import { Scraper } from '../architecture/Scraper.ts'
import { createHashId } from '../utils/utils.ts'

class MaeztraScraper implements Scraper {
  url = 'https://maeztra.com/vagas/'

  async execute() {
    let opportunities: Opportunity[] = []

    const res = await fetch(this.url)
    const html = await res.text()

    const $ = cheerio.load(html)

    let title = ''
    let description = ''

    $(
      ' div[data-elementor-type="wp-page"] > div.has_eae_slider.elementor-element.e-con-boxed.e-con > div.e-con-inner',
    ).each((_, element) => {
      title = $(element)
        .children('div.elementor-widget-heading')
        .children('div.elementor-widget-container')
        .children('h3')
        .text()
        .trim()

      $(element)
        .children('div.elementor-widget-text-editor')
        .children('div.elementor-widget-container')
        .children()
        .each((_, child) => {
          if (child.tagName == 'p') {
            if (description != '') description += '\n'
            description += $(child)
              .find('br')
              .replaceWith('\n')
              .end()
              .text()
              .trim()
          }
        })

      if (title) {
        opportunities.push({
          _id: '',
          title,
          description,
          url: this.url,
          source: {
            name: 'Maeztra',
            url: this.url,
          },
        })

        title = ''
        description = ''
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

export const Maeztra = new MaeztraScraper()
