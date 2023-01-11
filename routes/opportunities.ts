import type { Handlers } from "$fresh/server.ts";

import { Opportunity } from '../architecture/Opportunity.ts'
import { Scraper } from '../architecture/Scraper.ts'

import { Maeztra } from '../scrapers/Maeztra.ts'
import { Codeby } from '../scrapers/Codeby.ts'
import { Avanti } from '../scrapers/Avanti.ts'
import { AgenciaMetodo } from '../scrapers/AgenciaMetodo.ts'
import { Hibrido } from "../scrapers/Hibrido.ts";

export const handler: Handlers = {
    GET: async () => {
        try {
            let opportunities : Opportunity[] = [] 

            const scrapers : Scraper[] = [
                new Maeztra(),
                new Codeby(),
                new Avanti(),
                new AgenciaMetodo(),
                new Hibrido()
            ]

            await Promise.all(
                scrapers.map(( scraper ) => scraper.execute())
            ).then((results) => {
                for ( const result of results ) {
                    opportunities = opportunities.concat(result)
                }
            })

            return Response.json({ opportunities })
        } catch (e) {
            console.log(e)
            return Response.error()
        }
    }
}

// SORTEADO
// https://penseavanti.enlizt.me/
// https://drivencx.solides.jobs/
// https://m3ecommerce.com/trabalhe-conosco/
// https://maeztra.com/vagas/
// https://originalio.solides.jobs/