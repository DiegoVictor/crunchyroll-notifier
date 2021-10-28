import { SNS } from "@aws-sdk/client-sns";
import { Anime } from "@application/contracts/Anime";

const sns = new SNS({});

export const createTopic = async (Name: string) => {
  await sns.createTopic({ Name });
};

export const sendSubscribeRequest = async ({ topic }: Anime) => {
  await sns.publish({
    Message: JSON.stringify({
      default: "",
      GCM: JSON.stringify({
        data: {
          type: "subscribeTopic",
          topic,
        },
      }),
    }),
    MessageStructure: "json",
    TopicArn: process.env.GENERAL_TOPIC_ARN,
  });
};
