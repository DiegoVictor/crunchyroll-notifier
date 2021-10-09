import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.episodes`,
  events: [
    {
      http: {
        method: "get",
        path: "episodes",
      },
    },
  ],
};
