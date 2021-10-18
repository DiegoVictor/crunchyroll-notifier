import { SQS } from "@aws-sdk/client-sqs";
import { randomUUID } from "crypto";

import { Episode } from "@application/contracts/Episode";
const sqs = new SQS({});

export const sendMessageBatch = async (episodes: Episode[]) => {
  await sqs.sendMessageBatch({
    QueueUrl: process.env.QUEUE_URL,
    Entries: episodes.map((episodes) => ({
      Id: randomUUID(),
      MessageBody: JSON.stringify(episodes),
    })),
  });
};
