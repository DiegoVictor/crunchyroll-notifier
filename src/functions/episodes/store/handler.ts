import { Episode } from "@application/contracts/Episode";
import { Message } from "@infra/contracts/Message";
import { receiveMessages as receiveMessagesFromQueue } from "@infra/services/episodes";
export const store = async () => {
  try {
    const messages: Message<Episode>[] = await receiveMessagesFromQueue();
  } catch (err) {
    return response.InternalServerError(err);
  }
};
