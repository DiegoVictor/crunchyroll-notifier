import { Anime } from "@application/contracts/Anime";
import {
  createTopic,
  sendSubscribeRequest,
} from "@infra/services/notification";

const createAnimeTopic = async ({ topic }: Anime) => {
  await Promise.all(
    ["premium", "free"].map((type) =>
      createTopic(`animes-${type}-${topic}-sns-topic`)
    )
  );
};

export const createAnimeTopics = async (animes: Anime[]) => {
  await Promise.all(
    animes.map((anime) =>
      createAnimeTopic(anime).then(() =>
        sendSubscribeRequest(`premium-${anime.topic}`)
      )
    )
  );
};
