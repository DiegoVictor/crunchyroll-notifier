import { Episode } from "@application/contracts/Episode";
import { sendMessageBatch } from "@infra/services/episodes";

export const addEpisodesInQueue = async (episodes: Episode[]): Promise<void> =>
  sendMessageBatch(episodes.splice(0, 10)).then(() => {
    if (episodes.length > 0) {
      return addEpisodesInQueue(episodes);
    }
  });
