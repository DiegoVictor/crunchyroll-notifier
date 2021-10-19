import { handlerPath } from "@infra/libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.store`,
  events: [
    {
      http: {
        method: "post",
        path: "episodes",
      },
    },
    {
      eventBridge: {
        schedule: "rate(${self:custom.executionIntervalMinutes} minutes)",
      },
    },
  ],
};
