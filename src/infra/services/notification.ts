import { SNS } from "@aws-sdk/client-sns";
import { Message } from "@infra/contracts/Message";

const sns = new SNS({});

export const createTopic = async (Name: string) => {
  await sns.createTopic({ Name });
};

export const processEpisodesMessage = async (messages: Message[]) => {
  await sns.publish({
    Message: JSON.stringify(messages),
    TopicArn: process.env.EPISODES_PROCESSING_TOPIC_ARN,
  });
};
export const sendSubscribeRequest = async (topic: string) => {
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

export const getFromRecords = (records: SNSEventRecord[]): Message[] =>
  records.map(({ Sns: { Message } }) => JSON.parse(Message)).flat();
