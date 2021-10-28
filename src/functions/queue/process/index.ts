import { handlerPath } from "@infra/libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.process`,
  events: [
    {
      http: {
        method: "head",
        path: "queue",
      },
    },
    {
      eventBridge: {
        schedule: "rate(${self:custom.executionIntervalMinutes} minutes)",
      },
    },
  ],
};
