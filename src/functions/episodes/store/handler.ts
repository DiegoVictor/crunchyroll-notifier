import { createNewAnimesTopics } from "@application/use_cases/createNewAnimesTopics";
import { setAnimesAsActive } from "@application/use_cases/setAnimesAsActive";
import { saveEpisodesAndAnimes } from "@infra/repositories/batch";
import { Message } from "@infra/contracts/Message";
import { sendNewAnimesAlertNotification } from "@application/use_cases/sendNewAnimesAlertNotification";
import { getNewAndDeactivatedAnimes } from "@application/use_cases/getNewAndDeactivatedAnimes";

export const store = async () => {
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
    }

    return response.NoContent();
  } catch (err) {
    return response.InternalServerError(err);
  }
};
