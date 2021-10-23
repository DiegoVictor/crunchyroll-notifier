import { Anime } from "@application/contracts/Anime";
import { createTopic } from "@infra/services/animes";

const createAnimeTopic = async ({ topic }: Anime): Promise<void[]> =>
  Promise.all(
    ["premium", "free"].map((type) =>
      createTopic(`animes-${type}-${topic}-sns-topic`)
    )
  );

export const createNewAnimesTopics = async (
  animes: Anime[]
): Promise<Promise<void[]>[]> => animes.map(createAnimeTopic);
