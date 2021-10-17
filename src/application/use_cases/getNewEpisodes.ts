import { isAfter, subMinutes } from "date-fns";

import * as xml from "@infra/libs/xml";
import { Episode } from "@application/contracts/Episode";
import { getAnimesRss } from "@infra/services/cruchyroll";

export const getNewEpisodes = async (fromDate?: string): Promise<Episode[]> => {
  const rss = await getAnimesRss();

  const { elements } = xml.toJS(rss);
  const channel = xml.getNode("rss", elements);

  const { text: lastBuildDate } = xml.getNode(
    "lastBuildDate",
    channel.elements
  );

  const lastRun = subMinutes(
    new Date(fromDate),
    Number(process.env.EXECUTION_INTERVAL_MINUTES)
  );

  const episodes = new Map();

  if (isAfter(new Date(lastBuildDate), lastRun)) {
  }

  return Array.from(episodes).map(([, episode]) => episode);
};
