import { DynamoDB, WriteRequest } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { Anime } from "@application/contracts/Anime";
import { Episode } from "@application/contracts/Episode";

const dynamoDB = new DynamoDB({});

export const saveEpisodesAndAnimes = async (
  episodes: Episode[],
  animes: Anime[]
) => {
  const requestItems: {
    [key: string]: WriteRequest[];
  } = {};

  if (episodes.length > 0) {
    requestItems.Episodes = episodes.map((episode) => ({
      PutRequest: {
        Item: marshall(episode, {
          removeUndefinedValues: true,
        }),
      },
    }));
  }

  if (animes.length > 0) {
    requestItems.Animes = animes.map((anime) => ({
      PutRequest: {
        Item: marshall<Anime>(anime),
      },
    }));
  }

  await dynamoDB.batchWriteItem({
    RequestItems: requestItems,
  });
};
