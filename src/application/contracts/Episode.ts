export enum Channel {
  free = "free",
  premium = "premium",
}

export interface Episode {
  id?: string;
  notified: Channel[];
  serie: string;
  title: string;
  number: number;
  season: number;
  description: string;
  thumbnail: string;
  premiumPublishDate: number;
  freePublishDate: number;
}

export interface Restrictions extends Pick<Episode, "premiumPublishDate"> {
  subtitles: string[];
  country?: string[];
}
