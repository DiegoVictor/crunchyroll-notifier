import { handlerPath } from "@infra/libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.process`,
  environment: {
    EPISODES_PROCESSING_TOPIC_ARN: {
      Ref: "EpisodesProcessingTopic",
    },
  },
  events: [
    {
      http: {
        method: "head",
        path: "animes/process",
      },
    },
    {
      eventBridge: {
        schedule: "rate(${self:custom.executionIntervalMinutes} minutes)",
      },
    },
  ],
};
