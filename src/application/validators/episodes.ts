import { z } from "zod";

const episodesSchema = z
  .array(
    z.object({
      serie: z.string(),
      title: z.string(),
      number: z.string().optional(),
      season: z.string().optional(),
      description: z.string().optional(),
      thumbnail: z.string().url(),
      premiumPublishDate: z.number(),
      freePublishDate: z.number(),
    })
  )
  .nonempty();

type Params = z.infer<typeof episodesSchema>;

export const episodes = (data: Params): Params => episodesSchema.parse(data);
