import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.get`,
  events: [
    {
      http: {
        method: "get",
        path: "episodes",
      },
    },
  ],
};
