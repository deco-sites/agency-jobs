import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'
import { Opportunity } from '../architecture/Opportunity.ts'
import { ReferenceId } from '../utils/referenceId.ts'

export class Solides implements Scraper {
  url = 'https://<agency>.solides.jobs/vacancies/'

  async execute() {
    const referenceIds: string[] = [
      ReferenceId.DrivenCX,
      ReferenceId.OriginalIo,
      ReferenceId.Enext,
      ReferenceId.Trinto,
    ]

    const opportunities: Opportunity[] = []

    const solideSites = referenceIds.map((id) =>
      fetch(
        `https://api.solides.jobs/v2/vacancy/search?reference_id=${id}&search=&page=1&pagination=25&vacancyType=jobs`,
      ),
    )

    await Promise.all(solideSites).then(async (results) => {
      let idsVacancies = []

      for (const result of results) {
        const res = await result.json()
        const data = res.data

        this.getIdsVacancies(data, idsVacancies)
      }

      for (const id of idsVacancies) {
        const link = `https://api.solides.jobs/v2/vacancy/${id}`
        const response = await fetch(link)
        const vacancy = await response.json()
        const data = vacancy.data

        opportunities.push({
          title: data.title,
          description: this.parseDescription(data.description),
          url: data.linkVacancy,
          source: {
            name: data.company,
            url: this.url.replace('<agency>', data.slug),
          },
        })
      }
    })

    return opportunities
  }

  getIdsVacancies(data, idsVacancies): any[] {
    for (const d of data) {
      const idVacancy = d.id
      idsVacancies.push(idVacancy)
    }

    return idsVacancies
  }

  parseDescription(description: string): string {
    let descriptionText = ''
    const $ = cheerio.load(description)
    $('p').each((_, element) => {
      if (descriptionText != '') descriptionText += '\n\n'

      descriptionText += $(element)
        .find('br')
        .replaceWith('\n')
        .end()
        .text()
        .trim()
    })

    return descriptionText
  }
}
