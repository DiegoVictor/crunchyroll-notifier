import { APIGatewayProxyEvent } from "aws-lambda";

import * as response from "@infra/http/response";
import { getFromMessages as getAnimesFromMessages } from "@infra/repositories/animes";
export const process = async (event?: APIGatewayProxyEvent) => {
  try {
    const messages = await receiveMessagesFromQueue();
    const animes: Anime[] =
      messages.length > 0 ? getAnimesFromMessages(messages) : [];
  } catch (err) {
    console.log(err);

    return response.InternalServerError();
  }
};
