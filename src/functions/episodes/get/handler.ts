import "source-map-support/register";
import { APIGatewayProxyEvent } from "aws-lambda";

import * as response from "@infra/http/response";
import { getNewEpisodes } from "@application/use_cases/getNewEpisodes";
import { addEpisodesInQueue } from "@application/use_cases/addEpisodesInQueue";

export const get = async (event: APIGatewayProxyEvent) => {
  const { date = new Date() } = event.queryStringParameters || {};

  try {
    const episodes = await getNewEpisodes(date.toString());
    if (episodes.length > 0) {
      await addEpisodesInQueue(episodes);
    }

    return response.NoContent();
  } catch (err) {
    return response.InternalServerError(err);
  }
};
