import { Anime } from "@application/contracts/Anime";
import { sendSubscribeRequest } from "@infra/services/notifications";

export const sendNewAnimesAlertNotification = async (animes: Anime[]) =>
  animes.map(sendSubscribeRequest);
