import { isAfter, subMinutes } from "date-fns";

import { episodesMap, restrictionsMap } from "@application/parsers/episodes";
import * as xml from "@infra/libs/xml";
import { Episode, Restrictions } from "@application/contracts/Episode";
import { getAnimesRss } from "@infra/services/cruchyroll";

export const getRssEpisodesFrom = async (date?: string): Promise<Episode[]> => {
  const rss = await getAnimesRss();

  const { elements } = xml.toJS(rss);
  const channel = xml.getNode("rss", elements);

  const { text: lastBuildDate } = xml.getNode(
    "lastBuildDate",
    channel.elements
  );

  const lastRun = subMinutes(
    new Date(date),
    Number(process.env.EXECUTION_INTERVAL_MINUTES)
  );

  const episodes = new Map();

  if (isAfter(new Date(lastBuildDate), lastRun)) {
    channel.elements.forEach((item) => {
      if (item.name === "item") {
        const { country, subtitles, premiumPublishDate } =
          xml.mapFields<Restrictions>(item, restrictionsMap);

        if (
          country.includes("br") &&
          subtitles &&
          subtitles.includes("pt - br") &&
          subtitles.length > 1 &&
          isAfter(premiumPublishDate, lastRun)
        ) {
          const episode = xml.mapFields<Episode>(item, episodesMap);
          episodes.set(episode.title, episode);
        }
      }
    });
  }

  return Array.from(episodes).map(([, episode]) => episode);
};
