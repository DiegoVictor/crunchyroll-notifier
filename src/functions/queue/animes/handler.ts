import { APIGatewayProxyEvent } from "aws-lambda";

import * as response from "@infra/http/response";
import { receiveMessages as receiveMessagesFromQueue } from "@infra/services/queue";
import { getFromMessages as getAnimesFromMessages } from "@infra/repositories/animes";
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

  } catch (err) {
    console.log(err);

    return response.InternalServerError();
  }
};
