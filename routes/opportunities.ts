import type { Handlers } from '$fresh/server.ts'

import { Opportunity } from '../architecture/Opportunity.ts'

import * as scrapers from '../scrapers/index.ts'

export const handler: Handlers = {
    GET: async () => {

        try {
            let opportunities: Opportunity[] = []

            await Promise.all(
                Object.entries(scrapers).map(([_, object ]) => object.execute())
            ).then((results) => {
                for (const result of results) {
                    opportunities = opportunities.concat(result)
                }
            })

            return Response.json({ opportunities })
        } catch (e) {
            console.log(e)
            return Response.error()
        }
    },
}
