import axios from "axios";

const api = axios.create({
  baseURL: "http://feeds.feedburner.com",
});

export const getAnimesRss = async (): Promise<string> =>
  api.get("/crunchyroll/rss/anime?lang=ptBR").then(({ data }) => data);
