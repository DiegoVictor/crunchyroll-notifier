import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { Message } from "@infra/contracts/Message";

const dynamoDB = new DynamoDB({});

export const getFromMessages = (messages: Message[]) =>
  messages.map(({ MessageBody }) => mapFields(MessageBody));
export const saveMany = async (episodes: Episode[]) => {
  await dynamoDB.batchWriteItem({
    RequestItems: {
      Episodes: episodes.map((episode) => ({
        PutRequest: {
          Item: marshall<Episode>(episode, {
            convertEmptyValues: false,
            removeUndefinedValues: true,
          }),
        },
      })),
    },
  });
};
