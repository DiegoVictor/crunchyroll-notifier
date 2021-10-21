import { Episode } from "@application/contracts/Episode";
import { findByTitle as findAnimesByTitle } from "@infra/repositories/implementations/animes";
import { mapFields } from "@application/parsers/animes";

export const getNewAndDeactivatedAnimes = async (episodes: Episode[]) => {
  const titles: string[] = episodes.reduce((series, { serie }) => {
    if (!series.includes(serie)) {
      series.push(serie);
    }
    return series;
  }, []);

  return findAnimesByTitle(titles).then((saved) => {
    const animes = titles
      .filter((anime) => !saved.find(({ title }) => title === anime))
      .map((title) => mapFields({ title }));

    return {
      animes,
      deactivated: saved.filter(({ active }) => !active),
    };
  });
};
