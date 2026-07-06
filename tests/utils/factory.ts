import { faker } from "@faker-js/faker";
import { factory } from "factory-girl";


factory.define("Anime", {}, () => {
  const title = faker.name.title();

  return {
    id: faker.datatype.uuid(),
    active: true,
    topic: title.replace(/(\W|_)/gi, ""),
    title,
  };
});

export { factory };
