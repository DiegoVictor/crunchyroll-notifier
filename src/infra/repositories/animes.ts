import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { mapFields } from "@application/parsers/animes";

const dynamoDB = new DynamoDB({});

export const getActive = async () =>
  dynamoDB
    .scan({
      TableName: "Animes",
      ScanFilter: {
        active: {
          ComparisonOperator: "EQ",
          AttributeValueList: [
            {
              BOOL: true,
            },
          ],
        },
      },
    })
    .then(({ Items }) => Items.map((item) => mapFields(unmarshall(item))));

export const findByTitle = async (animes: string[]) =>
  dynamoDB
    .scan({
      TableName: "Animes",
      FilterExpression: `title IN (${animes
        .map((_, index) => `:anime${index}`)
        .join(",")})`,
      ExpressionAttributeValues: marshall(
        animes.reduce((values, anime, index) => {
          values[`:anime${index}`] = anime;
          return values;
        }, {})
      ),
    })
    .then(({ Items }) => Items.map((item) => mapFields(unmarshall(item))));

export const setAnimeAsActive = async (id: string) => {
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
