import "source-map-support/register";

import { APIGatewayProxyEvent } from "aws-lambda";
const rss = async (event: APIGatewayProxyEvent) => {
  try {
    const { date = new Date() } = event.queryStringParameters || {};
    return formatJSONResponse(204);
  } catch (err) {
    return formatJSONResponse(500, err.message);
  }
};

export const main = middyfy(rss);
