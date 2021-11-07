import { Anime } from "@application/contracts/Anime";
import { createAnimeTopics } from "@application/use_cases/createAnimeTopics";
import { factory } from "../../../utils/factory";

const createTopic = jest.fn((_: string) => Promise.resolve());
const sendSubscribeRequest = jest.fn((_: string) => Promise.resolve());
jest.mock("@infra/services/notification", () => ({
  createTopic: (name: string) => createTopic(name),
  sendSubscribeRequest: (topic: string) => sendSubscribeRequest(topic),
}));

describe("createAnimeTopics", () => {
  it("should be able to create animes topics", async () => {
    const animes = await factory.attrsMany<Anime>("Anime", 5);

    await createAnimeTopics(animes);

    animes.forEach(({ topic }) => {
      ["premium", "free"].map((type) =>
        expect(createTopic).toHaveBeenCalledWith(
          `animes-${type}-${topic}-sns-topic`
        )
      );
      expect(sendSubscribeRequest).toHaveBeenCalledWith(`premium-${topic}`);
    });
  });
});
