import { Episode } from "@application/contracts/Episode";
import { Message } from "@infra/contracts/Message";
import * as response from "@infra/libs/response";
import { receiveMessages as receiveMessagesFromQueue } from "@infra/services/episodes";
export const store = async () => {
  try {
    const messages: Message<Episode>[] = await receiveMessagesFromQueue();
    return response.NoContent();
  } catch (err) {
    return response.InternalServerError(err);
  }
};
