import { handlerPath } from "@infra/libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.get`,
  events: [
    {
      http: {
        method: "get",
        path: "animes",
      },
    },
  ],
};
