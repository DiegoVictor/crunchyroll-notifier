import { Anime } from "@application/contracts/Anime";
import { setAnimeAsActive } from "@infra/repositories/animes";

export const setAnimesAsActive = async (animes: Anime[]) =>
  Promise.all(animes.map(setAnimeAsActive));
