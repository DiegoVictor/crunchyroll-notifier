import { handlerPath } from "@infra/libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.process`,
  events: [
    {
      http: {
        method: "get",
        path: "rss/process",
        request: {
          parameters: {
            querystrings: {
              date: false,
            },
          },
        },
      },
    },
    {
      eventBridge: {
        schedule: "rate(${self:custom.executionIntervalMinutes} minutes)",
      },
    },
  ],
};
