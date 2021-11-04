import { randomUUID } from "crypto";

import { Episode } from "@application/contracts/Episode";

export const episodesMap = {
  serie: { tagName: "crunchyroll:seriesTitle" },
  title: {
    tagName: "crunchyroll:episodeTitle",
    parser: (value: string) => value.replace("Untitled", ""),
  },
  number: { tagName: "crunchyroll:episodeNumber" },
  season: { tagName: "crunchyroll:season" },
  description: {
    tagName: "description",
    parser: (value: string) =>
      value.replace(
        /((<\w+\s*(\w+="[a-z0-9:\/\.~\-_]*"\s?)*\s*\/?>)|(\n|\r))/gi,
        ""
      ),
  },
  thumbnail: { tagName: "media:thumbnail" },
  premiumPublishDate: {
    tagName: "crunchyroll:premiumPubDate",
    parser: (value: string) => new Date(value).getTime(),
  },
  freePublishDate: {
    tagName: "crunchyroll:freePubDate",
    parser: (value: string) => new Date(value).getTime(),
  },
};

export const restrictionsMap = {
  subtitles: {
    tagName: "crunchyroll:subtitleLanguages",
    parser: (value: string) => value.split(","),
  },
  country: {
    tagName: "media:restriction",
    parser: (value: string) => value.split(" "),
  },
  premiumPublishDate: {
    tagName: "crunchyroll:premiumPubDate",
    parser: (value: string) => new Date(value),
  },
};

export const mapFields = ({
  id = randomUUID(),
  notified = undefined,
  serie,
  title,
  number,
  season,
  description,
  thumbnail,
  premiumPublishDate,
  freePublishDate,
}: {
  [key: string]: any;
}): Episode => ({
  id,
  notified: notified && Array.from(notified),
  serie,
  title,
  number,
  season,
  description,
  thumbnail,
  premiumPublishDate: Number(premiumPublishDate),
  freePublishDate: Number(freePublishDate),
});
