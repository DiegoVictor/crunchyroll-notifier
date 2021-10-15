export interface Episode {
  id?: string;
  type: "premium" | "free";
  serie: string;
  title: string;
  number: number;
  season: number;
  description: string;
  thumbnail: string;
  notified?: string[];
  premiumPublishDate: number;
  freePublishDate: number;
}
}
