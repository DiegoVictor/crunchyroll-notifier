import { randomUUID } from "crypto";

import { Anime } from "@application/contracts/Anime";

export const slugify = (string: string) => string.replace(/(\W|_)/gi, "");

export const mapFields = ({
  id = randomUUID(),
  title,
  active = true,
  topic = slugify(title),
}: {
  [key: string]: any;
}): Anime => ({
  id,
  title,
  active,
  topic,
});
