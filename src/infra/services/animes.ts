import { SNS } from "@aws-sdk/client-sns";

const sns = new SNS({});

export const createTopic = async (Name: string) => {
  await sns.createTopic({ Name });
};
