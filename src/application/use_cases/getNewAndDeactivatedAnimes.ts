import { Episode } from "@application/contracts/Episode";

export const getNewAndDeactivatedAnimes = async (episodes: Episode[]) => {
  const titles: string[] = episodes.reduce((series, { serie }) => {
    if (!series.includes(serie)) {
      series.push(serie);
    }
    return series;
  }, []);
};
