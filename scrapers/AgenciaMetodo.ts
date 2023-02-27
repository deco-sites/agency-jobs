import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

import { Opportunity } from "../architecture/Opportunity.ts";
import { Scraper } from "../architecture/Scraper.ts";
import { createHashId } from "../utils/utils.ts";

class AgenciaMetodoScraper implements Scraper {
  url = "https://talentos.agenciametodo.com/";

  async execute() {
    const opportunities: Opportunity[] = [];

    const res = await fetch(this.url);
    const html = await res.text();

    const $ = cheerio.load(html);

    const elements = $(".job_listings > ul.job-list > li > a");

    for (const element of elements) {
      await this.getOpportunityFromPage(element.attribs.href).then(
        (opportunity) => {
          opportunities.push(opportunity);
        },
      );
    }

    return opportunities;
  }

  async getOpportunityFromPage(url: string): Promise<Opportunity> {
    let title = "";
    let subtitle = "";
    let description = "";

    const res = await fetch(url);
    const html = await res.text();

    const $ = cheerio.load(html);

    $("div.job_description")
      .children()
      .each((_, child) => {
        if (description != "") description += "\n";

        const element = $(child);

        if (child.tagName == "p") {
          const isStrong = !!element.children("strong").text().trim();

          if (isStrong && description != "") description += "\n";
          description += element.text();
          if (isStrong) description += "\n";
        } else if (child.tagName == "ul") {
          element.children("li").each((_, li) => {
            description += "\n - " + $(li).text();
          });
        }
      });

    $("#job-details .job-overview > ul > li > div").each(function () {
      if (subtitle != "") subtitle += " | ";
      const element = $(this);

      const job_details_title = element.children("strong").text().trim();
      const job_details_value = element.children("span").text().trim();

      if (job_details_title.toLowerCase().includes("cargo")) {
        title = job_details_value;
      } else subtitle += job_details_title + " " + job_details_value;
    });

    const _id = await createHashId(title, subtitle, description);
    return {
      _id,
      title,
      subtitle,
      description,
      url,
      source: {
        name: "Agencia Método",
        url: this.url,
      },
    };
  }
}

export const AgenciaMetodo = new AgenciaMetodoScraper();
