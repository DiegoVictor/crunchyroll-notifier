import { APIGatewayProxyEvent } from "aws-lambda";

import * as response from "@infra/http/response";
import { receiveMessages as receiveMessagesFromQueue } from "@infra/services/queue";
import { getFromMessages as getAnimesFromMessages } from "@infra/repositories/animes";
import { findByTitle as findAnimesByTitle } from "@infra/repositories/animes";
import { saveMany as saveAnimes } from "@infra/repositories/animes";
import { getOnlyNewAnimes } from "@application/use_cases/getOnlyNewAnimes";
import { activateAnimesWhenNecessary } from "@application/use_cases/activateAnimesWhenNecessary";
import { createAnimeTopics } from "@application/use_cases/createAnimeTopics";
import { Anime } from "@application/contracts/Anime";
import { processEpisodesMessage } from "@infra/services/notification";
import { mapFields } from "@application/parsers/animes";
import { setAnimesImageAndDescription } from "@application/use_cases/setAnimesImageAndDescription";
import * as validate from "@application/validators/animes";
import { ZodError, ZodIssue } from "zod";

export const process = async (event?: APIGatewayProxyEvent) => {
  try {
    const messages = await receiveMessagesFromQueue();
    const animes: Anime[] =
      messages.length > 0 ? getAnimesFromMessages(messages) : [];

    if (event && event.body && event.body.length > 0) {
      validate
        .animes(JSON.parse(event.body))
        .map((item) => animes.push(mapFields(item)));
    }

    if (animes.length > 0) {
      const saved = await findAnimesByTitle(animes.map(({ title }) => title));

      const promises = [];
      if (saved.length > 0) {
        promises.push(activateAnimesWhenNecessary(saved));
      }

      const onlyNew = getOnlyNewAnimes(animes, saved);
      if (onlyNew.length > 0) {
        promises.push(
          setAnimesImageAndDescription(onlyNew).then(saveAnimes),
          createAnimeTopics(onlyNew)
        );
      }
      await Promise.all(promises);

      if (messages.length > 0) {
        await processEpisodesMessage(messages);
      }
    }

    return response.NoContent();
  } catch (err) {
    if (err instanceof ZodError) {
      return response.BadRequest<ZodIssue[]>(err.errors);
    }

    console.log(err);

    return response.InternalServerError();
  }
};
