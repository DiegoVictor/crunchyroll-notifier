import { z } from "zod";

const authorizationSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type Params = z.infer<typeof authorizationSchema>;

export const authorization = (data: Params): Params =>
  authorizationSchema.parse(data);
