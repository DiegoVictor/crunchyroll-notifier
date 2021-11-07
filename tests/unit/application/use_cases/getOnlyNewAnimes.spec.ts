import { Anime } from "@application/contracts/Anime";
import { getOnlyNewAnimes } from "@application/use_cases/getOnlyNewAnimes";
import { factory } from "../../../utils/factory";

describe("getOnlyNewAnimes", () => {
  it("should be able to get only new animes", async () => {
    const animes = await factory.attrsMany<Anime>("Anime", 4);

    const onlyNewAnimes = getOnlyNewAnimes(animes.slice(0, 2), animes.slice(2));
    expect(onlyNewAnimes).toStrictEqual(animes.slice(0, 2));
  });
});
