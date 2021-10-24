import { Episode } from "@application/contracts/Episode";
import { createNewAnimesTopics } from "@application/use_cases/createNewAnimesTopics";
import { Message } from "@infra/contracts/Message";
import { sendNewAnimesAlertNotification } from "@application/use_cases/sendNewAnimesAlertNotification";
import { getNewAndDeactivatedAnimes } from "@application/use_cases/getNewAndDeactivatedAnimes";

export const store = async () => {
  try {
    const messages: Message<Episode>[] = await receiveMessagesFromQueue();

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
    }

    return response.NoContent();
  } catch (err) {
    return response.InternalServerError(err);
  }
};
