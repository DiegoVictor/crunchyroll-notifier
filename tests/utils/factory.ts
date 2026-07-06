import { faker } from "@faker-js/faker";
import { factory } from "factory-girl";

factory.define(
  "Episode",
  {},
  {
    title: faker.lorem.words,
    serie: faker.lorem.words,
    season: () => String(faker.datatype.number()),
    description: faker.lorem.paragraph,
    thumbnail: faker.image.imageUrl,
    number: () => String(faker.datatype.number()),
    premiumPublishDate: () => faker.date.soon().getTime(),
    freePublishDate: () => faker.date.soon().getTime(),
  }
);

factory.define("Anime", {}, () => {
  const title = faker.lorem.words();

  return {
    id: faker.datatype.uuid(),
    active: true,
    topic: title.replace(/(\W|_)/gi, ""),
    title,
  };
});

export { factory };
