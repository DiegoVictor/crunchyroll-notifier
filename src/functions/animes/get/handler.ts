import "source-map-support/register";

import * as response from "@infra/http/response";
import { Anime } from "@application/contracts/Anime";
import { getActive as getActiveAnimes } from "@infra/repositories/animes";

export const get = async () => {
  try {
    const animes = await getActiveAnimes();

    return response.OK<Anime[]>(animes);
  } catch (err) {
    console.log(err);

    return response.InternalServerError();
  }
};
