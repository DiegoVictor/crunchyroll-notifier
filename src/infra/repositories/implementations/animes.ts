import { DynamoDB, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
const dynamoDB = new DynamoDB({});

const mapToAnime = ({ Items }: ScanCommandOutput) =>
  Items.map((item) => unmarshall(item) as Anime);
