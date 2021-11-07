import * as faker from "faker";

import { Channel, Episode } from "@application/contracts/Episode";
import {
  episodesMap,
  mapFields,
  restrictionsMap,
} from "@application/parsers/episodes";
import { factory } from "../../../utils/factory";

describe("Episodes parsers", () => {
  it("should be able to map episode's fields", async () => {
    const episode = await factory.attrs<Episode>("Episode");
    expect(
      mapFields(
        Object.keys(episode).reduce((map, key) => {
          map[key] = String(episode[key]);
          return map;
        }, {})
      )
    ).toStrictEqual({
      id: expect.any(String),
      notified: undefined,
      ...episode,
    });
  });

  it("should be able to map episode's fields with previous data", async () => {
    const episode = await factory.attrs<Episode>("Episode", {
      notified: [Channel.premium],
    });
    expect(
      mapFields(
        Object.keys(episode).reduce((map, key) => {
          map[key] = episode[key];
          if (!Array.isArray(episode[key])) {
            map[key] = String(episode[key]);
          }
          return map;
        }, {})
      )
    ).toStrictEqual({
      id: expect.any(String),
      notified: [Channel.premium],
      ...episode,
    });
  });

  it("should be able to map episode", async () => {
    const episode = await factory.attrs<Episode>("Episode");

    const data = [
      {
        name: "crunchyroll:seriesTitle",
        elements: [
          {
            text: episode.serie,
          },
        ],
      },
      {
        name: "crunchyroll:episodeTitle",
        elements: [
          {
            text: episode.title,
          },
        ],
      },
      {
        name: "crunchyroll:episodeNumber",
        elements: [
          {
            text: episode.number,
          },
        ],
      },
      {
        name: "crunchyroll:season",
        elements: [
          {
            text: episode.season,
          },
        ],
      },
      {
        name: "description",
        elements: [
          {
            text: episode.description,
          },
        ],
      },
      {
        name: "media:thumbnail",
        elements: [
          {
            text: episode.thumbnail,
          },
        ],
      },
      {
        name: "crunchyroll:premiumPubDate",
        elements: [
          {
            text: new Date(episode.premiumPublishDate).toISOString(),
          },
        ],
      },
      {
        name: "crunchyroll:freePubDate",
        elements: [
          {
            text: new Date(episode.freePublishDate).toISOString(),
          },
        ],
      },
    ];

    const parsed = Object.keys(episodesMap).reduce((map, key) => {
      const { tagName, parser } = episodesMap[key];
      const item = data.find(({ name }) => name === tagName);

      const text = item.elements.pop().text;
      map[key] = parser ? parser(text) : text;

      return map;
    }, {});

    expect(parsed).toStrictEqual(episode);
  });

  it("should be able to map restrictions", async () => {
    const subtitles = faker.lorem.paragraph().split(" ").join(",");
    const country = faker.lorem.paragraph();
    const premiumPublishDate = faker.date.soon();

    const data = [
      {
        name: "crunchyroll:subtitleLanguages",
        elements: [
          {
            text: subtitles,
          },
        ],
      },
      {
        name: "media:restriction",
        elements: [
          {
            text: country,
          },
        ],
      },
      {
        name: "crunchyroll:premiumPubDate",
        elements: [
          {
            text: premiumPublishDate.toISOString(),
          },
        ],
      },
    ];

    const parsed = Object.keys(restrictionsMap).reduce((map, key) => {
      const { tagName, parser } = restrictionsMap[key];
      const item = data.find(({ name }) => name === tagName);

      map[key] = parser(item.elements.pop().text);

      return map;
    }, {});

    expect(parsed).toStrictEqual({
      subtitles: subtitles.split(","),
      country: country.split(" "),
      premiumPublishDate,
    });
  });
});
