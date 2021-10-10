export interface Episode {
  id?: string;
  serie: string;
  title: string;
  number: string;
  season: string;
  subtitles: string;
  description: string;
  thumbnail: string;
  country?: string;
  notified?: {
    premium: string;
    free: string;
  };
  publicationDate: {
    premium: string;
    free: string;
  };
}
