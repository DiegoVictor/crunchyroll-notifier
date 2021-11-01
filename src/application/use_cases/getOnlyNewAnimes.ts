import { Anime } from "@application/contracts/Anime";

export const getOnlyNewAnimes = (
  series: Anime[],
  savedAnimes: Anime[]
): Anime[] => {
  const titlesSaved = savedAnimes.map(({ title }) => title);
  return series.reduce((animes, anime) => {
    if (!titlesSaved.includes(anime.title)) {
      animes.push(anime);
    }
    return animes;
  }, []);
};
