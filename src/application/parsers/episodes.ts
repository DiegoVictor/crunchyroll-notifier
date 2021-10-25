import { randomUUID } from "crypto";

import { Episode } from "@application/contracts/Episode";

export const mapFields = ({
  id = randomUUID(),
  serie,
  title,
  number,
  season,
  description,
  thumbnail,
  premiumPublishDate,
  freePublishDate,
}: {
  [key: string]: string;
}): Episode => ({
  id,
  serie,
  title,
  number,
  season: Number(season),
  description,
  thumbnail,
  premiumPublishDate: Number(premiumPublishDate),
  freePublishDate: Number(freePublishDate),
});
