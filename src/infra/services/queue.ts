import { SQS } from "@aws-sdk/client-sqs";
import { randomUUID } from "crypto";

import { Episode } from "@application/contracts/Episode";
import { Message } from "@infra/contracts/Message";

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

export const receiveMessages = async (): Promise<Message[]> =>
  sqs
    .receiveMessage({
      MaxNumberOfMessages: 10,
      QueueUrl: process.env.QUEUE_URL,
    })
    .then((result) => {
      if (result.Messages) {
        return result.Messages.map((message) => ({
          Id: message.MessageId,
          ReceiptHandle: message.ReceiptHandle,
          MessageBody: JSON.parse(message.Body),
        }));
      }
      return [];
    });

export const deleteMessageBatch = async (episodes: Message[]) => {
  await sqs.deleteMessageBatch({
    QueueUrl: process.env.QUEUE_URL,
    Entries: episodes.map((episode) => ({
      Id: episode.Id,
      ReceiptHandle: episode.ReceiptHandle,
    })),
  });
};
