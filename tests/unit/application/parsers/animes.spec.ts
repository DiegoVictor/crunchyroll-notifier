import * as faker from "faker";

import { slugify, mapFields } from "@application/parsers/animes";

describe("Anime parsers", () => {
  it("should be able to slugify a string", () => {
    const title = faker.name.title();
    expect(slugify(title)).toBe(title.replace(/(\W|_)/gi, ""));
  });

  it("should be able to parse to anime object", () => {
    const title = faker.name.title();

    expect(mapFields({ title })).toStrictEqual({
      id: expect.any(String),
      title,
      active: true,
      topic: title.replace(/(\W|_)/gi, ""),
    });
  });
});
