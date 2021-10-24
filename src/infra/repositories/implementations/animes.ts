import { DynamoDB, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { Anime } from "@application/contracts/Anime";

const dynamoDB = new DynamoDB({});

const mapToAnime = ({ Items }: ScanCommandOutput) =>
  Items.map((item) => unmarshall(item) as Anime);

export const findByTitle = async (animes: string[]) =>
  dynamoDB
    .scan({
      TableName: "Animes",
      ScanFilter: {
        title: {
          ComparisonOperator: "IN",
          AttributeValueList: animes.map((serie) => ({
            S: serie,
          })),
        },
      },
    })
    .then(mapToAnime);

export const setAnimeAsActive = async ({ id }: Anime) => {
  await dynamoDB.updateItem({
    TableName: "Animes",
    Key: marshall({
      id,
    }),
    UpdateExpression: "SET active = :value",
    ExpressionAttributeValues: marshall({
      ":value": true,
    }),
  });
};
