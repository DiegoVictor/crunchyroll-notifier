import "source-map-support/register";
import { APIGatewayProxyEvent } from "aws-lambda";

import * as response from "@infra/libs/response";
import { getNewEpisodes } from "@application/use_cases/getNewEpisodes";
export const get = async (event: APIGatewayProxyEvent) => {
  const { date = new Date() } = event.queryStringParameters || {};

  try {
    const episodes = await getNewEpisodes(date.toString());
    return response.NoContent();
  } catch (err) {
    return response.InternalServerError(err);
  }
};
