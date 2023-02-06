import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

import { Opportunity } from "../architecture/Opportunity.ts";
import { Scraper } from "../architecture/Scraper.ts";
import { createHashId } from "../utils/utils.ts";

export class M3 implements Scraper {
  url = "https://m3ecommerce.com/trabalhe-conosco/";

  async execute() {
    let opportunities: Opportunity[] = [];

    const res = await fetch(this.url);
    const html = await res.text();

    const $ = cheerio.load(html);

    $(".join-us-container__vagas__list").each((_, element) => {
      const title = $(element).find("h3").text();

      let description = "";
      $(element)
        .children(".join-us-container__vagas__list__content")
        .children()
        .each((_, child) => {
          if (description != "") description += "\n\n";

          if (child.tagName == "p") description += $(child).text().trim();
          else if (child.tagName == "ul") {
            $(child)
              .children("li")
              .each((_, li) => {
                description += " - " + $(li).text().trim() + "\n";
              });
          } else if (child.tagName == "div") {
            description += $(child).children("span").text().trim();
            $(child)
              .children("ul")
              .children("li")
              .each((_, li) => {
                description += " - " + $(li).text().trim() + "\n";
              });
          }
        });

      description +=
        "\n\nLINK DO FORMULÁRIO: https://app.pipefy.com/public/form/cjJmu6-g";

      opportunities.push({
        _id: "",
        title,
        description,
        url: this.url,
        source: {
          name: "M3",
          url: this.url,
        },
      });
    });

    opportunities = await Promise.all(
      opportunities.map(async (o: Opportunity) => {
        let { _id, ...opportunityWithoutId } = o;

        _id = await createHashId(o.title, o.description);
        return {
          _id,
          ...opportunityWithoutId,
        };
      }),
    );

    return opportunities;
  }
}
