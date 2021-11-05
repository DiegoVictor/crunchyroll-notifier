import { Episode } from "@application/contracts/Episode";
import { addEpisodesInQueue } from "@application/use_cases/addEpisodesInQueue";
import { factory } from "../../../utils/factory";

const sendMessageBatch = jest.fn((_: Episode[]) => Promise.resolve());
jest.mock("@infra/services/queue", () => ({
  sendMessageBatch: (episodes: Episode[]) => sendMessageBatch(episodes),
}));

describe("addEpisodesInQueue", () => {
  it("should be able to add one episode to queue", async () => {
    const episodes = await factory.attrsMany<Episode>("Episode", 12);

    await addEpisodesInQueue(episodes.slice(0));

    expect(sendMessageBatch).toHaveBeenCalledWith(episodes.slice(0, 10));
    expect(sendMessageBatch).toHaveBeenCalledWith(episodes.slice(-2));
  });
});
