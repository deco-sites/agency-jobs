import type { Handlers } from '$fresh/server.ts'

import { Opportunity } from '../architecture/Opportunity.ts'

import * as scrapers from '../scrapers/index.ts'

export const handler: Handlers = {
  GET: async () => {
    try {
      let opportunities: Opportunity[] = []

      await Promise.all(
        Object.entries(scrapers).map(([_, object]) => object.execute()),
      ).then((results) => {
        for (const result of results) {
          opportunities = opportunities.concat(result)
        }
      })

      // const supabase = createClient(supabaseUrl, supabaseKey);

      // const { error } = await supabase
      //   .from('opportunities')
      //   .insert(opportunities)

      // if (error == null) {
      //   console.log('inserted into the database successfully')
      // }

      return Response.json({ opportunities })
    } catch (e) {
      console.log(e)
      return Response.error()
    }
  },
  POST: async () => {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data: opportunities, error } = await supabase
        .from('opportunities')
        .select('*')

      if (error != null) {
        return Response.json({
          message: 'error when trying to get opportunities from the DB',
        })
      }

      let delay = 0
      const delayIncrement = 500

      const promises = opportunities.map((o) => {
        delay += delayIncrement

        const data = {
          content: o.description + '\n Link para a vaga: ' + o.url,
          username: 'Vagas de Emprego',
          thread_name: o.title,
        }

        return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
          fetch(
            'https://discord.com/api/webhooks/1065085478933643324/BOMeFIEfkhym1ZP0rATF0WMlR10JQsc18axzFZAzdLjwPKG5ggQGyw_FXSgK0LcWuddZ',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            },
          ),
        )
      })

      Promise.all(promises).then((res) => console.log(res))

      return Response.json({
        message: 'sending opportunities to discord channel',
      })
    } catch (e) {
      console.log(e)
      return Response.error()
    }
  },
}
