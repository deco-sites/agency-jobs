import { SolidesScraper } from "./index.ts";

class DrivenCXScraper extends SolidesScraper {
  url =
    "https://api.solides.jobs/v2/vacancy/search?reference_id=59253&vacancyType=jobs";
  source = {
    name: "Driven CX",
    url: "https://drivencx.solides.jobs/",
  };
}

export const DrivenCX = new DrivenCXScraper();
