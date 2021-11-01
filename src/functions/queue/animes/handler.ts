import { APIGatewayProxyEvent } from "aws-lambda";

import * as response from "@infra/http/response";
import { receiveMessages as receiveMessagesFromQueue } from "@infra/services/queue";
import { getFromMessages as getAnimesFromMessages } from "@infra/repositories/animes";
import { findByTitle as findAnimesByTitle } from "@infra/repositories/animes";
import { activateAnimesWhenNecessary } from "@application/use_cases/activateAnimesWhenNecessary";
import { Anime } from "@application/contracts/Anime";
export const process = async (event?: APIGatewayProxyEvent) => {
  try {
    const messages = await receiveMessagesFromQueue();
    const animes: Anime[] =
      messages.length > 0 ? getAnimesFromMessages(messages) : [];

    if (event && event.body && event.body.length > 0) {
      const items = JSON.parse(event.body);
      if (items.length > 0) {
        animes.push(...items);
      }
    }

    if (animes.length > 0) {
      const saved = await findAnimesByTitle(animes.map(({ title }) => title));

      const promises = [];
      if (saved.length > 0) {
        promises.push(activateAnimesWhenNecessary(saved));
      }

    }

    return response.NoContent();
  } catch (err) {
    console.log(err);

    return response.InternalServerError();
  }
};
