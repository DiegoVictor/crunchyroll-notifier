import { handlerPath } from "@infra/libs/handlerResolver";

export default {
  handler: `${handlerPath(
    `${process.cwd()}/src/functions/queue/animes`
  )}/handler.process`,
  events: [
    {
      http: {
        method: "post",
        path: "animes",
      },
    },
  ],
};
