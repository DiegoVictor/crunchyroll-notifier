import axios from "axios";

const feedburner = axios.create({
  baseURL: "http://feeds.feedburner.com",
});

export const getAnimesRss = async (): Promise<string> =>
  feedburner.get("/crunchyroll/rss/anime?lang=ptBR").then(({ data }) => data);
