import { withLive } from "$live/live.ts";

export const handler = withLive({
  siteId: 450,
  site: "agency-jobs",
  domains: ["deco-sites-agency-jobs.deno.dev"],
});