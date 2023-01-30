import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { Opportunity } from "../architecture/Opportunity.ts";
import { ReferenceId } from "../utils/referenceId.ts";
import { Scraper } from "../architecture/Scraper.ts";

type SolidesData = {
  id: string;
  name: string;
  departament: string;
  place: string;
  city: { id: number; name: string };
  company: {
    name: string;
    logo: string;
  };
  pcdOnly: boolean;
  state: { name: string; acronym: string };
  description: string;
  videoUrl: string;
  linkVacancy: string;
  availablePositions: number;
};

export class Solides implements Scraper {
  url = "https://<agency>.solides.jobs/vacancies/";

  async execute() {
    const referenceIds: string[] = [
      ReferenceId.DrivenCX,
      ReferenceId.OriginalIo,
      ReferenceId.Enext,
      ReferenceId.Trinto,
    ];

    const opportunities: Opportunity[] = [];

    const solideSites = referenceIds.map((id) =>
      fetch(
        `https://api.solides.jobs/v2/vacancy/search?reference_id=${id}&search=&page=1&pagination=25&vacancyType=jobs`,
      )
    );

    await Promise.all(solideSites).then(async (results) => {
      const idsVacancies: string[] = [];

      for (const result of results) {
        const res = await result.json();
        const data = res.data;

        this.getIdsVacancies(data, idsVacancies);
      }

      for (const id of idsVacancies) {
        const link = `https://api.solides.jobs/v2/vacancy/${id}`;
        const response = await fetch(link);
        const vacancy = await response.json();
        const data = vacancy.data;

        opportunities.push({
          title: data.title,
          description: this.parseDescription(data.description),
          url: data.linkVacancy,
          source: {
            name: data.company,
            url: this.url.replace("<agency>", data.slug),
          },
        });
      }
    });

    return opportunities;
  }

  getIdsVacancies(data: SolidesData[], idsVacancies: string[]): string[] {
    for (const d of data) {
      const idVacancy = d.id;
      idsVacancies.push(idVacancy);
    }

    return idsVacancies;
  }

  parseDescription(description: string): string {
    let descriptionText = "";
    const $ = cheerio.load(description);

    $("p, ul").each((_, element) => {
      if (descriptionText != "") descriptionText += "\n\n";

      if (element.name == "p") {
        descriptionText += $(element)
          .find("br")
          .replaceWith("\n")
          .end()
          .text()
          .trim();
      } else if (element.name == "ul") {
        $(element)
          .children("li")
          .each((_, li) => {
            descriptionText += " - " + $(li).text().trim() + "\n";
          });
      }
    });

    return descriptionText;
  }
}
