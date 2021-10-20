import { randomUUID } from "crypto";

import { Episode } from "@application/contracts/Episode";

export const mapFields = (data: Episode): Episode =>
  Object.assign({}, data, {
    id: randomUUID(),
  });
