import axios from "axios";

const feedburner = axios.create({
  baseURL: "http://feeds.feedburner.com",
});

const crunchyroll = axios.create({
  baseURL: "https://www.crunchyroll.com",
});

export const getAnimesRss = async (): Promise<string> =>
  feedburner.get("/crunchyroll/rss/anime?lang=ptBR").then(({ data }) => data);

export const getAnimeRssBySlug = async (slug: string): Promise<string> =>
  crunchyroll.get(`/${slug}.rss`).then(({ data }) => data);
