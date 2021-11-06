import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { Episode } from "@application/contracts/Episode";
const dynamoDB = new DynamoDB({});

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
