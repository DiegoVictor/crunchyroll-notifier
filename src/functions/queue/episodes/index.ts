import { handlerPath } from "@infra/libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.process`,
  events: [
    {
      sns: {
        arn: {
          Ref: "EpisodesProcessingTopic",
        },
        topicName: "${self:custom.episodesProcessingTopicName}",
      },
    },
  ],
};
