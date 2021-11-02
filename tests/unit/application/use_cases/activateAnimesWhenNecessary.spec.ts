import { Anime } from "@application/contracts/Anime";
import { activateAnimesWhenNecessary } from "@application/use_cases/activateAnimesWhenNecessary";
import { factory } from "../../../utils/factory";

const setAsActive = jest.fn((_: Anime[]) => Promise.resolve());
jest.mock("@infra/repositories/animes", () => ({
  setAsActive: (animes: Anime[]) => setAsActive(animes),
}));

describe("activateAnimesWhenNecessary", () => {
  it("should be able to set animes as active", async () => {
    const animes = await factory.attrsMany<Anime>("Anime", 3, {
      active: false,
    });
    await activateAnimesWhenNecessary(animes);

    animes.forEach(({ id }) => {
      expect(setAsActive).toHaveBeenCalledWith(id);
    });
  });
});
