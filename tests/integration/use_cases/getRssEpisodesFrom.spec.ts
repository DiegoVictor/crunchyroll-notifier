import { getRssEpisodesFrom } from "@application/use_cases/getRssEpisodesFrom";

const originals = [
  {
    description:
      '&lt;img src="https://img1.ak.crunchyroll.com/i/spire1-tmb/1d3a5b639c678919801a789aa8e609751629872417_thumb.jpg"  /&gt;&lt;br /&gt;Shouta suddenly begins shutting himself up in his room. He\'s pouring over a complicated grimoire in order to create a magic item as a gift for Father\'s Day. Lucoa offers to help him since the task is so difficult, but he refuses and declares he must accomplish it by himself. However, he continues to fail to produce it...&lt;img src="http://feeds.feedburner.com/~r/crunchyroll/rss/anime/~4/4casPrXIBPI" height="1" width="1" alt=""/&gt;',
    freePublishDate: "Tue, 19 Jan 2038 00:27:28 GMT",
    number: "8",
    premiumPublishDate: "Wed, 13 Oct 2021 19:00:00 GMT",
    season: "2",
    serie: "Miss Kobayashi's Dragon Maid",
    thumbnail:
      "https://img1.ak.crunchyroll.com/i/spire1-tmb/1d3a5b639c678919801a789aa8e609751629872417_full.jpg",
    title: "The World's Only (Insert Phrase You Like Here)",
  },
  {
    description:
      '&lt;img src="https://img1.ak.crunchyroll.com/i/spire3-tmb/af0785c0a279f86b10980217bca8e3961633774963_thumb.jpg"  /&gt;&lt;br /&gt;The great Jahy is on the trail of the Magical Girl, Shinguu Kyouko.&#xD; Kyouko is befallen by misfortune after misfortune, but she\'s frighteningly tough.&#xD; The Magical Girl turns out to be a nice girl who hopes that everybody else can be happy if she just takes on all the misfortune.&#xD; Hearing that gives the great Jahy mixed feelings.&#xD; The only one to comfort and cheer up Jahy from feeling useless is Kokoro.&lt;img src="http://feeds.feedburner.com/~r/crunchyroll/rss/anime/~4/ArhY9DWmCxk" height="1" width="1" alt=""/&gt;',
    freePublishDate: "Wed, 20 Oct 2021 18:45:00 GMT",
    number: "10",
    premiumPublishDate: "Sat, 13 Oct 2021 18:45:00 GMT",
    serie: "The Great Jahy Will Not Be Defeated!",
    thumbnail:
      "https://img1.ak.crunchyroll.com/i/spire3-tmb/af0785c0a279f86b10980217bca8e3961633774963_full.jpg",
    title: "The Magical Girl Will Not Lose",
  },
  {
    description:
      '&lt;img src="https://img1.ak.crunchyroll.com/i/spire4-tmb/7a9c1d97a767282628a83061b555712e1633824849_thumb.jpg"  /&gt;&lt;br /&gt;&lt;img src="http://feeds.feedburner.com/~r/crunchyroll/rss/anime/~4/lh861VGp-CM" height="1" width="1" alt=""/&gt;',
    freePublishDate: "Sun, 17 Oct 2021 01:30:00 GMT",
    number: "32",
    premiumPublishDate: "Sun, 13 Oct 2021 21:30:00 GMT",
    serie: "Tropical-Rouge! Precure",
    thumbnail:
      "https://img1.ak.crunchyroll.com/i/spire4-tmb/7a9c1d97a767282628a83061b555712e1633824849_full.jpg",
    title: "Stride down the Runway! Sango's Fashion Show!",
  },
];

const episodes = [
  {
    description:
      "Shouta suddenly begins shutting himself up in his room. He's pouring over a complicated grimoire in order to create a magic item as a gift for Father's Day. Lucoa offers to help him since the task is so difficult, but he refuses and declares he must accomplish it by himself. However, he continues to fail to produce it...",
    freePublishDate: 2147473648000,
    number: "8",
    premiumPublishDate: 1634151600000,
    season: "2",
    serie: "Miss Kobayashi's Dragon Maid",
    thumbnail:
      "https://img1.ak.crunchyroll.com/i/spire1-tmb/1d3a5b639c678919801a789aa8e609751629872417_full.jpg",
    title: "The World's Only (Insert Phrase You Like Here)",
  },
  {
    description:
      "The great Jahy is on the trail of the Magical Girl, Shinguu Kyouko. Kyouko is befallen by misfortune after misfortune, but she's frighteningly tough. The Magical Girl turns out to be a nice girl who hopes that everybody else can be happy if she just takes on all the misfortune. Hearing that gives the great Jahy mixed feelings. The only one to comfort and cheer up Jahy from feeling useless is Kokoro.",
    freePublishDate: 1634755500000,
    number: "10",
    premiumPublishDate: 1634150700000,
    serie: "The Great Jahy Will Not Be Defeated!",
    thumbnail:
      "https://img1.ak.crunchyroll.com/i/spire3-tmb/af0785c0a279f86b10980217bca8e3961633774963_full.jpg",
    title: "The Magical Girl Will Not Lose",
  },
  {
    freePublishDate: 1634434200000,
    number: "32",
    premiumPublishDate: 1634160600000,
    serie: "Tropical-Rouge! Precure",
    thumbnail:
      "https://img1.ak.crunchyroll.com/i/spire4-tmb/7a9c1d97a767282628a83061b555712e1633824849_full.jpg",
    title: "Stride down the Runway! Sango's Fashion Show!",
  },
];

const xml = `<rss xmlns:media="http://search.yahoo.com/mrss/" xmlns:crunchyroll="http://www.crunchyroll.com/rss" xmlns:feedburner="http://rssnamespace.org/feedburner/ext/1.0" version="2.0"><channel><lastBuildDate>Wed, 13 Oct 2021 22:55:25 GMT</lastBuildDate>${originals.map(
  (episode) =>
    `<item><description>${
      episode.description
    }</description><crunchyroll:freePubDate>${
      episode.freePublishDate
    }</crunchyroll:freePubDate><crunchyroll:premiumPubDate>${
      episode.premiumPublishDate
    }</crunchyroll:premiumPubDate><crunchyroll:seriesTitle>${
      episode.serie
    }</crunchyroll:seriesTitle><crunchyroll:episodeTitle>${
      episode.title
    }</crunchyroll:episodeTitle><crunchyroll:episodeNumber>${
      episode.number
    }</crunchyroll:episodeNumber>${
      episode.season
        ? `<crunchyroll:season>${episode.season}</crunchyroll:season>`
        : ""
    }<crunchyroll:subtitleLanguages>en - us,es - la,es - es,fr - fr,pt - br,ar - me,it - it,de - de,ru - ru</crunchyroll:subtitleLanguages><media:restriction relationship="allow" type="country">br ba ma</media:restriction><media:thumbnail url="${
      episode.thumbnail
    }" width="640" height="360" /></item>`
)}</channel></rss>`;

jest.mock("@infra/services/cruchyroll", () => ({
  getAnimesRss: () => xml,
}));

describe("getRssEpisodesFrom", () => {
  beforeAll(() => {
    process.env.EXECUTION_INTERVAL_MINUTES = "30";
  });

  it("should be able to get new episodes", async () => {
    const fromDate = "Wed, 13 Oct 2021 18:55:25 GMT";
    const newEpisodes = await getRssEpisodesFrom(fromDate);

    expect(newEpisodes).toStrictEqual(episodes);
  });
});
