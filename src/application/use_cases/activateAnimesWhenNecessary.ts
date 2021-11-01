import { Anime } from "@application/contracts/Anime";
import { setAsActive as setAnimeAsActive } from "@infra/repositories/animes";

export const activateAnimesWhenNecessary = async (animes: Anime[]) => {
  const deactivated = animes.filter(({ active }) => !active);

  if (deactivated.length > 0) {
    await Promise.all(deactivated.map(({ id }) => setAnimeAsActive(id)));
  }
};
