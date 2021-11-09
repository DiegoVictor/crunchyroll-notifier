import { APIGatewayProxyEvent, Handler, SNSEvent } from "aws-lambda";

import { saveMany as saveEpisodes } from "@infra/repositories/episodes";
import * as response from "@infra/http/response";
import { getFromMessages as getEpisodesFromMessages } from "@infra/repositories/episodes";
import { deleteMessageBatch as removeMessagesFromQueue } from "@infra/services/queue";
import { getFromRecords as getMessagesFromRecords } from "@infra/services/notification";
import { mapFields } from "@application/parsers/episodes";

export const process: Handler<SNSEvent | APIGatewayProxyEvent> = async (
  event?
) => {
  try {
    if ("body" in event && event.body && event.body.length > 0) {
      await saveEpisodes(JSON.parse(event.body).map(mapFields));
    } else if ("Records" in event) {
      const messages = getMessagesFromRecords(event.Records);

      const episodes = getEpisodesFromMessages(messages);
      if (episodes.length > 0) {
        await saveEpisodes(episodes);
      }

      await removeMessagesFromQueue(messages);
    }

    return response.NoContent();
  } catch (err) {
    console.log(err);

    return response.InternalServerError();
  }
};
