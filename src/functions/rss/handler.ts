import "source-map-support/register";

import axios from "axios";
import { APIGatewayProxyEvent } from "aws-lambda";
const rss = async (event: APIGatewayProxyEvent) => {
  try {
    const { date = new Date() } = event.queryStringParameters || {};
    const { data: rss } = await axios.get(
      "http://feeds.feedburner.com/crunchyroll/rss/anime?lang=ptBR"
    );
    return formatJSONResponse(204);
  } catch (err) {
    return formatJSONResponse(500, err.message);
  }
};

export const main = middyfy(rss);
