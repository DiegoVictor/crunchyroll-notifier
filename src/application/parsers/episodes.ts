import { randomUUID } from "crypto";

import { Episode } from "@application/contracts/Episode";

export const mapFields = ({
  id = randomUUID(),
  notified = undefined,
  serie,
  title,
  number,
  season,
  description,
  thumbnail,
  premiumPublishDate,
  freePublishDate,
}: {
  [key: string]: any;
}): Episode => ({
  id,
  notified: notified && Array.from(notified),
  serie,
  title,
  number,
  season,
  description,
  thumbnail,
  premiumPublishDate: Number(premiumPublishDate),
  freePublishDate: Number(freePublishDate),
});
