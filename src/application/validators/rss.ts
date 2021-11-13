import { z } from "zod";

const dateSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}Z$/, {
      message:
        "Must be in format: YYYY-MM-DDTHH:mm:ss.SSSZ (e.g. 2021-11-07T00:00:01.000Z)",
    })
    .transform((date) => new Date(date))
    .optional(),
});

type Params = z.infer<typeof dateSchema>;

export const date = (data: Params): Params => dateSchema.parse(data);
