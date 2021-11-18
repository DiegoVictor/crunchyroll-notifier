import { randomUUID } from "crypto";

import { Anime } from "@application/contracts/Anime";

export const slugify = (string: string) =>
  string
    .replace(/(\s?-\s?|\s)/gi, "-")
    .replace(/[.#'_!:]/gi, "")
    .toLowerCase();

export const mapFields = ({
  id = randomUUID(),
  title,
  description = "",
  active = true,
  image = "",
  topic = slugify(title),
}: {
  [key: string]: any;
}): Anime => ({
  id,
  title,
  description,
  image,
  active,
  topic,
});
