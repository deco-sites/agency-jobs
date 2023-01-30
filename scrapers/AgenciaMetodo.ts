import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

import { Opportunity } from "../architecture/Opportunity.ts";
import { Scraper } from "../architecture/Scraper.ts";

export class AgenciaMetodo implements Scraper {
  url = "https://penseavanti.enlizt.me/";

  async execute() {
    const opportunities: Opportunity[] = [];

    const res = await fetch(this.url);
    const html = await res.text();

    const $ = cheerio.load(html);

    const elements = $(".job_listings > ul.job-list > li > a");

    for (const element of elements) {
      await this.getOpportunityFromPage(element.attribs.href)
        .then((opportunity) => {
          opportunities.push(opportunity);
        });
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

    $("div.job_description > p").each(function () {
      if (description != "") description += "\n";

      const element = $(this);
      const isStrong = !!element.children("strong").text().trim();

      if (isStrong && description != "") description += "\n";
      description += element.text();
      if (isStrong) description += "\n";
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

    return {
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
