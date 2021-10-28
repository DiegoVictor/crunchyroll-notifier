import { createNewAnimesTopics } from "@application/use_cases/createNewAnimesTopics";
import { setAnimesAsActive } from "@application/use_cases/setAnimesAsActive";
import { saveEpisodesAndAnimes } from "@infra/repositories/batch";
import { Message } from "@infra/contracts/Message";
import * as response from "@infra/http/response";
import {
  receiveMessages as receiveMessagesFromQueue,
  deleteMessageBatch as removeMessagesFromQueue,
} from "@infra/services/queue";
import { sendNewAnimesAlertNotification } from "@application/use_cases/sendNewAnimesAlertNotification";
import { getNewAndDeactivatedAnimes } from "@application/use_cases/getNewAndDeactivatedAnimes";
import { getFromMessages as getEpisodesFromMessages } from "@infra/repositories/episodes";

export const process = async () => {
  try {
    const messages: Message[] = await receiveMessagesFromQueue();

    if (messages.length > 0) {
      const episodes = getEpisodesFromMessages(messages);
      const { animes, deactivated } = await getNewAndDeactivatedAnimes(
        episodes
      );

      if (animes.length > 0) {
        await createNewAnimesTopics(animes).then(() =>
          sendNewAnimesAlertNotification(animes)
        );
      }

      const promises: Promise<void | void[]>[] = [
        saveEpisodesAndAnimes(episodes, animes),
      ];
      if (deactivated.length > 0) {
        promises.push(setAnimesAsActive(deactivated));
      }

      await Promise.all(promises).then(() => removeMessagesFromQueue(messages));
    }

    return response.NoContent();
  } catch (err) {
    console.log(err);

    return response.InternalServerError();
  }
};
