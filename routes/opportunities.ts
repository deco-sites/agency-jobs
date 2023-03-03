import type { Handlers } from '$fresh/server.ts'

import { Opportunity } from '../architecture/Opportunity.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@1.35.4'

import * as scrapers from '../scrapers/index.ts'

const supabaseUrl: string = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey: string = Deno.env.get('SUPABASE_KEY') || ''
const discordWebhook: string = Deno.env.get('DISCORD_WEBHOOK') || ''

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

      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error } = await supabase
        .from('opportunities')
        .insert(opportunities)

      if (error == null) {
        console.log('inserted into the database successfully')
      }

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
        .is('posted', false)

      if (error != null) {
        return Response.json({
          message: 'error when trying to get opportunities from the DB',
        })
      }

      const timer = (ms: number) => new Promise((res) => setTimeout(res, ms))

      for (let index = 0; index < opportunities.length; index++) {
        const o = opportunities[index]

        let description = ''
        if (o.description.length > 1700) {
          description = `${o.description.slice(
            0,
            1700,
          )}...\n Acesse a vaga para ver todos os detalhes.\n Link para a vaga: ${
            o.url
          }`
        } else {
          description = o.description + '\n Link para a vaga: ' + o.url
        }

        const data = {
          content: description,
          username: 'Vagas de Emprego',
          thread_name: o.title,
        }

        const res = await fetch(
            discordWebhook,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          },
        )

        if (res.status == 204) {
          await supabase
            .from('opportunities')
            .update({ posted: true })
            .eq('_id', o._id)
        }

        await timer(3000)
      }

      return Response.json({
        message: 'sending opportunities to discord channel',
      })
    } catch (e) {
      console.log(e)
      return Response.error()
    }
  },
}
