import type { Handlers } from "$fresh/server.ts";

import { Opportunity } from "../architecture/Opportunity.ts";
import { Scraper } from "../architecture/Scraper.ts";

import { Maeztra } from "../scrapers/Maeztra.ts";
import { Codeby } from "../scrapers/Codeby.ts";
import { Avanti } from "../scrapers/Avanti.ts";
import { AgenciaMetodo } from "../scrapers/AgenciaMetodo.ts";
import { Hibrido } from "../scrapers/Hibrido.ts";
import { Solides } from "../scrapers/Solides.ts";
import { M3 } from "../scrapers/M3.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.4";

const supabaseUrl: string = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey: string = Deno.env.get("SUPABASE_KEY") || "";

export const handler: Handlers = {
  GET: async () => {
    try {
      let opportunities: Opportunity[] = [];

      const scrapers: Scraper[] = [
        new Maeztra(),
        new Codeby(),
        new Avanti(),
        new AgenciaMetodo(),
        new Hibrido(),
        new Solides(),
        new M3(),
      ];

      await Promise.all(scrapers.map((scraper) => scraper.execute())).then(
        (results) => {
          for (const result of results) {
            opportunities = opportunities.concat(result);
          }
        },
      );

      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase
        .from("opportunities")
        .insert(opportunities);

      if (error == null) {
        console.log("inserted into the database successfully");
      }

      return Response.json({ opportunities });
    } catch (e) {
      console.log(e);
      return Response.error();
    }
  },
  POST: async () => {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: opportunities, error } = await supabase
        .from("opportunities")
        .select("*");

      if (error != null) {
        return Response.json({
          message: "error when trying to get opportunities from the DB",
        });
      }

      let delay = 0;
      const delayIncrement = 500;

      const promises = opportunities.map((o) => {
        delay += delayIncrement;

        const data = {
          content: o.description + "\n Link para a vaga: " + o.url,
          username: "Vagas de Emprego",
          thread_name: o.title,
        };

        return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
          fetch(
            "https://discord.com/api/webhooks/1065085478933643324/BOMeFIEfkhym1ZP0rATF0WMlR10JQsc18axzFZAzdLjwPKG5ggQGyw_FXSgK0LcWuddZ",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            },
          )
        );
      });

      Promise.all(promises).then((res) => console.log(res));

      return Response.json({
        message: "sending opportunities to discord channel",
      });
    } catch (e) {
      console.log(e);
      return Response.error();
    }
  },
};
