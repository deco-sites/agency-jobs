import type { Handlers } from '$fresh/server.ts'

import { Opportunity } from '../architecture/Opportunity.ts'
import { Scraper } from '../architecture/Scraper.ts'

import { Maeztra } from '../scrapers/Maeztra.ts'
import { Codeby } from '../scrapers/Codeby.ts'
import { Avanti } from '../scrapers/Avanti.ts'
import { AgenciaMetodo } from '../scrapers/AgenciaMetodo.ts'
import { Hibrido } from '../scrapers/Hibrido.ts'
import { M3 } from '../scrapers/M3.ts'

export const handler: Handlers = {
  GET: async () => {
    try {
        
      let opportunities: Opportunity[] = []

      const scrapers: Scraper[] = [
        Maeztra,
        Codeby,
        Avanti,
        AgenciaMetodo,
        Hibrido,
        M3
      ]

      await Promise.all(scrapers.map((scraper) => scraper.execute())).then(
        (results) => {
          for (const result of results) {
            opportunities = opportunities.concat(result)
          }
        },
      )

      return Response.json({ opportunities })
      
    } catch (e) {
      console.log(e)
      return Response.error()
    }
  },
}
