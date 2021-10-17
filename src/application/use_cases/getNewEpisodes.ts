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
};
